const CARD_LIBRARY = {
  knight: {
    label: "Chevalier",
    rarity: "commune",
    icon: "⚔️",
    portrait: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=480&q=80",
    description: "Soldat équilibré qui encaisse et inflige des dégâts stables.",
    cost: 3,
    baseStats: {
      speed: 0.12,
      damage: 6,
      range: 32,
      attackSpeed: 850,
      health: 85,
    },
  },
  archer: {
    label: "Archer",
    rarity: "commune",
    icon: "🏹",
    portrait: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=480&q=80",
    description: "Tireuse à distance rapide, idéale pour contrôler la ligne.",
    cost: 2,
    projectile: true,
    baseStats: {
      speed: 0.14,
      damage: 5,
      range: 150,
      attackSpeed: 820,
      health: 44,
    },
  },
  sentinel: {
    label: "Sentinelle",
    rarity: "rare",
    icon: "🛡️",
    portrait: "https://images.unsplash.com/photo-1587160645382-0a99855a1c0d?auto=format&fit=crop&w=480&q=80",
    description: "Bouclier vivant qui réduit les dégâts reçus.",
    cost: 4,
    damageReduction: 0.35,
    baseStats: {
      speed: 0.1,
      damage: 5,
      range: 28,
      attackSpeed: 900,
      health: 120,
    },
  },
  golem: {
    label: "Golem de pierre",
    rarity: "epique",
    icon: "🪨",
    portrait: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=480&q=80",
    description: "Colosse lent, dégâts renforcés contre les tours.",
    cost: 5,
    towerDamageMultiplier: 1.25,
    baseStats: {
      speed: 0.08,
      damage: 10,
      range: 34,
      attackSpeed: 1200,
      health: 160,
    },
  },
  pyromancer: {
    label: "Pyromancienne",
    rarity: "epique",
    icon: "🔥",
    portrait: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=480&q=80",
    description: "Projette des boules de feu infligeant des dégâts de zone.",
    cost: 4,
    projectile: true,
    splashRadius: 70,
    baseStats: {
      speed: 0.13,
      damage: 7,
      range: 150,
      attackSpeed: 940,
      health: 55,
    },
  },
  assassin: {
    label: "Voleur d'ombre",
    rarity: "legendaire",
    icon: "🗡️",
    portrait: "https://images.unsplash.com/photo-1545167622-3a6ac756afa4?auto=format&fit=crop&w=480&q=80",
    description: "Ultra rapide avec une première frappe critique.",
    cost: 3,
    firstStrikeBonus: 2.2,
    baseStats: {
      speed: 0.2,
      damage: 8,
      range: 28,
      attackSpeed: 700,
      health: 52,
    },
  },
  stormcaller: {
    label: "Invocatrice d'orage",
    rarity: "rare",
    icon: "⚡",
    portrait: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=480&q=80",
    description: "Frappe plusieurs ennemis avec des éclairs en chaîne.",
    cost: 4,
    projectile: true,
    splashRadius: 90,
    baseStats: {
      speed: 0.12,
      damage: 6,
      range: 150,
      attackSpeed: 880,
      health: 60,
    },
  },
  royalGuard: {
    label: "Garde royal",
    rarity: "commune",
    icon: "🪖",
    portrait: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=480&q=80",
    description: "Protecteur tenace qui obtient un bouclier lors de sa charge.",
    cost: 3,
    damageReduction: 0.25,
    baseStats: {
      speed: 0.11,
      damage: 6,
      range: 28,
      attackSpeed: 820,
      health: 95,
    },
  },
  crystalDragon: {
    label: "Dragon de cristal",
    rarity: "legendaire",
    icon: "🐉",
    portrait: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=480&q=80",
    description: "Dragon aérien qui ralentit les cibles touchées.",
    cost: 6,
    projectile: true,
    splashRadius: 110,
    baseStats: {
      speed: 0.1,
      damage: 12,
      range: 180,
      attackSpeed: 1100,
      health: 190,
    },
  },
  frostMonk: {
    label: "Moine de givre",
    rarity: "rare",
    icon: "❄️",
    portrait: "https://images.unsplash.com/photo-1617957772061-9ff51a158d64?auto=format&fit=crop&w=480&q=80",
    description: "Ralenti les ennemis à chaque coup de bâton.",
    cost: 3,
    baseStats: {
      speed: 0.13,
      damage: 5,
      range: 30,
      attackSpeed: 780,
      health: 75,
    },
  },
  battleRam: {
    label: "Bélier de bataille",
    rarity: "epique",
    icon: "🐏",
    portrait: "https://images.unsplash.com/photo-1578925513605-7be2d6f26903?auto=format&fit=crop&w=480&q=80",
    description: "Charge vers la tour en infligeant d'énormes dégâts d'impact.",
    cost: 4,
    towerDamageMultiplier: 1.6,
    baseStats: {
      speed: 0.15,
      damage: 9,
      range: 24,
      attackSpeed: 1000,
      health: 110,
    },
  },
};

const MAX_CARD_LEVEL = 5;
const UPGRADE_SHARD_REQUIREMENTS = [0, 2, 4, 10, 20];

const RARITY_ORDER = ["commune", "rare", "epique", "legendaire"];
const MAX_DECK_SIZE = 4;
const MIN_DECK_SIZE = 3;
const CHEST_COST = 120;

const lane = document.getElementById("lane");
const playerScore = document.getElementById("playerScore");
const aiScore = document.getElementById("aiScore");
const playerElixir = document.getElementById("playerElixir");
const timerEl = document.getElementById("timer");
const deckContainer = document.getElementById("deckList");
const startGameBtn = document.getElementById("startGame");
const modal = document.getElementById("resultModal");
const modalMessage = document.getElementById("resultMessage");
const modalTitle = document.getElementById("resultTitle");
const rewardMessage = document.getElementById("rewardMessage");
const playAgainBtn = document.getElementById("playAgain");
const closeModalBtn = document.getElementById("closeModal");
const collectionList = document.getElementById("collectionList");
const goldAmount = document.getElementById("goldAmount");
const trophyAmount = document.getElementById("trophyAmount");
const buyChestBtn = document.getElementById("buyChest");
const shopFeedback = document.getElementById("shopFeedback");
const deckHint = document.getElementById("deckHint");

const state = {
  running: false,
  playerTower: 100,
  aiTower: 100,
  playerElixir: 5,
  aiElixir: 5,
  units: [],
  lastUnitId: 0,
  loopHandle: null,
  timer: 180,
  lastFrame: performance.now(),
  aiDecisionTimer: 0,
  timerAccumulator: 0,
  aiLevel: 1,
};

const progress = {
  gold: 150,
  trophies: 0,
  unlocked: new Set(["knight", "archer", "sentinel", "golem"]),
  deck: ["knight", "archer", "sentinel", "golem"],
  cardLevels: {
    knight: 1,
    archer: 1,
    sentinel: 1,
    golem: 1,
  },
  cardShards: {
    knight: 0,
    archer: 0,
    sentinel: 0,
    golem: 0,
  },
};

function getCardData(key) {
  return CARD_LIBRARY[key];
}

function computeStats(card, level) {
  const powerMultiplier = 1 + (level - 1) * 0.18;
  const vitalityMultiplier = 1 + (level - 1) * 0.22;
  return {
    speed: card.baseStats.speed,
    damage: Math.round(card.baseStats.damage * powerMultiplier),
    range: card.baseStats.range,
    attackSpeed: card.baseStats.attackSpeed,
    health: Math.round(card.baseStats.health * vitalityMultiplier),
    maxHealth: Math.round(card.baseStats.health * vitalityMultiplier),
    projectile: Boolean(card.projectile),
    splashRadius: card.splashRadius ?? 0,
    towerDamageMultiplier: card.towerDamageMultiplier ?? 1,
    damageReduction: card.damageReduction ?? 0,
    firstStrikeBonus: card.firstStrikeBonus ?? 0,
  };
}

function getCardLevel(key) {
  return progress.cardLevels[key] ?? 1;
}

function getCardStats(key, side) {
  const data = getCardData(key);
  if (!data) return null;
  const level = side === "ai" ? state.aiLevel : getCardLevel(key);
  return computeStats(data, level);
}

function ensureCardTracking(key) {
  if (!(key in progress.cardLevels)) {
    progress.cardLevels[key] = 1;
  }
  if (!(key in progress.cardShards)) {
    progress.cardShards[key] = 0;
  }
}

function getCardShards(key) {
  ensureCardTracking(key);
  return progress.cardShards[key];
}

function getShardRequirement(level) {
  if (level >= MAX_CARD_LEVEL) return null;
  return UPGRADE_SHARD_REQUIREMENTS[level] ?? Infinity;
}

function canUpgradeCard(key) {
  const level = getCardLevel(key);
  const requirement = getShardRequirement(level);
  if (!requirement) return false;
  return getCardShards(key) >= requirement;
}

function rarityOrder(value) {
  const index = RARITY_ORDER.indexOf(value);
  return index === -1 ? RARITY_ORDER.length : index;
}

function updateHUD() {
  playerScore.textContent = `Tour : ${Math.max(0, Math.round(state.playerTower))}`;
  aiScore.textContent = `Tour : ${Math.max(0, Math.round(state.aiTower))}`;
  playerElixir.textContent = `Élixir : ${Math.floor(state.playerElixir)}`;
  timerEl.textContent = `Temps : ${state.timer}s`;
}

function renderProgress() {
  goldAmount.textContent = progress.gold;
  trophyAmount.textContent = progress.trophies;
}

function renderDeck() {
  deckContainer.innerHTML = "";
  if (!progress.deck.length) {
    const empty = document.createElement("p");
    empty.textContent = "Ajoutez des cartes à votre deck depuis la collection.";
    empty.className = "hint";
    deckContainer.appendChild(empty);
  } else {
    progress.deck.forEach((key) => {
      if (!progress.unlocked.has(key)) return;
      const card = getCardData(key);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "card";
      button.dataset.type = key;
      const portrait = document.createElement("div");
      portrait.className = "card-portrait";
      if (card.portrait) {
        portrait.style.backgroundImage = `url("${card.portrait}")`;
      }

      const emblem = document.createElement("span");
      emblem.className = "card-emblem";
      emblem.textContent = card.icon ?? card.label.charAt(0);
      portrait.appendChild(emblem);

      const rarity = document.createElement("span");
      rarity.className = `rarity-badge rarity-${card.rarity} portrait-rarity`;
      rarity.textContent = card.rarity;
      portrait.appendChild(rarity);

      const title = document.createElement("span");
      title.className = "card-title";
      title.textContent = card.label;

      const level = document.createElement("span");
      level.className = "card-level";
      level.textContent = `Niv. ${getCardLevel(key)}`;

      const cost = document.createElement("span");
      cost.className = "cost";
      cost.textContent = `Coût : ${card.cost}`;

      button.append(portrait, title, level, cost);
      deckContainer.appendChild(button);
    });
  }
  updateDeckHint();
}

function renderCollection() {
  collectionList.innerHTML = "";
  const entries = Object.entries(CARD_LIBRARY).sort((a, b) => {
    const [keyA, cardA] = a;
    const [keyB, cardB] = b;
    const rarityDiff = rarityOrder(cardA.rarity) - rarityOrder(cardB.rarity);
    if (rarityDiff !== 0) return rarityDiff;
    return cardA.label.localeCompare(cardB.label, "fr");
  });

  entries.forEach(([key, card]) => {
    const unlocked = progress.unlocked.has(key);
    ensureCardTracking(key);
    const li = document.createElement("li");
    li.className = `collection-card${unlocked ? "" : " locked"}`;

    const visual = document.createElement("div");
    visual.className = "card-visual";
    const portrait = document.createElement("div");
    portrait.className = "card-portrait card-portrait--large";
    if (card.portrait) {
      portrait.style.backgroundImage = `url("${card.portrait}")`;
    }
    if (!unlocked) {
      portrait.classList.add("is-locked");
    }

    const emblem = document.createElement("span");
    emblem.className = "card-emblem";
    emblem.textContent = card.icon ?? card.label.charAt(0);
    portrait.appendChild(emblem);

    const rarityOverlay = document.createElement("span");
    rarityOverlay.className = `rarity-badge rarity-${card.rarity} portrait-rarity`;
    rarityOverlay.textContent = card.rarity;
    portrait.appendChild(rarityOverlay);

    visual.appendChild(portrait);
    li.appendChild(visual);

    const header = document.createElement("header");
    const title = document.createElement("h3");
    title.className = "card-title";
    title.textContent = card.label;
    header.appendChild(title);

    const rarity = document.createElement("span");
    rarity.className = `rarity-badge rarity-${card.rarity}`;
    rarity.textContent = card.rarity;
    header.appendChild(rarity);
    li.appendChild(header);

    const description = document.createElement("p");
    description.textContent = card.description;
    li.appendChild(description);

    const stats = computeStats(card, unlocked ? getCardLevel(key) : 1);
    const statsBlock = document.createElement("div");
    statsBlock.className = "stats";
    statsBlock.innerHTML = `
      <span>PV : ${stats.health}</span>
      <span>Dégâts : ${stats.damage}</span>
      <span>Portée : ${stats.range}</span>
      <span>Vitesse : ${(stats.speed * 100).toFixed(0)}%</span>
    `;
    li.appendChild(statsBlock);

    if (unlocked) {
      const levelValue = getCardLevel(key);
      const level = document.createElement("p");
      level.className = "card-level";
      level.textContent = `Niveau ${levelValue}`;
      li.appendChild(level);

      const requirement = getShardRequirement(levelValue);
      const shards = getCardShards(key);
      const progressInfo = document.createElement("p");
      progressInfo.className = "card-progress";
      if (!requirement) {
        progressInfo.textContent = "Niveau maximum atteint";
      } else {
        progressInfo.textContent = `${shards}/${requirement} cartes requises pour le niveau ${levelValue + 1}`;
      }
      li.appendChild(progressInfo);

      const actions = document.createElement("div");
      actions.className = "card-actions";

      const upgradeButton = document.createElement("button");
      upgradeButton.type = "button";
      upgradeButton.dataset.upgrade = key;
      upgradeButton.textContent = requirement ? "Améliorer" : "Niveau max";
      if (!requirement || !canUpgradeCard(key)) {
        upgradeButton.disabled = true;
      }
      actions.appendChild(upgradeButton);

      const deckButton = document.createElement("button");
      deckButton.type = "button";
      deckButton.dataset.card = key;
      if (progress.deck.includes(key)) {
        deckButton.textContent = "Retirer du deck";
      } else if (progress.deck.length >= MAX_DECK_SIZE) {
        deckButton.textContent = "Deck complet";
        deckButton.disabled = true;
      } else {
        deckButton.textContent = "Ajouter au deck";
      }
      actions.appendChild(deckButton);

      li.appendChild(actions);
    } else {
      const locked = document.createElement("p");
      locked.className = "card-level";
      locked.textContent = "Carte verrouillée – ouvrez un coffre pour la débloquer.";
      li.appendChild(locked);

      const hint = document.createElement("p");
      hint.className = "card-progress";
      hint.textContent = "Les coffres contiennent des cartes permettant de l'améliorer.";
      li.appendChild(hint);
    }

    collectionList.appendChild(li);
  });
}

function updateDeckHint() {
  const count = progress.deck.length;
  deckHint.textContent = `Deck actuel : ${count} carte${count > 1 ? "s" : ""} actives / ${MAX_DECK_SIZE}. Minimum ${MIN_DECK_SIZE} pour jouer.`;
}

function resetGame() {
  state.running = false;
  state.playerTower = 100;
  state.aiTower = 100;
  state.playerElixir = 5;
  state.aiElixir = 5;
  state.units = [];
  state.lastUnitId = 0;
  state.timer = 180;
  state.lastFrame = performance.now();
  state.aiDecisionTimer = 0;
  state.timerAccumulator = 0;
  state.aiLevel = 1;
  if (state.loopHandle) cancelAnimationFrame(state.loopHandle);
  lane.innerHTML = "";
  updateHUD();
}

function spawnUnit(typeKey, side) {
  const card = getCardData(typeKey);
  if (!card) return;

  if (side === "player" && !progress.deck.includes(typeKey)) {
    feedback("Sélectionnez cette carte dans votre deck.");
    return;
  }

  if (side === "player" && state.playerElixir < card.cost) {
    feedback(`Pas assez d'élixir pour ${card.label}`);
    return;
  }

  if (side === "ai" && state.aiElixir < card.cost) {
    return;
  }

  const stats = getCardStats(typeKey, side);
  if (!stats) return;

  const newUnit = {
    id: ++state.lastUnitId,
    type: typeKey,
    side,
    x: side === "player" ? 32 : lane.clientWidth - 72,
    y: 24,
    health: stats.health,
    maxHealth: stats.maxHealth,
    cooldown: 0,
    stats,
    hasStruck: false,
  };

  const el = document.createElement("div");
  el.className = `unit ${side}`;
  el.dataset.id = newUnit.id;
  el.textContent = getCardData(typeKey).icon ?? card.label.charAt(0);
  el.setAttribute("role", "img");
  el.setAttribute("aria-label", `${card.label} ${side === "player" ? "allié" : "ennemi"}`);
  lane.appendChild(el);
  newUnit.element = el;
  state.units.push(newUnit);

  if (side === "player") {
    state.playerElixir -= card.cost;
  } else {
    state.aiElixir -= card.cost;
  }
  updateHUD();
}

function feedback(message) {
  startGameBtn.setAttribute("aria-live", "assertive");
  const previousText = startGameBtn.textContent;
  startGameBtn.textContent = message;
  startGameBtn.disabled = true;
  setTimeout(() => {
    startGameBtn.textContent = state.running ? "Partie en cours" : previousText;
    startGameBtn.removeAttribute("aria-live");
    startGameBtn.disabled = state.running;
  }, 1500);
}

function damageUnit(target, amount) {
  const reduction = target.stats.damageReduction ?? 0;
  const finalDamage = Math.max(1, Math.round(amount * (1 - reduction)));
  target.health -= finalDamage;
  if (target.health <= 0) {
    removeUnit(target);
    return true;
  }
  return false;
}

function attackUnit(attacker, defender) {
  const stats = attacker.stats;
  let damage = stats.damage;
  if (stats.firstStrikeBonus && !attacker.hasStruck) {
    damage = Math.round(damage * stats.firstStrikeBonus);
    attacker.hasStruck = true;
  }

  spawnProjectile(attacker, defender);
  const defeated = damageUnit(defender, damage);

  if (!defeated && stats.splashRadius > 0) {
    const splashTargets = state.units.filter(
      (unit) => unit.side !== attacker.side && unit.id !== defender.id && Math.abs(unit.x - defender.x) <= stats.splashRadius
    );
    splashTargets.forEach((unit) => {
      damageUnit(unit, Math.round(damage * 0.6));
    });
  }
}

function spawnProjectile(attacker, defender) {
  if (!attacker.stats.projectile) return;

  const projectile = document.createElement("div");
  projectile.className = `projectile ${attacker.side}`;
  projectile.style.transform = `translate(${attacker.x}px, -16px)`;
  lane.appendChild(projectile);

  requestAnimationFrame(() => {
    projectile.style.transform = `translate(${defender.x}px, -16px)`;
  });

  setTimeout(() => {
    projectile.remove();
  }, 260);
}

function removeUnit(unit) {
  unit.element?.remove();
  state.units = state.units.filter((u) => u.id !== unit.id);
}

function dealTowerDamage(side, amount) {
  if (side === "player") {
    state.playerTower -= amount;
    if (state.playerTower <= 0) endGame("ai");
  } else {
    state.aiTower -= amount;
    if (state.aiTower <= 0) endGame("player");
  }
  updateHUD();
}

function updateUnits(delta) {
  const laneWidth = lane.clientWidth;
  state.units.slice().forEach((unit) => {
    const enemies = state.units.filter((u) => u.side !== unit.side);
    const direction = unit.side === "player" ? 1 : -1;
    let speed = unit.stats.speed * delta;

    let target = null;
    let minDistance = Number.POSITIVE_INFINITY;
    enemies.forEach((enemy) => {
      const distance = Math.abs(enemy.x - unit.x);
      if (distance < minDistance) {
        minDistance = distance;
        target = enemy;
      }
    });

    if (target && minDistance <= unit.stats.range) {
      speed = 0;
      if (unit.cooldown <= 0) {
        attackUnit(unit, target);
        unit.cooldown = unit.stats.attackSpeed;
      }
    }

    unit.cooldown -= delta;
    unit.x += speed * direction;

    if (unit.side === "player" && unit.x >= laneWidth - 72) {
      dealTowerDamage("ai", Math.round(unit.stats.damage * unit.stats.towerDamageMultiplier));
      removeUnit(unit);
      return;
    }

    if (unit.side === "ai" && unit.x <= 24) {
      dealTowerDamage("player", Math.round(unit.stats.damage * unit.stats.towerDamageMultiplier));
      removeUnit(unit);
      return;
    }

    unit.element.style.transform = `translate(${unit.x}px, 0)`;
  });
}

function regenerateElixir(delta) {
  const regenRate = delta / 1000;
  state.playerElixir = Math.min(10, state.playerElixir + regenRate * 1.25);
  const aggressionBoost = state.aiTower < state.playerTower ? 1.3 : 1;
  state.aiElixir = Math.min(10, state.aiElixir + regenRate * (1.15 + (state.aiLevel - 1) * 0.25) * aggressionBoost);
}

function getAIDeck() {
  const deck = ["knight", "archer", "sentinel"];
  if (state.timer <= 170) deck.push("golem");
  if (state.timer <= 155) deck.push("royalGuard");
  if (state.timer <= 140) deck.push("frostMonk");
  if (state.timer <= 135 || state.aiTower < state.playerTower) deck.push("pyromancer");
  if (state.timer <= 120) deck.push("battleRam");
  if (state.timer <= 105) deck.push("stormcaller");
  if (state.timer <= 90 || state.aiTower < state.playerTower - 20) deck.push("assassin");
  if (state.timer <= 60 || state.aiTower < state.playerTower - 30) deck.push("crystalDragon");
  return deck;
}

function weightedRandom(cards) {
  const weights = { commune: 1.4, rare: 1.1, epique: 0.9, legendaire: 0.75 };
  const pool = cards.map((key) => {
    const rarity = getCardData(key).rarity;
    return { key, weight: weights[rarity] ?? 1 };
  });
  const total = pool.reduce((sum, item) => sum + item.weight, 0);
  let threshold = Math.random() * total;
  for (const item of pool) {
    threshold -= item.weight;
    if (threshold <= 0) return item.key;
  }
  return pool[pool.length - 1].key;
}

function aiBehavior(delta) {
  state.aiDecisionTimer += delta;
  const decisionThreshold = Math.max(700, 2200 - state.aiLevel * 320 - (state.aiTower < state.playerTower ? 380 : 0));
  if (state.aiDecisionTimer < decisionThreshold) return;
  state.aiDecisionTimer = 0;

  const aiDeck = getAIDeck();
  const affordable = aiDeck.filter((key) => getCardData(key).cost <= state.aiElixir);
  if (!affordable.length) return;

  const typeKey = weightedRandom(affordable);
  spawnUnit(typeKey, "ai");
}

function updateTimer(delta) {
  state.timerAccumulator += delta;
  while (state.timerAccumulator >= 1000) {
    state.timerAccumulator -= 1000;
    state.timer -= 1;
    if (state.timer <= 120) state.aiLevel = Math.max(state.aiLevel, 2);
    if (state.timer <= 60) state.aiLevel = Math.max(state.aiLevel, 3);
  }

  if (state.timer <= 0) {
    state.timer = 0;
    endGame(state.playerTower >= state.aiTower ? "player" : "ai");
  }
}

function gameLoop(timestamp) {
  if (!state.running) return;
  const delta = timestamp - state.lastFrame;
  state.lastFrame = timestamp;

  regenerateElixir(delta);
  updateUnits(delta);
  aiBehavior(delta);
  updateTimer(delta);
  updateHUD();

  state.loopHandle = requestAnimationFrame(gameLoop);
}

function startGame() {
  if (progress.deck.length < MIN_DECK_SIZE) {
    feedback(`Deck incomplet (${progress.deck.length}/${MIN_DECK_SIZE})`);
    return;
  }
  resetGame();
  state.running = true;
  state.lastFrame = performance.now();
  startGameBtn.textContent = "Partie en cours";
  startGameBtn.disabled = true;
  updateHUD();
  state.loopHandle = requestAnimationFrame(gameLoop);
}

function applyRewards(winner) {
  const victory = winner === "player";
  const goldGain = victory ? 60 : 25;
  const trophyGain = victory ? 35 : -18;
  progress.gold += goldGain;
  progress.trophies = Math.max(0, progress.trophies + trophyGain);
  renderProgress();
  return {
    gold: goldGain,
    trophies: trophyGain,
    text: `Récompenses : +${goldGain} or, ${trophyGain >= 0 ? "+" : ""}${trophyGain} trophées`,
  };
}

function endGame(winner) {
  if (!state.running) return;
  state.running = false;
  cancelAnimationFrame(state.loopHandle);
  const rewards = applyRewards(winner);
  modal.hidden = false;
  modal.classList.add("is-open");
  modalMessage.textContent = winner === "player" ? "Vous remportez la couronne !" : "La tour a cédé. Retentez votre chance.";
  modalTitle.textContent = winner === "player" ? "Victoire !" : "Défaite";
  rewardMessage.textContent = rewards.text;
  rewardMessage.classList.toggle("reward", winner === "player");
  playAgainBtn.focus();
  startGameBtn.textContent = "Rejouer une partie";
  startGameBtn.disabled = false;
}

function toggleModal(open) {
  modal.hidden = !open;
  modal.classList.toggle("is-open", open);
  if (!open) {
    startGameBtn.focus();
  }
}

function announceShop(message, state = "info") {
  shopFeedback.textContent = message;
  shopFeedback.dataset.state = state;
}

function openChest() {
  if (progress.gold < CHEST_COST) {
    announceShop(`Il manque ${CHEST_COST - progress.gold} or pour ce coffre.`, "warning");
    return;
  }

  progress.gold -= CHEST_COST;
  const allCards = Object.keys(CARD_LIBRARY);
  const locked = allCards.filter((key) => !progress.unlocked.has(key));
  const unlocked = Array.from(progress.unlocked);
  let message;

  if (locked.length && Math.random() < 0.55) {
    const cardKey = locked[Math.floor(Math.random() * locked.length)];
    progress.unlocked.add(cardKey);
    ensureCardTracking(cardKey);
    progress.cardLevels[cardKey] = 1;
    progress.cardShards[cardKey] = (progress.cardShards[cardKey] ?? 0) + 1;
    if (!progress.deck.includes(cardKey) && progress.deck.length < MAX_DECK_SIZE) {
      progress.deck.push(cardKey);
    }
    message = `${CARD_LIBRARY[cardKey].label} rejoint votre armée ! (+1 carte bonus)`;
  } else {
    const rewardPool = unlocked.length ? unlocked : allCards;
    const cardKey = weightedRandom(rewardPool);
    ensureCardTracking(cardKey);
    const base = CARD_LIBRARY[cardKey].rarity === "legendaire" ? 1 : 2;
    const bonus = Math.random() < 0.35 ? 1 : 0;
    const earned = base + bonus;
    progress.cardShards[cardKey] += earned;

    const requirement = getShardRequirement(getCardLevel(cardKey));
    const ready = requirement && progress.cardShards[cardKey] >= requirement;
    const label = CARD_LIBRARY[cardKey].label;
    message = `+${earned} carte${earned > 1 ? "s" : ""} ${label}`;
    if (ready) {
      message += " – amélioration disponible !";
    }
  }

  renderProgress();
  renderDeck();
  renderCollection();
  announceShop(message, "success");
}

function toggleDeck(cardKey) {
  if (!progress.unlocked.has(cardKey)) return;
  if (progress.deck.includes(cardKey)) {
    if (progress.deck.length <= MIN_DECK_SIZE) {
      announceShop(`Gardez au moins ${MIN_DECK_SIZE} cartes actives.`, "warning");
      return;
    }
    progress.deck = progress.deck.filter((key) => key !== cardKey);
  } else {
    if (progress.deck.length >= MAX_DECK_SIZE) {
      announceShop("Deck complet. Retirez une carte avant d'en ajouter une nouvelle.", "warning");
      return;
    }
    progress.deck.push(cardKey);
  }
  renderDeck();
  renderCollection();
}

function upgradeCard(cardKey) {
  if (!progress.unlocked.has(cardKey)) return;
  ensureCardTracking(cardKey);
  const currentLevel = getCardLevel(cardKey);
  const requirement = getShardRequirement(currentLevel);
  if (!requirement) {
    announceShop(`${CARD_LIBRARY[cardKey].label} est déjà au niveau maximum.`, "warning");
    return;
  }

  const shards = getCardShards(cardKey);
  if (shards < requirement) {
    announceShop(`Il manque ${requirement - shards} carte${requirement - shards > 1 ? "s" : ""} pour améliorer ${CARD_LIBRARY[cardKey].label}.`, "warning");
    return;
  }

  progress.cardShards[cardKey] = shards - requirement;
  progress.cardLevels[cardKey] = Math.min(MAX_CARD_LEVEL, currentLevel + 1);
  renderDeck();
  renderCollection();
  announceShop(`${CARD_LIBRARY[cardKey].label} atteint le niveau ${getCardLevel(cardKey)} !`, "success");
}

deckContainer.addEventListener("click", (event) => {
  const cardBtn = event.target.closest(".card");
  if (!cardBtn) return;
  if (!state.running) {
    feedback("Lancez la partie avant de jouer");
    return;
  }
  spawnUnit(cardBtn.dataset.type, "player");
});

collectionList.addEventListener("click", (event) => {
  const upgradeBtn = event.target.closest("button[data-upgrade]");
  if (upgradeBtn) {
    upgradeCard(upgradeBtn.dataset.upgrade);
    return;
  }

  const deckButton = event.target.closest("button[data-card]");
  if (!deckButton) return;
  toggleDeck(deckButton.dataset.card);
});

startGameBtn.addEventListener("click", () => {
  if (state.running) return;
  toggleModal(false);
  startGame();
});

playAgainBtn.addEventListener("click", () => {
  toggleModal(false);
  startGame();
});

closeModalBtn.addEventListener("click", () => {
  toggleModal(false);
});

buyChestBtn.addEventListener("click", () => {
  openChest();
});

function handleKeyboard(event) {
  if (!state.running) return;
  const index = parseInt(event.key, 10) - 1;
  if (index >= 0 && index < progress.deck.length) {
    spawnUnit(progress.deck[index], "player");
  }
}

document.addEventListener("keydown", handleKeyboard);

renderDeck();
renderCollection();
renderProgress();
announceShop("Un coffre mystère coûte 120 or.");
resetGame();
