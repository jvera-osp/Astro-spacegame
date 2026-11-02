package com.astroesquiva.spacegame;

import com.android.billingclient.api.AcknowledgePurchaseParams;
import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.BillingFlowParams;
import com.android.billingclient.api.BillingResult;
import com.android.billingclient.api.ConsumeParams;
import com.android.billingclient.api.PendingPurchasesParams;
import com.android.billingclient.api.ProductDetails;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.QueryProductDetailsParams;
import com.android.billingclient.api.QueryPurchasesParams;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.function.Consumer;

@CapacitorPlugin(name = "GooglePlayBilling")
public class GooglePlayBillingPlugin extends Plugin {
    private static final Set<String> CONSUMABLE_PRODUCTS = new HashSet<>(Arrays.asList(
        "iap_starter_pack",
        "iap_pocket_stars",
        "iap_galactic_chest",
        "iap_cosmic_vault"
    ));

    private BillingClient billingClient;
    private PluginCall activePurchaseCall;
    private String activeProductId;
    private boolean connectionInProgress;
    private final List<Consumer<BillingResult>> connectionCallbacks = new ArrayList<>();

    @Override
    public void load() {
        billingClient = BillingClient.newBuilder(getContext())
            .setListener(this::onPurchasesUpdated)
            .enablePendingPurchases(
                PendingPurchasesParams.newBuilder().enableOneTimeProducts().build()
            )
            .enableAutoServiceReconnection()
            .build();
    }

    @PluginMethod
    public void getProducts(PluginCall call) {
        JSArray productIds = call.getArray("productIds");
        if (productIds == null || productIds.length() == 0) {
            call.reject("Se requiere al menos un identificador de producto.");
            return;
        }

        List<QueryProductDetailsParams.Product> products = new ArrayList<>();
        for (int index = 0; index < productIds.length(); index++) {
            String productId = productIds.optString(index, "");
            if (!productId.isEmpty()) {
                products.add(
                    QueryProductDetailsParams.Product.newBuilder()
                        .setProductId(productId)
                        .setProductType(BillingClient.ProductType.INAPP)
                        .build()
                );
            }
        }

        if (products.isEmpty()) {
            call.reject("No se encontraron identificadores de producto válidos.");
            return;
        }

        ensureConnected(result -> {
            if (result.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                call.reject("No se pudo conectar con Google Play Billing: " + result.getDebugMessage());
                return;
            }

            QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder()
                .setProductList(products)
                .build();
            billingClient.queryProductDetailsAsync(params, (queryResult, detailsResult) -> {
                if (queryResult.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                    call.reject("No se pudieron consultar los productos: " + queryResult.getDebugMessage());
                    return;
                }

                JSArray availableProducts = new JSArray();
                for (ProductDetails details : detailsResult.getProductDetailsList()) {
                    ProductDetails.OneTimePurchaseOfferDetails offer =
                        details.getOneTimePurchaseOfferDetails();
                    if (offer == null) continue;

                    JSObject item = new JSObject();
                    item.put("productId", details.getProductId());
                    item.put("title", details.getTitle());
                    item.put("description", details.getDescription());
                    item.put("formattedPrice", offer.getFormattedPrice());
                    item.put("currencyCode", offer.getPriceCurrencyCode());
                    item.put("priceAmountMicros", offer.getPriceAmountMicros());
                    availableProducts.put(item);
                }

                JSObject response = new JSObject();
                response.put("products", availableProducts);
                call.resolve(response);
            });
        });
    }

    @PluginMethod
    public void purchase(PluginCall call) {
        String productId = call.getString("productId");
        if (productId == null || productId.isEmpty()) {
            call.reject("Se requiere un identificador de producto.");
            return;
        }
        if (activePurchaseCall != null) {
            call.reject("Ya hay una compra en curso.");
            return;
        }

        activePurchaseCall = call;
        activeProductId = productId;
        ensureConnected(result -> {
            if (result.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                rejectActivePurchase("No se pudo conectar con Google Play Billing: " + result.getDebugMessage());
                return;
            }

            QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder()
                .setProductList(Arrays.asList(
                    QueryProductDetailsParams.Product.newBuilder()
                        .setProductId(productId)
                        .setProductType(BillingClient.ProductType.INAPP)
                        .build()
                ))
                .build();
            billingClient.queryProductDetailsAsync(params, (queryResult, detailsResult) -> {
                if (queryResult.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                    rejectActivePurchase("No se pudo consultar el producto en Google Play.");
                    return;
                }
                if (detailsResult.getProductDetailsList().isEmpty()) {
                    rejectActivePurchase("PRODUCT_NOT_AVAILABLE");
                    return;
                }

                ProductDetails details = detailsResult.getProductDetailsList().get(0);
                BillingFlowParams.ProductDetailsParams productParams =
                    BillingFlowParams.ProductDetailsParams.newBuilder()
                        .setProductDetails(details)
                        .build();
                BillingFlowParams flowParams = BillingFlowParams.newBuilder()
                    .setProductDetailsParamsList(Arrays.asList(productParams))
                    .build();

                BillingResult flowResult = billingClient.launchBillingFlow(getActivity(), flowParams);
                if (flowResult.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                    rejectActivePurchase(
                        flowResult.getResponseCode() == BillingClient.BillingResponseCode.ITEM_ALREADY_OWNED
                            ? "ITEM_ALREADY_OWNED"
                            : "No se pudo iniciar el pago: " + flowResult.getDebugMessage()
                    );
                }
            });
        });
    }

    @PluginMethod
    public void completePurchase(PluginCall call) {
        String productId = call.getString("productId");
        String purchaseToken = call.getString("purchaseToken");
        if (productId == null || productId.isEmpty() || purchaseToken == null || purchaseToken.isEmpty()) {
            call.reject("Se requiere el producto y el token de compra para completar la transacción.");
            return;
        }

        ensureConnected(result -> {
            if (result.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                call.reject("No se pudo conectar con Google Play Billing: " + result.getDebugMessage());
                return;
            }

            if (CONSUMABLE_PRODUCTS.contains(productId)) {
                consumePurchase(call, purchaseToken);
                return;
            }

            QueryPurchasesParams params = QueryPurchasesParams.newBuilder()
                .setProductType(BillingClient.ProductType.INAPP)
                .build();
            billingClient.queryPurchasesAsync(params, (queryResult, purchases) -> {
                if (queryResult.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                    call.reject("No se pudo verificar el estado de la compra: " + queryResult.getDebugMessage());
                    return;
                }

                Purchase ownedPurchase = null;
                for (Purchase purchase : purchases) {
                    if (purchase.getPurchaseToken().equals(purchaseToken)) {
                        ownedPurchase = purchase;
                        break;
                    }
                }
                if (ownedPurchase == null) {
                    call.reject("La compra ya no figura como disponible en Google Play.");
                    return;
                }
                if (ownedPurchase.isAcknowledged()) {
                    call.resolve();
                    return;
                }

                AcknowledgePurchaseParams acknowledgeParams = AcknowledgePurchaseParams.newBuilder()
                    .setPurchaseToken(purchaseToken)
                    .build();
                billingClient.acknowledgePurchase(acknowledgeParams, acknowledgeResult -> {
                    if (acknowledgeResult.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                        call.reject("No se pudo confirmar la compra: " + acknowledgeResult.getDebugMessage());
                        return;
                    }
                    call.resolve();
                });
            });
        });
    }

    @PluginMethod
    public void restorePurchases(PluginCall call) {
        ensureConnected(result -> {
            if (result.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                call.reject("No se pudo conectar con Google Play Billing: " + result.getDebugMessage());
                return;
            }

            QueryPurchasesParams params = QueryPurchasesParams.newBuilder()
                .setProductType(BillingClient.ProductType.INAPP)
                .build();
            billingClient.queryPurchasesAsync(params, (queryResult, purchases) -> {
                if (queryResult.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                    call.reject("No se pudieron restaurar las compras: " + queryResult.getDebugMessage());
                    return;
                }

                JSArray ownedProductIds = new JSArray();
                JSArray activePurchases = new JSArray();
                for (Purchase purchase : purchases) {
                    if (purchase.getPurchaseState() != Purchase.PurchaseState.PURCHASED) continue;
                    for (String productId : purchase.getProducts()) {
                        if (!CONSUMABLE_PRODUCTS.contains(productId)) {
                            ownedProductIds.put(productId);
                        }
                        JSObject activePurchase = new JSObject();
                        activePurchase.put("productId", productId);
                        activePurchase.put("purchaseTime", purchase.getPurchaseTime());
                        activePurchase.put("purchaseState", "PURCHASED");
                        activePurchase.put("purchaseToken", purchase.getPurchaseToken());
                        activePurchases.put(activePurchase);
                    }
                }

                JSObject response = new JSObject();
                response.put("productIds", ownedProductIds);
                response.put("purchases", activePurchases);
                call.resolve(response);
            });
        });
    }

    private void ensureConnected(Consumer<BillingResult> callback) {
        if (billingClient == null) {
            callback.accept(
                BillingResult.newBuilder()
                    .setResponseCode(BillingClient.BillingResponseCode.ERROR)
                    .setDebugMessage("BillingClient no está disponible.")
                    .build()
            );
            return;
        }
        if (billingClient.isReady()) {
            callback.accept(
                BillingResult.newBuilder()
                    .setResponseCode(BillingClient.BillingResponseCode.OK)
                    .setDebugMessage("")
                    .build()
            );
            return;
        }

        connectionCallbacks.add(callback);
        if (connectionInProgress) return;

        connectionInProgress = true;
        billingClient.startConnection(new BillingClientStateListenerAdapter(result -> {
            connectionInProgress = false;
            List<Consumer<BillingResult>> callbacks = new ArrayList<>(connectionCallbacks);
            connectionCallbacks.clear();
            for (Consumer<BillingResult> pendingCallback : callbacks) {
                pendingCallback.accept(result);
            }
        }));
    }

    private void onPurchasesUpdated(BillingResult result, List<Purchase> purchases) {
        if (result.getResponseCode() == BillingClient.BillingResponseCode.USER_CANCELED) {
            rejectActivePurchase("USER_CANCELED");
            return;
        }
        if (result.getResponseCode() != BillingClient.BillingResponseCode.OK || purchases == null) {
            if (activePurchaseCall != null) {
                rejectActivePurchase("No se completó la compra: " + result.getDebugMessage());
            }
            return;
        }

        for (Purchase purchase : purchases) {
            for (String productId : purchase.getProducts()) {
                if (activePurchaseCall != null && productId.equals(activeProductId)) {
                    if (purchase.getPurchaseState() == Purchase.PurchaseState.PENDING) {
                        resolveActivePurchase(purchase, productId, "PENDING");
                    } else if (purchase.getPurchaseState() == Purchase.PurchaseState.PURCHASED) {
                        resolveActivePurchase(purchase, productId, "PURCHASED");
                    } else {
                        rejectActivePurchase("La compra no se completó.");
                    }
                    return;
                }

                if (purchase.getPurchaseState() == Purchase.PurchaseState.PURCHASED) {
                    notifyPurchaseUpdated(purchase, productId);
                }
            }
        }

        if (activePurchaseCall != null) {
            rejectActivePurchase("Google Play no devolvió la compra solicitada.");
        }
    }

    private void resolveActivePurchase(Purchase purchase, String productId, String purchaseState) {
        if (activePurchaseCall == null) return;
        try {
            JSObject response = new JSObject();
            response.put("productId", productId);
            response.put("purchaseTime", purchase.getPurchaseTime());
            response.put("purchaseState", purchaseState);
            response.put("purchaseToken", purchase.getPurchaseToken());
            activePurchaseCall.resolve(response);
        } finally {
            activePurchaseCall = null;
            activeProductId = null;
        }
    }

    private void notifyPurchaseUpdated(Purchase purchase, String productId) {
        JSObject response = new JSObject();
        response.put("productId", productId);
        response.put("purchaseTime", purchase.getPurchaseTime());
        response.put("purchaseState", "PURCHASED");
        response.put("purchaseToken", purchase.getPurchaseToken());
        notifyListeners("purchaseUpdated", response);
    }

    private void consumePurchase(PluginCall call, String purchaseToken) {
        ConsumeParams params = ConsumeParams.newBuilder()
            .setPurchaseToken(purchaseToken)
            .build();
        billingClient.consumeAsync(params, (consumeResult, token) -> {
            if (consumeResult.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                call.reject("No se pudo consumir el producto: " + consumeResult.getDebugMessage());
                return;
            }
            call.resolve();
        });
    }

    private void rejectActivePurchase(String message) {
        if (activePurchaseCall == null) return;
        activePurchaseCall.reject(message);
        activePurchaseCall = null;
        activeProductId = null;
    }

    private static class BillingClientStateListenerAdapter
        implements com.android.billingclient.api.BillingClientStateListener {
        private final Consumer<BillingResult> callback;

        BillingClientStateListenerAdapter(Consumer<BillingResult> callback) {
            this.callback = callback;
        }

        @Override
        public void onBillingSetupFinished(BillingResult billingResult) {
            callback.accept(billingResult);
        }

        @Override
        public void onBillingServiceDisconnected() {
        }
    }
}
