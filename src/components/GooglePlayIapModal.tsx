import React, { useState } from 'react';
import { IapProduct } from '../types/game';
import { googlePlayBilling, GooglePlayProduct, GooglePlayPurchase } from '../services/googlePlayBilling';
import { sounds } from '../audio/soundEffects';
import { CheckCircle2, ShieldCheck, X, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

interface GooglePlayIapModalProps {
  product: IapProduct | GooglePlayProduct | null;
  onClose: () => void;
  onSuccess: (
    coins: number,
    gems: number,
    rewardType: string | undefined,
    consumableType: string | undefined,
    consumableQty: number | undefined,
    purchase: GooglePlayPurchase
  ) => Promise<void>;
}

export const GooglePlayIapModal: React.FC<GooglePlayIapModalProps> = ({
  product,
  onClose,
  onSuccess,
}) => {
  const [parentGateAnswer, setParentGateAnswer] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showParentGate, setShowParentGate] = useState(true);
  const [parentGateError, setParentGateError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [[numA, numB]] = useState(() => [
    Math.floor(12 + Math.random() * 18),
    Math.floor(12 + Math.random() * 18),
  ]);

  if (!product) return null;

  // Resolve fields for both IapProduct and GooglePlayProduct
  const prodId = 'productId' in product ? product.productId : product.id;
  const priceDisplay = 'priceUsd' in product ? product.priceUsd : product.price;
  const coinsReward = product.coins || 0;
  const gemsReward = product.gems || 0;
  const rewardType = 'rewardType' in product ? product.rewardType : 'coins_gems';
  const consumableType = 'consumableType' in product ? product.consumableType : undefined;
  const consumableQty = 'consumableQty' in product ? product.consumableQty : undefined;

  const expectedAnswer = numA * numB;

  const handleVerifyParent = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(parentGateAnswer.trim(), 10) === expectedAnswer) {
      setParentGateError(false);
      setShowParentGate(false);
    } else {
      setParentGateError(true);
    }
  };

  const handleConfirmPurchase = async () => {
    setIsProcessing(true);
    setErrorMessage(null);
    sounds.playButtonTap();

    try {
      // Execute through Google Play Billing Service
      const result = await googlePlayBilling.launchPurchaseFlow(prodId);

      if (result.success && result.purchase) {
        const purchase = result.purchase;
        setIsProcessing(false);
        setIsSuccess(true);
        sounds.playPurchaseSuccess();

        void (async () => {
          try {
            await onSuccess(coinsReward, gemsReward, rewardType, consumableType, consumableQty, purchase);
            await googlePlayBilling.completePurchase(purchase);
            setTimeout(onClose, 1800);
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            setIsSuccess(false);
            setErrorMessage(`La compra se realizó, pero no se pudo completar su registro: ${message}`);
            sounds.playHurt();
          }
        })();
      } else {
        setIsProcessing(false);
        if (result.error === 'USER_CANCELED') {
          setErrorMessage('Compra cancelada por el usuario en Google Play.');
        } else if (result.error === 'ITEM_ALREADY_OWNED') {
          setErrorMessage('Ya posees este artículo en tu cuenta de Google Play.');
        } else if (result.error === 'PURCHASE_PENDING') {
          setErrorMessage('El pago está pendiente. Las recompensas se entregarán cuando Google Play confirme la compra.');
        } else if (result.error === 'PRODUCT_NOT_AVAILABLE') {
          setErrorMessage('Este producto no está disponible en Google Play todavía.');
        } else if (result.error === 'BILLING_NOT_AVAILABLE') {
          setErrorMessage('Las compras solo están disponibles en la versión Android instalada desde Google Play.');
        } else {
          setErrorMessage(result.error || 'Google Play no pudo procesar la compra.');
        }
        sounds.playHurt();
      }
    } catch (error) {
      setIsProcessing(false);
      const message = error instanceof Error ? error.message : String(error);
      setErrorMessage(`Fallo en la comunicación con Google Play: ${message}`);
      sounds.playHurt();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="w-full sm:max-w-md max-h-[92dvh] overflow-y-auto bg-slate-900 border-t sm:border border-slate-700 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col text-slate-100">
        {/* Google Play top bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950/80 border-b border-slate-800">
          <div className="flex items-center gap-2">
            {/* Google Play colored triangle icon */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path d="M3.609 1.814L13.792 12 3.61 22.186A2.43 2.43 0 013 20.457V3.543c0-.66.224-1.272.609-1.729z" fill="#00C1DE" />
              <path d="M17.18 8.613l-3.388 3.387 3.388 3.387 3.824-2.185c1.332-.761 1.332-2.003 0-2.764l-3.824-2.185z" fill="#FFC800" />
              <path d="M3.609 1.814l10.183 10.186 3.388-3.387L6.035.798C5.035.227 4.145.623 3.609 1.814z" fill="#00E676" />
              <path d="M13.792 12L3.609 22.186c.536 1.191 1.426 1.587 2.426 1.016l11.145-6.415-3.388-3.387z" fill="#FF3A44" />
            </svg>
            <span className="font-semibold text-sm tracking-tight text-slate-200">Google Play Billing</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3 h-3" />
              <span>Protegido</span>
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex flex-col gap-4">
          {isSuccess ? (
            /* Purchase Success screen */
            <div className="py-6 flex flex-col items-center justify-center text-center gap-3 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/30">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <h3 className="text-xl font-bold text-white">¡Compra confirmada!</h3>
              <p className="text-xs text-slate-400 max-w-xs">
                Google Play confirmó el pago. Tus recompensas espaciales se añadieron.
              </p>

              <div className="w-full bg-slate-950 p-3 rounded-2xl border border-slate-800 text-left space-y-1 mt-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Artículo:</span>
                  <span className="text-white font-medium">{product.title}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Importe cobrado:</span>
                  <span className="text-emerald-400 font-bold">{priceDisplay}</span>
                </div>
              </div>
            </div>
          ) : showParentGate ? (
            /* Kid Safety / Parental Gate */
            <div className="flex flex-col gap-3">
              <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-3 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-amber-300">Confirmación para una persona adulta</p>
                  <p className="text-amber-200/80 mt-0.5 leading-relaxed">
                        Antes de continuar, un adulto debe resolver este reto. Google Play también mostrará su propio diálogo de compra:
                  </p>
                </div>
              </div>

              <form onSubmit={handleVerifyParent} className="flex flex-col gap-3">
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <span className="font-bold text-base text-cyan-300">
                    ¿Cuánto es {numA} × {numB}?
                  </span>
                  <input
                    type="number"
                    value={parentGateAnswer}
                    onChange={(e) => setParentGateAnswer(e.target.value)}
                    placeholder="Resultado"
                    className="w-24 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-center font-bold text-white focus:outline-none focus:border-cyan-400"
                    autoFocus
                  />
                </div>

                {parentGateError && (
                  <p className="text-xs text-rose-400 text-center font-semibold flex items-center justify-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>¡Respuesta incorrecta! Intenta de nuevo.</span>
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-transform active:scale-95 shadow-md"
                >
                  Confirmar persona adulta
                </button>
              </form>
            </div>
          ) : (
            /* Google Play Checkout UI */
            <div className="flex flex-col gap-3.5">
              {/* Product item preview */}
              <div className="flex items-center justify-between bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400/20 to-pink-500/20 border border-amber-400/40 flex items-center justify-center text-xl">
                    💎
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                      <span>{product.title}</span>
                      {product.badge && (
                        <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-1.5 py-0.2 rounded-md font-semibold">
                          {product.badge}
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      {coinsReward > 0 && <span className="text-amber-300 font-bold">+{coinsReward} Monedas</span>}
                      {gemsReward > 0 && <span className="text-pink-300 font-bold">+{gemsReward} Gemas</span>}
                      {consumableQty && (
                        <span className="text-emerald-400 font-bold">+{consumableQty} Unidades</span>
                      )}
                    </p>
                    <code className="text-[10px] text-slate-500 font-mono">SKU: {prodId}</code>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-lg font-black text-emerald-400">{priceDisplay}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="px-1 text-[11px] text-slate-400">
                  El pago se completará en la pantalla segura de Google Play. El precio mostrado proviene de Google Play.
                </p>
              </div>

              {errorMessage && (
                <div className="p-2.5 bg-rose-950/50 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 1-Tap Buy CTA button */}
              <button
                onClick={handleConfirmPurchase}
                disabled={isProcessing}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-emerald-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2 text-slate-950 font-bold">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Conectando con Google Play Billing...</span>
                  </div>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Continuar con Google Play ({priceDisplay})</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
