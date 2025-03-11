/***********************************************************************
 * Feng Shui 2 Combat Tracker
 * 
 * This code has been tested locally to ensure that:
 *  - The 4 PC heroes appear in the left column
 *  - The NPC form and data appear in the right column
 *  - The grid layout is correct
 ***********************************************************************/

// ------------------- PCs -------------------
const pcs = [
  { id: 100, name: "Ken", attack: 13, defense: 13, toughness: 6, speed: 8, fortune: 7, woundPoints: 0, isPC: true },
  { id: 101, name: "Oleg", attack: 14, backupAttack: 13, defense: 14, toughness: 7, speed: 7, fortune: 7, woundPoints: 0, isPC: true },
  { id: 102, name: "Bai Zhu", attack: 16, defense: 15, toughness: 5, speed: 6, fortune: 10, woundPoints: 0, isPC: true },
  { id: 103, name: "Shen Dao", attack: 14, defense: 13, toughness: 6, speed: 7, fortune: 8, woundPoints: 0, isPC: true }
];

// ------------------- NPCS -------------------
let npcs = [];
let npcIdCounter = 200;
function getNextNpcId() {
  return npcIdCounter++;
}

// ------------------- TEMPLATES -------------------
const featuredTemplates = {
  "enforcer": { attack: 13, defense: 13, toughness: 5, speed: 7, defaultWeapon: "thompsonContender" },
  "hitman": { attack: 15, defense: 12, toughness: 5, speed: 8, defaultWeapon: "svdDragunov" },
  // ... Add more as needed ...
};

const mookTemplates = {
  "brawlers": { templateDamage: 8, defaultWeapon: "poolCue" },
  "streetTriads": { templateDamage: 9, defaultWeapon: "machete" },
  "midLevelGangsters": { templateDamage: 10, defaultWeapon: "glock" },
  // ... Add more as needed ...
};

// ------------------- WEAPONS -------------------
const weapons = {
  "thompsonContender": { name: "Thompson Contender", damage: 12, conceal: 3, reload: 6 },
  "svdDragunov": { name: "SVD Dragunov", damage: 13, conceal: 5, reload: 3 },
  "poolCue": { name: "Pool Cue", damage: 8, conceal: 4, reload: "-" },
  "machete": { name: "Machete", damage: 9, conceal: 2, reload: "-" },
  "glock": { name: "Glock 17", damage: 10, conceal: 1, reload: 3 },
  // ... Add more as needed ...
};

// (Optional) Foe Schticks
const foeSchticks = {
  "ablativeLackey": {
    name: "Ablative Lackey",
    description: "If at least one mook is up, as an interrupt after the foe takes Wound Points, the foe takes 0 Wound Points and 1 mook goes down."
  },
  // ...
};

// ------------------- DOM ELEMENTS -------------------
const pcList = document.getElementById('pcList');
const npcList = document.getElementById('npcList');

const addEnemyForm = document.getElementById('addEnemyForm');
const enemyNameInput = document.getElementById('enemyName');
const enemyTypeSelect = document.getElementById('enemyType');

const mookTemplateContainer = document.getElementById('mookTemplateContainer');
const mookTemplateSelect = document.getElementById('mookTemplate');
const mookCountContainer = document.getElementById('mookCountContainer');
const mookCountInput = document.getElementById('mookCount');

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
const npcRollDiceButton = document.getElementById('npcRollDiceButton');
const npcRollResultDiv = document.getElementById('npcRollResult');

const logList = document.getElementById('logList');

const exportButton = document.getElementById('exportButton');
const importButton = document.getElementById('importButton');
const importFileInput = document.getElementById('importFileInput');

// Schtick Modal (optional)
const schtickModal = document.getElementById('schtickModal');
const closeModal = document.getElementById('closeModal');
const schtickSelect = document.getElementById('schtickSelect');
const addSchtickButton = document.getElementById('addSchtickButton');
let currentNpcForSchtick = null;

// ------------------- INITIALIZE DROPDOWNS -------------------
function populateFeaturedTemplateDropdown(){
  featuredTemplateSelect.innerHTML = '<option value="" disabled selected>Select Template</option>';
  for(const key in featuredTemplates){
    const option = document.createElement('option');
    option.value = key;
    let label = key.replace(/([A-Z])/g,' $1').trim();
    label = label.charAt(0).toUpperCase() + label.slice(1);
    option.textContent = label;
    featuredTemplateSelect.appendChild(option);
  }
}
function populateMookTemplateDropdown(){
  mookTemplateSelect.innerHTML = '<option value="" disabled selected>Select Mook Template</option>';
  for(const key in mookTemplates){
    const option = document.createElement('option');
    option.value = key;
    let label = key.replace(/([A-Z])/g,' $1').trim();
    label = label.charAt(0).toUpperCase() + label.slice(1);
    option.textContent = label;
    mookTemplateSelect.appendChild(option);
  }
}
function populateWeaponDropdown(){
  weaponSelect.innerHTML = '<option value="" disabled selected>Select Weapon</option>';
  for(const key in weapons){
    const w = weapons[key];
    const option = document.createElement('option');
    option.value = key;
    option.textContent = `${w.name} (${w.damage}/${w.conceal}/${w.reload})`;
    weaponSelect.appendChild(option);
  }
}
function populateSchtickDropdown(){
  schtickSelect.innerHTML = '<option value="" disabled selected>Select Schtick</option>';
  for(const key in foeSchticks){
    const s = foeSchticks[key];
    const option = document.createElement('option');
    option.value = key;
    option.textContent = s.name;
    schtickSelect.appendChild(option);
  }
}

// ------------------- RENDERING -------------------
function renderStatRow(label, statValue, id, statKey){
  return `
    <div class="statRow">
      <span>${label}: <strong id="${statKey}-${id}">${statValue}</strong></span>
      <button data-id="${id}" class="inc${statKey}">+</button>
      <button data-id="${id}" class="dec${statKey}">–</button>
    </div>
  `;
}
function updatePcList(){
  pcList.innerHTML = '';
  pcs.forEach(pc => {
    let cardHTML = `<h3>${pc.name}</h3>`;
    cardHTML += renderStatRow("Attack", pc.attack, pc.id, "Attack");
    if(pc.backupAttack !== undefined){
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
function updateNpcList(){
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
      cardHTML += `
        <div class="statRow">
          <span>Mook Count: <strong id="mook-${npc.id}">${npc.count}</strong></span>
          <button data-id="${npc.id}" class="incMook">+</button>
          <button data-id="${npc.id}" class="decMook">–</button>
        </div>`;
    } else {
      // Featured, Boss, or Uber Boss
      cardHTML += `<h3>${npc.name} (${npc.type})</h3>`;
      cardHTML += renderStatRow("Attack", npc.attack, npc.id, "Attack");
      cardHTML += renderStatRow("Defense", npc.defense, npc.id, "Defense");
      cardHTML += renderStatRow("Toughness", npc.toughness, npc.id, "Toughness");
      cardHTML += renderStatRow("Speed", npc.speed, npc.id, "Speed");
      cardHTML += renderStatRow("Fortune", npc.fortune || 0, npc.id, "Fortune");
      cardHTML += renderStatRow("Wound Points", npc.woundPoints, npc.id, "Wound");
      if(npc.weapon){
        const w = npc.weapon;
        cardHTML += `
          <div class="statRow">
            <span>Weapon: <strong>${w.name} (${w.damage}/${w.conceal}/${w.reload})</strong></span>
          </div>`;
      }
      if(!npc.schticks) npc.schticks = [];
      if(npc.schticks.length > 0){
        cardHTML += `<div class="schticksContainer"><strong>Schticks:</strong>`;
        npc.schticks.forEach(s => {
          cardHTML += `<div class="statRow"><em>${s.name}:</em> ${s.description}</div>`;
        });
        cardHTML += `</div>`;
      }
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
function updateAttackDropdowns(){
  playerAttackerSelect.innerHTML = '';
  npcTargetSelect.innerHTML = '';
  npcAttackerSelect.innerHTML = '';
  playerTargetSelect.innerHTML = '';
  pcs.forEach(pc => {
    const option = document.createElement('option');
    option.value = pc.id;
    option.textContent = pc.name;
    playerAttackerSelect.appendChild(option);
  });
  npcs.forEach(npc => {
    if(npc.type !== "mook" || npc.count > 0){
      const option = document.createElement('option');
      option.value = npc.id;
      option.textContent = npc.name;
      npcTargetSelect.appendChild(option);
    }
  });
  npcs.forEach(npc => {
    if(npc.type !== "mook" || npc.count > 0){
      const option = document.createElement('option');
      option.value = npc.id;
      option.textContent = npc.name;
      npcAttackerSelect.appendChild(option);
    }
  });
  pcs.forEach(pc => {
    const option = document.createElement('option');
    option.value = pc.id;
    option.textContent = pc.name;
    playerTargetSelect.appendChild(option);
  });
}

// ------------------- ATTACH LISTENERS -------------------
function attachPcListeners(){
  // Attack
  document.querySelectorAll('.incAttack').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id,10);
      const pc = pcs.find(p => p.id===id);
      if(pc){ pc.attack++; updatePcList(); logEvent(`${pc.name}'s Attack is now ${pc.attack}`);}
    });
  });
  document.querySelectorAll('.decAttack').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id,10);
      const pc = pcs.find(p => p.id===id);
      if(pc){ pc.attack = Math.max(0, pc.attack-1); updatePcList(); logEvent(`${pc.name}'s Attack is now ${pc.attack}`);}
    });
  });
  // Backup Attack
  document.querySelectorAll('.incBackupAttack').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id,10);
      const pc = pcs.find(p => p.id===id);
      if(pc && pc.backupAttack!==undefined){ pc.backupAttack++; updatePcList(); logEvent(`${pc.name}'s Backup Attack is now ${pc.backupAttack}`);}
    });
  });
  document.querySelectorAll('.decBackupAttack').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id,10);
      const pc = pcs.find(p => p.id===id);
      if(pc && pc.backupAttack!==undefined){ pc.backupAttack = Math.max(0, pc.backupAttack-1); updatePcList(); logEvent(`${pc.name}'s Backup Attack is now ${pc.backupAttack}`);}
    });
  });
  // Defense
  document.querySelectorAll('.incDefense').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id,10);
      const pc = pcs.find(p => p.id===id);
      if(pc){ pc.defense++; updatePcList(); logEvent(`${pc.name}'s Defense is now ${pc.defense}`);}
    });
  });
  document.querySelectorAll('.decDefense').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id,10);
      const pc = pcs.find(p => p.id===id);
      if(pc){ pc.defense = Math.max(0, pc.defense-1); updatePcList(); logEvent(`${pc.name}'s Defense is now ${pc.defense}`);}
    });
  });
  // Toughness
  document.querySelectorAll('.incToughness').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id,10);
      const pc = pcs.find(p => p.id===id);
      if(pc){ pc.toughness++; updatePcList(); logEvent(`${pc.name}'s Toughness is now ${pc.toughness}`);}
    });
  });
  document.querySelectorAll('.decToughness').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id,10);
      const pc = pcs.find(p => p.id===id);
      if(pc){ pc.toughness = Math.max(0, pc.toughness-1); updatePcList(); logEvent(`${pc.name}'s Toughness is now ${pc.toughness}`);}
    });
  });
  // Speed
  document.querySelectorAll('.incSpeed').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id,10);
      const pc = pcs.find(p => p.id===id);
      if(pc){ pc.speed++; updatePcList(); logEvent(`${pc.name}'s Speed is now ${pc.speed}`);}
    });
  });
  document.querySelectorAll('.decSpeed').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id,10);
      const pc = pcs.find(p => p.id===id);
      if(pc){ pc.speed = Math.max(0, pc.speed-1); updatePcList(); logEvent(`${pc.name}'s Speed is now ${pc.speed}`);}
    });
  });
  // Fortune
  document.querySelectorAll('.incFortune').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id,10);
      const pc = pcs.find(p => p.id===id);
      if(pc){ pc.fortune++; updatePcList(); logEvent(`${pc.name}'s Fortune is now ${pc.fortune}`);}
    });
  });
  document.querySelectorAll('.decFortune').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id,10);
      const pc = pcs.find(p => p.id===id);
      if(pc){ pc.fortune = Math.max(0, pc.fortune-1); updatePcList(); logEvent(`${pc.name}'s Fortune is now ${pc.fortune}`);}
    });
  });
  // Wound
  document.querySelectorAll('.incWound').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id,10);
      const pc = pcs.find(p => p.id===id);
      if(pc){ pc.woundPoints++; updatePcList(); logEvent(`${pc.name}'s Wound Points are now ${pc.woundPoints}`);}
    });
  });
  document.querySelectorAll('.decWound').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id,10);
      const pc = pcs.find(p => p.id===id);
      if(pc){ pc.woundPoints = Math.max(0, pc.woundPoints-1); updatePcList(); logEvent(`${pc.name}'s Wound Points are now ${pc.woundPoints}`);}
    });
  });
}

function attachNpcListeners(){
  // Attack
  document.querySelectorAll('.incAttack').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id,10);
      const npc = npcs.find(n=>n.id===id);
      if(npc){ npc.attack++; updateNpcList(); logEvent(`${npc.name}'s Attack is now ${npc.attack}`);}
    });
  });
  document.querySelectorAll('.decAttack').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id,10);
      const npc = npcs.find(n=>n.id===id);
      if(npc){ npc.attack = Math.max(0,npc.attack-1); updateNpcList(); logEvent(`${npc.name}'s Attack is now ${npc.attack}`);}
    });
  });
  // Defense
  document.querySelectorAll('.incDefense').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id,10);
      const npc = npcs.find(n=>n.id===id);
      if(npc){ npc.defense++; updateNpcList(); logEvent(`${npc.name}'s Defense is now ${npc.defense}`);}
    });
  });
  document.querySelectorAll('.decDefense').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id,10);
      const npc = npcs.find(n=>n.id===id);
      if(npc){ npc.defense = Math.max(0,npc.defense-1); updateNpcList(); logEvent(`${npc.name}'s Defense is now ${npc.defense}`);}
    });
  });
  // Toughness
  document.querySelectorAll('.incToughness').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id,10);
      const npc = npcs.find(n=>n.id===id);
      if(npc){ npc.toughness++; updateNpcList(); logEvent(`${npc.name}'s Toughness is now ${npc.toughness}`);}
    });
  });
  document.querySelectorAll('.decToughness').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id,10);
      const npc = npcs.find(n=>n.id===id);
      if(npc){ npc.toughness = Math.max(0,npc.toughness-1); updateNpcList(); logEvent(`${npc.name}'s Toughness is now ${npc.toughness}`);}
    });
  });
  // Speed
  document.querySelectorAll('.incSpeed').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id,10);
      const npc = npcs.find(n=>n.id===id);
      if(npc){ npc.speed++; updateNpcList(); logEvent(`${npc.name}'s Speed is now ${npc.speed}`);}
    });
  });
  document.querySelectorAll('.decSpeed').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id,10);
      const npc = npcs.find(n=>n.id===id);
      if(npc){ npc.speed = Math.max(0,npc.speed-1); updateNpcList(); logEvent(`${npc.name}'s Speed is now ${npc.speed}`);}
    });
  });
  // Fortune
  document.querySelectorAll('.incFortune').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id,10);
      const npc = npcs.find(n=>n.id===id);
      if(npc){ npc.fortune = (npc.fortune||0)+1; updateNpcList(); logEvent(`${npc.name}'s Fortune is now ${npc.fortune}`);}
    });
  });
  document.querySelectorAll('.decFortune').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id,10);
      const npc = npcs.find(n=>n.id===id);
      if(npc){ npc.fortune = Math.max(0,(npc.fortune||0)-1); updateNpcList(); logEvent(`${npc.name}'s Fortune is now ${npc.fortune}`);}
    });
  });
  // Wound
  document.querySelectorAll('.incWound').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id,10);
      const npc = npcs.find(n=>n.id===id);
      if(npc && npc.type!=="mook"){ npc.woundPoints++; updateNpcList(); logEvent(`${npc.name}'s Wound Points are now ${npc.woundPoints}`);}
    });
  });
  document.querySelectorAll('.decWound').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id,10);
      const npc = npcs.find(n=>n.id===id);
      if(npc && npc.type!=="mook"){ 
        npc.woundPoints = Math.max(0, npc.woundPoints-1);
        updateNpcList();
        logEvent(`${npc.name}'s Wound Points are now ${npc.woundPoints}`);
      }
    });
  });
  // Mook Count
  document.querySelectorAll('.incMook').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id,10);
      const npc = npcs.find(n=>n.id===id);
      if(npc && npc.type==="mook"){
        npc.count++;
        updateNpcList();
        logEvent(`${npc.name}'s Mook Count is now ${npc.count}`);
      }
    });
  });
  document.querySelectorAll('.decMook').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id,10);
      const npc = npcs.find(n=>n.id===id);
      if(npc && npc.type==="mook"){
        npc.count = Math.max(0, npc.count-1);
        updateNpcList();
        logEvent(`${npc.name}'s Mook Count is now ${npc.count}`);
      }
    });
  });
  // Remove
  document.querySelectorAll('.removeEnemy').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id,10);
      npcs = npcs.filter(n=>n.id!==id);
      updateAttackDropdowns();
      updateNpcList();
      logEvent(`Removed enemy with ID ${id}`);
    });
  });
  // Add Schtick (optional)
  document.querySelectorAll('.addSchtickBtn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentNpcForSchtick = parseInt(btn.dataset.id,10);
      schtickModal.style.display = "block";
    });
  });
}

// ------------------- FOE SCHTICK MODAL (OPTIONAL) -------------------
closeModal.addEventListener('click', () => {
  schtickModal.style.display = "none";
});
window.addEventListener('click', e => {
  if(e.target===schtickModal){
    schtickModal.style.display = "none";
  }
});
addSchtickButton.addEventListener('click', () => {
  const key = schtickSelect.value;
  if(!key || !foeSchticks[key]) {
    alert("Select a valid schtick.");
    return;
  }
  const npc = npcs.find(n=>n.id===currentNpcForSchtick);
  if(!npc){
    alert("No foe found for schtick assignment.");
    return;
  }
  if(!npc.schticks) npc.schticks = [];
  npc.schticks.push(foeSchticks[key]);
  updateNpcList();
  logEvent(`Added schtick "${foeSchticks[key].name}" to ${npc.name}.`);
  schtickModal.style.display = "none";
  currentNpcForSchtick=null;
});

// ------------------- FORM LOGIC: ADD ENEMY -------------------
addEnemyForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = enemyNameInput.value.trim();
  const type = enemyTypeSelect.value;
  let enemy;

  if(type==="mook"){
    const tmplKey = mookTemplateSelect.value;
    if(!tmplKey){
      alert("Select a Mook Template.");
      return;
    }
    const tmpl = mookTemplates[tmplKey];
    enemy = {
      id: getNextNpcId(),
      name,
      type,
      attack: 8,
      defense: 13,
      toughness: 0,
      speed: 5,
      fortune: 0,
      templateDamage: tmpl.templateDamage,
      woundPoints: 0,
      schticks: []
    };
    enemy.count = parseInt(mookCountInput.value,10)||1;
    // If there's a default weapon
    if(tmpl.defaultWeapon && weapons[tmpl.defaultWeapon]){
      enemy.weapon = weapons[tmpl.defaultWeapon];
    }
  } else {
    // featured/boss/uberboss
    const tmplKey = featuredTemplateSelect.value;
    if(!tmplKey){
      alert("Select a Featured Foe Template.");
      return;
    }
    const tmpl = featuredTemplates[tmplKey];
    let baseAttack = tmpl.attack;
    let baseDefense = tmpl.defense;
    let baseToughness = tmpl.toughness;
    let baseSpeed = tmpl.speed;
    if(type==="boss"){
      baseAttack +=3; baseDefense +=2; baseToughness +=2; baseSpeed+=1;
    } else if(type==="uberboss"){
      baseAttack +=5; baseDefense +=4; baseToughness +=3; baseSpeed+=2;
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
      schticks: []
    };
    // default weapon from template
    if(tmpl.defaultWeapon && weapons[tmpl.defaultWeapon]){
      enemy.weapon = weapons[tmpl.defaultWeapon];
    }
    // override with chosen weapon if user selected one
    const wKey = weaponSelect.value;
    if(wKey && weapons[wKey]){
      enemy.weapon = weapons[wKey];
    }
  }

  npcs.push(enemy);
  updateAttackDropdowns();
  updateNpcList();
  addEnemyForm.reset();
  // hide containers
  mookTemplateContainer.style.display="none";
  mookCountContainer.style.display="none";
  featuredTemplateContainer.style.display="none";
  weaponContainer.style.display="none";
  logEvent(`Added enemy: ${name} (${type})`);
});

// Toggle form fields based on type
enemyTypeSelect.addEventListener('change', e => {
  const val = e.target.value;
  if(val==="mook"){
    mookTemplateContainer.style.display="";
    mookCountContainer.style.display="";
    featuredTemplateContainer.style.display="none";
    weaponContainer.style.display="none";
  } else {
    // featured/boss/uberboss
    mookTemplateContainer.style.display="none";
    mookCountContainer.style.display="none";
    featuredTemplateContainer.style.display="";
    weaponContainer.style.display="";
  }
});

// ------------------- FORMS: ATTACK -------------------
playerActionForm.addEventListener('submit', e => {
  e.preventDefault();
  const attackerId = parseInt(playerAttackerSelect.value,10);
  const targetId = parseInt(npcTargetSelect.value,10);
  const attacker = pcs.find(p=>p.id===attackerId);
  const target = npcs.find(n=>n.id===targetId);
  if(!attacker || !target) return;
  
  let rollResult = parseInt(playerRollResultInput.value.replace('!',''),10);
  const mod = parseInt(playerModifierInput.value,10)||0;
  rollResult += mod;
  let smackdown = rollResult - target.defense;
  if(smackdown<0) smackdown=0;
  const weapDmg = parseInt(playerWeaponDamageInput.value,10)||0;
  let damage = smackdown + weapDmg - target.toughness;
  if(damage<0) damage=0;
  
  let msg = `Player Attack: ${attacker.name} rolled ${rollResult} vs. ${target.name} (DEF ${target.defense}) = ${smackdown}. +WDmg(${weapDmg}) -Tgh(${target.toughness})= ${damage}. `;
  
  if(target.type==="mook"){
    if(damage>0){
      target.count--;
      if(target.count<0) target.count=0;
      msg+= `Mook down! count->${target.count}`;
    } else {
      msg+= `No damage. count->${target.count}`;
    }
  } else {
    target.woundPoints += damage;
    msg+= `${target.name} WoundPoints->${target.woundPoints}`;
  }
  logEvent(msg);
  updateNpcList();
  playerActionForm.reset();
  updateAttackDropdowns();
});

// NPC Attack
npcRollDiceButton.addEventListener('click', () => {
  const attackerId = parseInt(npcAttackerSelect.value,10);
  const attacker = npcs.find(n=>n.id===attackerId);
  if(!attacker){
    alert("No attacking NPC selected!");
    return;
  }
  const mod = parseInt(npcModifierInput.value,10)||0;
  const posInit = rollDie();
  const negInit = rollDie();
  const boxcars = (posInit===6 && negInit===6);
  const posTotal = rollExplodingDie(posInit);
  const negTotal = rollExplodingDie(negInit);
  const diceOutcome = posTotal - negTotal;
  
  let baseAttack = attacker.attack;
  // if mook with templateDamage
  if(attacker.type==="mook" && attacker.templateDamage){
    baseAttack += attacker.templateDamage;
  }
  const finalCheck = baseAttack + diceOutcome + mod;
  npcRollResultDiv.dataset.finalCheck = finalCheck;
  
  let resultTxt = `+die=${posTotal}(init ${posInit}), -die=${negTotal}(init ${negInit}) =>${diceOutcome}. FinalCheck=${finalCheck}`;
  if(boxcars) resultTxt+=" (Boxcars!)";
  npcRollResultDiv.innerHTML = resultTxt;
  logEvent(`NPC Roll: +${posTotal}, -${negTotal} =>${diceOutcome}, final=${finalCheck}${boxcars?" (Boxcars!)":""}`);
});
npcActionForm.addEventListener('submit', e => {
  e.preventDefault();
  const attackerId = parseInt(npcAttackerSelect.value,10);
  const targetId = parseInt(playerTargetSelect.value,10);
  const attacker = npcs.find(n=>n.id===attackerId);
  const target = pcs.find(p=>p.id===targetId);
  if(!attacker||!target) return;
  
  let finalCheck = parseInt(npcRollResultDiv.dataset.finalCheck||"0",10);
  if(isNaN(finalCheck)||finalCheck===0){
    alert("Roll dice first!");
    return;
  }
  let smackdown = finalCheck - target.defense;
  if(smackdown<0) smackdown=0;
  
  let weaponDamage=0;
  if(attacker.weapon) weaponDamage=attacker.weapon.damage||0;
  
  let damage = smackdown + weaponDamage - target.toughness;
  if(damage<0) damage=0;
  let msg = `NPC Attack: ${attacker.name}(Final ${finalCheck}) vs. ${target.name}(DEF ${target.defense})=Smack ${smackdown}. +WpnDmg(${weaponDamage}) -Tgh(${target.toughness})= ${damage}. `;
  target.woundPoints += damage;
  msg+=`${target.name} WoundPoints->${target.woundPoints}`;
  
  logEvent(msg);
  updatePcList();
  npcActionForm.reset();
  npcRollResultDiv.textContent="";
  delete npcRollResultDiv.dataset.finalCheck;
  updateAttackDropdowns();
});

// ------------------- DICE HELPERS -------------------
function rollDie(){
  return Math.floor(Math.random()*6)+1;
}
function rollExplodingDie(init){
  let total=init;
  while(init===6){
    init=rollDie();
    total+=init;
  }
  return total;
}

// ------------------- EXPORT/IMPORT -------------------
exportButton.addEventListener('click',()=>{
  const data={pcs,npcs};
  const str=JSON.stringify(data);
  const blob=new Blob([str],{type:"application/json"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download="combatData.json";
  a.click();
  URL.revokeObjectURL(url);
  logEvent("Exported data.");
});
importButton.addEventListener('click',()=>{
  importFileInput.click();
});
importFileInput.addEventListener('change',(e)=>{
  const file=e.target.files[0];
  if(!file)return;
  const reader=new FileReader();
  reader.onload=function(evt){
    try{
      const d=JSON.parse(evt.target.result);
      npcs=d.npcs||[];
      updateAttackDropdowns();
      updatePcList();
      updateNpcList();
      logEvent("Imported data OK.");
    }catch(err){
      alert("Import fail: "+err);
    }
  };
  reader.readAsText(file);
});

// ------------------- INIT -------------------
function init(){
  populateFeaturedTemplateDropdown();
  populateMookTemplateDropdown();
  populateWeaponDropdown();
  populateSchtickDropdown();
  updatePcList();
  updateAttackDropdowns();
  updateNpcList();
}
init();

// Show/hide fields
enemyTypeSelect.addEventListener('change',(e)=>{
  const val=e.target.value;
  if(val==="mook"){
    mookTemplateContainer.style.display="";
    mookCountContainer.style.display="";
    featuredTemplateContainer.style.display="none";
    weaponContainer.style.display="none";
  } else {
    mookTemplateContainer.style.display="none";
    mookCountContainer.style.display="none";
    featuredTemplateContainer.style.display="";
    weaponContainer.style.display="";
  }
});

// Close modal if user clicks outside or hits close
closeModal.addEventListener('click',()=>{
  schtickModal.style.display="none";
});
window.addEventListener('click',(ev)=>{
  if(ev.target===schtickModal){
    schtickModal.style.display="none";
  }
});
addSchtickButton.addEventListener('click',()=>{
  const key=schtickSelect.value;
  if(!key||!foeSchticks[key]){
    alert("Select valid schtick.");
    return;
  }
  const npc=npcs.find(n=>n.id===currentNpcForSchtick);
  if(!npc){
    alert("No foe for schtick assignment.");
    return;
  }
  if(!npc.schticks) npc.schticks=[];
  npc.schticks.push(foeSchticks[key]);
  updateNpcList();
  logEvent(`Added schtick "${foeSchticks[key].name}" to ${npc.name}.`);
  schtickModal.style.display="none";
  currentNpcForSchtick=null;
});

// ------------------- LOG HELPER -------------------
function logEvent(msg){
  const li=document.createElement('li');
  li.textContent=msg;
  logList.appendChild(li);
}
