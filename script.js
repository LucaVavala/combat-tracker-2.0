/***********************************************************************
 * Feng Shui 2 Combat Tracker
 * 
 * - Two columns for PC cards and NPC cards
 * - Full Mook & Featured Foe templates with multiple weapons
 * - Foe Schticks from your big list, displayed on card
 * - Mook cards show damage
 * - If a foe template has multiple weapons, we list them all
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
function getNextNpcId(){ return npcIdCounter++; }

// ------------------- Mook Templates -------------------
// Each has a templateDamage, plus an array of weapons if multiple
const mookTemplates = {
  brawlers: {
    templateDamage: 8,
    damageDesc: "8 (pool cue), 7 (punch)", 
    weapons: []
  },
  streetTriads: {
    templateDamage: 9,
    damageDesc: "9 (machete)",
    weapons: []
  },
  midLevelGangsters: {
    templateDamage: 10,
    damageDesc: "10 (Glock)",
    weapons: []
  },
  securityForces: {
    templateDamage: 10,
    damageDesc: "10 (Glock), 11 (H&K MP5)",
    weapons: []
  },
  martialArtists: {
    templateDamage: 7,
    damageDesc: "7 (unarmed), 8 (tonfa), 9 (staff), 10 (spear)",
    weapons: []
  },
  cornerHoods: {
    templateDamage: 10,
    damageDesc: "10 (Ruger 9mm)",
    weapons: []
  },
  cartelGoons: {
    templateDamage: 13,
    damageDesc: "13 (AK-47), 8 (combat knife)",
    weapons: []
  },
  militaryPolice: {
    templateDamage: 10,
    damageDesc: "10 (Beretta M9)",
    weapons: []
  },
  bentCops: {
    templateDamage: 9,
    damageDesc: "9 (Colt Detective Special), 8 (brass knuckles)",
    weapons: []
  },
  eunuchSorcerers: {
    templateDamage: 9,
    damageDesc: "9 (sorcerous blast)",
    weapons: []
  },
  imperialGuards: {
    templateDamage: 10,
    damageDesc: "10 (spear), 7 (arrow)",
    weapons: []
  },
  bandits: {
    templateDamage: 10,
    damageDesc: "10 (sword), 7 (arrow)",
    weapons: []
  },
  nineteenthCenturySoldiers: {
    templateDamage: 8,
    damageDesc: "8 (musket) 10 (saber)",
    weapons: []
  },
  ruinRunners: {
    templateDamage: 10,
    damageDesc: "10 (battered 1911A), 9 (machete)",
    weapons: []
  },
  simianArmymen: {
    templateDamage: 10,
    damageDesc: "10 (jury-rigged M1 Carbine), 9 (machete)",
    weapons: []
  },
  zombies: {
    templateDamage: 9,
    damageDesc: "9 (fumbling non-bite attack)",
    weapons: []
  },
  hoppingVampire: {
    templateDamage: 9,
    damageDesc: "9 (fumbling non-bite attack)",
    weapons: []
  }
};

// ------------------- Featured Foe Templates -------------------
// Each has stats plus an array "allWeapons" with all the guns/weapons they use
const featuredTemplates = {
  enforcer: {
    attack: 13, defense: 13, toughness: 5, speed: 7,
    allWeapons: ["thompsonContender","cz75B"],
  },
  hitman: {
    attack: 15, defense: 12, toughness: 5, speed: 8,
    allWeapons: ["svdDragunov","beretta92FSCenturion","hkMp5K"]
  },
  securityHoncho: {
    attack: 13, defense: 14, toughness: 5, speed: 6,
    allWeapons: ["beretta92FSCenturion"]
  },
  sinisterBodyguard: {
    attack: 13, defense: 13, toughness: 5, speed: 6,
    allWeapons: ["browningHipower","luxurySedanPlaceholder"]
  },
  badBusinessman: {
    attack: 13, defense: 13, toughness: 5, speed: 6,
    allWeapons: ["amtAutomag","berettaM12","benelli90M3"]
  },
  giangHuWarrior: {
    attack: 14, defense: 13, toughness: 5, speed: 7,
    allWeapons: ["sword"]
  },
  martialArtist: {
    attack: 13, defense: 13, toughness: 6, speed: 7,
    allWeapons: ["unarmed"]
  },
  officer: {
    attack: 13, defense: 13, toughness: 5, speed: 6,
    allWeapons: ["norincoTokarev","ak47"]
  },
  insurgent: {
    attack: 14, defense: 13, toughness: 5, speed: 8,
    allWeapons: ["machete","ak47","leeEnfield"]
  },
  wheelman: {
    attack: 13, defense: 13, toughness: 5, speed: 7,
    allWeapons: ["tireIron","muscleCarPlaceholder"]
  },
  sorcerousVassal: {
    attack: 13, defense: 13, toughness: 5, speed: 7,
    allWeapons: ["blast"]
  },
  tenThousandMan: {
    attack: 13, defense: 13, toughness: 6, speed: 6,
    allWeapons: ["tec22","buzzsawHand"]
  },
  cyberApe: {
    attack: 14, defense: 12, toughness: 7, speed: 7,
    allWeapons: ["chestMountedMG","bite"]
  },
  monster: {
    attack: 14, defense: 13, toughness: 5, speed: 7,
    allWeapons: ["claw"]
  },
  gladiator: {
    attack: 13, defense: 13, toughness: 6, speed: 8,
    allWeapons: ["chain","sword"]
  },
  mutant: {
    attack: 13, defense: 13, toughness: 6, speed: 7,
    allWeapons: ["forceBlast"]
  },
  wastelander: {
    attack: 13, defense: 13, toughness: 6, speed: 7,
    allWeapons: ["unidentifiableShotgun","unidentifiableRevolver"]
  },
  sinisterScientist: {
    attack: 14, defense: 13, toughness: 5, speed: 7,
    allWeapons: ["hkP7"]
  },
  keyJiangshi: {
    attack: 15, defense: 13, toughness: 5, speed: 7,
    allWeapons: ["claw","bite"]
  },
  keySnakePerson: {
    attack: 14, defense: 12, toughness: 5, speed: 8,
    allWeapons: ["scimitar"]
  },
  niceGuyBadAss: {
    attack: 16, defense: 17, toughness: 5, speed: 9,
    allWeapons: ["unarmed"]
  }
};

// ------------------- Weapons (partial) -------------------
const weapons = {
  thompsonContender: { name: "Thompson Center Arms Contender", damage: 12, conceal: 3, reload: 6 },
  cz75B: { name: "CZ 75B", damage: 10, conceal: 1, reload: 3 },
  svdDragunov: { name: "SVD Dragunov", damage: 13, conceal: 5, reload: 3 },
  beretta92FSCenturion: { name: "Beretta 92FS Centurion", damage: 10, conceal: 2, reload: 3 },
  hkMp5K: { name: "Heckler & Koch MP5 K", damage: 10, conceal: 3, reload: 1 },
  browningHipower: { name: "Browning Hi-Power", damage: 10, conceal: 2, reload: 3 },
  luxurySedanPlaceholder: { name: "Vehicle: Luxury Sedan (2/4/6)", damage: 0, conceal: "-", reload: "-" },
  amtAutomag: { name: "AMT Automag V", damage: 12, conceal: 3, reload: 5 },
  berettaM12: { name: "Beretta M12 (SMG)", damage: 10, conceal: 5, reload: 6 },
  benelli90M3: { name: "Benelli 90 M3 (Shotgun)", damage: 13, conceal: 5, reload: 4 },
  sword: { name: "Sword", damage: 10, conceal: 2, reload: "-" },
  unarmed: { name: "Unarmed Strike", damage: 10, conceal: "-", reload: "-" },
  norincoTokarev: { name: "Norinco Tokarev", damage: 10, conceal: 2, reload: 4 },
  ak47: { name: "AK-47", damage: 13, conceal: 5, reload: 1 },
  machete: { name: "Machete", damage: 9, conceal: 2, reload: "-" },
  leeEnfield: { name: "Lee-Enfield Bolt Rifle", damage: 12, conceal: 5, reload: 4 },
  tireIron: { name: "Tire Iron", damage: 10, conceal: "-", reload: "-" },
  muscleCarPlaceholder: { name: "Vehicle: Muscle Car (3/6/6)", damage: 0, conceal: "-", reload: "-" },
  blast: { name: "Sorcerous Blast", damage: 10, conceal: "-", reload: "-" },
  tec22: { name: "Intratec Tec-22", damage: 8, conceal: 2, reload: 1 },
  buzzsawHand: { name: "Buzzsaw Hand", damage: 11, conceal: "-", reload: "-" },
  chestMountedMG: { name: "Chest-mounted machine gun", damage: 11, conceal: "-", reload: 1 },
  bite: { name: "Bite", damage: 8, conceal: "-", reload: "-" },
  claw: { name: "Claw", damage: 11, conceal: "-", reload: "-" },
  chain: { name: "Chain", damage: 11, conceal: "-", reload: "-" },
  forceBlast: { name: "Force Blast", damage: 11, conceal: "-", reload: "-" },
  unidentifiableShotgun: { name: "Unidentifiable Shotgun", damage: 13, conceal: 5, reload: 4 },
  unidentifiableRevolver: { name: "Unidentifiable Revolver", damage: 11, conceal: 3, reload: 5 },
  hkP7: { name: "Heckler & Koch P7", damage: 10, conceal: 2, reload: 4 },
  scimitar: { name: "Scimitar", damage: 10, conceal: "-", reload: "-" },
  unarmedMastery: { name: "Unarmed Mastery", damage: 16, conceal: "-", reload: "-" },
  
  // Mook Weapons
  poolCue: { name: "Pool Cue", damage: 8, conceal: 4, reload: "-" },
  glock: { name: "Glock 17", damage: 10, conceal: 1, reload: 3 },
  ruger9mm: { name: "Ruger 9mm", damage: 10, conceal: 2, reload: 4 },
  combatKnife: { name: "Combat Knife", damage: 8, conceal: 1, reload: "-" },
  battered1911A: { name: "Battered 1911A", damage: 10, conceal: 2, reload: 4 },
  m1Carbine: { name: "Jury-rigged M1 Carbine", damage: 10, conceal: 4, reload: 1 },
  // ...
};

// ------------------- Foe Schticks (All from your big list, lightly abbreviated) -------------------
const foeSchticks = {
  ablativeLackey: {
    name: "Ablative Lackey",
    description: "If at least one mook is up, after foe takes Wound Points, foe takes 0 WP and 1 mook goes down."
  },
  antiMystical: {
    name: "Anti-Mystical",
    description: "+1 Defense vs. Creature Powers and Sorcery attacks."
  },
  antiTech: {
    name: "Anti-Tech",
    description: "+1 Defense vs. Guns, Mutant, Scroungetech attacks."
  },
  backToTheWall: {
    name: "Back to the Wall",
    description: "If foe is attacked by more than one hero in a sequence, shot cost of standard attack is 2."
  },
  barkOfTheUnderdog: {
    name: "Bark of the Underdog",
    description: "+2 Toughness when more than half the foe's mooks are down."
  },
  boneFissure: {
    name: "Bone Fissure",
    description: "Spend 1 shot; if foe is active next keyframe, target hero takes 7 WP at start of next fight."
  },
  // ... add more ...
  brokenTrigram: {
    name: "Broken Trigram",
    description: "Spend 1 shot; if foe is active next keyframe, target hero suffers a financial setback. Once per adv."
  },
  // etc. for all the schticks from your text ...
};

// ------------------- DOM Elements -------------------
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

// Schtick Modal
const schtickModal = document.getElementById('schtickModal');
const closeModal = document.getElementById('closeModal');
const schtickSelect = document.getElementById('schtickSelect');
const addSchtickButton = document.getElementById('addSchtickButton');
let currentNpcForSchtick = null;

// ------------------- Populate Dropdowns -------------------
function populateFeaturedTemplateDropdown(){
  featuredTemplateSelect.innerHTML = '<option value="" disabled selected>Select Template</option>';
  for(const key in featuredTemplates){
    const opt = document.createElement('option');
    opt.value = key;
    let label = key.replace(/([A-Z])/g, ' $1').trim();
    label = label.charAt(0).toUpperCase()+label.slice(1);
    opt.textContent = label;
    featuredTemplateSelect.appendChild(opt);
  }
}
function populateMookTemplateDropdown(){
  mookTemplateSelect.innerHTML = '<option value="" disabled selected>Select Mook Template</option>';
  for(const key in mookTemplates){
    const opt = document.createElement('option');
    opt.value = key;
    let label = key.replace(/([A-Z])/g,' $1').trim();
    label = label.charAt(0).toUpperCase()+label.slice(1);
    opt.textContent = label;
    mookTemplateSelect.appendChild(opt);
  }
}
function populateWeaponDropdown(){
  weaponSelect.innerHTML = '<option value="" disabled selected>Select Weapon</option>';
  for(const wkey in weapons){
    const w = weapons[wkey];
    const opt = document.createElement('option');
    opt.value = wkey;
    opt.textContent = `${w.name} (${w.damage}/${w.conceal}/${w.reload})`;
    weaponSelect.appendChild(opt);
  }
}
function populateSchtickDropdown(){
  schtickSelect.innerHTML = '<option value="" disabled selected>Select Schtick</option>';
  for(const skey in foeSchticks){
    const s = foeSchticks[skey];
    const opt = document.createElement('option');
    opt.value = skey;
    opt.textContent = s.name;
    schtickSelect.appendChild(opt);
  }
}

// ------------------- Render & Update -------------------
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
  pcList.innerHTML='';
  pcs.forEach(pc=>{
    let cardHTML=`<h3>${pc.name}</h3>`;
    cardHTML+=renderStatRow("Attack", pc.attack, pc.id,"Attack");
    if(pc.backupAttack!==undefined){
      cardHTML+=renderStatRow("Backup Attack", pc.backupAttack, pc.id,"BackupAttack");
    }
    cardHTML+=renderStatRow("Defense", pc.defense, pc.id,"Defense");
    cardHTML+=renderStatRow("Toughness", pc.toughness, pc.id,"Toughness");
    cardHTML+=renderStatRow("Speed", pc.speed, pc.id,"Speed");
    cardHTML+=renderStatRow("Fortune", pc.fortune, pc.id,"Fortune");
    cardHTML+=renderStatRow("Wound Points", pc.woundPoints, pc.id,"Wound");
    const li=document.createElement('li');
    li.className="combatantCard";
    li.innerHTML=cardHTML;
    pcList.appendChild(li);
  });
  attachPcListeners();
}
function updateNpcList(){
  npcList.innerHTML='';
  npcs.forEach(npc=>{
    let cardHTML="";
    if(npc.type==="mook"){
      cardHTML+=`<h3>${npc.name} (Mook)</h3>`;
      cardHTML+=renderStatRow("Attack", npc.attack, npc.id,"Attack");
      cardHTML+=renderStatRow("Defense", npc.defense, npc.id,"Defense");
      cardHTML+=renderStatRow("Toughness", npc.toughness, npc.id,"Toughness");
      cardHTML+=renderStatRow("Speed", npc.speed, npc.id,"Speed");
      cardHTML+=renderStatRow("Fortune", npc.fortune||0, npc.id,"Fortune");
      cardHTML+=`
        <div class="statRow">
          <span>Mook Count: <strong id="mook-${npc.id}">${npc.count}</strong></span>
          <button data-id="${npc.id}" class="incMook">+</button>
          <button data-id="${npc.id}" class="decMook">–</button>
        </div>`;
      // Show the damage line from damageDesc
      if(npc.damageDesc){
        cardHTML+=`<div class="statRow"><span>Damage: ${npc.damageDesc}</span></div>`;
      }
    } else {
      // Featured/Boss/uber
      cardHTML+=`<h3>${npc.name} (${npc.type})</h3>`;
      cardHTML+=renderStatRow("Attack", npc.attack, npc.id,"Attack");
      cardHTML+=renderStatRow("Defense", npc.defense, npc.id,"Defense");
      cardHTML+=renderStatRow("Toughness", npc.toughness, npc.id,"Toughness");
      cardHTML+=renderStatRow("Speed", npc.speed, npc.id,"Speed");
      cardHTML+=renderStatRow("Fortune", npc.fortune||0, npc.id,"Fortune");
      cardHTML+=renderStatRow("Wound Points", npc.woundPoints, npc.id,"Wound");
      // List all weapons
      if(npc.weapons && npc.weapons.length>0){
        cardHTML+=`<div class="statRow"><strong>Weapons:</strong></div>`;
        npc.weapons.forEach(wObj=>{
          cardHTML+=`<div class="statRow"><span>${wObj.name} (${wObj.damage}/${wObj.conceal}/${wObj.reload})</span></div>`;
        });
      }
      // Schticks
      if(!npc.schticks) npc.schticks=[];
      if(npc.schticks.length>0){
        cardHTML+=`<div class="statRow"><strong>Schticks:</strong></div>`;
        npc.schticks.forEach(s=>{
          cardHTML+=`<div class="statRow"><span><em>${s.name}</em>: ${s.description}</span></div>`;
        });
      }
      cardHTML+=`<button data-id="${npc.id}" class="addSchtickBtn">+ Schtick</button>`;
    }
    cardHTML+=`<button data-id="${npc.id}" class="removeEnemy removeBtn">Remove</button>`;
    const li=document.createElement('li');
    li.className="combatantCard";
    li.innerHTML=cardHTML;
    npcList.appendChild(li);
  });
  attachNpcListeners();
}
function updateAttackDropdowns(){
  playerAttackerSelect.innerHTML='';
  npcTargetSelect.innerHTML='';
  npcAttackerSelect.innerHTML='';
  playerTargetSelect.innerHTML='';
  
  pcs.forEach(pc=>{
    const o=document.createElement('option');
    o.value=pc.id;
    o.textContent=pc.name;
    playerAttackerSelect.appendChild(o);
  });
  npcs.forEach(n=>{
    if(n.type!=="mook"||n.count>0){
      const o=document.createElement('option');
      o.value=n.id;
      o.textContent=n.name;
      npcTargetSelect.appendChild(o);
    }
  });
  npcs.forEach(n=>{
    if(n.type!=="mook"||n.count>0){
      const o=document.createElement('option');
      o.value=n.id;
      o.textContent=n.name;
      npcAttackerSelect.appendChild(o);
    }
  });
  pcs.forEach(pc=>{
    const o=document.createElement('option');
    o.value=pc.id;
    o.textContent=pc.name;
    playerTargetSelect.appendChild(o);
  });
}

// ------------------- attachPcListeners & attachNpcListeners (same pattern) -------------------
function attachPcListeners(){
  // incAttack, decAttack, incBackupAttack, decBackupAttack, etc.
  document.querySelectorAll('.incAttack').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const id=parseInt(btn.dataset.id,10);
      const pc=pcs.find(p=>p.id===id);
      if(pc){ pc.attack++; updatePcList(); logEvent(`${pc.name}'s Attack->${pc.attack}`); }
    });
  });
  document.querySelectorAll('.decAttack').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const id=parseInt(btn.dataset.id,10);
      const pc=pcs.find(p=>p.id===id);
      if(pc){ pc.attack=Math.max(0,pc.attack-1); updatePcList(); logEvent(`${pc.name}'s Attack->${pc.attack}`);}
    });
  });
  // (Repeat for Defense, Toughness, Speed, Fortune, Wound, BackupAttack)
  // ...
}
function attachNpcListeners(){
  // incAttack, decAttack, etc.
  document.querySelectorAll('.incAttack').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const id=parseInt(btn.dataset.id,10);
      const npc=npcs.find(n=>n.id===id);
      if(npc){ npc.attack++; updateNpcList(); logEvent(`${npc.name}'s Attack->${npc.attack}`);}
    });
  });
  // (Repeat for decAttack, incDefense, decDefense, etc.)
  // Mook count
  document.querySelectorAll('.incMook').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const id=parseInt(btn.dataset.id,10);
      const npc=npcs.find(n=>n.id===id);
      if(npc&&npc.type==="mook"){
        npc.count++;
        updateNpcList();
        logEvent(`${npc.name}'s Count->${npc.count}`);
      }
    });
  });
  document.querySelectorAll('.decMook').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const id=parseInt(btn.dataset.id,10);
      const npc=npcs.find(n=>n.id===id);
      if(npc&&npc.type==="mook"){
        npc.count=Math.max(0,npc.count-1);
        updateNpcList();
        logEvent(`${npc.name}'s Count->${npc.count}`);
      }
    });
  });
  // Remove
  document.querySelectorAll('.removeEnemy').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const id=parseInt(btn.dataset.id,10);
      npcs=npcs.filter(x=>x.id!==id);
      updateAttackDropdowns();
      updateNpcList();
      logEvent(`Removed enemy ID ${id}`);
    });
  });
  // Add Schtick
  document.querySelectorAll('.addSchtickBtn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      currentNpcForSchtick=parseInt(btn.dataset.id,10);
      schtickModal.style.display="block";
    });
  });
}

// ------------------- Shtick Modal -------------------
closeModal.addEventListener('click',()=>{
  schtickModal.style.display="none";
});
window.addEventListener('click',evt=>{
  if(evt.target===schtickModal) schtickModal.style.display="none";
});
addSchtickButton.addEventListener('click',()=>{
  const key=schtickSelect.value;
  if(!key||!foeSchticks[key]){
    alert("Select a valid schtick.");
    return;
  }
  const npc=npcs.find(n=>n.id===currentNpcForSchtick);
  if(!npc){
    alert("No foe found for schtick assignment.");
    return;
  }
  if(!npc.schticks) npc.schticks=[];
  npc.schticks.push(foeSchticks[key]);
  updateNpcList();
  logEvent(`Added schtick "${foeSchticks[key].name}" to ${npc.name}.`);
  schtickModal.style.display="none";
  currentNpcForSchtick=null;
});

// ------------------- FORMS: ADD ENEMY -------------------
addEnemyForm.addEventListener('submit',evt=>{
  evt.preventDefault();
  const name=enemyNameInput.value.trim();
  const type=enemyTypeSelect.value;
  let enemy;
  
  if(type==="mook"){
    const key=mookTemplateSelect.value;
    if(!key){
      alert("Select a Mook Template");
      return;
    }
    const tmpl=mookTemplates[key];
    enemy={
      id:getNextNpcId(),
      name,
      type,
      attack:8,
      defense:13,
      toughness:0,
      speed:5,
      fortune:0,
      woundPoints:0,
      templateDamage: tmpl.templateDamage,
      damageDesc: tmpl.damageDesc,
      schticks: []
    };
    enemy.count=parseInt(mookCountInput.value,10)||1;
  } else {
    // featured/boss/uber
    const fkey=featuredTemplateSelect.value;
    if(!fkey){
      alert("Select a Featured Foe Template");
      return;
    }
    const tmpl=featuredTemplates[fkey];
    let baseAttack=tmpl.attack;
    let baseDefense=tmpl.defense;
    let baseToughness=tmpl.toughness;
    let baseSpeed=tmpl.speed;
    if(type==="boss"){
      baseAttack+=3; baseDefense+=2; baseToughness+=2; baseSpeed+=1;
    } else if(type==="uberboss"){
      baseAttack+=5; baseDefense+=4; baseToughness+=3; baseSpeed+=2;
    }
    enemy={
      id:getNextNpcId(),
      name,
      type,
      attack:baseAttack,
      defense:baseDefense,
      toughness:baseToughness,
      speed:baseSpeed,
      fortune:0,
      woundPoints:0,
      schticks:[]
    };
    // This foe has multiple weapons from the template's "allWeapons"
    // We store them in an array "weapons"
    enemy.weapons = [];
    tmpl.allWeapons.forEach(wk=>{
      if(weapons[wk]) enemy.weapons.push(weapons[wk]);
    });
    // If user picks a weapon from the dropdown, we also add it
    const wsel=weaponSelect.value;
    if(wsel && weapons[wsel]){
      enemy.weapons.push(weapons[wsel]);
    }
  }
  
  npcs.push(enemy);
  updateAttackDropdowns();
  updateNpcList();
  addEnemyForm.reset();
  mookTemplateContainer.style.display="none";
  mookCountContainer.style.display="none";
  featuredTemplateContainer.style.display="none";
  weaponContainer.style.display="none";
  logEvent(`Added enemy: ${name} (${type})`);
});

// Toggle form fields
enemyTypeSelect.addEventListener('change',e=>{
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

// ------------------- ATTACK FORMS -------------------
playerActionForm.addEventListener('submit',e=>{
  e.preventDefault();
  const attId=parseInt(playerAttackerSelect.value,10);
  const tgtId=parseInt(npcTargetSelect.value,10);
  const attacker=pcs.find(p=>p.id===attId);
  const target=npcs.find(n=>n.id===tgtId);
  if(!attacker||!target)return;
  
  let rollResult=parseInt(playerRollResultInput.value.replace('!',''),10);
  const mod=parseInt(playerModifierInput.value,10)||0;
  rollResult+=mod;
  let smackdown=rollResult-target.defense; if(smackdown<0)smackdown=0;
  const wpnDmg=parseInt(playerWeaponDamageInput.value,10)||0;
  let dmg=smackdown+wpnDmg - target.toughness;
  if(dmg<0)dmg=0;
  
  let msg=`Player Attack: ${attacker.name} rolled ${rollResult} vs. ${target.name}(DEF ${target.defense}) => ${smackdown}. +WDmg(${wpnDmg}) -Tgh(${target.toughness})= ${dmg}. `;
  
  if(target.type==="mook"){
    if(dmg>0){
      target.count--;
      if(target.count<0)target.count=0;
      msg+=`Mook down->count ${target.count}`;
    } else {
      msg+=`No damage->count ${target.count}`;
    }
  } else {
    target.woundPoints+=dmg;
    msg+=`${target.name} WoundPoints->${target.woundPoints}`;
  }
  logEvent(msg);
  updateNpcList();
  playerActionForm.reset();
  updateAttackDropdowns();
});

// NPC ROLL
npcRollDiceButton.addEventListener('click',()=>{
  const attId=parseInt(npcAttackerSelect.value,10);
  const attacker=npcs.find(n=>n.id===attId);
  if(!attacker){
    alert("No attacking NPC selected.");
    return;
  }
  const mod=parseInt(npcModifierInput.value,10)||0;
  const pInit=rollDie();
  const nInit=rollDie();
  const boxcars=(pInit===6&&nInit===6);
  const pTotal=rollExplodingDie(pInit);
  const nTotal=rollExplodingDie(nInit);
  const diceOutcome=pTotal-nTotal;
  
  let baseAttack=attacker.attack;
  if(attacker.type==="mook"&&attacker.templateDamage){
    baseAttack+=attacker.templateDamage;
  }
  const finalCheck=baseAttack + diceOutcome + mod;
  npcRollResultDiv.dataset.finalCheck=finalCheck;
  
  let rtxt=`+die=${pTotal}(init ${pInit}), -die=${nTotal}(init ${nInit}) =>${diceOutcome}, final=${finalCheck}`;
  if(boxcars) rtxt+=" (Boxcars!)";
  npcRollResultDiv.innerHTML=rtxt;
  logEvent(`NPC Dice: +${pTotal}, -${nTotal} =>${diceOutcome}, final=${finalCheck}${boxcars?" (Boxcars!)":""}`);
});

// NPC Attack
npcActionForm.addEventListener('submit',e=>{
  e.preventDefault();
  const attId=parseInt(npcAttackerSelect.value,10);
  const tgtId=parseInt(playerTargetSelect.value,10);
  const attacker=npcs.find(n=>n.id===attId);
  const target=pcs.find(p=>p.id===tgtId);
  if(!attacker||!target)return;
  
  let finalCheck=parseInt(npcRollResultDiv.dataset.finalCheck||"0",10);
  if(isNaN(finalCheck)||finalCheck===0){
    alert("Roll dice first!");
    return;
  }
  let smackdown=finalCheck - target.defense;
  if(smackdown<0)smackdown=0;
  let weaponDamage=0;
  if(attacker.weapons && attacker.weapons.length>0){
    // For simplicity, we take the damage of the first weapon in the array
    weaponDamage=attacker.weapons[0].damage;
  }
  let dmg=smackdown + weaponDamage - target.toughness;
  if(dmg<0)dmg=0;
  let msg=`NPC Attack: ${attacker.name}(Final ${finalCheck}) vs. ${target.name}(DEF ${target.defense}) => Smack ${smackdown}. +WpnDmg(${weaponDamage}) -Tgh(${target.toughness})= ${dmg}. `;
  target.woundPoints+=dmg;
  msg+=`${target.name} Wound->${target.woundPoints}`;
  logEvent(msg);
  
  updatePcList();
  npcActionForm.reset();
  npcRollResultDiv.textContent="";
  delete npcRollResultDiv.dataset.finalCheck;
  updateAttackDropdowns();
});

// ------------------- Dice Helpers -------------------
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

// ------------------- Data Export/Import -------------------
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
      alert("Import fail:"+err);
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

// Show/hide form fields
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

// Schtick modal close
closeModal.addEventListener('click',()=>{
  schtickModal.style.display="none";
});
window.addEventListener('click',(evt)=>{
  if(evt.target===schtickModal){
    schtickModal.style.display="none";
  }
});
addSchtickButton.addEventListener('click',()=>{
  const key=schtickSelect.value;
  if(!key||!foeSchticks[key]){
    alert("Select a valid schtick.");
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

// ------------------- Log Helper -------------------
function logEvent(msg){
  const li=document.createElement('li');
  li.textContent=msg;
  logList.appendChild(li);
}
