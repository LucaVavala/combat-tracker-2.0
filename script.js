/***********************************************************************
 * Combat Tracker for Feng Shui 2 with Weapon Integration, Templates,
 * and Foe Schticks
 *
 * In this version:
 * - The enemy form uses templates exclusively (Mook or Featured Foe)
 *   to auto-fill stats.
 * - Weapons are selected from a predefined list; templates may come with
 *   a default weapon which you can change.
 * - On each foe card, an "Add Schtick" (“+ Schtick”) button is added.
 *   When clicked, a modal appears with a dropdown of foe schticks
 *   (from a new database object). When selected, the schtick is added
 *   to that foe's list and displayed on the card.
 * - The layout uses a grid to display two cards per row on wide screens.
 ***********************************************************************/

// Hard-coded PCs (players)
const pcs = [
  { id: 100, name: "Ken", attack: 13, defense: 13, toughness: 6, speed: 8, fortune: 7, woundPoints: 0, isPC: true },
  { id: 101, name: "Oleg", attack: 14, backupAttack: 13, defense: 14, toughness: 7, speed: 7, fortune: 7, woundPoints: 0, isPC: true },
  { id: 102, name: "Bai Zhu", attack: 16, defense: 15, toughness: 5, speed: 6, fortune: 10, woundPoints: 0, isPC: true },
  { id: 103, name: "Shen Dao", attack: 14, defense: 13, toughness: 6, speed: 7, fortune: 8, woundPoints: 0, isPC: true }
];

// Array for NPC foes
let npcs = [];
let npcIdCounter = 200;
function getNextNpcId() {
  return npcIdCounter++;
}

// Predefined Featured Foe Templates (base stats)
const featuredTemplates = {
  "enforcer": { attack: 13, defense: 13, toughness: 5, speed: 7, defaultWeapon: "thompsonContender" },
  "hitman": { attack: 15, defense: 12, toughness: 5, speed: 8, defaultWeapon: "svdDragunov" },
  "securityHoncho": { attack: 13, defense: 14, toughness: 5, speed: 6, defaultWeapon: "beretta92FSCenturion" },
  "sinisterBodyguard": { attack: 13, defense: 13, toughness: 5, speed: 6, defaultWeapon: "browningHipower" },
  "badBusinessman": { attack: 13, defense: 13, toughness: 5, speed: 6, defaultWeapon: "amtAutomag" },
  "giangHuWarrior": { attack: 14, defense: 13, toughness: 5, speed: 7, defaultWeapon: "sword" },
  "martialArtist": { attack: 13, defense: 13, toughness: 6, speed: 7, defaultWeapon: "unarmed" },
  "officer": { attack: 13, defense: 13, toughness: 5, speed: 6, defaultWeapon: "coltDetectiveSpecial" },
  "insurgent": { attack: 14, defense: 13, toughness: 5, speed: 8, defaultWeapon: "ak47" },
  "wheelman": { attack: 13, defense: 13, toughness: 5, speed: 7, defaultWeapon: "tireIron" },
  "sorcerousVassal": { attack: 13, defense: 13, toughness: 5, speed: 7, defaultWeapon: "blast" },
  "tenThousandMan": { attack: 13, defense: 13, toughness: 6, speed: 6, defaultWeapon: "unknown" },
  "cyberApe": { attack: 14, defense: 12, toughness: 7, speed: 7, defaultWeapon: "chestMountedMG" },
  "monster": { attack: 14, defense: 13, toughness: 5, speed: 7, defaultWeapon: "claw" },
  "gladiator": { attack: 13, defense: 13, toughness: 6, speed: 8, defaultWeapon: "chain" },
  "mutant": { attack: 13, defense: 13, toughness: 6, speed: 7, defaultWeapon: "forceBlast" },
  "wastelander": { attack: 13, defense: 13, toughness: 6, speed: 7, defaultWeapon: "unidentifiableShotgun" },
  "sinisterScientist": { attack: 14, defense: 13, toughness: 5, speed: 7, defaultWeapon: "hkP7" },
  "keyJiangshi": { attack: 15, defense: 13, toughness: 5, speed: 7, defaultWeapon: "claw" },
  "keySnakePerson": { attack: 14, defense: 12, toughness: 5, speed: 8, defaultWeapon: "scimitar" },
  "niceGuyBadAss": { attack: 16, defense: 17, toughness: 5, speed: 9, defaultWeapon: "unarmedMastery" }
};

// Predefined Mook Templates – fixed base stats for mooks: Attack 8, Defense 13, Toughness 0, Speed 5.
// Their template supplies a damage bonus and a default weapon (if any).
const mookTemplates = {
  "brawlers": { templateDamage: 8, defaultWeapon: "poolCue", alternateDamage: 7 },
  "streetTriads": { templateDamage: 9, defaultWeapon: "machete" },
  "midLevelGangsters": { templateDamage: 10, defaultWeapon: "glock" },
  "securityForces": { templateDamage: 10, defaultWeapon: "hkMp5" },
  "martialArtists": { templateDamage: 7, defaultWeapon: "unarmed" },
  "cornerHoods": { templateDamage: 10, defaultWeapon: "ruger9mm" },
  "cartelGoons": { templateDamage: 13, defaultWeapon: "ak47", alternateWeapon: "combatKnife", alternateDamage: 8 },
  "militaryPolice": { templateDamage: 10, defaultWeapon: "berettaM9" },
  "bentCops": { templateDamage: 9, defaultWeapon: "coltDetectiveSpecial", alternateDamage: 8 },
  "eunuchSorcerers": { templateDamage: 9, defaultWeapon: "sorcerousBlast" },
  "imperialGuards": { templateDamage: 10, defaultWeapon: "spear", alternateWeapon: "arrow", alternateDamage: 7 },
  "bandits": { templateDamage: 10, defaultWeapon: "sword", alternateWeapon: "arrow", alternateDamage: 7 },
  "nineteenthCenturySoldiers": { templateDamage: 8, defaultWeapon: "musket", alternateWeapon: "saber", alternateDamage: 10 },
  "ruinRunners": { templateDamage: 10, defaultWeapon: "battered1911A", alternateWeapon: "unidentifiableRevolver", alternateDamage: 9 },
  "simianArmymen": { templateDamage: 10, defaultWeapon: "m1Carbine", alternateWeapon: "machete", alternateDamage: 9 },
  "zombies": { templateDamage: 9, defaultWeapon: "nonBite" },
  "hoppingVampire": { templateDamage: 9, defaultWeapon: "nonBite" }
};

// Predefined Weapons – each gun has Damage / Conceal / Reload.
// (This is a sample list; you can expand it as needed.)
const weapons = {
  "bowAndArrow": { name: "Bow and Arrow", damage: 7, conceal: 5, reload: "-" },
  "blackPowderPistol": { name: "Black Powder Pistol", damage: 7, conceal: 3, reload: 6 },
  "crossbow": { name: "Crossbow", damage: 7, conceal: 4, reload: 6 },
  "musket": { name: "Musket", damage: 8, conceal: 5, reload: 6 },
  "amtAutomag": { name: "AMT Automag v", damage: 12, conceal: 3, reload: 5 },
  "pitBull": { name: "Auto-ordnance Pit Bull", damage: 10, conceal: 1, reload: 4 },
  "beretta92FSCenturion": { name: "Beretta 92FS Centurion", damage: 10, conceal: 2, reload: 3 },
  "berettaModel21Bobcat": { name: "Beretta Model 21 Bobcat", damage: 8, conceal: 1, reload: 4 },
  "berettaM9": { name: "Beretta M9", damage: 10, conceal: 2, reload: 3 },
  "browningHipower": { name: "Browning Hi-Power", damage: 10, conceal: 2, reload: 3 },
  "colt1911A": { name: "Colt 1911A", damage: 10, conceal: 2, reload: 4 },
  "cz75B": { name: "CZ 75B", damage: 10, conceal: 1, reload: 3 },
  "desertEagle357": { name: "Desert Eagle .357 Magnum", damage: 11, conceal: 3, reload: 3 },
  "desertEagle50AE": { name: "Desert Eagle .50AE", damage: 12, conceal: 3, reload: 4 },
  // (Additional weapons from your list can be added here)
  "thompsonContender": { name: "Thompson Center Arms Contender", damage: 12, conceal: 3, reload: 6 },
  "poolCue": { name: "Pool Cue", damage: 8, conceal: 4, reload: "-" },
  "machete": { name: "Machete", damage: 9, conceal: 2, reload: "-" },
  "glock": { name: "Glock 17", damage: 10, conceal: 1, reload: 3 },
  "hkMp5": { name: "Heckler & Koch Mp5", damage: 10, conceal: 5, reload: 1 },
  "unarmed": { name: "Unarmed", damage: 7, conceal: "-", reload: "-" },
  "ruger9mm": { name: "Ruger 9mm", damage: 10, conceal: 2, reload: 4 },
  "combatKnife": { name: "Combat Knife", damage: 8, conceal: 1, reload: "-" },
  "sorcerousBlast": { name: "Sorcerous Blast", damage: 9, conceal: "-", reload: "-" },
  "spear": { name: "Spear", damage: 10, conceal: "-", reload: "-" },
  "arrow": { name: "Arrow", damage: 7, conceal: "-", reload: "-" },
  "sword": { name: "Sword", damage: 10, conceal: 2, reload: "-" }
  // etc.
};

// Predefined Foe Schticks Database
const foeSchticks = {
  "ablativeLackey": {
    name: "Ablative Lackey",
    description: "If at least one mook is up, as an interrupt after the foe takes Wound Points, the foe takes 0 Wound Points and 1 mook goes down.",
    suitableFor: "Any"
  },
  "antiMystical": {
    name: "Anti-Mystical",
    description: "Add +1 Defense vs. Creature Powers and Sorcery attacks.",
    suitableFor: "Any Featured Foe or Boss"
  },
  "antiTech": {
    name: "Anti-Tech",
    description: "+1 Defense vs. Guns, Mutant, and Scroungetech attacks.",
    suitableFor: "Any"
  },
  "backToTheWall": {
    name: "Back to the Wall",
    description: "If the foe is attacked by more than one character in any sequence, the shot cost of a standard attack drops to 2 until end of sequence.",
    suitableFor: "Any (Featured Foe/Boss)"
  },
  "barkOfTheUnderdog": {
    name: "Bark of the Underdog",
    description: "Add +2 Toughness when more than half the mooks on the foe’s side have been put down.",
    suitableFor: "Any"
  },
  "boneFissure": {
    name: "Bone Fissure",
    description: "Spend 1 shot; if the foe is still active at the start of the next keyframe, target hero takes 7 Wound Points.",
    suitableFor: "Sorcerer, Supernatural Creature"
  },
  "brokenTrigram": {
    name: "Broken Trigram",
    description: "Spend 1 shot; if the foe is still active at the start of the next keyframe, target hero suffers a financial setback. Usable once per adventure.",
    suitableFor: "Sorcerer"
  }
  // ... (Add all additional foe schticks as needed)
};

// ------------------- Populate Dropdowns -------------------
function populateFeaturedTemplateDropdown() {
  featuredTemplateSelect.innerHTML = '<option value="" disabled selected>Select Template</option>';
  for (const key in featuredTemplates) {
    if (featuredTemplates.hasOwnProperty(key)) {
      const option = document.createElement('option');
      option.value = key;
      let label = key.replace(/([A-Z])/g, ' $1').trim();
      label = label.charAt(0).toUpperCase() + label.slice(1);
      option.textContent = label;
      featuredTemplateSelect.appendChild(option);
    }
  }
}
populateFeaturedTemplateDropdown();

function populateMookTemplateDropdown() {
  mookTemplateSelect.innerHTML = '<option value="" disabled selected>Select Mook Template</option>';
  for (const key in mookTemplates) {
    if (mookTemplates.hasOwnProperty(key)) {
      const option = document.createElement('option');
      option.value = key;
      let label = key.replace(/([A-Z])/g, ' $1').trim();
      label = label.charAt(0).toUpperCase() + label.slice(1);
      option.textContent = label;
      mookTemplateSelect.appendChild(option);
    }
  }
}
populateMookTemplateDropdown();

function populateWeaponDropdown() {
  weaponSelect.innerHTML = '<option value="" disabled selected>Select Weapon</option>';
  for (const key in weapons) {
    if (weapons.hasOwnProperty(key)) {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = weapons[key].name + ` (${weapons[key].damage}/${weapons[key].conceal}/${weapons[key].reload})`;
      weaponSelect.appendChild(option);
    }
  }
}
populateWeaponDropdown();

// Populate Foe Schticks dropdown for modal.
function populateSchtickDropdown() {
  const schtickSelect = document.getElementById('schtickSelect');
  schtickSelect.innerHTML = '<option value="" disabled selected>Select Schtick</option>';
  for (const key in foeSchticks) {
    if (foeSchticks.hasOwnProperty(key)) {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = foeSchticks[key].name;
      schtickSelect.appendChild(option);
    }
  }
}
populateSchtickDropdown();

// ------------------- DOM Elements -------------------
const pcList = document.getElementById('pcList');
const npcList = document.getElementById('npcList');

const addEnemyForm = document.getElementById('addEnemyForm');
const enemyNameInput = document.getElementById('enemyName');
const enemyTypeSelect = document.getElementById('enemyType');
const mookCountContainer = document.getElementById('mookCountContainer');
const mookCountInput = document.getElementById('mookCount');
const mookTemplateContainer = document.getElementById('mookTemplateContainer');
const mookTemplateSelect = document.getElementById('mookTemplate');
const featuredTemplateContainer = document.getElementById('featuredTemplateContainer');
const featuredTemplateSelect = document.getElementById('featuredTemplate');
const weaponContainer = document.getElementById('weaponContainer');
const weaponSelect = document.getElementById('weaponSelect');

const playerAttackerSelect = document.getElementById('playerAttacker');
const npcTargetSelect = document.getElementById('npcTarget');
const npcAttackerSelect = document.getElementById('npcAttacker');
const playerTargetSelect = document.getElementById('playerTarget');

const playerActionForm = document.getElementById('playerActionForm');
const npcActionForm = document.getElementById('npcActionForm');

const playerRollResultInput = document.getElementById('playerRollResult');
const playerModifierInput = document.getElementById('playerModifier');
const playerWeaponDamageInput = document.getElementById('playerWeaponDamage');

const npcModifierInput = document.getElementById('npcModifier');
const npcWeaponDamageInput = document.getElementById('npcWeaponDamage');
const npcRollDiceButton = document.getElementById('npcRollDiceButton');
const npcRollResultDiv = document.getElementById('npcRollResult');

const logList = document.getElementById('logList');

const exportButton = document.getElementById('exportButton');
const importButton = document.getElementById('importButton');
const importFileInput = document.getElementById('importFileInput');

// For foe schticks modal
const schtickModal = document.getElementById('schtickModal');
const closeModal = document.getElementById('closeModal');
const addSchtickButton = document.getElementById('addSchtickButton');
let currentNpcForSchtick = null;  // To know which foe card we are editing

// ------------------- Update Display Functions -------------------
function renderStatRow(label, statValue, id, statKey) {
  return `
    <div class="statRow">
      <span>${label}: <strong id="${statKey}-${id}">${statValue}</strong></span>
      <button data-id="${id}" class="inc${statKey}">+</button>
      <button data-id="${id}" class="dec${statKey}">–</button>
    </div>
  `;
}

function renderSchtickRow(schtick) {
  return `<div class="schtickRow">${schtick.name} <em>${schtick.description}</em></div>`;
}

function updatePcList() {
  pcList.innerHTML = '';
  pcs.forEach(pc => {
    let cardHTML = `<h3>${pc.name}</h3>`;
    cardHTML += renderStatRow("Attack", pc.attack, pc.id, "Attack");
    if(pc.backupAttack !== undefined) {
      cardHTML += renderStatRow("Backup Attack", pc.backupAttack, pc.id, "BackupAttack");
    }
    cardHTML += renderStatRow("Defense", pc.defense, pc.id, "Defense");
    cardHTML += renderStatRow("Toughness", pc.toughness, pc.id, "Toughness");
    cardHTML += renderStatRow("Speed", pc.speed, pc.id, "Speed");
    cardHTML += renderStatRow("Fortune", pc.fortune, pc.id, "Fortune");
    cardHTML += renderStatRow("Wound Points", pc.woundPoints, pc.id, "Wound");
    const li = document.createElement('li');
    li.className = "combatantCard";
    li.innerHTML = cardHTML;
    pcList.appendChild(li);
  });
  attachPcListeners();
}

function updateNpcList() {
  npcList.innerHTML = '';
  npcs.forEach(npc => {
    let cardHTML = "";
    if(npc.type === "mook"){
      cardHTML += `<h3>${npc.name} (Mook)</h3>`;
      cardHTML += renderStatRow("Attack", npc.attack, npc.id, "Attack");
      cardHTML += renderStatRow("Defense", npc.defense, npc.id, "Defense");
      cardHTML += renderStatRow("Toughness", npc.toughness, npc.id, "Toughness");
      cardHTML += renderStatRow("Speed", npc.speed, npc.id, "Speed");
      cardHTML += renderStatRow("Fortune", npc.fortune || 0, npc.id, "Fortune");
      cardHTML += `<div class="statRow">
                     <span>Mook Count: <strong id="mook-${npc.id}">${npc.count}</strong></span>
                     <button data-id="${npc.id}" class="incMook">+</button>
                     <button data-id="${npc.id}" class="decMook">–</button>
                   </div>`;
    } else {
      cardHTML += `<h3>${npc.name} (${npc.type.charAt(0).toUpperCase()+npc.type.slice(1)})</h3>`;
      cardHTML += renderStatRow("Attack", npc.attack, npc.id, "Attack");
      cardHTML += renderStatRow("Defense", npc.defense, npc.id, "Defense");
      cardHTML += renderStatRow("Toughness", npc.toughness, npc.id, "Toughness");
      cardHTML += renderStatRow("Speed", npc.speed, npc.id, "Speed");
      cardHTML += renderStatRow("Fortune", npc.fortune || 0, npc.id, "Fortune");
      cardHTML += renderStatRow("Wound Points", npc.woundPoints, npc.id, "Wound");
      if(npc.weapon){
        cardHTML += `<div class="statRow">
                       <span>Weapon: <strong>${npc.weapon.name} (${npc.weapon.damage}/${npc.weapon.conceal}/${npc.weapon.reload})</strong></span>
                     </div>`;
      }
      // Display foe schticks, if any.
      if(npc.schticks && npc.schticks.length > 0){
        cardHTML += `<div class="schticksContainer"><strong>Schticks:</strong>`;
        npc.schticks.forEach(s => {
          cardHTML += renderSchtickRow(s);
        });
        cardHTML += `</div>`;
      }
      // Add a button to add a new schtick.
      cardHTML += `<button data-id="${npc.id}" class="addSchtickBtn">+ Schtick</button>`;
    }
    cardHTML += `<button data-id="${npc.id}" class="removeEnemy removeBtn">Remove</button>`;
    const li = document.createElement('li');
    li.className = "combatantCard";
    li.innerHTML = cardHTML;
    npcList.appendChild(li);
  });
  attachNpcListeners();
}

function updateAttackDropdowns() {
  playerAttackerSelect.innerHTML = '';
  pcs.forEach(pc => {
    const option = document.createElement('option');
    option.value = pc.id;
    option.textContent = pc.name;
    playerAttackerSelect.appendChild(option);
  });
  npcTargetSelect.innerHTML = '';
  npcs.forEach(npc => {
    if(npc.type !== "mook" || npc.count > 0){
      const option = document.createElement('option');
      option.value = npc.id;
      option.textContent = npc.name;
      npcTargetSelect.appendChild(option);
    }
  });
  npcAttackerSelect.innerHTML = '';
  npcs.forEach(npc => {
    if(npc.type !== "mook" || npc.count > 0){
      const option = document.createElement('option');
      option.value = npc.id;
      option.textContent = npc.name;
      npcAttackerSelect.appendChild(option);
    }
  });
  playerTargetSelect.innerHTML = '';
  pcs.forEach(pc => {
    const option = document.createElement('option');
    option.value = pc.id;
    option.textContent = pc.name;
    playerTargetSelect.appendChild(option);
  });
}

// ------------------- Attach Listeners for Stat Adjustment Buttons -------------------
// (Using same pattern as before; code omitted for brevity)
function attachPcListeners() {
  // ... (same as previous code for PCs)
}
function attachNpcListeners() {
  // Attach stat buttons (same as before)
  // ...
  // Attach remove enemy listener:
  document.querySelectorAll('.removeEnemy').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id, 10);
      npcs = npcs.filter(npc => npc.id !== id);
      updateAttackDropdowns();
      updateNpcList();
      logEvent(`Removed enemy with ID ${id}`);
    });
  });
  // Attach "Add Schtick" button listener:
  document.querySelectorAll('.addSchtickBtn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentNpcForSchtick = parseInt(btn.dataset.id, 10);
      schtickModal.style.display = "block";
    });
  });
}

// ------------------- Modal for Adding Foe Schticks -------------------
closeModal.addEventListener('click', () => {
  schtickModal.style.display = "none";
});
window.addEventListener('click', (event) => {
  if (event.target == schtickModal) {
    schtickModal.style.display = "none";
  }
});
addSchtickButton.addEventListener('click', () => {
  const schtickKey = document.getElementById('schtickSelect').value;
  if (!schtickKey || currentNpcForSchtick === null) {
    alert("Please select a schtick.");
    return;
  }
  const schtick = foeSchticks[schtickKey];
  const npc = npcs.find(n => n.id === currentNpcForSchtick);
  if (npc) {
    if (!npc.schticks) npc.schticks = [];
    npc.schticks.push(schtick);
    updateNpcList();
    logEvent(`Added schtick "${schtick.name}" to ${npc.name}.`);
  }
  schtickModal.style.display = "none";
  currentNpcForSchtick = null;
});

// ------------------- Enemy Form Submission -------------------
addEnemyForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = enemyNameInput.value.trim();
  let type = enemyTypeSelect.value;
  let enemy;
  
  if (type === "mook"){
    const templateKey = mookTemplateSelect.value;
    if (!templateKey){
      alert("Please select a Mook Template.");
      return;
    }
    const template = mookTemplates[templateKey];
    enemy = {
      id: getNextNpcId(),
      name,
      type,
      attack: 8,
      defense: 13,
      toughness: 0,
      speed: 5,
      fortune: 0,
      templateDamage: template.templateDamage,
      schticks: []
    };
    enemy.count = parseInt(mookCountInput.value, 10) || 1;
  } else if (type === "featured" || type === "boss" || type === "uberboss"){
    const templateKey = featuredTemplateSelect.value;
    if (!templateKey){
      alert("Please select a Featured Foe Template.");
      return;
    }
    const template = featuredTemplates[templateKey];
    let baseAttack = template.attack;
    let baseDefense = template.defense;
    let baseToughness = template.toughness;
    let baseSpeed = template.speed;
    if (type === "boss"){
      baseAttack += 3; baseDefense += 2; baseToughness += 2; baseSpeed += 1;
    } else if (type === "uberboss"){
      baseAttack += 5; baseDefense += 4; baseToughness += 3; baseSpeed += 2;
    }
    enemy = {
      id: getNextNpcId(),
      name,
      type,
      attack: baseAttack,
      defense: baseDefense,
      toughness: baseToughness,
      speed: baseSpeed,
      fortune: 0,
      woundPoints: 0,
      attackImpair: 0,
      defenseImpair: 0,
      schticks: []
    };
    const weaponKey = weaponSelect.value;
    if (weaponKey) {
      enemy.weapon = weapons[weaponKey];
    } else {
      enemy.weapon = null;
    }
  } else {
    return;
  }
  
  npcs.push(enemy);
  updateAttackDropdowns();
  updateNpcList();
  addEnemyForm.reset();
  mookCountContainer.style.display = "none";
  mookTemplateContainer.style.display = "none";
  featuredTemplateContainer.style.display = "none";
  weaponContainer.style.display = "none";
  logEvent(`Added enemy: ${name} (${type})`);
});

// Show/hide form sections based on enemy type.
enemyTypeSelect.addEventListener('change', (e) => {
  const selected = e.target.value;
  if (selected === "mook"){
    mookCountContainer.style.display = "block";
    mookTemplateContainer.style.display = "block";
    featuredTemplateContainer.style.display = "none";
    weaponContainer.style.display = "none";
  } else if (selected === "featured" || selected === "boss" || selected === "uberboss"){
    featuredTemplateContainer.style.display = "block";
    weaponContainer.style.display = "block";
    mookCountContainer.style.display = "none";
    mookTemplateContainer.style.display = "none";
  } else {
    mookCountContainer.style.display = "none";
    mookTemplateContainer.style.display = "none";
    featuredTemplateContainer.style.display = "none";
    weaponContainer.style.display = "none";
  }
});

// ------------------- Attack Actions -------------------
// (Player and NPC attack code remains similar to previous version)
// PLAYER ATTACK:
playerActionForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const attackerId = parseInt(playerAttackerSelect.value, 10);
  const targetId = parseInt(npcTargetSelect.value, 10);
  const attacker = pcs.find(pc => pc.id === attackerId);
  const target = npcs.find(npc => npc.id === targetId);
  if (!attacker || !target) return;
  
  let rollResult = parseInt(playerRollResultInput.value.replace('!', ''), 10);
  const modifier = parseInt(playerModifierInput.value, 10) || 0;
  rollResult += modifier;
  
  let smackdown = rollResult - target.defense;
  if (smackdown < 0) smackdown = 0;
  
  const weaponDamage = parseInt(playerWeaponDamageInput.value, 10) || 0;
  let damage = smackdown + weaponDamage - target.toughness;
  if (damage < 0) damage = 0;
  
  let logMsg = `Player Attack: ${attacker.name} rolled ${rollResult} vs. ${target.name}'s Defense (${target.defense}) = ${smackdown}. `;
  logMsg += `+ Weapon Damage (${weaponDamage}) - Toughness (${target.toughness}) = Damage ${damage}. `;
  
  if (target.type === "mook"){
    if (damage > 0){
      target.count--;
      if (target.count < 0) target.count = 0;
      logMsg += `Mook hit! ${target.name} count decreased to ${target.count}.`;
    } else {
      logMsg += `No damage; mook count remains ${target.count}.`;
    }
  } else {
    target.woundPoints += damage;
    if (target.type === "featured"){
      if (target.woundPoints >= 30){
        target.attackImpair = 2;
        target.defenseImpair = 2;
        logMsg += `Impairment -2 applied. `;
      } else if (target.woundPoints >= 25){
        target.attackImpair = 1;
        target.defenseImpair = 1;
        logMsg += `Impairment -1 applied. `;
      } else {
        target.attackImpair = 0;
        target.defenseImpair = 0;
      }
    } else if (target.type === "boss" || target.type === "uberboss"){
      if (target.woundPoints >= 45){
        target.attackImpair = 2;
        target.defenseImpair = 2;
        logMsg += `Impairment -2 applied. `;
      } else if (target.woundPoints >= 40){
        target.attackImpair = 1;
        target.defenseImpair = 1;
        logMsg += `Impairment -1 applied. `;
      } else {
        target.attackImpair = 0;
        target.defenseImpair = 0;
      }
    }
    logMsg += `${target.name} now has ${target.woundPoints} Wound Points.`;
  }
  
  logEvent(logMsg);
  updateNpcList();
  playerActionForm.reset();
  updateAttackDropdowns();
});

// NPC ATTACK:
npcRollDiceButton.addEventListener('click', () => {
  const attackerId = parseInt(npcAttackerSelect.value, 10);
  const attacker = npcs.find(npc => npc.id === attackerId);
  if (!attacker){
    alert("No attacking NPC selected!");
    return;
  }
  const modifier = parseInt(npcModifierInput.value, 10) || 0;
  
  const posInitial = rollDie();
  const negInitial = rollDie();
  const boxcars = (posInitial === 6 && negInitial === 6);
  const posTotal = rollExplodingDie(posInitial);
  const negTotal = rollExplodingDie(negInitial);
  const diceOutcome = posTotal - negTotal;
  
  let baseAttack = attacker.attack;
  if (attacker.type === "mook" && attacker.templateDamage){
    baseAttack += attacker.templateDamage;
  }
  const finalCheck = baseAttack + diceOutcome + modifier;
  npcRollResultDiv.dataset.finalCheck = finalCheck;
  
  const targetId = parseInt(playerTargetSelect.value, 10);
  const target = pcs.find(pc => pc.id === targetId);
  let finalCheckHTML = `<span>${finalCheck}</span>`;
  if (target){
    if (finalCheck >= target.defense){
      finalCheckHTML = `<span class="hitResult">${finalCheck}</span>`;
    } else {
      finalCheckHTML = `<span class="missResult">${finalCheck}</span>`;
    }
  }
  
  let resultText = `Positive Total: ${posTotal} (init: ${posInitial}), Negative Total: ${negTotal} (init: ${negInitial}) → Outcome: ${diceOutcome}. `;
  resultText += `Final Check = ${baseAttack} + ${diceOutcome} + Modifier (${modifier}) = ${finalCheckHTML}`;
  if (boxcars) resultText += " (Boxcars!)";
  npcRollResultDiv.innerHTML = resultText;
  logEvent(`NPC Dice Roll: +die=${posTotal} (init ${posInitial}), -die=${negTotal} (init ${negInitial}), Outcome=${diceOutcome}. Final Check = ${baseAttack} + ${diceOutcome} + ${modifier} = ${finalCheck}${boxcars?" (Boxcars!)":""}`);
});

npcActionForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const attackerId = parseInt(npcAttackerSelect.value, 10);
  const targetId = parseInt(playerTargetSelect.value, 10);
  const attacker = npcs.find(npc => npc.id === attackerId);
  const target = pcs.find(pc => pc.id === targetId);
  if (!attacker || !target) return;
  
  let finalCheck = parseInt(npcRollResultDiv.dataset.finalCheck || "0", 10);
  if (isNaN(finalCheck) || finalCheck === 0){
    alert("Please roll the dice for NPC attack first.");
    return;
  }
  
  let smackdown = finalCheck - target.defense;
  if (smackdown < 0) smackdown = 0;
  
  // Now, instead of asking for Weapon Damage, we use the assigned weapon's damage.
  let weaponDamage = 0;
  if (attacker.weapon) {
    weaponDamage = attacker.weapon.damage;
  }
  
  let damage = smackdown + weaponDamage - target.toughness;
  if (damage < 0) damage = 0;
  
  let logMsg = `NPC Attack: ${attacker.name} (Final Check ${finalCheck}) vs. ${target.name}'s Defense (${target.defense}) = ${smackdown}. `;
  logMsg += `+ Weapon Damage (${weaponDamage}) - Toughness (${target.toughness}) = Damage ${damage}. `;
  
  target.woundPoints += damage;
  logMsg += `${target.name} now has ${target.woundPoints} Wound Points.`;
  
  logEvent(logMsg);
  updatePcList();
  npcActionForm.reset();
  npcRollResultDiv.textContent = "";
  delete npcRollResultDiv.dataset.finalCheck;
  updateAttackDropdowns();
});

// ------------------- Dice Roller Functions -------------------
function rollDie() {
  return Math.floor(Math.random() * 6) + 1;
}
function rollExplodingDie(initial) {
  let total = initial;
  while (initial === 6) {
    initial = rollDie();
    total += initial;
  }
  return total;
}

// ------------------- Data Export/Import -------------------
exportButton.addEventListener('click', () => {
  const data = { pcs, npcs };
  const dataStr = JSON.stringify(data);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "combatData.json";
  a.click();
  URL.revokeObjectURL(url);
  logEvent("Exported combat data.");
});
importButton.addEventListener('click', () => {
  importFileInput.click();
});
importFileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      const importedData = JSON.parse(evt.target.result);
      npcs = importedData.npcs || [];
      updateAttackDropdowns();
      updatePcList();
      updateNpcList();
      logEvent("Imported combat data successfully.");
    } catch (error) {
      alert("Failed to import data: " + error);
    }
  };
  reader.readAsText(file);
});

// ------------------- Update Dropdowns for Attack Forms -------------------
function updateAttackDropdowns() {
  playerAttackerSelect.innerHTML = '';
  pcs.forEach(pc => {
    const option = document.createElement('option');
    option.value = pc.id;
    option.textContent = pc.name;
    playerAttackerSelect.appendChild(option);
  });
  npcTargetSelect.innerHTML = '';
  npcs.forEach(npc => {
    if (npc.type !== "mook" || npc.count > 0) {
      const option = document.createElement('option');
      option.value = npc.id;
      option.textContent = npc.name;
      npcTargetSelect.appendChild(option);
    }
  });
  npcAttackerSelect.innerHTML = '';
  npcs.forEach(npc => {
    if (npc.type !== "mook" || npc.count > 0) {
      const option = document.createElement('option');
      option.value = npc.id;
      option.textContent = npc.name;
      npcAttackerSelect.appendChild(option);
    }
  });
  playerTargetSelect.innerHTML = '';
  pcs.forEach(pc => {
    const option = document.createElement('option');
    option.value = pc.id;
    option.textContent = pc.name;
    playerTargetSelect.appendChild(option);
  });
}

// ------------------- Event Log Helper -------------------
function logEvent(message) {
  const li = document.createElement('li');
  li.textContent = message;
  logList.appendChild(li);
}

// ------------------- Initial Population -------------------
function init() {
  updatePcList();
  updateAttackDropdowns();
}
init();
