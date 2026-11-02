import { Capacitor, PluginListenerHandle, registerPlugin } from '@capacitor/core';

export interface GooglePlayProduct {
  productId: string;
  type: 'inapp' | 'subs';
  title: string;
  description: string;
  price: string;
  priceMicros: number;
  currency: string;
  isConsumable: boolean;
  rewardType: 'coins_gems' | 'consumable' | 'vip_pass';
  coins?: number;
  gems?: number;
  consumableType?: 'extra_lives' | 'starting_shields' | 'mega_magnets';
  consumableQty?: number;
  iconEmoji: string;
  badge?: string;
}

export interface GooglePlayPurchase {
  productId: string;
  purchaseTime: number;
  purchaseState: 'PURCHASED' | 'PENDING';
  purchaseToken: string;
}

interface NativeStoreProduct {
  productId: string;
  title: string;
  description: string;
  formattedPrice: string;
  currencyCode: string;
  priceAmountMicros: number;
}

interface NativePurchase {
  productId: string;
  purchaseTime: number;
  purchaseState: 'PURCHASED' | 'PENDING';
  purchaseToken: string;
}

interface NativeRestoreResult {
  productIds: string[];
  purchases: GooglePlayPurchase[];
}

interface NativeBillingPlugin {
  getProducts(options: { productIds: string[] }): Promise<{ products: NativeStoreProduct[] }>;
  purchase(options: { productId: string }): Promise<NativePurchase>;
  completePurchase(options: { productId: string; purchaseToken: string }): Promise<void>;
  restorePurchases(): Promise<NativeRestoreResult>;
  addListener(
    eventName: 'purchaseUpdated',
    listener: (purchase: GooglePlayPurchase) => void
  ): Promise<PluginListenerHandle>;
}

const NativeBilling = registerPlugin<NativeBillingPlugin>('GooglePlayBilling');

const PRODUCTS: GooglePlayProduct[] = [
  {
    productId: 'iap_starter_pack',
    type: 'inapp',
    title: 'Pack Astronauta Principiante',
    description: '300 Monedas estelares + 5 Gemas galácticas para principiantes.',
    price: '$0.49',
    priceMicros: 490000,
    currency: 'USD',
    isConsumable: true,
    rewardType: 'coins_gems',
    coins: 300,
    gems: 5,
    iconEmoji: '🌟',
    badge: 'Económico',
  },
  {
    productId: 'iap_pocket_stars',
    type: 'inapp',
    title: 'Bolsita de Estrellas (+Vidas)',
    description: '700 Monedas estelares + 12 Gemas galácticas.',
    price: '$0.99',
    priceMicros: 990000,
    currency: 'USD',
    isConsumable: true,
    rewardType: 'coins_gems',
    coins: 700,
    gems: 12,
    iconEmoji: '⭐',
    badge: 'Favorito',
  },
  {
    productId: 'iap_galactic_chest',
    type: 'inapp',
    title: 'Cofre Galáctico',
    description: '2,500 Monedas estelares + 45 Gemas para desbloquear naves.',
    price: '$1.99',
    priceMicros: 1990000,
    currency: 'USD',
    isConsumable: true,
    rewardType: 'coins_gems',
    coins: 2500,
    gems: 45,
    iconEmoji: '💎',
    badge: 'Más vendido',
  },
  {
    productId: 'iap_cosmic_vault',
    type: 'inapp',
    title: 'Caja Fuerte Cósmica',
    description: '8,000 Monedas estelares + 150 Gemas galácticas.',
    price: '$3.99',
    priceMicros: 3990000,
    currency: 'USD',
    isConsumable: true,
    rewardType: 'coins_gems',
    coins: 8000,
    gems: 150,
    iconEmoji: '🚀',
    badge: 'Súper valor',
  },
  {
    productId: 'astro_vip_astronaut_pass',
    type: 'inapp',
    title: 'Pase Astronauta VIP Permanente',
    description: 'Desbloquea el Halcón Dorado VIP y recompensas permanentes.',
    price: '$3.99',
    priceMicros: 3990000,
    currency: 'USD',
    isConsumable: false,
    rewardType: 'vip_pass',
    coins: 2000,
    gems: 50,
    iconEmoji: '👑',
    badge: 'Permanente',
  },
];

class GooglePlayBillingService {
  private initialized = false;
  private initialization: Promise<void> | null = null;
  private nativeAvailable = false;
  private availableProductIds = new Set<string>();
  private ownedProductIds = new Set<string>();
  private activePurchases: GooglePlayPurchase[] = [];
  private restoreError: string | null = null;
  private completionPromises = new Map<string, Promise<void>>();

  public init(): Promise<void> {
    if (this.initialized) return Promise.resolve();
    if (this.initialization) return this.initialization;

    this.initialization = this.initialize().catch((error: unknown) => {
      this.initialization = null;
      throw error;
    });
    return this.initialization;
  }

  private async initialize(): Promise<void> {
    this.nativeAvailable = Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';
    if (!this.nativeAvailable) {
      this.initialized = true;
      return;
    }

    const { products } = await NativeBilling.getProducts({
      productIds: PRODUCTS.map(({ productId }) => productId),
    });

    this.availableProductIds = new Set(products.map(({ productId }) => productId));
    for (const storeProduct of products) {
      const product = this.getProduct(storeProduct.productId);
      if (!product) continue;
      product.title = storeProduct.title || product.title;
      product.description = storeProduct.description || product.description;
      product.price = storeProduct.formattedPrice;
      product.priceMicros = storeProduct.priceAmountMicros;
      product.currency = storeProduct.currencyCode;
    }

    this.initialized = true;
    try {
      const restored = await NativeBilling.restorePurchases();
      this.applyRestoredPurchases(restored);
    } catch (error) {
      this.restoreError = error instanceof Error ? error.message : String(error);
    }
  }

  public getProducts(): GooglePlayProduct[] {
    return PRODUCTS;
  }

  public getProduct(productId: string): GooglePlayProduct | undefined {
    return PRODUCTS.find((product) => product.productId === productId);
  }

  public isNativeSupported(): boolean {
    return this.nativeAvailable;
  }

  public isProductAvailable(productId: string): boolean {
    return this.availableProductIds.has(productId);
  }

  public async launchPurchaseFlow(
    productId: string
  ): Promise<{ success: boolean; purchase?: GooglePlayPurchase; error?: string }> {
    await this.init();

    if (!this.nativeAvailable) {
      return { success: false, error: 'BILLING_NOT_AVAILABLE' };
    }

    const product = this.getProduct(productId);
    if (!product || !this.isProductAvailable(productId)) {
      return { success: false, error: 'PRODUCT_NOT_AVAILABLE' };
    }

    if (!product.isConsumable && this.ownedProductIds.has(productId)) {
      return { success: false, error: 'ITEM_ALREADY_OWNED' };
    }

    try {
      const purchase = await NativeBilling.purchase({ productId });
      if (purchase.purchaseState !== 'PURCHASED') {
        return { success: false, error: 'PURCHASE_PENDING' };
      }

      if (!product.isConsumable) this.ownedProductIds.add(productId);
      return { success: true, purchase };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return { success: false, error: message };
    }
  }

  public async isProductOwned(productId: string): Promise<boolean> {
    await this.init();
    return this.ownedProductIds.has(productId);
  }

  public async completePurchase(purchase: GooglePlayPurchase): Promise<void> {
    const activeCompletion = this.completionPromises.get(purchase.purchaseToken);
    if (activeCompletion) return activeCompletion;

    const completion = this.completeNativePurchase(purchase);
    this.completionPromises.set(purchase.purchaseToken, completion);
    try {
      await completion;
    } finally {
      this.completionPromises.delete(purchase.purchaseToken);
    }
  }

  private async completeNativePurchase(purchase: GooglePlayPurchase): Promise<void> {
    await this.init();
    if (!this.nativeAvailable) {
      throw new Error('Google Play Billing solo está disponible en Android.');
    }

    await NativeBilling.completePurchase({
      productId: purchase.productId,
      purchaseToken: purchase.purchaseToken,
    });
    this.activePurchases = this.activePurchases.filter(
      (activePurchase) => activePurchase.purchaseToken !== purchase.purchaseToken
    );
  }

  public async isVipUnlocked(): Promise<boolean> {
    return this.isProductOwned('astro_vip_astronaut_pass');
  }

  public async restorePurchases(): Promise<{ restoredCount: number; restoredProducts: GooglePlayProduct[] }> {
    await this.init();
    if (!this.nativeAvailable) {
      throw new Error('Google Play Billing solo está disponible en Android.');
    }

    const restored = await NativeBilling.restorePurchases();
    this.applyRestoredPurchases(restored);
    this.restoreError = null;
    const { productIds } = restored;
    const restoredProducts = productIds
      .map((productId) => this.getProduct(productId))
      .filter((product): product is GooglePlayProduct => Boolean(product));

    return { restoredCount: restoredProducts.length, restoredProducts };
  }

  public getActivePurchases(): GooglePlayPurchase[] {
    return [...this.activePurchases];
  }

  public getRestoreError(): string | null {
    return this.restoreError;
  }

  public async addPurchaseListener(
    listener: (purchase: GooglePlayPurchase) => void
  ): Promise<PluginListenerHandle | null> {
    if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'android') return null;
    return NativeBilling.addListener('purchaseUpdated', listener);
  }

  private applyRestoredPurchases(restored: NativeRestoreResult): void {
    this.ownedProductIds = new Set(restored.productIds);
    this.activePurchases = restored.purchases;
  }

  public generateGooglePlayCsv(): string {
    const headers = ['Product ID', 'Published State', 'Purchase Type', 'Auto-Translate', 'Locale; Title; Description', 'Price'];
    const rows = PRODUCTS.map((product) => {
      const localeTitleDesc = `es-ES; ${product.title}; ${product.description}`;
      return `"${product.productId}","unpublished","managed_product","false","${localeTitleDesc}","${product.priceMicros}"`;
    });
    return [headers.join(','), ...rows].join('\n');
  }

  public generateCatalogJson(): string {
    return JSON.stringify(
      {
        version: '8.0.0',
        packageName: 'com.astroesquiva.spacegame',
        products: PRODUCTS,
      },
      null,
      2
    );
  }
}

export const GOOGLE_PLAY_PRODUCTS = PRODUCTS;
export const googlePlayBilling = new GooglePlayBillingService();
