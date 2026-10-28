export type GameState =
  | 'TITLE_MENU'
  | 'PLAYING'
  | 'PAUSED'
  | 'GAME_OVER'
  | 'SHOP'
  | 'SETTINGS'
  | 'LEADERBOARD';

export type ControlType = 'touch_drag' | 'buttons' | 'keyboard';
export type DifficultyLevel = 'easy' | 'normal' | 'fast';

export interface ShipUnlockRequirement {
  type: 'score' | 'dodges_single' | 'dodges_total' | 'coins_total';
  target: number;
  label: string;
  description: string;
}

export interface SpaceshipDef {
  id: string;
  name: string;
  description: string;
  color: string;
  accentColor: string;
  engineColor: string;
  speed: number;
  maxShield: number;
  magnetBonus: number;
  priceCoins: number;
  priceGems: number;
  unlocked: boolean;
  modelType: 'classic' | 'ufo' | 'cat' | 'falcon' | 'rainbow' | 'robot' | 'dragon';
  unlockRequirement?: ShipUnlockRequirement;
}

export interface AccessoryDef {
  id: string;
  name: string;
  icon: string;
  type: 'crown' | 'pirate' | 'sunglasses' | 'alien' | 'bow' | 'none';
  priceCoins: number;
  unlocked: boolean;
}

export interface ConsumableItem {
  id: 'extra_lives_pack' | 'temp_shields_pack' | 'mega_magnet_pack';
  title: string;
  description: string;
  icon: string;
  priceCoins: number;
  priceGems: number;
  quantityGranted: number;
  badge?: string;
}

export interface IapProduct {
  id: string;
  title: string;
  coins: number;
  gems: number;
  priceUsd: string;
  badge?: string;
  bonusDesc: string;
  isPopular?: boolean;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  dodges: number;
  shipName: string;
  date: string;
  isPlayer?: boolean;
}

export interface PlayerInventory {
  extraLivesStock: number;
  startingShieldsStock: number;
  megaMagnetStock: number;
}

export interface PlayerState {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  width: number;
  height: number;
  lives: number;
  maxLives: number;
  shield: number;
  maxShield: number;
  invincibleTimer: number;
  magnetTimer: number;
  turboTimer: number;
  activeShipId: string;
  activeAccessoryId: string;
}

export interface Obstacle {
  id: number;
  x: number;
  y: number;
  radius: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  type: 'asteroid' | 'spiky_crystal' | 'space_jelly' | 'alien_ufo' | 'comet';
  color: string;
  faceExpression: 'happy' | 'cheeky' | 'silly' | 'sleepy';
  warningTelegraph?: boolean;
  pulsePhase?: number;
  hasBeenDodged?: boolean;
}

export interface Collectible {
  id: number;
  x: number;
  y: number;
  radius: number;
  speedY: number;
  type: 'coin' | 'gem' | 'heart' | 'shield' | 'magnet' | 'rainbow';
  value: number;
  wobble: number;
  color: string;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  shape?: 'circle' | 'star' | 'sparkle';
}

export interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  vy: number;
}
