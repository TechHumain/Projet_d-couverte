const CARD_LIBRARY = {
  knight: {
    label: "Chevalier",
    rarity: "commune",
    icon: "⚔️",
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
};

const RARITY_ORDER = ["commune", "rare", "epique", "legendaire"];
const MAX_DECK_SIZE = 4;
const MIN_DECK_SIZE = 3;
const CHEST_COST = 120;
const GOLD_TARGET = 500;
const TROPHY_TARGET = 1000;

const lane = document.getElementById("lane");
const playerScore = document.getElementById("playerScore");
const aiScore = document.getElementById("aiScore");
const playerElixir = document.getElementById("playerElixir");
const aiElixirDisplay = document.getElementById("aiElixir");
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
const playerHealthFill = document.getElementById("playerHealthFill");
const aiHealthFill = document.getElementById("aiHealthFill");
const playerElixirFill = document.getElementById("playerElixirFill");
const aiElixirFill = document.getElementById("aiElixirFill");
const timerRing = document.getElementById("timerRing");
const timerHint = document.getElementById("timerHint");
const goldFill = document.getElementById("goldFill");
const trophyFill = document.getElementById("trophyFill");
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

function rarityOrder(value) {
  const index = RARITY_ORDER.indexOf(value);
  return index === -1 ? RARITY_ORDER.length : index;
}

function updateMeter(fillElement, ratio) {
  if (!fillElement) return;
  const clamped = Math.max(0, Math.min(1, ratio));
  fillElement.style.width = `${Math.round(clamped * 100)}%`;
}

function formatTime(seconds) {
  const minutes = Math.max(0, Math.floor(seconds / 60));
  const secs = Math.max(0, seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function updateHUD() {
  const playerTower = Math.max(0, Math.round(state.playerTower));
  const aiTower = Math.max(0, Math.round(state.aiTower));
  playerScore.textContent = `Tour : ${playerTower}`;
  aiScore.textContent = `Tour : ${aiTower}`;
  playerElixir.textContent = `Élixir : ${Math.floor(state.playerElixir)}`;
  if (aiElixirDisplay) {
    aiElixirDisplay.textContent = `Élixir : ${Math.floor(state.aiElixir)}`;
  }
  timerEl.textContent = `Temps : ${formatTime(state.timer)}`;

  updateMeter(playerHealthFill, playerTower / 100);
  updateMeter(aiHealthFill, aiTower / 100);
  updateMeter(playerElixirFill, Math.min(10, state.playerElixir) / 10);
  updateMeter(aiElixirFill, Math.min(10, state.aiElixir) / 10);

  if (timerRing) {
    const ratio = Math.max(0, Math.min(1, state.timer / 180));
    timerRing.style.setProperty("--angle", `${ratio * 360}deg`);
    let stage = "normal";
    if (state.timer <= 30) {
      stage = "final";
    } else if (state.timer <= 60) {
      stage = "overtime";
    } else if (state.timer <= 120) {
      stage = "double";
    }
    timerRing.dataset.stage = stage;
    if (timerHint) {
      switch (stage) {
        case "double":
          timerHint.textContent =
            "Double élixir actif : multipliez vos assauts !";
          break;
        case "overtime":
          timerHint.textContent =
            "Prolongations : la moindre erreur peut coûter la partie.";
          break;
        case "final":
          timerHint.textContent =
            "Dernières secondes : lancez votre combo décisif !";
          break;
        default:
          timerHint.textContent =
            "La furie double élixir commence à 60 secondes.";
      }
    }
  }
}

function renderProgress() {
  goldAmount.textContent = progress.gold;
  trophyAmount.textContent = progress.trophies;
  updateMeter(goldFill, progress.gold / GOLD_TARGET);
  updateMeter(trophyFill, progress.trophies / TROPHY_TARGET);
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
      const stats = computeStats(card, getCardLevel(key));
      const button = document.createElement("button");
      button.type = "button";
      button.className = `card rarity-${card.rarity}`;
      button.dataset.type = key;
      button.setAttribute(
        "aria-label",
        `${card.label} – coût ${card.cost} élixir`,
      );
      button.innerHTML = `
        <span class="elixir-orb">${card.cost}</span>
        <div class="card-content">
          <div class="card-header">
            <span class="card-icon">${card.icon ?? card.label.charAt(0)}</span>
            <span class="card-title">${card.label}</span>
          </div>
          <p class="card-level">Niv. ${getCardLevel(key)}</p>
          <p class="cost">PV ${stats.health} • DPS ${stats.damage}</p>
        </div>
      `;
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
    const li = document.createElement("li");
    li.className = `collection-card rarity-${card.rarity}${unlocked ? "" : " locked"}`;
    const header = document.createElement("header");
    const title = document.createElement("h3");
    title.className = "card-title";
    title.innerHTML = `<span class="card-icon">${card.icon ?? card.label.charAt(0)}</span>${card.label}`;
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
      const level = document.createElement("p");
      level.className = "card-level";
      level.textContent = `Niveau ${getCardLevel(key)}`;
      li.appendChild(level);

      const button = document.createElement("button");
      button.type = "button";
      button.dataset.card = key;
      if (progress.deck.includes(key)) {
        button.textContent = "Retirer du deck";
      } else if (progress.deck.length >= MAX_DECK_SIZE) {
        button.textContent = "Deck complet";
        button.disabled = true;
      } else {
        button.textContent = "Ajouter au deck";
      }
      li.appendChild(button);
    } else {
      const locked = document.createElement("p");
      locked.className = "card-level";
      locked.textContent =
        "Carte verrouillée – ouvrez un coffre pour la débloquer.";
      li.appendChild(locked);
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
  el.setAttribute(
    "aria-label",
    `${card.label} ${side === "player" ? "allié" : "ennemi"}`,
  );
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
      (unit) =>
        unit.side !== attacker.side &&
        unit.id !== defender.id &&
        Math.abs(unit.x - defender.x) <= stats.splashRadius,
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
      dealTowerDamage(
        "ai",
        Math.round(unit.stats.damage * unit.stats.towerDamageMultiplier),
      );
      removeUnit(unit);
      return;
    }

    if (unit.side === "ai" && unit.x <= 24) {
      dealTowerDamage(
        "player",
        Math.round(unit.stats.damage * unit.stats.towerDamageMultiplier),
      );
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
  state.aiElixir = Math.min(
    10,
    state.aiElixir +
      regenRate * (1.15 + (state.aiLevel - 1) * 0.25) * aggressionBoost,
  );
}

function getAIDeck() {
  const deck = ["knight", "archer", "sentinel"];
  if (state.timer <= 170) deck.push("golem");
  if (state.timer <= 135 || state.aiTower < state.playerTower)
    deck.push("pyromancer");
  if (state.timer <= 90 || state.aiTower < state.playerTower - 20)
    deck.push("assassin");
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
  const decisionThreshold = Math.max(
    700,
    2200 - state.aiLevel * 320 - (state.aiTower < state.playerTower ? 380 : 0),
  );
  if (state.aiDecisionTimer < decisionThreshold) return;
  state.aiDecisionTimer = 0;

  const aiDeck = getAIDeck();
  const affordable = aiDeck.filter(
    (key) => getCardData(key).cost <= state.aiElixir,
  );
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
  modalMessage.textContent =
    winner === "player"
      ? "Vous remportez la couronne !"
      : "La tour a cédé. Retentez votre chance.";
  modalTitle.textContent = winner === "player" ? "Victoire !" : "Défaite";
  rewardMessage.textContent = rewards.text;
  rewardMessage.classList.toggle("reward", winner === "player");
  playAgainBtn.focus();
  startGameBtn.textContent = "Rejouer une partie";
  startGameBtn.disabled = false;
}

function toggleModal(open) {
  modal.hidden = !open;
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
    announceShop(
      `Il manque ${CHEST_COST - progress.gold} or pour ce coffre.`,
      "warning",
    );
    return;
  }

  progress.gold -= CHEST_COST;
  const locked = Object.keys(CARD_LIBRARY).filter(
    (key) => !progress.unlocked.has(key),
  );
  let message;
  if (locked.length) {
    const cardKey = locked[Math.floor(Math.random() * locked.length)];
    progress.unlocked.add(cardKey);
    progress.cardLevels[cardKey] = 1;
    if (progress.deck.length < MAX_DECK_SIZE) {
      progress.deck.push(cardKey);
    }
    message = `${CARD_LIBRARY[cardKey].label} rejoint votre armée !`;
  } else {
    const unlocked = Array.from(progress.unlocked);
    const cardKey = unlocked[Math.floor(Math.random() * unlocked.length)];
    const currentLevel = getCardLevel(cardKey);
    if (currentLevel < 5) {
      progress.cardLevels[cardKey] = currentLevel + 1;
      message = `${CARD_LIBRARY[cardKey].label} passe niveau ${progress.cardLevels[cardKey]} !`;
    } else {
      const refund = 60;
      progress.gold += refund;
      message = `${CARD_LIBRARY[cardKey].label} est déjà au niveau max. +${refund} or.`;
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
      announceShop(
        `Gardez au moins ${MIN_DECK_SIZE} cartes actives.`,
        "warning",
      );
      return;
    }
    progress.deck = progress.deck.filter((key) => key !== cardKey);
  } else {
    if (progress.deck.length >= MAX_DECK_SIZE) {
      announceShop(
        "Deck complet. Retirez une carte avant d'en ajouter une nouvelle.",
        "warning",
      );
      return;
    }
    progress.deck.push(cardKey);
  }
  renderDeck();
  renderCollection();
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
  const button = event.target.closest("button[data-card]");
  if (!button) return;
  toggleDeck(button.dataset.card);
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
