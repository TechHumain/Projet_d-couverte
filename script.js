const UNIT_TYPES = {
  knight: {
    label: "Chevalier",
    cost: 3,
    speed: 0.12,
    damage: 6,
    range: 32,
    attackSpeed: 850,
    health: 80,
  },
  archer: {
    label: "Archer",
    cost: 2,
    speed: 0.14,
    damage: 5,
    range: 140,
    attackSpeed: 900,
    health: 40,
    projectile: true,
  },
  golem: {
    label: "Golem",
    cost: 5,
    speed: 0.09,
    damage: 10,
    range: 36,
    attackSpeed: 1200,
    health: 150,
  },
};

const lane = document.getElementById("lane");
const playerScore = document.getElementById("playerScore");
const aiScore = document.getElementById("aiScore");
const playerElixir = document.getElementById("playerElixir");
const timerEl = document.getElementById("timer");
const cards = document.querySelectorAll(".card");
const startGameBtn = document.getElementById("startGame");
const modal = document.getElementById("resultModal");
const modalMessage = document.getElementById("resultMessage");
const modalTitle = document.getElementById("resultTitle");
const playAgainBtn = document.getElementById("playAgain");
const closeModalBtn = document.getElementById("closeModal");

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
};

const formatTower = (value) => `Tour : ${Math.max(0, Math.round(value))}`;
const formatElixir = (value) => `Élixir : ${Math.floor(value)}`;

function updateHUD() {
  playerScore.textContent = formatTower(state.playerTower);
  aiScore.textContent = formatTower(state.aiTower);
  playerElixir.textContent = formatElixir(state.playerElixir);
  timerEl.textContent = `Temps : ${state.timer}s`;
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
  if (state.loopHandle) cancelAnimationFrame(state.loopHandle);
  lane.innerHTML = "";
  updateHUD();
}

function spawnUnit(typeKey, side) {
  const type = UNIT_TYPES[typeKey];
  if (!type) return;

  if (side === "player" && state.playerElixir < type.cost) {
    feedback(`Pas assez d'élixir pour ${type.label}`);
    return;
  }

  if (side === "ai" && state.aiElixir < type.cost) {
    return;
  }

  const newUnit = {
    id: ++state.lastUnitId,
    type: typeKey,
    side,
    x: side === "player" ? 32 : lane.clientWidth - 72,
    y: 24,
    health: type.health,
    cooldown: 0,
  };

  const el = document.createElement("div");
  el.className = `unit ${side}`;
  el.dataset.id = newUnit.id;
  el.textContent = type.label.charAt(0);
  el.setAttribute("role", "img");
  el.setAttribute("aria-label", `${type.label} ${side === "player" ? "allié" : "ennemi"}`);
  lane.appendChild(el);
  newUnit.element = el;
  state.units.push(newUnit);

  if (side === "player") {
    state.playerElixir -= type.cost;
  } else {
    state.aiElixir -= type.cost;
  }
  updateHUD();
}

function feedback(message) {
  startGameBtn.setAttribute("aria-live", "assertive");
  startGameBtn.textContent = message;
  startGameBtn.disabled = true;
  setTimeout(() => {
    startGameBtn.textContent = state.running ? "Partie en cours" : "Lancer une partie";
    startGameBtn.removeAttribute("aria-live");
    startGameBtn.disabled = state.running;
  }, 1500);
}

function updateUnits(delta) {
  const laneWidth = lane.clientWidth;
  state.units.slice().forEach((unit) => {
    const type = UNIT_TYPES[unit.type];
    const enemies = state.units.filter((u) => u.side !== unit.side);
    const direction = unit.side === "player" ? 1 : -1;
    let speed = type.speed * delta;

    let target = null;
    let minDistance = Number.POSITIVE_INFINITY;
    enemies.forEach((enemy) => {
      const distance = Math.abs(enemy.x - unit.x);
      if (distance < minDistance) {
        minDistance = distance;
        target = enemy;
      }
    });

    if (target && minDistance <= type.range) {
      speed = 0;
      if (unit.cooldown <= 0) {
        attackUnit(unit, target, type);
        unit.cooldown = type.attackSpeed;
      }
    }

    unit.cooldown -= delta;
    unit.x += speed * direction;

    if (unit.side === "player" && unit.x >= laneWidth - 64) {
      dealTowerDamage("ai", type.damage);
      removeUnit(unit);
      return;
    }

    if (unit.side === "ai" && unit.x <= 24) {
      dealTowerDamage("player", type.damage);
      removeUnit(unit);
      return;
    }

    unit.element.style.transform = `translate(${unit.x}px, 0)`;
  });
}

function attackUnit(attacker, defender, type) {
  defender.health -= type.damage;
  spawnProjectile(attacker, defender);
  if (defender.health <= 0) {
    removeUnit(defender);
  }
}

function spawnProjectile(attacker, defender) {
  const type = UNIT_TYPES[attacker.type];
  if (!type.projectile) return;

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

function regenerateElixir(delta) {
  const regenRate = delta / 1000;
  state.playerElixir = Math.min(10, state.playerElixir + regenRate * 1.2);
  state.aiElixir = Math.min(10, state.aiElixir + regenRate * 1.2);
}

function aiBehavior(delta) {
  state.aiDecisionTimer += delta;
  if (state.aiDecisionTimer < 2200) return;
  state.aiDecisionTimer = 0;

  const affordable = Object.entries(UNIT_TYPES).filter(([, value]) => value.cost <= state.aiElixir);
  if (!affordable.length) return;
  const [typeKey] = affordable[Math.floor(Math.random() * affordable.length)];
  spawnUnit(typeKey, "ai");
}

function updateTimer(delta) {
  state.timerAccumulator += delta;
  while (state.timerAccumulator >= 1000) {
    state.timerAccumulator -= 1000;
    state.timer -= 1;
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
  resetGame();
  state.running = true;
  state.lastFrame = performance.now();
  startGameBtn.textContent = "Partie en cours";
  startGameBtn.disabled = true;
  updateHUD();
  state.loopHandle = requestAnimationFrame(gameLoop);
}

function endGame(winner) {
  if (!state.running) return;
  state.running = false;
  cancelAnimationFrame(state.loopHandle);
  modal.hidden = false;
  modalMessage.textContent =
    winner === "player" ? "Vous remportez la couronne !" : "La tour a cédé. Retentez votre chance.";
  modalTitle.textContent = winner === "player" ? "Victoire !" : "Défaite";
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

cards.forEach((card) => {
  card.addEventListener("click", () => {
    if (!state.running) {
      feedback("Lancez la partie avant de jouer");
      return;
    }
    spawnUnit(card.dataset.type, "player");
  });
});

document.addEventListener("keydown", (event) => {
  if (!state.running) return;
  if (event.key === "1") spawnUnit("knight", "player");
  if (event.key === "2") spawnUnit("archer", "player");
  if (event.key === "3") spawnUnit("golem", "player");
});

resetGame();
