import React, { useRef, useEffect, useCallback } from 'react';
import {
  PlayerState,
  Obstacle,
  Collectible,
  Particle,
  FloatingText,
  SpaceshipDef,
  AccessoryDef,
  ControlType,
  DifficultyLevel,
} from '../types/game';
import { sounds } from '../audio/soundEffects';

interface GameCanvasProps {
  isPlaying: boolean;
  isPaused: boolean;
  activeShip: SpaceshipDef;
  activeAccessory: AccessoryDef;
  controlType: ControlType;
  difficulty: DifficultyLevel;
  extraLivesStock: number;
  startingShieldsStock: number;
  onUseExtraLife: () => void;
  onUseStartingShield: () => void;
  onCoinsEarned: (coins: number) => void;
  onGemsEarned: (gems: number) => void;
  onObstacleDodged: (totalDodges: number, score: number) => void;
  onGameOver: (finalScore: number, coinsEarned: number, totalDodges: number) => void;
  onPlayerStatusChange: (lives: number, shield: number, magnetTime: number, turboTime: number) => void;
  // External inputs from on-screen buttons
  externalMoveDir: number; // -1, 0, 1
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  isPlaying,
  isPaused,
  activeShip,
  activeAccessory,
  controlType,
  difficulty,
  extraLivesStock,
  startingShieldsStock,
  onUseExtraLife,
  onUseStartingShield,
  onCoinsEarned,
  onGemsEarned,
  onObstacleDodged,
  onGameOver,
  onPlayerStatusChange,
  externalMoveDir,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // References to preserve mutable game loop state across frames without React re-rendering
  const gameStateRef = useRef({
    score: 0,
    dodgesCount: 0,
    coinsEarnedThisRun: 0,
    distance: 0,
    gameTime: 0,
    spawnObstacleTimer: 0,
    spawnCollectibleTimer: 0,
    hitstopTimer: 0,
    shakeDuration: 0,
    shakeIntensity: 0,
    nextId: 1,
    player: {
      x: 200,
      y: 500,
      targetX: 200,
      targetY: 500,
      vx: 0,
      width: 44,
      height: 48,
      lives: 3,
      maxLives: 3,
      shield: 1,
      maxShield: activeShip.maxShield,
      invincibleTimer: 0,
      magnetTimer: 0,
      turboTimer: 0,
      activeShipId: activeShip.id,
      activeAccessoryId: activeAccessory.id,
    } as PlayerState,
    obstacles: [] as Obstacle[],
    collectibles: [] as Collectible[],
    particles: [] as Particle[],
    floatingTexts: [] as FloatingText[],
    stars: [] as { x: number; y: number; size: number; speed: number; alpha: number; color: string }[],
    keysHeld: { left: false, right: false, up: false, down: false },
    touchPointer: { active: false, x: 200, y: 500, id: -1 },
  });

  // Store callbacks in mutable refs to prevent recreation of game loop or unwanted effect re-triggers
  const callbacksRef = useRef({
    onCoinsEarned,
    onGemsEarned,
    onObstacleDodged,
    onGameOver,
    onPlayerStatusChange,
    onUseExtraLife,
    onUseStartingShield,
  });

  useEffect(() => {
    callbacksRef.current = {
      onCoinsEarned,
      onGemsEarned,
      onObstacleDodged,
      onGameOver,
      onPlayerStatusChange,
      onUseExtraLife,
      onUseStartingShield,
    };
  });

  // Track previous status to prevent 60fps re-rendering of App.tsx
  const lastStatusRef = useRef({ lives: 3, shield: 1, magnet: 0, turbo: 0 });

  // Keep ship attributes updated if changed
  useEffect(() => {
    gameStateRef.current.player.maxShield = activeShip.maxShield;
  }, [activeShip]);

  // Reset or Start Run
  const resetGame = useCallback(() => {
    const canvas = canvasRef.current;
    const width = canvas ? canvas.width : 400;
    const height = canvas ? canvas.height : 700;

    gameStateRef.current.score = 0;
    gameStateRef.current.dodgesCount = 0;
    gameStateRef.current.coinsEarnedThisRun = 0;
    gameStateRef.current.distance = 0;
    gameStateRef.current.gameTime = 0;
    gameStateRef.current.spawnObstacleTimer = 0;
    gameStateRef.current.spawnCollectibleTimer = 0;
    gameStateRef.current.hitstopTimer = 0;
    gameStateRef.current.shakeDuration = 0;
    gameStateRef.current.obstacles = [];
    gameStateRef.current.collectibles = [];
    gameStateRef.current.particles = [];
    gameStateRef.current.floatingTexts = [];

    const startX = width / 2;
    const startY = height * 0.8;

    // Check if player has consumable starting shields in stock!
    let initialShield = activeShip.maxShield;
    if (startingShieldsStock > 0) {
      initialShield += 2;
      callbacksRef.current.onUseStartingShield();
      gameStateRef.current.floatingTexts.push({
        id: gameStateRef.current.nextId++,
        x: startX,
        y: startY - 40,
        text: '¡ESCUDO REFORZADO ACTIVADO! 🛡️',
        color: '#38BDF8',
        alpha: 1,
        vy: -1.2,
      });
    }

    gameStateRef.current.player = {
      x: startX,
      y: startY,
      targetX: startX,
      targetY: startY,
      vx: 0,
      width: 44,
      height: 48,
      lives: 3,
      maxLives: 3,
      shield: initialShield,
      maxShield: initialShield,
      invincibleTimer: 1.5, // brief grace period at start
      magnetTimer: 0,
      turboTimer: 0,
      activeShipId: activeShip.id,
      activeAccessoryId: activeAccessory.id,
    };

    lastStatusRef.current = { lives: 3, shield: initialShield, magnet: 0, turbo: 0 };
    callbacksRef.current.onPlayerStatusChange(3, initialShield, 0, 0);
    callbacksRef.current.onObstacleDodged(0, 0);
  }, [activeShip.maxShield, activeShip.id, activeAccessory.id, startingShieldsStock]);

  // Only reset when transitioning from NOT playing to PLAYING
  const prevIsPlayingRef = useRef(false);
  useEffect(() => {
    if (isPlaying && !prevIsPlayingRef.current) {
      resetGame();
    }
    prevIsPlayingRef.current = isPlaying;
  }, [isPlaying, resetGame]);

  // Initialize starfield
  useEffect(() => {
    const starColors = ['#FFFFFF', '#BAE6FD', '#DDD6FE', '#FEF08A', '#FBCFE8'];
    const stars = [];
    for (let i = 0; i < 90; i++) {
      stars.push({
        x: Math.random() * 800,
        y: Math.random() * 1200,
        size: Math.random() * 2.2 + 0.8,
        speed: Math.random() * 1.5 + 0.4,
        alpha: Math.random() * 0.7 + 0.3,
        color: starColors[Math.floor(Math.random() * starColors.length)],
      });
    }
    gameStateRef.current.stars = stars;
  }, []);

  // Main Canvas Lifecycle and 60fps Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const addFloatingText = (x: number, y: number, text: string, color: string) => {
      gameStateRef.current.floatingTexts.push({
        id: gameStateRef.current.nextId++,
        x,
        y,
        text,
        color,
        alpha: 1,
        vy: -1.2,
      });
    };

    const addExplosionParticles = (x: number, y: number, color: string, count = 12) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3.5 + 1.2;
        gameStateRef.current.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 4 + 2,
          color,
          alpha: 1,
          life: 0,
          maxLife: 35 + Math.random() * 15,
          shape: Math.random() > 0.5 ? 'star' : 'circle',
        });
      }
    };

    // Game loop
    const loop = (currentTime: number) => {
      const rawDt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      const dt = Math.min(rawDt, 0.05); // Clamped delta time to avoid frame skip spikes

      const rect = canvas.getBoundingClientRect();
      const displayW = rect.width;
      const displayH = rect.height;

      // Handle hitstop
      if (gameStateRef.current.hitstopTimer > 0) {
        gameStateRef.current.hitstopTimer -= dt;
      } else if (isPlaying && !isPaused) {
        const state = gameStateRef.current;
        const player = state.player;

        state.gameTime += dt;
        state.distance += dt * 60;
        // Puntuación: El jugador empieza en 0 y gana puntos por cada obstáculo esquivado

        // Update timers
        if (player.invincibleTimer > 0) player.invincibleTimer -= dt;
        if (player.magnetTimer > 0) player.magnetTimer -= dt;
        if (player.turboTimer > 0) player.turboTimer -= dt;

        // Only fire status change when integer/status changes to prevent 60fps re-rendering
        const curM = Math.ceil(player.magnetTimer);
        const curT = Math.ceil(player.turboTimer);
        if (
          player.lives !== lastStatusRef.current.lives ||
          player.shield !== lastStatusRef.current.shield ||
          curM !== lastStatusRef.current.magnet ||
          curT !== lastStatusRef.current.turbo
        ) {
          lastStatusRef.current = {
            lives: player.lives,
            shield: player.shield,
            magnet: curM,
            turbo: curT,
          };
          callbacksRef.current.onPlayerStatusChange(player.lives, player.shield, player.magnetTimer, player.turboTimer);
        }

        // Update player movement based on control type
        const moveSpeed = (difficulty === 'easy' ? 320 : difficulty === 'normal' ? 380 : 440) * activeShip.speed;

        if (controlType === 'touch_drag' && state.touchPointer.active) {
          // Direct finger drag: smoothly interpolate towards touch position with kid-friendly ease
          const dx = state.touchPointer.x - player.x;
          const dy = state.touchPointer.y - player.y;
          player.x += dx * Math.min(dt * 14, 1);
          player.y += dy * Math.min(dt * 14, 1);
        } else {
          // Button or Keyboard controls
          let dirX = 0;
          if (externalMoveDir !== 0) {
            dirX = externalMoveDir;
          } else {
            if (state.keysHeld.left) dirX -= 1;
            if (state.keysHeld.right) dirX += 1;
          }

          player.vx = dirX * moveSpeed;
          player.x += player.vx * dt;

          // Keep player near bottom ~78% height
          const targetY = displayH * 0.78;
          player.y += (targetY - player.y) * dt * 4;
        }

        // Clamp player inside screen bounds
        const margin = 26;
        player.x = Math.max(margin, Math.min(displayW - margin, player.x));
        player.y = Math.max(displayH * 0.2, Math.min(displayH - margin, player.y));

        // Spawn engine thruster particles
        if (Math.random() < 0.8) {
          const isTurbo = player.turboTimer > 0;
          const pColor = isTurbo
            ? `hsl(${(state.gameTime * 360) % 360}, 100%, 65%)`
            : activeShip.engineColor;
          state.particles.push({
            x: player.x + (Math.random() - 0.5) * 12,
            y: player.y + 22,
            vx: (Math.random() - 0.5) * 1.5,
            vy: Math.random() * 3 + (isTurbo ? 6 : 3),
            size: Math.random() * 4 + 2,
            color: pColor,
            alpha: 0.9,
            life: 0,
            maxLife: 22,
            shape: 'circle',
          });
        }

        // Spawn obstacles
        const obstacleRate = difficulty === 'easy' ? 1.6 : difficulty === 'normal' ? 1.15 : 0.85;
        state.spawnObstacleTimer += dt;
        if (state.spawnObstacleTimer >= obstacleRate) {
          state.spawnObstacleTimer = 0;

          const types: Obstacle['type'][] = ['asteroid', 'spiky_crystal', 'space_jelly', 'alien_ufo'];
          if (state.gameTime > 8) types.push('comet');

          const obsType = types[Math.floor(Math.random() * types.length)];
          const obsRadius = obsType === 'asteroid' ? 24 : obsType === 'alien_ufo' ? 26 : 20;

          // Base speed scales gently
          const baseSpeed = difficulty === 'easy' ? 130 : difficulty === 'normal' ? 175 : 220;
          const speedMod = obsType === 'comet' ? 1.6 : 1.0;
          const speedY = (baseSpeed + Math.random() * 40) * speedMod;
          const speedX = obsType === 'alien_ufo' ? (Math.random() > 0.5 ? 40 : -40) : 0;

          const faces: Obstacle['faceExpression'][] = ['happy', 'cheeky', 'silly', 'sleepy'];
          const face = faces[Math.floor(Math.random() * faces.length)];

          const colors = {
            asteroid: '#A1A1AA',
            spiky_crystal: '#C084FC',
            space_jelly: '#38BDF8',
            alien_ufo: '#4ADE80',
            comet: '#FB923C',
          };

          state.obstacles.push({
            id: state.nextId++,
            x: Math.random() * (displayW - 60) + 30,
            y: -40,
            radius: obsRadius,
            speedY,
            speedX,
            rotation: 0,
            rotationSpeed: (Math.random() - 0.5) * 2,
            type: obsType,
            color: colors[obsType],
            faceExpression: face,
            warningTelegraph: obsType === 'comet',
            pulsePhase: 0,
          });
        }

        // Spawn collectibles (Coins, Gems, Shields, Magnets, Rainbow Stars, Hearts)
        state.spawnCollectibleTimer += dt;
        if (state.spawnCollectibleTimer >= 0.75) {
          state.spawnCollectibleTimer = 0;
          const rand = Math.random();
          let cType: Collectible['type'] = 'coin';
          let cColor = '#FBBF24';
          let cVal = 10;

          if (rand < 0.6) {
            cType = 'coin';
            cColor = '#FBBF24';
            cVal = 10;
          } else if (rand < 0.75) {
            cType = 'gem';
            cColor = '#F472B6';
            cVal = 1;
          } else if (rand < 0.85 && player.lives < player.maxLives) {
            cType = 'heart';
            cColor = '#EF4444';
            cVal = 1;
          } else if (rand < 0.90) {
            cType = 'shield';
            cColor = '#06B6D4';
            cVal = 1;
          } else if (rand < 0.95) {
            cType = 'magnet';
            cColor = '#A855F7';
            cVal = 1;
          } else {
            cType = 'rainbow';
            cColor = '#FACC15';
            cVal = 1;
          }

          state.collectibles.push({
            id: state.nextId++,
            x: Math.random() * (displayW - 50) + 25,
            y: -30,
            radius: cType === 'coin' ? 14 : 16,
            speedY: 140,
            type: cType,
            value: cVal,
            wobble: Math.random() * Math.PI * 2,
            color: cColor,
          });
        }

        // Update collectibles and Magnet pulling
        const magnetActive = player.magnetTimer > 0 || player.turboTimer > 0;
        const magnetReach = (magnetActive ? 220 : 50) * activeShip.magnetBonus;

        for (let i = state.collectibles.length - 1; i >= 0; i--) {
          const item = state.collectibles[i];
          item.wobble += dt * 4;
          item.y += item.speedY * dt;

          // Magnet suction logic
          const dx = player.x - item.x;
          const dy = player.y - item.y;
          const dist = Math.hypot(dx, dy);

          if (dist < magnetReach) {
            const pullSpeed = 450 * (1 - dist / magnetReach);
            item.x += (dx / dist) * pullSpeed * dt;
            item.y += (dy / dist) * pullSpeed * dt;
          }

          // Collision with player
          // Child-friendly generous pickup radius
          if (dist < player.width / 2 + item.radius + 8) {
            if (item.type === 'coin') {
              sounds.playCoin();
              state.coinsEarnedThisRun += item.value;
              callbacksRef.current.onCoinsEarned(item.value);
              addFloatingText(item.x, item.y, `+${item.value}`, '#FBBF24');
            } else if (item.type === 'gem') {
              sounds.playGem();
              callbacksRef.current.onGemsEarned(1);
              addFloatingText(item.x, item.y, '+1 GEMA', '#F472B6');
            } else if (item.type === 'heart') {
              sounds.playShieldUp();
              if (player.lives < player.maxLives) player.lives += 1;
              addFloatingText(item.x, item.y, '+1 VIDA', '#EF4444');
            } else if (item.type === 'shield') {
              sounds.playShieldUp();
              player.shield = Math.min(player.maxShield + 1, player.shield + 1);
              addFloatingText(item.x, item.y, '¡ESCUDO!', '#38BDF8');
            } else if (item.type === 'magnet') {
              sounds.playRainbowTurbo();
              player.magnetTimer = 8;
              addFloatingText(item.x, item.y, '¡IMÁN ESTELAR!', '#C084FC');
            } else if (item.type === 'rainbow') {
              sounds.playRainbowTurbo();
              player.turboTimer = 6;
              player.invincibleTimer = 6;
              addFloatingText(item.x, item.y, '¡SÚPER ARCOÍRIS!', '#FACC15');
            }

            addExplosionParticles(item.x, item.y, item.color, 8);
            state.collectibles.splice(i, 1);
            continue;
          }

          if (item.y > displayH + 50) {
            state.collectibles.splice(i, 1);
          }
        }

        // Update obstacles & collisions
        for (let i = state.obstacles.length - 1; i >= 0; i--) {
          const obs = state.obstacles[i];
          obs.y += obs.speedY * dt;
          obs.x += obs.speedX * dt;
          obs.rotation += obs.rotationSpeed * dt;
          if (obs.pulsePhase !== undefined) obs.pulsePhase += dt * 3;

          // Bounce UFO on walls
          if (obs.type === 'alien_ufo') {
            if (obs.x < obs.radius || obs.x > displayW - obs.radius) {
              obs.speedX *= -1;
            }
          }

          // Player collision detection
          // Forgiving hitbox: hurtbox is ~70% of visual radius
          const pDist = Math.hypot(player.x - obs.x, player.y - obs.y);
          const collisionDist = player.width * 0.38 + obs.radius * 0.72;

          if (pDist < collisionDist) {
            if (player.turboTimer > 0) {
              // Rainbow turbo smashes obstacles into coins!
              sounds.playGem();
              addExplosionParticles(obs.x, obs.y, '#FBBF24', 16);
              addFloatingText(obs.x, obs.y, '¡BOOM! +20', '#FACC15');
              state.coinsEarnedThisRun += 20;
              state.dodgesCount += 1;
              state.score += 20;
              callbacksRef.current.onCoinsEarned(20);
              callbacksRef.current.onObstacleDodged(state.dodgesCount, state.score);
              state.obstacles.splice(i, 1);
              continue;
            } else if (player.invincibleTimer <= 0) {
              // Hit handling
              if (player.shield > 0) {
                // Shield absorbs hit
                sounds.playShieldHit();
                player.shield -= 1;
                player.invincibleTimer = 1.2;
                state.hitstopTimer = 0.04;
                state.shakeDuration = 0.25;
                state.shakeIntensity = 8;
                addExplosionParticles(obs.x, obs.y, '#38BDF8', 14);
                addFloatingText(player.x, player.y - 30, '¡ESCUDO SALVADOR!', '#38BDF8');
                state.obstacles.splice(i, 1);
                continue;
              } else {
                // Takes damage to lives
                sounds.playHurt();
                player.lives -= 1;
                player.invincibleTimer = 1.8;
                state.hitstopTimer = 0.06;
                state.shakeDuration = 0.35;
                state.shakeIntensity = 12;
                addExplosionParticles(player.x, player.y, '#EF4444', 18);

                if (player.lives <= 0) {
                  // Check if player has extra lives in consumable stock!
                  if (extraLivesStock > 0) {
                    callbacksRef.current.onUseExtraLife();
                    player.lives = 1;
                    player.invincibleTimer = 3.2;
                    sounds.playRainbowTurbo();
                    addExplosionParticles(player.x, player.y, '#F43F5E', 24);
                    addFloatingText(player.x, player.y - 35, '¡DRON DE RESCATE ACTIVADO! ❤️', '#F43F5E');
                    state.shakeDuration = 0.2;
                    state.obstacles.splice(i, 1);
                    continue;
                  } else {
                    // Game Over
                    sounds.playGameOver();
                    callbacksRef.current.onGameOver(state.score, state.coinsEarnedThisRun, state.dodgesCount);
                    return;
                  }
                }
              }
            }
          }

          // Check if obstacle has safely passed the player (DODGED!)
          if (!obs.hasBeenDodged && obs.y > player.y + 20) {
            obs.hasBeenDodged = true;
            state.dodgesCount += 1;
            const pointsEarned = 10;
            state.score += pointsEarned;
            sounds.playCoin();
            addFloatingText(obs.x, player.y - 12, `+${pointsEarned} ¡Esquivado!`, '#38BDF8');
            callbacksRef.current.onObstacleDodged(state.dodgesCount, state.score);
          }

          if (obs.y > displayH + 60) {
            state.obstacles.splice(i, 1);
          }
        }
      }

      // Update background stars (always animate, even on title screen!)
      for (const star of gameStateRef.current.stars) {
        star.y += star.speed * (isPlaying && gameStateRef.current.player.turboTimer > 0 ? 3.5 : 1);
        if (star.y > displayH) {
          star.y = -5;
          star.x = Math.random() * displayW;
        }
      }

      // Update particles
      const particles = gameStateRef.current.particles;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += 1;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha = Math.max(0, 1 - p.life / p.maxLife);
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
        }
      }

      // Update floating texts
      const fTexts = gameStateRef.current.floatingTexts;
      for (let i = fTexts.length - 1; i >= 0; i--) {
        const ft = fTexts[i];
        ft.y += ft.vy;
        ft.alpha -= 0.02;
        if (ft.alpha <= 0) {
          fTexts.splice(i, 1);
        }
      }

      // ----------------------------------------------------
      // DRAWING PASS
      // ----------------------------------------------------
      ctx.save();

      // Screen shake translation
      if (gameStateRef.current.shakeDuration > 0) {
        gameStateRef.current.shakeDuration -= dt;
        const dx = (Math.random() - 0.5) * gameStateRef.current.shakeIntensity;
        const dy = (Math.random() - 0.5) * gameStateRef.current.shakeIntensity;
        ctx.translate(dx, dy);
      }

      // Clear with space gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, displayH);
      bgGrad.addColorStop(0, '#060814');
      bgGrad.addColorStop(0.5, '#0B112C');
      bgGrad.addColorStop(1, '#170E38');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, displayW, displayH);

      // Distant colorful cosmic nebula glow
      const nebGrad = ctx.createRadialGradient(
        displayW * 0.7,
        displayH * 0.3,
        20,
        displayW * 0.7,
        displayH * 0.3,
        displayW * 0.6
      );
      nebGrad.addColorStop(0, 'rgba(168, 85, 247, 0.15)');
      nebGrad.addColorStop(0.6, 'rgba(56, 189, 248, 0.08)');
      nebGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = nebGrad;
      ctx.fillRect(0, 0, displayW, displayH);

      // Draw twinkling stars
      for (const star of gameStateRef.current.stars) {
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.alpha * (0.8 + 0.2 * Math.sin(star.y * 0.05));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      // Draw comet warning telegraphs (flashing friendly alert icon at the top)
      for (const obs of gameStateRef.current.obstacles) {
        if (obs.warningTelegraph && obs.y < 80) {
          ctx.save();
          const flash = Math.sin(Date.now() * 0.015) > 0;
          ctx.fillStyle = flash ? '#EF4444' : '#F59E0B';
          ctx.shadowColor = '#EF4444';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(obs.x, 30, 16, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 16px Fredoka, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('!', obs.x, 30);
          ctx.restore();
        }
      }

      // Draw Collectibles
      for (const item of gameStateRef.current.collectibles) {
        ctx.save();
        ctx.translate(item.x, item.y + Math.sin(item.wobble) * 3);

        if (item.type === 'coin') {
          // Golden star coin
          ctx.fillStyle = '#FBBF24';
          ctx.shadowColor = '#F59E0B';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(0, 0, item.radius, 0, Math.PI * 2);
          ctx.fill();

          // Inner rim
          ctx.strokeStyle = '#FEF08A';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, item.radius - 3, 0, Math.PI * 2);
          ctx.stroke();

          // Star symbol in center
          ctx.fillStyle = '#78350F';
          ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('★', 0, 1);
        } else if (item.type === 'gem') {
          // Diamond / Pink Cosmic Gem
          ctx.fillStyle = '#F472B6';
          ctx.shadowColor = '#EC4899';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.moveTo(0, -item.radius);
          ctx.lineTo(item.radius, 0);
          ctx.lineTo(0, item.radius);
          ctx.lineTo(-item.radius, 0);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#FDF2F8';
          ctx.beginPath();
          ctx.moveTo(0, -item.radius);
          ctx.lineTo(item.radius * 0.5, 0);
          ctx.lineTo(0, item.radius * 0.5);
          ctx.closePath();
          ctx.fill();
        } else if (item.type === 'heart') {
          // Red Heart
          ctx.fillStyle = '#EF4444';
          ctx.shadowColor = '#DC2626';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(-6, -4, 7, 0, Math.PI * 2);
          ctx.arc(6, -4, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(-13, -2);
          ctx.lineTo(0, 13);
          ctx.lineTo(13, -2);
          ctx.closePath();
          ctx.fill();
        } else if (item.type === 'shield') {
          // Blue Shield Bubble Pickup
          ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
          ctx.strokeStyle = '#22D3EE';
          ctx.lineWidth = 2.5;
          ctx.shadowColor = '#06B6D4';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(0, 0, item.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = '#FFFFFF';
          ctx.font = '14px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🛡️', 0, 1);
        } else if (item.type === 'magnet') {
          // Horseshoe Magnet
          ctx.fillStyle = '#A855F7';
          ctx.shadowColor = '#9333EA';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(0, 0, item.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FFFFFF';
          ctx.font = '13px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🧲', 0, 1);
        } else if (item.type === 'rainbow') {
          // Rainbow Star
          ctx.fillStyle = '#FACC15';
          ctx.shadowColor = '#EAB308';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(0, 0, item.radius + 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FFFFFF';
          ctx.font = '14px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🌈', 0, 1);
        }

        ctx.restore();
      }

      // Draw Obstacles (with friendly animated cartoon faces)
      for (const obs of gameStateRef.current.obstacles) {
        ctx.save();
        ctx.translate(obs.x, obs.y);
        ctx.rotate(obs.rotation);

        if (obs.type === 'asteroid') {
          // Cute rocky asteroid
          ctx.fillStyle = '#71717A';
          ctx.strokeStyle = '#52525B';
          ctx.lineWidth = 3;
          ctx.beginPath();
          const r = obs.radius;
          ctx.moveTo(r, 0);
          ctx.lineTo(r * 0.8, r * 0.7);
          ctx.lineTo(r * 0.2, r * 0.95);
          ctx.lineTo(-r * 0.6, r * 0.7);
          ctx.lineTo(-r * 0.9, 0);
          ctx.lineTo(-r * 0.6, -r * 0.7);
          ctx.lineTo(0.1, -r);
          ctx.lineTo(r * 0.7, -r * 0.6);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Friendly cartoon eyes
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(-7, -4, 4.5, 0, Math.PI * 2);
          ctx.arc(7, -4, 4.5, 0, Math.PI * 2);
          ctx.fill();
          // Pupils
          ctx.fillStyle = '#18181B';
          ctx.beginPath();
          ctx.arc(-6, -3, 2.5, 0, Math.PI * 2);
          ctx.arc(8, -3, 2.5, 0, Math.PI * 2);
          ctx.fill();
          // Smile
          ctx.strokeStyle = '#18181B';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 4, 5, 0.2, Math.PI - 0.2);
          ctx.stroke();
        } else if (obs.type === 'spiky_crystal') {
          // Glowing Spiky Crystal
          ctx.fillStyle = '#C084FC';
          ctx.shadowColor = '#A855F7';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          const spikes = 6;
          for (let s = 0; s < spikes * 2; s++) {
            const rad = s % 2 === 0 ? obs.radius : obs.radius * 0.55;
            const a = (s * Math.PI) / spikes;
            const px = Math.cos(a) * rad;
            const py = Math.sin(a) * rad;
            if (s === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();

          // Cute crystal eye
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(0, 0, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#4C1D95';
          ctx.beginPath();
          ctx.arc(0, 0, 2.8, 0, Math.PI * 2);
          ctx.fill();
        } else if (obs.type === 'space_jelly') {
          // Neon Pulsing Space Jellyfish
          const pulse = Math.sin(obs.pulsePhase || 0) * 3;
          ctx.fillStyle = 'rgba(56, 189, 248, 0.85)';
          ctx.shadowColor = '#38BDF8';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(0, -2, obs.radius + pulse, Math.PI, 0);
          ctx.lineTo(obs.radius * 0.7, obs.radius * 0.7);
          ctx.lineTo(obs.radius * 0.3, obs.radius * 0.3);
          ctx.lineTo(0, obs.radius * 0.8);
          ctx.lineTo(-obs.radius * 0.3, obs.radius * 0.3);
          ctx.lineTo(-obs.radius * 0.7, obs.radius * 0.7);
          ctx.closePath();
          ctx.fill();

          // Big cute shiny eyes
          ctx.fillStyle = '#082F49';
          ctx.beginPath();
          ctx.arc(-6, -4, 3, 0, Math.PI * 2);
          ctx.arc(6, -4, 3, 0, Math.PI * 2);
          ctx.fill();
        } else if (obs.type === 'alien_ufo') {
          // Cute Alien UFO
          // Glass dome
          ctx.fillStyle = 'rgba(167, 243, 208, 0.9)';
          ctx.beginPath();
          ctx.arc(0, -6, obs.radius * 0.6, Math.PI, 0);
          ctx.fill();
          // Little smiling alien inside dome
          ctx.fillStyle = '#22C55E';
          ctx.beginPath();
          ctx.arc(0, -9, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#052E16';
          ctx.fillRect(-2, -10, 1.5, 2);
          ctx.fillRect(1, -10, 1.5, 2);

          // UFO Saucer body
          ctx.fillStyle = '#10B981';
          ctx.strokeStyle = '#059669';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(0, 3, obs.radius * 1.1, obs.radius * 0.45, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Blinking lights
          const colors = ['#FBBF24', '#EF4444', '#38BDF8'];
          for (let li = -2; li <= 2; li++) {
            ctx.fillStyle = colors[Math.abs(li) % colors.length];
            ctx.beginPath();
            ctx.arc(li * 9, 3, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (obs.type === 'comet') {
          // Flaming glowing comet
          ctx.fillStyle = '#FB923C';
          ctx.shadowColor = '#F97316';
          ctx.shadowBlur = 14;
          // Tail
          ctx.beginPath();
          ctx.moveTo(0, -obs.radius * 2.2);
          ctx.lineTo(obs.radius * 0.8, 0);
          ctx.lineTo(-obs.radius * 0.8, 0);
          ctx.closePath();
          ctx.fill();

          // Core head
          ctx.fillStyle = '#FEF08A';
          ctx.beginPath();
          ctx.arc(0, 0, obs.radius, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      // Draw Player Spaceship (only during play or title)
      const player = gameStateRef.current.player;
      ctx.save();
      ctx.translate(player.x, player.y);

      // Flashing opacity when hit / invincible
      if (player.invincibleTimer > 0 && Math.sin(Date.now() * 0.02) < 0) {
        ctx.globalAlpha = 0.4;
      }

      // Draw Rainbow Turbo Glow Aura
      if (player.turboTimer > 0) {
        ctx.save();
        const auraGrad = ctx.createRadialGradient(0, 0, 15, 0, 0, 48);
        auraGrad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        auraGrad.addColorStop(0.5, `hsl(${(Date.now() * 0.3) % 360}, 100%, 60%)`);
        auraGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(0, 0, 48, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Draw Magnet Ring if active
      if (player.magnetTimer > 0) {
        ctx.save();
        ctx.strokeStyle = 'rgba(192, 132, 252, 0.6)';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.arc(0, 0, 42 + Math.sin(Date.now() * 0.008) * 4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Draw Spaceship Model based on active ship type
      const shipColor = player.turboTimer > 0 ? `hsl(${(Date.now() * 0.3) % 360}, 90%, 60%)` : activeShip.color;
      const accent = activeShip.accentColor;

      if (activeShip.modelType === 'classic' || activeShip.modelType === 'rainbow') {
        // Sleek Rocket
        // Fins
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.moveTo(-18, 16);
        ctx.lineTo(-24, 24);
        ctx.lineTo(-10, 20);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(18, 16);
        ctx.lineTo(24, 24);
        ctx.lineTo(10, 20);
        ctx.closePath();
        ctx.fill();

        // Main fuselage
        ctx.fillStyle = shipColor;
        ctx.beginPath();
        ctx.moveTo(0, -26);
        ctx.bezierCurveTo(18, -10, 18, 15, 14, 22);
        ctx.lineTo(-14, 22);
        ctx.bezierCurveTo(-18, 15, -18, -10, 0, -26);
        ctx.closePath();
        ctx.fill();

        // Cockpit window
        ctx.fillStyle = '#67E8F9';
        ctx.beginPath();
        ctx.arc(0, -4, 7.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(2.5, -6.5, 2.5, 0, Math.PI * 2);
        ctx.fill();
      } else if (activeShip.modelType === 'ufo') {
        // Friendly Saucer
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.ellipse(0, 0, 26, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = shipColor;
        ctx.beginPath();
        ctx.arc(0, -4, 14, Math.PI, 0);
        ctx.fill();
        // Window
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(0, -5, 5, 0, Math.PI * 2);
        ctx.fill();
      } else if (activeShip.modelType === 'cat') {
        // Cosmic Cat Ship with ears!
        // Ears
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.moveTo(-16, -10);
        ctx.lineTo(-22, -26);
        ctx.lineTo(-6, -18);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(16, -10);
        ctx.lineTo(22, -26);
        ctx.lineTo(6, -18);
        ctx.closePath();
        ctx.fill();

        // Body
        ctx.fillStyle = shipColor;
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.fill();

        // Eyes & nose
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(-7, -2, 4.5, 0, Math.PI * 2);
        ctx.arc(7, -2, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#18181B';
        ctx.beginPath();
        ctx.arc(-7, -2, 2.5, 0, Math.PI * 2);
        ctx.arc(7, -2, 2.5, 0, Math.PI * 2);
        ctx.fill();
        // Little pink nose
        ctx.fillStyle = '#F43F5E';
        ctx.beginPath();
        ctx.arc(0, 4, 2.5, 0, Math.PI * 2);
        ctx.fill();
      } else if (activeShip.modelType === 'falcon') {
        // Gold Falcon VIP
        ctx.fillStyle = shipColor;
        ctx.shadowColor = '#FACC15';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(0, -28);
        ctx.lineTo(26, 18);
        ctx.lineTo(10, 14);
        ctx.lineTo(0, 22);
        ctx.lineTo(-10, 14);
        ctx.lineTo(-26, 18);
        ctx.closePath();
        ctx.fill();
        // Cockpit
        ctx.fillStyle = '#38BDF8';
        ctx.beginPath();
        ctx.ellipse(0, -6, 5, 10, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (activeShip.modelType === 'dragon') {
        // Cosmic Magic Dragon with wings and horns!
        ctx.fillStyle = accent;
        // Dragon wings
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-28, -8);
        ctx.lineTo(-24, 16);
        ctx.lineTo(-8, 8);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(28, -8);
        ctx.lineTo(24, 16);
        ctx.lineTo(8, 8);
        ctx.closePath();
        ctx.fill();

        // Dragon body
        ctx.fillStyle = shipColor;
        ctx.shadowColor = accent;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.ellipse(0, 2, 14, 22, 0, 0, Math.PI * 2);
        ctx.fill();

        // Cute glowing eyes
        ctx.fillStyle = '#FEF08A';
        ctx.beginPath();
        ctx.arc(-5, -6, 3, 0, Math.PI * 2);
        ctx.arc(5, -6, 3, 0, Math.PI * 2);
        ctx.fill();
        // Snout
        ctx.fillStyle = '#F472B6';
        ctx.beginPath();
        ctx.arc(0, -14, 4, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Robo Astro
        ctx.fillStyle = shipColor;
        ctx.fillRect(-16, -18, 32, 36);
        ctx.fillStyle = accent;
        ctx.fillRect(-10, -24, 20, 6);
        // Robo eyes visor
        ctx.fillStyle = '#22D3EE';
        ctx.fillRect(-11, -10, 22, 7);
      }

      // Draw Equipped Accessory on ship head
      if (activeAccessory.type === 'crown') {
        ctx.fillStyle = '#FACC15';
        ctx.beginPath();
        ctx.moveTo(-12, -24);
        ctx.lineTo(-12, -34);
        ctx.lineTo(-6, -28);
        ctx.lineTo(0, -36);
        ctx.lineTo(6, -28);
        ctx.lineTo(12, -34);
        ctx.lineTo(12, -24);
        ctx.closePath();
        ctx.fill();
      } else if (activeAccessory.type === 'pirate') {
        ctx.fillStyle = '#0F172A';
        ctx.beginPath();
        ctx.arc(0, -25, 15, Math.PI, 0);
        ctx.lineTo(18, -25);
        ctx.lineTo(-18, -25);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#EF4444';
        ctx.fillRect(-14, -25, 28, 3);
      } else if (activeAccessory.type === 'sunglasses') {
        ctx.fillStyle = '#0F172A';
        ctx.fillRect(-14, -8, 28, 6);
      } else if (activeAccessory.type === 'alien') {
        ctx.strokeStyle = '#22C55E';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(0, -24);
        ctx.lineTo(0, -36);
        ctx.stroke();
        ctx.fillStyle = '#4ADE80';
        ctx.beginPath();
        ctx.arc(0, -38, 4.5, 0, Math.PI * 2);
        ctx.fill();
      } else if (activeAccessory.type === 'bow') {
        ctx.fillStyle = '#F43F5E';
        ctx.beginPath();
        ctx.moveTo(0, -26);
        ctx.lineTo(-10, -32);
        ctx.lineTo(-10, -20);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(0, -26);
        ctx.lineTo(10, -32);
        ctx.lineTo(10, -20);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, -26, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Shield Bubble around player if shield > 0
      if (player.shield > 0) {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.9)';
        ctx.fillStyle = 'rgba(56, 189, 248, 0.18)';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#38BDF8';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(0, 0, 36 + Math.sin(Date.now() * 0.006) * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      ctx.restore();

      // Draw Particles
      for (const p of gameStateRef.current.particles) {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Draw Floating Texts
      for (const ft of gameStateRef.current.floatingTexts) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, ft.alpha);
        ctx.fillStyle = ft.color;
        ctx.shadowColor = ft.color;
        ctx.shadowBlur = 8;
        ctx.font = 'bold 16px Fredoka, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [
    isPlaying,
    isPaused,
    activeShip,
    activeAccessory,
    controlType,
    difficulty,
    externalMoveDir,
    extraLivesStock,
  ]);

  // Touch and Pointer Event Listeners for Kids "Dedo Mágico" (Direct Drag & Follow)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const touchX = e.clientX - rect.left;
    // Ergonomic offset: place spaceship ~45px above finger so child's finger doesn't obscure the ship!
    const touchY = e.clientY - rect.top - (controlType === 'touch_drag' ? 45 : 0);

    gameStateRef.current.touchPointer = {
      active: true,
      x: touchX,
      y: touchY,
      id: e.pointerId,
    };

    // If starting or on title, immediately align ship target
    if (controlType === 'touch_drag') {
      gameStateRef.current.player.targetX = touchX;
      gameStateRef.current.player.targetY = touchY;
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!gameStateRef.current.touchPointer.active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const touchX = e.clientX - rect.left;
    const touchY = e.clientY - rect.top - (controlType === 'touch_drag' ? 45 : 0);

    gameStateRef.current.touchPointer.x = touchX;
    gameStateRef.current.touchPointer.y = touchY;
  };

  const handlePointerUp = () => {
    gameStateRef.current.touchPointer.active = false;
  };

  // Keyboard navigation support for desktop testers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        gameStateRef.current.keysHeld.left = true;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        gameStateRef.current.keysHeld.right = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        gameStateRef.current.keysHeld.left = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        gameStateRef.current.keysHeld.right = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden touch-game-surface">
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="w-full h-full block cursor-pointer select-none"
      />
    </div>
  );
};
