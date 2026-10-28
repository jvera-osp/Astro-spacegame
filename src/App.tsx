/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { AndroidFrame } from './components/AndroidFrame';
import { GameCanvas } from './components/GameCanvas';
import { HUD } from './components/HUD';
import { TouchControls } from './components/TouchControls';
import { TitleScreen } from './components/TitleScreen';
import { GameOverModal } from './components/GameOverModal';
import { PauseModal } from './components/PauseModal';
import { ShopModal } from './components/ShopModal';
import { SettingsModal } from './components/SettingsModal';
import { GooglePlayIapModal } from './components/GooglePlayIapModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { googlePlayBilling, GooglePlayProduct } from './services/googlePlayBilling';
import {
  GameState,
  ControlType,
  DifficultyLevel,
  SpaceshipDef,
  AccessoryDef,
  IapProduct,
  ConsumableItem,
  LeaderboardEntry,
  PlayerInventory,
} from './types/game';
import { INITIAL_SHIPS, INITIAL_ACCESSORIES, INITIAL_LEADERBOARD } from './data/storeCatalog';
import { sounds } from './audio/soundEffects';

export default function App() {
  // Game state machine
  const [gameState, setGameState] = useState<GameState>('TITLE_MENU');

  // Modals
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [selectedIapProduct, setSelectedIapProduct] = useState<IapProduct | GooglePlayProduct | null>(null);

  // Player persistent bank & customization
  const [coins, setCoins] = useState<number>(() => {
    const saved = localStorage.getItem('astro_coins');
    return saved !== null ? parseInt(saved, 10) : 150; // Starter gift
  });

  const [gems, setGems] = useState<number>(() => {
    const saved = localStorage.getItem('astro_gems');
    return saved !== null ? parseInt(saved, 10) : 12; // Starter gift
  });

  const [highScore, setHighScore] = useState<number>(() => {
    const saved = localStorage.getItem('astro_highscore');
    return saved !== null ? parseInt(saved, 10) : 0;
  });

  const [playerName, setPlayerName] = useState<string>(() => {
    return localStorage.getItem('astro_player_name') || 'Cadete Cósmico';
  });

  // Lifetime stats for unlocking ships
  const [lifetimeDodges, setLifetimeDodges] = useState<number>(() => {
    const saved = localStorage.getItem('astro_lifetime_dodges');
    return saved !== null ? parseInt(saved, 10) : 0;
  });

  const [bestSingleDodges, setBestSingleDodges] = useState<number>(() => {
    const saved = localStorage.getItem('astro_best_single_dodges');
    return saved !== null ? parseInt(saved, 10) : 0;
  });

  const [lifetimeCoins, setLifetimeCoins] = useState<number>(() => {
    const saved = localStorage.getItem('astro_lifetime_coins');
    return saved !== null ? parseInt(saved, 10) : 150;
  });

  // Consumable items inventory
  const [inventory, setInventory] = useState<PlayerInventory>(() => {
    try {
      const saved = localStorage.getItem('astro_inventory');
      return saved
        ? JSON.parse(saved)
        : { extraLivesStock: 2, startingShieldsStock: 2, megaMagnetStock: 1 };
    } catch {
      return { extraLivesStock: 2, startingShieldsStock: 2, megaMagnetStock: 1 };
    }
  });

  // Leaderboard entries
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    try {
      const saved = localStorage.getItem('astro_leaderboard');
      return saved ? JSON.parse(saved) : INITIAL_LEADERBOARD;
    } catch {
      return INITIAL_LEADERBOARD;
    }
  });

  // Ships & Accessories
  const [unlockedShipIds, setUnlockedShipIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('astro_unlocked_ships');
      return saved ? JSON.parse(saved) : ['ship_classic'];
    } catch {
      return ['ship_classic'];
    }
  });

  const [activeShipId, setActiveShipId] = useState<string>(() => {
    return localStorage.getItem('astro_active_ship') || 'ship_classic';
  });

  const [unlockedAccessoryIds, setUnlockedAccessoryIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('astro_unlocked_accessories');
      return saved ? JSON.parse(saved) : ['acc_none'];
    } catch {
      return ['acc_none'];
    }
  });

  const [activeAccessoryId, setActiveAccessoryId] = useState<string>(() => {
    return localStorage.getItem('astro_active_accessory') || 'acc_none';
  });

  const [controlType, setControlType] = useState<ControlType>(() => {
    const saved = localStorage.getItem('astro_control_type') as ControlType;
    return saved || 'touch_drag'; // Default to kid-friendly direct finger drag
  });

  const [difficulty, setDifficulty] = useState<DifficultyLevel>(() => {
    const saved = localStorage.getItem('astro_difficulty') as DifficultyLevel;
    return saved || 'normal';
  });

  const [isMuted, setIsMuted] = useState<boolean>(() => {
    return sounds.getMuted();
  });

  const [hasClaimedDaily, setHasClaimedDaily] = useState<boolean>(() => {
    const today = new Date().toDateString();
    return localStorage.getItem('astro_daily_claimed') === today;
  });

  // Active run stats (Player starts strictly at 0 points!)
  const [runScore, setRunScore] = useState(0);
  const [runDodges, setRunDodges] = useState(0);
  const [runCoinsEarned, setRunCoinsEarned] = useState(0);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [playerLives, setPlayerLives] = useState(3);
  const [playerShield, setPlayerShield] = useState(1);
  const [playerMagnetTimer, setPlayerMagnetTimer] = useState(0);
  const [playerTurboTimer, setPlayerTurboTimer] = useState(0);

  // Direction input from on-screen buttons
  const [externalMoveDir, setExternalMoveDir] = useState<number>(0);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('astro_coins', coins.toString());
  }, [coins]);

  useEffect(() => {
    localStorage.setItem('astro_gems', gems.toString());
  }, [gems]);

  useEffect(() => {
    localStorage.setItem('astro_highscore', highScore.toString());
  }, [highScore]);

  useEffect(() => {
    localStorage.setItem('astro_player_name', playerName);
  }, [playerName]);

  useEffect(() => {
    localStorage.setItem('astro_lifetime_dodges', lifetimeDodges.toString());
  }, [lifetimeDodges]);

  useEffect(() => {
    localStorage.setItem('astro_best_single_dodges', bestSingleDodges.toString());
  }, [bestSingleDodges]);

  useEffect(() => {
    localStorage.setItem('astro_lifetime_coins', lifetimeCoins.toString());
  }, [lifetimeCoins]);

  useEffect(() => {
    localStorage.setItem('astro_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('astro_leaderboard', JSON.stringify(leaderboard));
  }, [leaderboard]);

  useEffect(() => {
    localStorage.setItem('astro_unlocked_ships', JSON.stringify(unlockedShipIds));
  }, [unlockedShipIds]);

  useEffect(() => {
    localStorage.setItem('astro_active_ship', activeShipId);
  }, [activeShipId]);

  useEffect(() => {
    localStorage.setItem('astro_unlocked_accessories', JSON.stringify(unlockedAccessoryIds));
  }, [unlockedAccessoryIds]);

  useEffect(() => {
    localStorage.setItem('astro_active_accessory', activeAccessoryId);
  }, [activeAccessoryId]);

  useEffect(() => {
    localStorage.setItem('astro_control_type', controlType);
  }, [controlType]);

  useEffect(() => {
    localStorage.setItem('astro_difficulty', difficulty);
  }, [difficulty]);

  // Ships list with unlocked state computed
  const ships = useMemo(() => {
    return INITIAL_SHIPS.map((ship) => ({
      ...ship,
      unlocked: unlockedShipIds.includes(ship.id),
    }));
  }, [unlockedShipIds]);

  const activeShip = useMemo(() => {
    return ships.find((s) => s.id === activeShipId) || ships[0];
  }, [ships, activeShipId]);

  // Accessories list with unlocked state computed
  const accessories = useMemo(() => {
    return INITIAL_ACCESSORIES.map((acc) => ({
      ...acc,
      unlocked: unlockedAccessoryIds.includes(acc.id),
    }));
  }, [unlockedAccessoryIds]);

  const activeAccessory = useMemo(() => {
    return accessories.find((a) => a.id === activeAccessoryId) || accessories[0];
  }, [accessories, activeAccessoryId]);

  // Sound toggle handler
  const handleToggleMute = useCallback(() => {
    const nowMuted = sounds.toggleMute();
    setIsMuted(nowMuted);
  }, []);

  // Keyboard shortcut listener per game craft guidelines
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (gameState === 'TITLE_MENU') {
        if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
          e.preventDefault();
          sounds.playButtonTap();
          setGameState('PLAYING');
        }
      } else if (gameState === 'PLAYING') {
        if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
          e.preventDefault();
          sounds.playButtonTap();
          setGameState('PAUSED');
        }
      } else if (gameState === 'PAUSED') {
        if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
          e.preventDefault();
          sounds.playButtonTap();
          setGameState('PLAYING');
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [gameState]);

  // Game callbacks
  const handleCoinsEarned = useCallback((amount: number) => {
    setCoins((prev) => prev + amount);
    setRunCoinsEarned((prev) => prev + amount);
    setLifetimeCoins((prev) => prev + amount);
  }, []);

  const handleGemsEarned = useCallback((amount: number) => {
    setGems((prev) => prev + amount);
  }, []);

  const handleObstacleDodged = useCallback((totalDodges: number, score: number) => {
    setRunDodges(totalDodges);
    setRunScore(score);
    setLifetimeDodges((prev) => prev + 1);
    setBestSingleDodges((prev) => Math.max(prev, totalDodges));
  }, []);

  const handleUseExtraLife = useCallback(() => {
    setInventory((prev) => ({
      ...prev,
      extraLivesStock: Math.max(0, prev.extraLivesStock - 1),
    }));
  }, []);

  const handleUseStartingShield = useCallback(() => {
    setInventory((prev) => ({
      ...prev,
      startingShieldsStock: Math.max(0, prev.startingShieldsStock - 1),
    }));
  }, []);

  const handleGameOver = useCallback((finalScore: number, coinsEarned: number, totalDodges: number) => {
    setRunScore(finalScore);
    setRunCoinsEarned(coinsEarned);
    setRunDodges(totalDodges);

    let isRecord = false;
    if (finalScore > highScore) {
      setHighScore(finalScore);
      isRecord = true;
      setIsNewRecord(true);
    } else {
      setIsNewRecord(false);
    }

    // Insert or update on Leaderboard
    if (finalScore > 0) {
      setLeaderboard((prev) => {
        const newEntry: LeaderboardEntry = {
          id: `player_${Date.now()}`,
          name: playerName,
          score: finalScore,
          dodges: totalDodges,
          shipName: activeShip.name,
          date: 'Hoy',
          isPlayer: true,
        };
        const combined = [...prev.filter((e) => !e.isPlayer || e.score >= finalScore), newEntry];
        combined.sort((a, b) => b.score - a.score);
        return combined.slice(0, 8);
      });
    }

    setGameState('GAME_OVER');
  }, [highScore, playerName, activeShip.name]);

  const handlePlayerStatusChange = useCallback(
    (lives: number, shield: number, magnetTime: number, turboTime: number) => {
      setPlayerLives(lives);
      setPlayerShield(shield);
      setPlayerMagnetTimer(magnetTime);
      setPlayerTurboTimer(turboTime);
    },
    []
  );

  // Store actions
  const handleBuyShip = (shipId: string, costCoins: number, costGems: number) => {
    if (coins >= costCoins && gems >= costGems) {
      setCoins((prev) => prev - costCoins);
      setGems((prev) => prev - costGems);
      setUnlockedShipIds((prev) => [...prev, shipId]);
      setActiveShipId(shipId);
    }
  };

  const handleClaimRequirementUnlock = (shipId: string) => {
    setUnlockedShipIds((prev) => (prev.includes(shipId) ? prev : [...prev, shipId]));
    setActiveShipId(shipId);
  };

  const handleBuyAccessory = (accId: string, costCoins: number) => {
    if (coins >= costCoins) {
      setCoins((prev) => prev - costCoins);
      setUnlockedAccessoryIds((prev) => [...prev, accId]);
      setActiveAccessoryId(accId);
    }
  };

  const handleBuyConsumable = (item: ConsumableItem) => {
    if (coins >= item.priceCoins && gems >= item.priceGems) {
      setCoins((prev) => prev - item.priceCoins);
      setGems((prev) => prev - item.priceGems);

      setInventory((prev) => {
        if (item.id === 'extra_lives_pack') {
          return { ...prev, extraLivesStock: prev.extraLivesStock + item.quantityGranted };
        } else if (item.id === 'temp_shields_pack') {
          return { ...prev, startingShieldsStock: prev.startingShieldsStock + item.quantityGranted };
        } else {
          return { ...prev, megaMagnetStock: prev.megaMagnetStock + item.quantityGranted };
        }
      });
    }
  };

  const handleClaimDailyGift = () => {
    setCoins((prev) => prev + 150);
    setGems((prev) => prev + 5);
    const today = new Date().toDateString();
    localStorage.setItem('astro_daily_claimed', today);
    setHasClaimedDaily(true);
  };

  const handleIapSuccess = (
    earnedCoins: number,
    earnedGems: number,
    rewardType?: string,
    consumableType?: string,
    consumableQty?: number
  ) => {
    if (earnedCoins > 0) {
      setCoins((prev) => prev + earnedCoins);
      setLifetimeCoins((prev) => prev + earnedCoins);
    }
    if (earnedGems > 0) {
      setGems((prev) => prev + earnedGems);
    }

    // Handle consumables from Google Play Billing
    if (consumableType && consumableQty) {
      setInventory((prev) => {
        if (consumableType === 'extra_lives') {
          return { ...prev, extraLivesStock: prev.extraLivesStock + consumableQty };
        } else if (consumableType === 'starting_shields') {
          return { ...prev, startingShieldsStock: prev.startingShieldsStock + consumableQty };
        } else if (consumableType === 'mega_magnets') {
          return { ...prev, megaMagnetStock: prev.megaMagnetStock + consumableQty };
        }
        return prev;
      });
    }

    // Handle VIP Pass entitlement
    const currentId = selectedIapProduct
      ? 'productId' in selectedIapProduct
        ? selectedIapProduct.productId
        : selectedIapProduct.id
      : null;
    if (rewardType === 'vip_pass' || currentId === 'astro_vip_astronaut_pass') {
      if (!unlockedShipIds.includes('ship_falcon')) {
        setUnlockedShipIds((prev) => [...prev, 'ship_falcon']);
      }
    }
  };

  const handleRestorePurchases = async () => {
    const result = await googlePlayBilling.restorePurchases();
    if (result.restoredCount > 0) {
      for (const prod of result.restoredProducts) {
        if (prod.productId === 'astro_vip_astronaut_pass') {
          if (!unlockedShipIds.includes('ship_falcon')) {
            setUnlockedShipIds((prev) => [...prev, 'ship_falcon']);
          }
        }
      }
    }
  };

  // Android bottom bar handlers
  const handleAndroidBack = () => {
    if (isPrivacyOpen) {
      setIsPrivacyOpen(false);
    } else if (isLeaderboardOpen) {
      setIsLeaderboardOpen(false);
    } else if (isShopOpen) {
      setIsShopOpen(false);
    } else if (isSettingsOpen) {
      setIsSettingsOpen(false);
    } else if (gameState === 'PLAYING') {
      setGameState('PAUSED');
    } else if (gameState === 'PAUSED' || gameState === 'GAME_OVER') {
      setGameState('TITLE_MENU');
    }
  };

  const handleAndroidHome = () => {
    setIsPrivacyOpen(false);
    setIsLeaderboardOpen(false);
    setIsShopOpen(false);
    setIsSettingsOpen(false);
    setGameState('TITLE_MENU');
  };

  return (
    <AndroidFrame
      onAndroidBack={handleAndroidBack}
      onAndroidHome={handleAndroidHome}
      title="Astro Esquiva"
    >
      <div className="relative w-full h-full overflow-hidden bg-slate-950 flex flex-col">
        {/* Isolated Canvas Loop */}
        <GameCanvas
          isPlaying={gameState === 'PLAYING'}
          isPaused={gameState === 'PAUSED'}
          activeShip={activeShip}
          activeAccessory={activeAccessory}
          controlType={controlType}
          difficulty={difficulty}
          extraLivesStock={inventory.extraLivesStock}
          startingShieldsStock={inventory.startingShieldsStock}
          onUseExtraLife={handleUseExtraLife}
          onUseStartingShield={handleUseStartingShield}
          onCoinsEarned={handleCoinsEarned}
          onGemsEarned={handleGemsEarned}
          onObstacleDodged={handleObstacleDodged}
          onGameOver={handleGameOver}
          onPlayerStatusChange={handlePlayerStatusChange}
          externalMoveDir={externalMoveDir}
        />

        {/* HUD Overlay (<15% playfield occlusion, pointer-events: none on wrapper) */}
        {gameState === 'PLAYING' && (
          <>
            <HUD
              score={runScore}
              dodges={runDodges}
              lives={playerLives}
              maxLives={activeShip.modelType === 'falcon' ? 4 : 3}
              shield={playerShield}
              magnetTimer={playerMagnetTimer}
              turboTimer={playerTurboTimer}
              coins={coins}
              gems={gems}
              isMuted={isMuted}
              onToggleMute={handleToggleMute}
              onPause={() => setGameState('PAUSED')}
            />

            {/* On-screen touch buttons or touch-drag switcher */}
            <TouchControls
              controlType={controlType}
              onMoveChange={setExternalMoveDir}
              onToggleControlMode={() =>
                setControlType((prev) => (prev === 'touch_drag' ? 'buttons' : 'touch_drag'))
              }
            />
          </>
        )}

        {/* Title Screen View */}
        {gameState === 'TITLE_MENU' && !isShopOpen && !isSettingsOpen && !isLeaderboardOpen && !isPrivacyOpen && (
          <TitleScreen
            highScore={highScore}
            totalCoins={coins}
            totalGems={gems}
            controlType={controlType}
            onStartGame={() => {
              setRunScore(0);
              setRunDodges(0);
              setRunCoinsEarned(0);
              setGameState('PLAYING');
            }}
            onOpenShop={() => setIsShopOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
            onOpenPrivacy={() => setIsPrivacyOpen(true)}
          />
        )}

        {/* Pause Modal */}
        {gameState === 'PAUSED' && !isShopOpen && !isSettingsOpen && !isLeaderboardOpen && !isPrivacyOpen && (
          <PauseModal
            onResume={() => setGameState('PLAYING')}
            onRestart={() => {
              setRunScore(0);
              setRunDodges(0);
              setRunCoinsEarned(0);
              setGameState('PLAYING');
            }}
            onGoHome={() => setGameState('TITLE_MENU')}
            onOpenShop={() => setIsShopOpen(true)}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
          />
        )}

        {/* Game Over Modal */}
        {gameState === 'GAME_OVER' && !isShopOpen && !isSettingsOpen && !isLeaderboardOpen && !isPrivacyOpen && (
          <GameOverModal
            score={runScore}
            highScore={highScore}
            dodges={runDodges}
            isNewRecord={isNewRecord}
            coinsEarned={runCoinsEarned}
            onPlayAgain={() => {
              setRunScore(0);
              setRunDodges(0);
              setRunCoinsEarned(0);
              setGameState('PLAYING');
            }}
            onOpenShop={() => setIsShopOpen(true)}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
            onGoHome={() => setGameState('TITLE_MENU')}
          />
        )}

        {/* Shop Modal */}
        {isShopOpen && (
          <ShopModal
            coins={coins}
            gems={gems}
            ships={ships}
            activeShipId={activeShipId}
            accessories={accessories}
            activeAccessoryId={activeAccessoryId}
            inventory={inventory}
            highScore={highScore}
            lifetimeDodges={lifetimeDodges}
            bestSingleDodges={bestSingleDodges}
            lifetimeCoins={lifetimeCoins}
            onSelectShip={(id) => setActiveShipId(id)}
            onBuyShip={handleBuyShip}
            onClaimRequirementUnlock={handleClaimRequirementUnlock}
            onSelectAccessory={(id) => setActiveAccessoryId(id)}
            onBuyAccessory={handleBuyAccessory}
            onBuyConsumable={handleBuyConsumable}
            onOpenIapModal={(prod) => setSelectedIapProduct(prod)}
            onClaimDailyGift={handleClaimDailyGift}
            hasClaimedDaily={hasClaimedDaily}
            onRestorePurchases={handleRestorePurchases}
            onClose={() => setIsShopOpen(false)}
          />
        )}

        {/* Settings Modal */}
        {isSettingsOpen && (
          <SettingsModal
            controlType={controlType}
            onChangeControlType={setControlType}
            difficulty={difficulty}
            onChangeDifficulty={setDifficulty}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            onResetProgress={() => {
              setCoins(150);
              setGems(12);
              setHighScore(0);
              setLifetimeDodges(0);
              setBestSingleDodges(0);
              setInventory({ extraLivesStock: 2, startingShieldsStock: 2, megaMagnetStock: 1 });
              setUnlockedShipIds(['ship_classic']);
              setActiveShipId('ship_classic');
              setUnlockedAccessoryIds(['acc_none']);
              setActiveAccessoryId('acc_none');
              localStorage.clear();
            }}
            onOpenPrivacy={() => setIsPrivacyOpen(true)}
            onClose={() => setIsSettingsOpen(false)}
          />
        )}

        {/* Leaderboard Modal */}
        {isLeaderboardOpen && (
          <LeaderboardModal
            entries={leaderboard}
            playerName={playerName}
            onUpdatePlayerName={setPlayerName}
            onClose={() => setIsLeaderboardOpen(false)}
          />
        )}

        {/* Privacy Policy Modal */}
        {isPrivacyOpen && (
          <PrivacyPolicyModal onClose={() => setIsPrivacyOpen(false)} />
        )}

        {/* Google Play Simulated In-App Purchase Modal */}
        {selectedIapProduct && (
          <GooglePlayIapModal
            product={selectedIapProduct}
            onClose={() => setSelectedIapProduct(null)}
            onSuccess={handleIapSuccess}
          />
        )}
      </div>
    </AndroidFrame>
  );
}
