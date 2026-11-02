import React, { useState } from 'react';
import { SpaceshipDef, AccessoryDef, IapProduct, ConsumableItem, PlayerInventory } from '../types/game';
import { CONSUMABLE_ITEMS } from '../data/storeCatalog';
import { sounds } from '../audio/soundEffects';
import { X, Star, Gem, Check, Lock, Gift, Sparkles, Shield, Magnet, Zap, Heart, Award } from 'lucide-react';

interface ShopModalProps {
  coins: number;
  gems: number;
  ships: SpaceshipDef[];
  activeShipId: string;
  accessories: AccessoryDef[];
  activeAccessoryId: string;
  inventory: PlayerInventory;
  iapProducts: IapProduct[];
  billingError: string | null;
  highScore: number;
  lifetimeDodges: number;
  bestSingleDodges: number;
  lifetimeCoins: number;
  onSelectShip: (id: string) => void;
  onBuyShip: (id: string, costCoins: number, costGems: number) => void;
  onClaimRequirementUnlock: (shipId: string) => void;
  onSelectAccessory: (id: string) => void;
  onBuyAccessory: (id: string, costCoins: number) => void;
  onBuyConsumable: (item: ConsumableItem) => void;
  onOpenIapModal: (product: IapProduct) => void;
  onClaimDailyGift: () => void;
  hasClaimedDaily: boolean;
  onRestorePurchases: () => void;
  onClose: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  coins,
  gems,
  ships,
  activeShipId,
  accessories,
  activeAccessoryId,
  inventory,
  iapProducts,
  billingError,
  highScore,
  lifetimeDodges,
  bestSingleDodges,
  lifetimeCoins,
  onSelectShip,
  onBuyShip,
  onClaimRequirementUnlock,
  onSelectAccessory,
  onBuyAccessory,
  onBuyConsumable,
  onOpenIapModal,
  onClaimDailyGift,
  hasClaimedDaily,
  onRestorePurchases,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'ships' | 'consumables' | 'accessories' | 'iap'>('ships');

  return (
    <div className="absolute inset-0 z-40 bg-slate-950/90 backdrop-blur-md flex flex-col overflow-hidden text-white select-none animate-in fade-in duration-200">
      {/* Header */}
      <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-amber-400 to-pink-500 flex items-center justify-center text-slate-950 font-black shadow-md shrink-0">
            🚀
          </div>
          <div className="truncate">
            <h2 className="text-sm sm:text-base font-black tracking-tight leading-tight truncate">Tienda Galáctica</h2>
            <p className="text-[10px] sm:text-[11px] text-slate-400 truncate">Naves, objetos y compras</p>
          </div>
        </div>

        {/* Currency balances & Close */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="flex items-center gap-1 bg-slate-950 px-2 sm:px-2.5 py-1 rounded-xl border border-slate-800">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
            <span className="text-xs font-bold text-amber-300 tabular-nums">{coins}</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 px-2 sm:px-2.5 py-1 rounded-xl border border-slate-800">
            <Gem className="w-3 h-3 text-pink-400 fill-pink-400 shrink-0" />
            <span className="text-xs font-bold text-pink-300 tabular-nums">{gems}</span>
          </div>

          <button
            onClick={() => {
              sounds.playButtonTap();
              onClose();
            }}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 active:scale-90 transition-transform ml-0.5"
            aria-label="Cerrar tienda"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="w-full max-w-2xl mx-auto flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Tabs */}
        <div className="px-3 pt-2.5 pb-2 bg-slate-900/50 border-b border-slate-800 flex items-center gap-1.5 shrink-0 overflow-x-auto scrollbar-none">
          <button
            onClick={() => {
              sounds.playButtonTap();
              setActiveTab('ships');
            }}
            className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'ships'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <span>🚀 Flota</span>
          </button>

          <button
            onClick={() => {
              sounds.playButtonTap();
              setActiveTab('consumables');
            }}
            className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'consumables'
                ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-400/20'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <span>❤️ Vidas & Escudos</span>
          </button>

          <button
            onClick={() => {
              sounds.playButtonTap();
              setActiveTab('accessories');
            }}
            className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'accessories'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <span>👑 Gorros</span>
          </button>

          <button
            onClick={() => {
              sounds.playButtonTap();
              setActiveTab('iap');
            }}
            className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'iap'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/20'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Compras (IAP)</span>
          </button>
        </div>

        {/* Daily Free Reward Banner */}
        <div className="px-3 sm:px-4 pt-2 shrink-0">
          <div className="bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-purple-500/20 border border-amber-500/40 rounded-2xl p-2 sm:p-2.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Gift className="w-4 h-4 text-amber-400 animate-bounce shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-amber-200 truncate">¡Regalo Diario para Astronautas!</p>
                <p className="text-[10px] text-slate-400 truncate">+150 Monedas y +5 Gemas gratis</p>
              </div>
            </div>
            <button
              onClick={() => {
                if (!hasClaimedDaily) {
                  sounds.playGem();
                  onClaimDailyGift();
                }
              }}
              disabled={hasClaimedDaily}
              className={`px-2.5 sm:px-3 py-1 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 shrink-0 ${
                hasClaimedDaily
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950 animate-pulse'
              }`}
            >
              {hasClaimedDaily ? 'Reclamado' : '¡Reclamar!'}
            </button>
          </div>
        </div>

        {/* Content Area with smooth scroll */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 pb-8">
        {/* SHIPS TAB (with specific unlock requirements!) */}
        {activeTab === 'ships' && (
          <div className="grid grid-cols-1 gap-3">
            {ships.map((ship) => {
              const isEquipped = activeShipId === ship.id;
              const canAfford = coins >= ship.priceCoins && gems >= ship.priceGems;

              // Check if requirement is satisfied
              let reqCurrent = 0;
              let reqTarget = 1;
              let reqCompleted = false;

              if (ship.unlockRequirement) {
                reqTarget = ship.unlockRequirement.target;
                if (ship.unlockRequirement.type === 'dodges_single') {
                  reqCurrent = bestSingleDodges;
                } else if (ship.unlockRequirement.type === 'dodges_total') {
                  reqCurrent = lifetimeDodges;
                } else if (ship.unlockRequirement.type === 'score') {
                  reqCurrent = highScore;
                } else if (ship.unlockRequirement.type === 'coins_total') {
                  reqCurrent = lifetimeCoins;
                }
                reqCompleted = reqCurrent >= reqTarget;
              }

              return (
                <div
                  key={ship.id}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isEquipped
                      ? 'bg-slate-900 border-amber-400 shadow-md shadow-amber-500/10'
                      : ship.unlocked
                      ? 'bg-slate-900/60 border-slate-800'
                      : 'bg-slate-950/80 border-slate-850 opacity-95'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Ship Preview Avatar */}
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center relative shadow-inner shrink-0 mt-0.5"
                      style={{ backgroundColor: `${ship.color}22`, borderColor: `${ship.color}88`, borderWidth: 2 }}
                    >
                      <div
                        className="w-6 h-9 rounded-t-full shadow-md"
                        style={{ backgroundColor: ship.color }}
                      />
                      {isEquipped && (
                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-[10px] shadow">
                          ✓
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-white flex items-center gap-1.5 flex-wrap">
                        <span>{ship.name}</span>
                        {isEquipped && (
                          <span className="text-[10px] text-amber-400 bg-amber-400/20 px-1.5 py-0.5 rounded-md font-semibold">
                            En Uso
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-snug line-clamp-2 mt-0.5">
                        {ship.description}
                      </p>

                      {/* Perk indicators */}
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-300">
                        <span className="flex items-center gap-0.5">
                          <Zap className="w-3 h-3 text-amber-400" />
                          <span>{Math.round(ship.speed * 100)}% Vel</span>
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Shield className="w-3 h-3 text-cyan-400" />
                          <span>{ship.maxShield} Escudo</span>
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Magnet className="w-3 h-3 text-purple-400" />
                          <span>x{ship.magnetBonus} Imán</span>
                        </span>
                      </div>

                      {/* Requirement Box if locked */}
                      {!ship.unlocked && ship.unlockRequirement && (
                        <div className="mt-2 p-2 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px]">
                          <div className="flex items-center justify-between text-amber-300 font-bold mb-1">
                            <span className="flex items-center gap-1">
                              <Award className="w-3.5 h-3.5 text-amber-400" />
                              <span>{ship.unlockRequirement.label}</span>
                            </span>
                            <span className="text-slate-400 text-[10px] tabular-nums">
                              {Math.min(reqCurrent, reqTarget)} / {reqTarget}
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(100, (reqCurrent / reqTarget) * 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action button */}
                  <div className="shrink-0 flex items-center justify-end gap-2">
                    {ship.unlocked ? (
                      isEquipped ? (
                        <div className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 text-xs font-semibold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Activo</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            sounds.playButtonTap();
                            onSelectShip(ship.id);
                          }}
                          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
                        >
                          Equipar
                        </button>
                      )
                    ) : reqCompleted ? (
                      /* Unlock free via achievement! */
                      <button
                        onClick={() => {
                          sounds.playPurchaseSuccess();
                          onClaimRequirementUnlock(ship.id);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 active:scale-95 animate-bounce flex items-center gap-1.5"
                      >
                        <Award className="w-4 h-4" />
                        <span>¡Misión Cumplida! Desbloquear</span>
                      </button>
                    ) : (
                      /* Or buy with coins */
                      <button
                        onClick={() => {
                          if (canAfford) {
                            sounds.playPurchaseSuccess();
                            onBuyShip(ship.id, ship.priceCoins, ship.priceGems);
                          } else {
                            sounds.playHurt();
                            setActiveTab('iap');
                          }
                        }}
                        className={`px-3 py-2 rounded-xl text-xs font-bold shadow-md transition-all flex flex-col items-center gap-0.5 active:scale-95 ${
                          canAfford
                            ? 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                            : 'bg-slate-800 hover:bg-slate-750 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          <span>Comprar</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px]">
                          {ship.priceCoins > 0 && <span>{ship.priceCoins} 🪙</span>}
                          {ship.priceGems > 0 && <span>{ship.priceGems} 💎</span>}
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CONSUMABLES TAB (Vidas Extra & Escudos Temporales) */}
        {activeTab === 'consumables' && (
          <div className="space-y-3">
            {/* Inventory Status Bar */}
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-around text-center text-xs">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-medium">Vidas de Rescate</p>
                <p className="text-base font-black text-rose-400 flex items-center justify-center gap-1 mt-0.5">
                  <Heart className="w-4 h-4 fill-rose-400" />
                  <span className="tabular-nums">{inventory.extraLivesStock}</span>
                </p>
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-medium">Escudos Iniciales</p>
                <p className="text-base font-black text-cyan-400 flex items-center justify-center gap-1 mt-0.5">
                  <Shield className="w-4 h-4 fill-cyan-400" />
                  <span className="tabular-nums">{inventory.startingShieldsStock}</span>
                </p>
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-medium">Súper Imanes</p>
                <p className="text-base font-black text-purple-400 flex items-center justify-center gap-1 mt-0.5">
                  <Magnet className="w-4 h-4" />
                  <span className="tabular-nums">{inventory.megaMagnetStock}</span>
                </p>
              </div>
            </div>

            {/* Consumable items purchase list */}
            <div className="grid grid-cols-1 gap-3">
              {CONSUMABLE_ITEMS.map((item) => {
                const canAfford = coins >= item.priceCoins && gems >= item.priceGems;

                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl border border-slate-800 bg-slate-900/80 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-850 flex items-center justify-center text-2xl shadow-inner shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-white">{item.title}</h4>
                          {item.badge && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded-md font-bold">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-snug mt-0.5 max-w-[220px]">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (canAfford) {
                          sounds.playPurchaseSuccess();
                          onBuyConsumable(item);
                        } else {
                          sounds.playHurt();
                          setActiveTab('iap');
                        }
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 flex flex-col items-center gap-0.5 shrink-0 ${
                        canAfford
                          ? 'bg-emerald-400 hover:bg-emerald-300 text-slate-950'
                          : 'bg-slate-800 hover:bg-slate-750 text-slate-400'
                      }`}
                    >
                      <span>Obtener</span>
                      <span className="text-[10px] font-semibold">
                        {item.priceCoins} 🪙 {item.priceGems > 0 ? `· ${item.priceGems} 💎` : ''}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ACCESSORIES TAB */}
        {activeTab === 'accessories' && (
          <div className="grid grid-cols-2 gap-2.5">
            {accessories.map((acc) => {
              const isEquipped = activeAccessoryId === acc.id;
              const canAfford = coins >= acc.priceCoins;

              return (
                <div
                  key={acc.id}
                  className={`p-3 rounded-2xl border flex flex-col items-center text-center justify-between gap-2 ${
                    isEquipped
                      ? 'bg-slate-900 border-amber-400 shadow-md shadow-amber-400/20'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-850 flex items-center justify-center text-2xl shadow-inner">
                    {acc.icon}
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-white">{acc.name}</h5>
                    <p className="text-[10px] text-amber-300 font-medium mt-0.5">
                      {acc.unlocked ? 'Desbloqueado' : `${acc.priceCoins} 🪙`}
                    </p>
                  </div>

                  {acc.unlocked ? (
                    isEquipped ? (
                      <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> En uso
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          sounds.playButtonTap();
                          onSelectAccessory(acc.id);
                        }}
                        className="w-full py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                      >
                        Ponerse
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => {
                        if (canAfford) {
                          sounds.playPurchaseSuccess();
                          onBuyAccessory(acc.id, acc.priceCoins);
                        } else {
                          sounds.playHurt();
                          setActiveTab('iap');
                        }
                      }}
                      className="w-full py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1"
                    >
                      <Lock className="w-3 h-3" />
                      <span>{acc.priceCoins} 🪙</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* IN-APP PURCHASES (IAP) TAB */}
        {activeTab === 'iap' && (
          <div className="space-y-3">
            <div className="p-3 bg-gradient-to-r from-emerald-950/60 to-cyan-950/60 border border-emerald-500/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xl shrink-0">
                  🛡️
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-300">Google Play Billing Oficial</p>
                  <p className="text-[11px] text-slate-300">
                    Precios y confirmación de pago proporcionados por Google Play.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => {
                    sounds.playButtonTap();
                    onRestorePurchases();
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-cyan-300 border border-slate-700 text-xs font-bold active:scale-95 transition-transform"
                >
                  Restaurar Compras
                </button>
              </div>
            </div>

            {billingError && (
              <p role="alert" className="rounded-xl border border-rose-500/40 bg-rose-950/40 p-3 text-xs text-rose-200">
                {billingError}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {iapProducts.map((prod) => (
                <div
                  key={prod.id}
                  className={`p-3.5 rounded-2xl border flex flex-col justify-between gap-3 relative overflow-hidden ${
                    prod.isPopular
                      ? 'bg-gradient-to-b from-slate-900 to-indigo-950/70 border-amber-400/80 shadow-lg shadow-indigo-950/50 ring-1 ring-amber-400/40'
                      : 'bg-slate-900/80 border-slate-800'
                  }`}
                >
                  {prod.badge && (
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 shadow-sm">
                      {prod.badge}
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-2xl">
                      💎
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">{prod.title}</h4>
                      <p className="text-xs text-amber-300 font-semibold mt-0.5">
                        +{prod.coins} Monedas · +{prod.gems} Gemas
                      </p>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-snug">{prod.bonusDesc}</p>

                  <button
                    onClick={() => {
                      sounds.playButtonTap();
                      onOpenIapModal(prod);
                    }}
                    disabled={!prod.available}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span>{prod.available ? `Comprar por ${prod.priceUsd}` : 'No disponible en Google Play'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};
