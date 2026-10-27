'use strict';
(function(){
const $=id=>document.getElementById(id);
// ================= BALANCE / DATA =================
const BAL={raidTime:240,boardWindow:60,R:0.35,half:34,secureN:[0,1,2],insurance:0.25,randomBonus:0.1};
const RAR=[{n:'普通',c:0xd8d8d8,t:0.5},{n:'優良',c:0x4fd16a,t:0.9},{n:'稀有',c:0x4aa3ff,t:1.3},{n:'史詩',c:0xb46cff,t:1.9},{n:'傳說',c:0xff9a1f,t:2.6}];
const RCSS=['#d8d8d8','#4fd16a','#4aa3ff','#b46cff','#ff9a1f'];
const ITEMS=[
 [0,'🧦','單隻襪子',3],[0,'🥫','過期罐頭',8],[0,'📰','舊報紙',2],[0,'🔋','三號電池',12],[0,'🧻','衛生紙半捲',6],[0,'🍜','泡麵',10],
 [1,'🧴','洗髮精',45],[1,'🔦','手電筒',60],[1,'🥤','珍奶(冰)',55],[1,'🩹','急救包',80],[1,'🧰','工具箱',95],
 [2,'📱','舊手機',320],[2,'⌚','電子錶',260],[2,'🎧','耳機',380],[2,'💊','高級止痛藥',290],
 [3,'💻','筆電',1500],[3,'📷','相機',1200],[3,'🎮','遊戲主機',1800],[3,'🥃','陳年威士忌',1300],
 [4,'🪙','金條',8800],[4,'💎','鑽石戒指',12000],[4,'📀','神秘硬碟',9500],[4,'🧻','傳說衛生紙',7777]];
const POOLS={
 low:[0.55,0.28,0.12,0.04,0.01], mid:[0.4,0.3,0.18,0.09,0.03], high:[0.1,0.2,0.3,0.25,0.15], top:[0,0.1,0.3,0.35,0.25], corpse:[0.3,0.3,0.25,0.12,0.03]};
// container kinds: label, size, color, style, pool, n range
const CK={
 box:{l:'紙箱',w:0.9,h:0.7,d:0.9,c:0xb08a5a,s:'box',p:'low',n:[3,6]},
 fridge:{l:'冰箱',w:0.9,h:1.9,d:0.8,c:0xeef2f4,s:'fridge',p:'low',n:[3,7]},
 wardrobe:{l:'衣櫃',w:1.5,h:2.1,d:0.65,c:0x7a4f2c,s:'wardrobe',p:'mid',n:[3,8]},
 safe:{l:'床頭保險箱',w:0.6,h:0.6,d:0.6,c:0x4a4f55,s:'safe',p:'high',n:[3,4]},
 shelf:{l:'貨架',w:3.2,h:1.7,d:0.7,c:0xd0d4d8,s:'shelf',p:'low',n:[4,8],reach:2.4},
 cooler:{l:'冷藏櫃',w:1.6,h:1.9,d:0.8,c:0xbfe3f2,s:'fridge',p:'low',n:[3,7]},
 register:{l:'收銀機',w:1.2,h:1.0,d:0.7,c:0x30343a,s:'safe',p:'mid',n:[2,4]},
 desk:{l:'辦公桌抽屜',w:1.5,h:0.75,d:0.8,c:0x8c7a62,s:'plain',p:'low',n:[3,6]},
 filing:{l:'檔案櫃',w:0.6,h:1.4,d:0.7,c:0x7b828a,s:'wardrobe',p:'mid',n:[3,6]},
 bossafe:{l:'老闆保險箱',w:0.9,h:1.2,d:0.8,c:0x2e3238,s:'safe',p:'top',n:[3,5]},
 ammo:{l:'彈藥箱',w:1.0,h:0.55,d:0.6,c:0x4d5a32,s:'box',p:'low',n:[3,6]},
 weapon:{l:'武器箱',w:1.8,h:0.6,d:0.7,c:0x3d4a2a,s:'box',p:'mid',n:[3,6]},
 milsafe:{l:'軍用保險櫃',w:1.0,h:1.4,d:0.8,c:0x3a4030,s:'safe',p:'top',n:[3,5]},
 cargo:{l:'走私貨櫃',w:2.4,h:2.6,d:6,c:0xa33b2b,s:'cargo',p:'mid',n:[4,8],reach:3.6},
 smug:{l:'走私箱',w:1.0,h:0.8,d:1.0,c:0x5a4630,s:'box',p:'mid',n:[3,6]},
 captain:{l:'船長保險箱',w:0.9,h:1.0,d:0.8,c:0x283848,s:'safe',p:'top',n:[3,5]},
 airdrop:{l:'空投補給',w:1.2,h:1.2,d:1.2,c:0x3a6ea5,s:'box',p:'high',n:[4,6]},
 corpse:{l:'屍體',w:0.01,h:0.01,d:0.01,c:0,s:'none',p:'corpse',n:[2,4],reach:2.2}};
const THEMES=[
 {id:'house',name:'民房社區',tier:1,mult:1,sky:0x9cb8cf,fog:[40,120],ground:0x6f8a4e,yardC:0x8c8273,wall:0xe6dccb,floor:0xa47b55,roof:0x8a3b2e,hemi:0.75,sun:1.1,lamp:0xfff0dc,
  bld:{n:[2,3],cols:[2,2],rows:[1,2],cell:5.2,open:0.15,wh:3},rooms:['box','fridge','wardrobe','box','wardrobe'],special:'safe',lock:0.5,props:'house',yard:'trees',
  enemies:[['grunt'],['grunt']],twist:'鄰居都出國了，只留一個士兵幫忙看家。',
  items:[[0,'🪴','枯萎盆栽',4],[1,'🍚','電鍋',70],[2,'🧸','絕版公仔',420],[3,'🖼️','阿嬤的山水畫',1600],[4,'📜','祖傳地契',9000]]},
 {id:'mart',name:'便利商店/大賣場',tier:2,mult:1.15,sky:0xa9c4d8,fog:[45,120],ground:0x5d6168,yardC:0x3f4248,wall:0xf2f2ee,floor:0xd9d9d2,roof:0x2a6db0,hemi:0.8,sun:1.0,lamp:0xf4fbff,
  bld:{n:[1,1],cols:[3,3],rows:[2,3],cell:6.6,open:0.85,wh:3.6},rooms:['shelf','shelf','cooler','box'],special:'register',lock:0.35,props:'mart',yard:'cars',
  enemies:[['guard'],['guard','grunt']],twist:'會員集點：每搜一個容器 +1 點。點數毫無用處。',
  items:[[0,'🍙','過期御飯糰',5],[0,'🧃','打折果汁',7],[1,'🎫','刮刮樂',60],[2,'🍱','限量便當',300],[3,'🎟️','中獎彩券',1700],[4,'💳','黑卡',10000]]},
 {id:'office',name:'辦公大樓',tier:3,mult:1.35,sky:0xb4c2cc,fog:[40,110],ground:0x7d8a6a,yardC:0x9a9a94,wall:0xd7dde3,floor:0x6f7a86,roof:0x545c66,hemi:0.8,sun:1.0,lamp:0xeef4ff,
  bld:{n:[1,1],cols:[3,4],rows:[2,3],cell:5.4,open:0.25,wh:3.2,tower:true},rooms:['desk','desk','filing','fridge','desk'],special:'bossafe',lock:0.8,props:'office',yard:'planters',
  enemies:[['guard'],['guard','grunt']],twist:'這裡的轉圈圈叫做「KPI 載入中」。',
  items:[[0,'📎','迴紋針',2],[0,'☕','冷掉的咖啡',4],[1,'🖊️','董事長的筆',90],[2,'🏆','年度業績獎盃',450],[3,'🗂️','機密簡報',2100],[4,'📈','內線消息',11000]]},
 {id:'base',name:'軍事倉庫',tier:4,mult:1.6,sky:0x8fa3a8,fog:[35,105],ground:0x6b6a4e,yardC:0x7a7660,wall:0x8a8f7a,floor:0x5e5e55,roof:0x4a5240,hemi:0.7,sun:1.0,lamp:0xffe8c0,
  bld:{n:[2,2],cols:[2,2],rows:[1,2],cell:6.6,open:0.6,wh:4},rooms:['ammo','weapon','box','ammo'],special:'milsafe',lock:0.6,props:'crates',yard:'sandbags',
  enemies:[['grunt','heavy'],['grunt','heavy','guard']],twist:'國防預算只夠請兩個人顧整座倉庫。',
  items:[[0,'🪖','破頭盔',15],[1,'🥾','軍靴',110],[2,'📡','無線電',520],[3,'🔭','夜視鏡',2400],[4,'🚀','（不明）飛彈零件',14000]]},
 {id:'port',name:'港口碼頭',tier:5,mult:1.9,sky:0x2c3a52,fog:[22,80],ground:0x4a4f57,yardC:0x3b3f46,wall:0x7a8088,floor:0x50555c,roof:0x3a4a5a,hemi:0.45,sun:0.5,lamp:0xffd9a0,night:true,
  bld:{n:[1,1],cols:[2,2],rows:[2,2],cell:6,open:0.5,wh:4},rooms:['smug','box','smug'],special:'captain',lock:0.7,props:'crates',yard:'containers',
  enemies:[['grunt','guard'],['grunt','heavy','guard']],twist:'深夜碼頭。這裡的貨都沒有報關，所以特別值錢。',
  items:[[0,'🐟','死魚',3],[1,'⚓','小錨',100],[2,'🦜','走私鸚鵡',600],[3,'🧳','可疑皮箱',2600],[4,'🗿','走私古董',15000]]}];
const ETYPES={
 grunt:{n:'巡邏兵',hp:100,dmg:11,cd:[0.9,1.4],range:38,speed:1.5,acc:0.75,uni:0x55603f,hat:0x3d4530,scale:1},
 guard:{n:'保全',hp:60,dmg:6,cd:[0.45,0.7],range:46,speed:3,acc:0.6,uni:0x2d4a7a,hat:0x1d2c4a,scale:0.95},
 heavy:{n:'重裝兵',hp:260,dmg:20,cd:[1.6,2.1],range:30,speed:1.1,acc:0.8,uni:0x2b2d30,hat:0x15161a,scale:1.22,advance:true},
 boss:{n:'隊長',hp:420,dmg:16,cd:[0.7,1.0],range:40,speed:1.3,acc:0.8,uni:0x5a2a2a,hat:0xd4af37,scale:1.3,advance:true}};
const GEAR={
 gun:[{id:'g0',n:'老舊步槍',price:0,dmg:25,mag:30,rate:0.11,spread:0.012,rl:1.4,d:'免費。準度靠信仰。'},
      {id:'g1',n:'突擊步槍',price:3500,dmg:34,mag:30,rate:0.095,spread:0.01,rl:1.3,d:'比較像一把槍了。'},
      {id:'g2',n:'精準射手步槍',price:9000,dmg:72,mag:12,rate:0.3,spread:0.003,rl:1.8,d:'一槍一個夢想。'}],
 armor:[{id:'a0',n:'T恤',price:0,red:0,spd:1,d:'防禦力：心理層面。'},
        {id:'a1',n:'軟式防彈衣',price:2500,red:0.3,spd:1,d:'減傷 30%。'},
        {id:'a2',n:'重型防彈衣',price:8000,red:0.55,spd:0.88,d:'減傷 55%，但你走路像企鵝。'}],
 bag:[{id:'b0',n:'購物袋',price:0,cap:12,d:'環保又容量小。'},
      {id:'b1',n:'登山背包',price:1800,cap:25,d:'25 格。'},
      {id:'b2',n:'軍用大背包',price:6000,cap:36,d:'36 格。你的貪婪終於有地方放了。'}]};
const UPG={
 luck:{n:'幸運加持',d:'轉圈圈變快、略提升高稀有度機率',lv:[0,2000,6000,15000],eff:[1,0.85,0.72,0.6]},
 stash:{n:'倉庫擴建',d:'倉庫格數',lv:[0,1500,5000,12000],eff:[30,45,60,90]},
 shelf:{n:'戰利品展示櫃',d:'可陳列的史詩/傳說物品數',lv:[0,3000,10000],eff:[0,3,8]},
 secure:{n:'安全箱',d:'陣亡時自動保留最貴的 N 件',lv:[0,4000,12000],eff:[0,1,2]}};
const QUESTS=[
 q=>({type:'theme',theme:q%5,reward:600+300*(q%5),t:`從【${THEMES[q%5].name}】活著回來`}),
 q=>({type:'rare',r:2,n:2+(q%3),reward:900+200*(q%3),t:`一局帶回 ${2+(q%3)} 件「稀有」以上`}),
 q=>({type:'kills',n:2,reward:1200,t:'一局擊殺 2 名敵人（他們薪水很低，別有罪惡感）'}),
 q=>({type:'speed',s:75,reward:1000,t:'75 秒內撤離（老K說他趕著去接小孩）'}),
 q=>({type:'value',v:4000+2000*(q%3),reward:1500,t:`一局帶回價值 $${(4000+2000*(q%3)).toLocaleString()} 以上`}),
 q=>({type:'empty',reward:300,t:'兩手空空撤離一次（老K想證明「什麼都不拿」也是一種策略）'})];
const NPC_LINES=['老K：「我以前是特種部隊。後來轉行做房仲。差不多啦。」','老K：「轉圈圈越久越值錢？這是行銷，孩子。」','老K：「記得：敵人很少，但你的時間更少。」','老K：「保險？保險公司最喜歡你這種客人。」','老K：「展示櫃上的東西不能賣，但能讓你晚上睡得比較好。」'];
// ================= SAVE =================
const SKEY='extractlite_save_v4';
function defSave(){return {v:4,money:800,stash:[],trophies:[],gear:{g1:0,g2:0,a1:0,a2:0,b1:1,b2:0},equip:{gun:'g0',armor:'a0',bag:'b1'},upg:{luck:0,stash:0,shelf:0,secure:0},
  quest:null,questN:0,stats:{raids:0,extracts:0,deaths:0,best:0,earned:0},inRaid:null,seedN:1}}
let S;
function loadSave(){try{const p=JSON.parse(localStorage.getItem(SKEY)||'null');const d=defSave();if(p&&typeof p==='object'){S=Object.assign({},d,p);S.gear=Object.assign({},d.gear,p.gear||{});S.equip=Object.assign({},d.equip,p.equip||{});S.upg=Object.assign({},d.upg,p.upg||{});S.stats=Object.assign({},d.stats,p.stats||{});if(!Array.isArray(S.stash))S.stash=[];if(!Array.isArray(S.trophies))S.trophies=[]}else S=d}catch(e){S=defSave()}}
function save(){try{localStorage.setItem(SKEY,JSON.stringify(S))}catch(e){}}
loadSave();
// seeded rng
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
let rng=Math.random;const ri=(a,b)=>a+Math.floor(rng()*(b-a+1)),pick=a=>a[Math.floor(rng()*a.length)];
const gearOf=(slot,id)=>GEAR[slot].find(g=>g.id===id)||GEAR[slot][0];
// ================= RENDERER =================
const canvas=$('c');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
const scene=new THREE.Scene();scene.background=new THREE.Color(0x9cb8cf);scene.fog=new THREE.Fog(0x9cb8cf,40,120);
const camera=new THREE.PerspectiveCamera(72,1,0.05,300);
function resize(){renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()}
addEventListener('resize',resize);resize();
const hemi=new THREE.HemisphereLight(0xdfefff,0x5a5040,0.75);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xfff1d6,1.1);sun.position.set(30,50,25);sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-45,right:45,top:45,bottom:-45,far:150});scene.add(sun);
const lamps=[0,1,2,3].map(()=>{const l=new THREE.PointLight(0xfff0dc,0,16,1.4);scene.add(l);return l});
const flashlight=new THREE.SpotLight(0xfff4d8,0,32,0.5,0.45,1.2);
const world=new THREE.Group();scene.add(world);
const matCache={};
const M=c=>matCache[c]||(matCache[c]=new THREE.MeshStandardMaterial({color:c,roughness:0.85,metalness:0.05}));
const EM=(c,e)=>{const k=c+'_'+e;return matCache[k]||(matCache[k]=new THREE.MeshStandardMaterial({color:c,emissive:e,roughness:0.95}))};
const colliders=[],solids=[];
function box(w,h,d,x,y,z,mat,opt={}){
  const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),typeof mat==='number'?M(mat):mat);
  m.position.set(x,y,z);m.castShadow=opt.shadow!==false;m.receiveShadow=true;(opt.parent||world).add(m);
  if(opt.collide!==false){const c={minX:x-w/2,maxX:x+w/2,minZ:z-d/2,maxZ:z+d/2};colliders.push(c);solids.push(m);m.userData.col=c}
  return m}
function clearWorld(){
  world.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material&&o.material.userData.own){if(o.material.map)o.material.map.dispose();o.material.dispose()}});
  world.clear();colliders.length=0;solids.length=0;containers.length=0;enemies.length=0;doors.length=0;
  for(const q of particles){scene.remove(q.m);q.m.geometry.dispose();q.m.material.dispose()}particles.length=0;
  for(const t of tracers){scene.remove(t.l);t.l.geometry.dispose();t.l.material.dispose()}tracers.length=0;
  lamps.forEach(l=>l.intensity=0);}
function emojiTex(ic,bg){const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');
  if(bg){x.fillStyle=bg;x.beginPath();x.arc(64,64,60,0,7);x.fill()}x.font='80px serif';x.textAlign='center';x.textBaseline='middle';x.fillText(ic,64,70);return new THREE.CanvasTexture(c)}

// ================= CONTAINERS =================
const containers=[],doors=[];
let level=null;
function rollRarity(p){let r=rng();for(let i=0;i<p.length;i++){if((r-=p[i])<0)return i}return p.length-1}
function poolFor(kind){const p=POOLS[CK[kind].p].slice();const L=S.upg.luck,sh=L*0.035;const s2=Math.min(sh,p[0]);if(s2>0){p[0]-=s2;p[3]+=s2*0.6;p[4]+=s2*0.4}return p}
function rollItem(kind){
  const r=rollRarity(poolFor(kind));const th=level&&level.theme;let list=ITEMS.filter(i=>i[0]===r);
  if(th&&rng()<0.45){const t=th.items.filter(i=>i[0]===r);if(t.length)list=t}
  const it=list[Math.floor(rng()*list.length)];
  return {r:it[0],ic:it[1],name:it[2],v:Math.max(1,Math.round(it[3]*(0.85+rng()*0.3)*(level?level.vmult:1))),p:0,state:'wait'}}
function container(kind,x,z,rot,opt={}){
  const k=CK[kind],w=k.w,h=k.h,d=k.d;
  const grp=new THREE.Group();grp.position.set(x,opt.y||0,z);grp.rotation.y=rot||0;world.add(grp);
  let body=null;
  if(k.s!=='none'){body=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),M(k.c));body.position.y=h/2;body.castShadow=body.receiveShadow=true;grp.add(body);
    const add=(gw,gh,gd,px,py,pz,c)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(gw,gh,gd),M(c));m.position.set(px,py,pz);grp.add(m);return m};
    if(k.s==='fridge'){add(0.06,0.5,0.06,w/2-0.15,h*0.7,d/2+0.04,0x999999);add(w*0.98,0.02,0.01,0,h*0.62,d/2+0.005,0x888888)}
    if(k.s==='wardrobe'){add(0.02,h*0.94,0.01,0,h/2,d/2+0.005,0x3b2616);add(0.08,0.08,0.05,0.1,h*0.55,d/2+0.03,0xd4af37)}
    if(k.s==='box')add(w*1.01,0.06,0.15,0,h+0.005,0,0xc9b37a);
    if(k.s==='safe'){add(0.16,0.16,0.05,0,h/2,d/2+0.03,0xaaaaaa)}
    if(k.s==='shelf'){for(const yy of[0.45,0.95,1.45])add(w*1.02,0.04,d*1.05,0,yy,0,0x8a9098);for(let i=0;i<6;i++)add(0.25,0.3,0.3,-w/2+0.3+i*0.52,1.12,(i%2?0.1:-0.1),[0xe0554a,0x4a9fe0,0xf0c040,0x5ac46a][i%4])}
    if(k.s==='cargo'){for(let i=-2;i<=2;i++)add(0.05,h*0.9,0.05,w/2+0.01,h/2,i*1.1,0x6a2a20);add(w*0.9,0.1,0.05,0,h*0.5,d/2+0.02,0x333333)}
    if(k.s==='plain')add(w*0.9,0.05,0.02,0,h*0.6,d/2+0.01,0x5a4a38);
  }
  if(body){const cr=Math.abs(Math.cos(rot||0)),sr=Math.abs(Math.sin(rot||0)),ww=w*cr+d*sr,dd=w*sr+d*cr;
    const c={minX:x-ww/2,maxX:x+ww/2,minZ:z-dd/2,maxZ:z+dd/2};colliders.push(c);solids.push(body);}
  const n=opt.n||ri(k.n[0],k.n[1]);const items=[];for(let i=0;i<n;i++)items.push(rollItem(kind));
  const marker=new THREE.Mesh(new THREE.OctahedronGeometry(kind==='airdrop'?0.25:0.12),new THREE.MeshBasicMaterial({color:0xf5c542}));marker.material.userData.own=true;
  marker.position.set(x,(opt.y||0)+Math.max(h,0.3)+0.45,z);world.add(marker);
  const ct={kind,label:opt.label||k.l,pos:new THREE.Vector3(x,h/2,z),items,cur:-1,marker,searched:false,reach:(k.reach||Math.max(w,d)/2+1.4),grp,room:opt.room};
  containers.push(ct);return ct}
// ================= LEVEL GENERATOR =================
const DOORW=1.6;
function wallLine(axis,fixed,a,b,gaps,th,wh,col){ // axis 'x': wall runs along x at z=fixed
  gaps=gaps.slice().sort((p,q)=>p[0]-q[0]);let cur=a;const T=0.3;
  const seg=(s,e)=>{if(e-s<0.05)return;const L=e-s,m=(s+e)/2;axis==='x'?box(L,wh,T,m,wh/2,fixed,col):box(T,wh,L,fixed,wh/2,m,col)};
  for(const [g0,g1] of gaps){seg(cur,g0);const m=(g0+g1)/2,L=g1-g0;axis==='x'?box(L,wh-2.3,T,m,2.3+(wh-2.3)/2,fixed,col,{collide:false}):box(T,wh-2.3,L,fixed,2.3+(wh-2.3)/2,m,col,{collide:false});cur=g1}
  seg(cur,b)}
function genBuilding(th,x0,z0,cols,rows,cell,sub){
  const B=th.bld,wh=B.wh,W=cols*cell,D=rows*cell;const id=(c,r)=>r*cols+c;
  const rooms=[];for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)rooms.push({c,r,minX:x0+c*cell,maxX:x0+(c+1)*cell,minZ:z0+r*cell,maxZ:z0+(r+1)*cell,deg:0,walls:{}});
  // spanning tree (random DFS)
  const edges=new Map();const ek=(a,b)=>a<b?a+'_'+b:b+'_'+a;
  const nb=i=>{const R=rooms[i],o=[];if(R.c>0)o.push(id(R.c-1,R.r));if(R.c<cols-1)o.push(id(R.c+1,R.r));if(R.r>0)o.push(id(R.c,R.r-1));if(R.r<rows-1)o.push(id(R.c,R.r+1));return o};
  const seen=new Set([ri(0,rooms.length-1)]);const st=[...seen];
  while(st.length){const cur=st[st.length-1];const opts=nb(cur).filter(n=>!seen.has(n));if(!opts.length){st.pop();continue}const n=pick(opts);seen.add(n);edges.set(ek(cur,n),'door');st.push(n)}
  for(let i=0;i<rooms.length;i++)for(const n of nb(i))if(n>i&&!edges.has(ek(i,n))&&rng()<0.25)edges.set(ek(i,n),'door');
  for(const [k] of edges){const [a,b]=k.split('_').map(Number);rooms[a].deg++;rooms[b].deg++}
  // entrance on perimeter
  const per=rooms.filter(R=>R.c===0||R.r===0||R.c===cols-1||R.r===rows-1);
  const ent=pick(per);const sides=[];if(ent.r===rows-1)sides.push('S');if(ent.r===0)sides.push('N');if(ent.c===0)sides.push('W');if(ent.c===cols-1)sides.push('E');
  const exits=[[ent,pick(sides)]];
  if(rooms.length>=4&&rng()<0.6){const o=pick(per.filter(R=>R!==ent));const s2=[];if(o.r===rows-1)s2.push('S');if(o.r===0)s2.push('N');if(o.c===0)s2.push('W');if(o.c===cols-1)s2.push('E');exits.push([o,pick(s2)])}
  // locked room = leaf not used as exit
  let locked=null;
  if(rooms.length>=2&&!level.lockUsed&&rng()<th.lock){const c=rooms.filter(R=>R.deg===1&&!exits.some(e=>e[0]===R));if(c.length)locked=pick(c)}
  // edge types: open plan
  for(const [k,v] of edges){const [a,b]=k.split('_').map(Number);if(rooms[a]!==locked&&rooms[b]!==locked&&rng()<B.open)edges.set(k,'open')}
  // floor/ceiling/roof
  box(W,0.1,D,x0+W/2,0.05,z0+D/2,th.floor,{collide:false});
  box(W,0.02,D,x0+W/2,wh-0.01,z0+D/2,EM(0xf4efe6,0x5a5246),{collide:false,shadow:false});
  box(W+0.8,0.25,D+0.8,x0+W/2,wh+0.12,z0+D/2,th.roof,{collide:false});
  if(B.tower){const fl=3+ri(0,3);for(let f=1;f<=fl;f++){box(W,3.2,D,x0+W/2,wh+0.25+(f-0.5)*3.2,z0+D/2,f%2?0x9fb4c6:0x8ea3b5,{collide:false});
    box(W+0.05,1.1,D+0.05,x0+W/2,wh+0.25+(f-0.5)*3.2+0.3,z0+D/2,EM(0x3a5068,0x0c1a28),{collide:false,shadow:false})}}
  // walls
  const gapAt=(m)=>[[m-DOORW/2,m+DOORW/2]];
  const lockedDoor=[];
  // horizontal lines (along x) at z = z0 + r*cell, r=0..rows
  for(let r=0;r<=rows;r++){const z=z0+r*cell;
    for(let c=0;c<cols;c++){const a=x0+c*cell,b=a+cell,m=(a+b)/2;let gaps=[],wall=true;
      if(r===0||r===rows){const R=rooms[id(c,r===0?0:rows-1)];const side=r===0?'N':'S';if(exits.some(e=>e[0]===R&&e[1]===side))gaps=gapAt(m)}
      else{const t=edges.get(ek(id(c,r-1),id(c,r)));if(t==='open')wall=false;else if(t==='door'){gaps=gapAt(m);if(rooms[id(c,r-1)]===locked||rooms[id(c,r)]===locked)lockedDoor.push({axis:'x',x:m,z})}}
      if(wall)wallLine('x',z,a,b,gaps,th,wh,th.wall);
      const rA=r>0?rooms[id(c,r-1)]:null,rB=r<rows?rooms[id(c,r)]:null;
      if(rA)rA.walls.S={wall,gaps,axis:'x',fixed:z,a,b};if(rB)rB.walls.N={wall,gaps,axis:'x',fixed:z,a,b}}}
  for(let c=0;c<=cols;c++){const x=x0+c*cell;
    for(let r=0;r<rows;r++){const a=z0+r*cell,b=a+cell,m=(a+b)/2;let gaps=[],wall=true;
      if(c===0||c===cols){const R=rooms[id(c===0?0:cols-1,r)];const side=c===0?'W':'E';if(exits.some(e=>e[0]===R&&e[1]===side))gaps=gapAt(m)}
      else{const t=edges.get(ek(id(c-1,r),id(c,r)));if(t==='open')wall=false;else if(t==='door'){gaps=gapAt(m);if(rooms[id(c-1,r)]===locked||rooms[id(c,r)]===locked)lockedDoor.push({axis:'z',x,z:m})}}
      if(wall)wallLine('z',x,a,b,gaps,th,wh,th.wall);
      const rA=c>0?rooms[id(c-1,r)]:null,rB=c<cols?rooms[id(c,r)]:null;
      if(rA)rA.walls.E={wall,gaps,axis:'z',fixed:x,a,b};if(rB)rB.walls.W={wall,gaps,axis:'z',fixed:x,a,b}}}
  if(locked&&lockedDoor.length){const L=lockedDoor[0];
    const m=L.axis==='x'?box(DOORW,2.3,0.16,L.x,1.15,L.z,0x8a2c22):box(0.16,2.3,DOORW,L.x,1.15,L.z,0x8a2c22);
    const sign=new THREE.Mesh(new THREE.PlaneGeometry(0.5,0.5),new THREE.MeshBasicMaterial({map:emojiTex('🔒','#f5c542'),transparent:true}));sign.material.userData.own=true;
    sign.position.set(L.x,1.7,L.z);if(L.axis==='z')sign.rotation.y=Math.PI/2;world.add(sign);const sign2=sign.clone();sign2.rotation.y+=Math.PI;world.add(sign2);
    doors.push({pos:new THREE.Vector3(L.x,0,L.z),mesh:m,col:m.userData.col,open:false,t:0,signs:[sign,sign2],room:locked})}
  else locked=null;
  if(locked)level.lockUsed=true;
  // interior light
  const li=lamps.find(l=>l.intensity===0);if(li){li.position.set(x0+W/2,wh-0.5,z0+D/2);li.color.setHex(th.lamp);li.intensity=th.night?20:16;li.distance=Math.max(W,D)*1.1}
  // contents
  for(const R of rooms){furnish(th,R,cell,R===locked)}
  return {rect:{minX:x0,maxX:x0+W,minZ:z0,maxZ:z0+D},rooms,locked,exits}}
function wallSlots(R){ // free segments along each solid wall
  const out=[];for(const s of ['N','S','W','E']){const w=R.walls[s];if(!w||!w.wall)continue;let segs=[[w.a+0.3,w.b-0.3]];
    for(const [g0,g1] of w.gaps){const n=[];for(const [a,b] of segs){if(g1+0.45<=a||g0-0.45>=b){n.push([a,b]);continue}if(g0-0.45>a)n.push([a,g0-0.45]);if(g1+0.45<b)n.push([g1+0.45,b])}segs=n}
    for(const sg of segs)out.push({side:s,w,seg:sg})}return out}
function placeOnWall(R,kind,placed,opt){
  const k=CK[kind];const slots=wallSlots(R).filter(s=>s.seg[1]-s.seg[0]>=k.w+0.1);
  for(let tries=0;tries<8&&slots.length;tries++){const s=pick(slots);const along=s.seg[0]+k.w/2+rng()*(s.seg[1]-s.seg[0]-k.w);const off=0.15+k.d/2+0.02;
    let x,z,rot;if(s.side==='N'){x=along;z=s.w.fixed+off;rot=0}else if(s.side==='S'){x=along;z=s.w.fixed-off;rot=Math.PI}else if(s.side==='W'){z=along;x=s.w.fixed+off;rot=Math.PI/2}else{z=along;x=s.w.fixed-off;rot=-Math.PI/2}
    const hw=(rot===0||rot===Math.PI?k.w:k.d)/2+0.35,hd=(rot===0||rot===Math.PI?k.d:k.w)/2+0.35;const r={minX:x-hw,maxX:x+hw,minZ:z-hd,maxZ:z+hd};
    if(placed.some(p=>p.minX<r.maxX&&p.maxX>r.minX&&p.minZ<r.maxZ&&p.maxZ>r.minZ))continue;placed.push(r);return container(kind,x,z,rot,Object.assign({room:R},opt||{}))}
  return null}
function furnish(th,R,cell,isLocked){
  const placed=[];const cx=(R.minX+R.maxX)/2,cz=(R.minZ+R.maxZ)/2;
  if(isLocked){placeOnWall(R,th.special,placed);placeOnWall(R,pick(th.rooms),placed);return}
  const n=th.props==='mart'?1:ri(1,2);for(let i=0;i<n;i++)placeOnWall(R,pick(th.rooms),placed);
  // center props
  if(th.props==='mart'){const rot=rng()<0.5?0:Math.PI/2;container('shelf',cx,cz,rot);}
  else if(th.props==='office'){if(rng()<0.75){container('desk',cx,cz-0.42,0);box(1.5,0.75,0.8,cx,0.375,cz+0.42,0x8c7a62);box(0.05,0.5,1.6,cx+0.8,1.0,cz,0x6a7a88)}}
  else if(th.props==='house'){if(rng()<0.6)box(1.6,0.75,1.0,cx,0.38,cz,0x6b4a2f);}
  else if(th.props==='crates'){if(rng()<0.7){const s=ri(1,2);box(1.6,0.9*s,1.6,cx,0.45*s,cz,0x8a6a3a)}}
}
// ---------- yard ----------
function overlaps(r,list,m){return list.some(p=>p.minX-m<r.maxX&&p.maxX+m>r.minX&&p.minZ-m<r.maxZ&&p.maxZ+m>r.minZ)}
function yardPlace(w,d,reserved,m,tries){const H=BAL.half-2;for(let t=0;t<(tries||40);t++){const x=-H+w/2+rng()*(2*H-w),z=-H+d/2+rng()*(2*H-d);const r={minX:x-w/2,maxX:x+w/2,minZ:z-d/2,maxZ:z+d/2};if(!overlaps(r,reserved,m)){reserved.push(r);return {x,z}}}return null}
function genYard(th,reserved,minimal){
  const Y=th.yard,N=minimal?0:1;
  if(Y==='trees')for(let i=0;i<14*N;i++){const p=yardPlace(1,1,reserved,1.6);if(!p)continue;
    const t=new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.35,2.4,8),M(0x5a4030));t.position.set(p.x,1.2,p.z);t.castShadow=true;world.add(t);
    const c=new THREE.Mesh(new THREE.ConeGeometry(1.8,4,8),M(0x2f5a2f));c.position.set(p.x,4,p.z);c.castShadow=true;world.add(c);colliders.push({minX:p.x-0.4,maxX:p.x+0.4,minZ:p.z-0.4,maxZ:p.z+0.4});solids.push(t)}
  if(Y==='cars')for(let i=0;i<8*N;i++){const rot=rng()<0.5;const w=rot?4.2:2,d=rot?2:4.2;const p=yardPlace(w,d,reserved,1.8);if(!p)continue;const col=pick([0xc0392b,0x2c3e50,0xecf0f1,0x7f8c8d,0x2980b9]);
    box(w,0.9,d,p.x,0.55,p.z,col);box(rot?2.2:1.8,0.6,rot?1.8:2.2,p.x,1.3,p.z,0x223344,{collide:false})}
  if(Y==='planters')for(let i=0;i<10*N;i++){const p=yardPlace(1.6,1.6,reserved,1.8);if(!p)continue;box(1.6,0.6,1.6,p.x,0.3,p.z,0x9a8f80);const b=new THREE.Mesh(new THREE.SphereGeometry(0.8,8,6),M(0x3f7a3a));b.position.set(p.x,1.0,p.z);world.add(b)}
  if(Y==='sandbags'){for(let i=0;i<9*N;i++){const rot=rng()<0.5;const p=yardPlace(rot?3:0.8,rot?0.8:3,reserved,1.8);if(p)box(rot?3:0.8,0.9,rot?0.8:3,p.x,0.45,p.z,0x9c8a5e)}
    const p=N&&yardPlace(3,3,reserved,2);if(p){for(const sx of[-1,1])for(const sz of[-1,1])box(0.2,5,0.2,p.x+sx*1.3,2.5,p.z+sz*1.3,0x5a4a32);box(3.2,0.2,3.2,p.x,5,p.z,0x5a4a32,{collide:false});box(3.2,1,0.1,p.x,5.6,p.z+1.55,0x5a4a32,{collide:false})}
    for(let i=0;i<2*N;i++){const q=yardPlace(1,1,reserved,1.5);if(q)container('ammo',q.x,q.z,rng()*3)}}
  if(Y==='containers'){
    const water=new THREE.Mesh(new THREE.PlaneGeometry(60,200),new THREE.MeshStandardMaterial({color:0x10263a,roughness:0.3,metalness:0.4}));water.material.userData.own=true;water.rotation.x=-Math.PI/2;water.position.set(BAL.half+31,-0.3,0);world.add(water);
    for(let i=0;i<3;i++)box(0.4,0.6,0.4,BAL.half-0.5,0.3,-20+i*20,0x222222);
    for(let i=0;i<16*N;i++){const rot=rng()<0.5;const w=rot?6:2.4,d=rot?2.4:6;const p=yardPlace(w,d,reserved,2.2);if(!p)continue;
      if(i<3)container('cargo',p.x,p.z,rot?Math.PI/2:0);
      else{const st=rng()<0.4?2:1;const col=pick([0xa33b2b,0x2b6aa3,0x2f8a4a,0xc9a227,0x7a3e8a]);box(w,2.6*st,d,p.x,1.3*st,p.z,col)}}
    for(let i=0;i<2*N;i++){const p=yardPlace(7,3,reserved,2);if(!p)continue;for(const sx of[-1,1])for(const sz of[-1,1])box(0.4,12,0.4,p.x+sx*3.2,6,p.z+sz*1.2,0xd8a020);box(7.2,0.6,3,p.x,12,p.z,0xd8a020,{collide:false});box(1,0.6,18,p.x,12.5,p.z,0xd8a020,{collide:false})}
    for(let i=0;i<N;i++){const q=yardPlace(1,1,reserved,1.5);if(q)container('smug',q.x,q.z,rng()*3)}}
  if(th.id==='house'&&N){const q=yardPlace(1,1,reserved,1.5);if(q)container('box',q.x,q.z,rng()*3)}
  if(th.id==='mart'&&N){const q=yardPlace(1,1,reserved,1.5);if(q)container('box',q.x,q.z,rng()*3)}
}
// ---------- reachability raster ----------
const RC=0.25,RN=Math.ceil((BAL.half*2+4)/RC),RO=BAL.half+2;
function raster(skip){const g=new Uint8Array(RN*RN);const R=BAL.R*0.95;
  for(const c of colliders){if(skip&&skip.includes(c))continue;const x0=Math.max(0,Math.floor((c.minX-R+RO)/RC)),x1=Math.min(RN-1,Math.floor((c.maxX+R+RO)/RC)),z0=Math.max(0,Math.floor((c.minZ-R+RO)/RC)),z1=Math.min(RN-1,Math.floor((c.maxZ+R+RO)/RC));
    for(let z=z0;z<=z1;z++)for(let x=x0;x<=x1;x++)g[z*RN+x]=1}
  const H=Math.floor((RO-BAL.half)/RC);for(let i=0;i<RN;i++)for(let j=0;j<RN;j++)if(i<H||j<H||i>=RN-H||j>=RN-H)g[i*RN+j]=1;return g}
function flood(g,sx,sz){const seen=new Uint8Array(RN*RN);const q=new Int32Array(RN*RN);let h=0,t=0;const s=Math.floor((sz+RO)/RC)*RN+Math.floor((sx+RO)/RC);if(g[s])return seen;seen[s]=1;q[t++]=s;
  while(h<t){const i=q[h++];const x=i%RN,z=(i/RN)|0;const nb=[x>0?i-1:-1,x<RN-1?i+1:-1,z>0?i-RN:-1,z<RN-1?i+RN:-1];for(const n of nb)if(n>=0&&!seen[n]&&!g[n]){seen[n]=1;q[t++]=n}}return seen}
function reachedNear(seen,x,z,rad){const r=Math.ceil(rad/RC),cx=Math.floor((x+RO)/RC),cz=Math.floor((z+RO)/RC);
  for(let dz=-r;dz<=r;dz++)for(let dx=-r;dx<=r;dx++){if((dx*dx+dz*dz)*RC*RC>rad*rad)continue;const X=cx+dx,Z=cz+dz;if(X<0||Z<0||X>=RN||Z>=RN)continue;if(seen[Z*RN+X])return true}return false}
function validate(){const sp=level.spawn;const gOpen=raster(doors.map(d=>d.col));const all=flood(gOpen,sp.x,sp.z);
  const bad=[];for(const c of containers)if(!reachedNear(all,c.pos.x,c.pos.z,c.reach-0.35))bad.push(c.label);
  if(!reachedNear(all,heli.position.x,heli.position.z,4.5))bad.push('heli');
  if(level.keyC){const gL=raster();const lk=flood(gL,sp.x,sp.z);if(!reachedNear(lk,level.keyC.pos.x,level.keyC.pos.z,level.keyC.reach-0.35))bad.push('key');if(!reachedNear(lk,heli.position.x,heli.position.z,4.5))bad.push('heliL');
    for(const d of doors)if(!reachedNear(lk,d.pos.x,d.pos.z,1.9))bad.push('door')}
  return {ok:!bad.length,bad,seen:all,g:gOpen}}
// ================= HELICOPTER =================
const heli=new THREE.Group();heli.rotation.order='YXZ';scene.add(heli);
{const hm=M(0x4b5a3a),dk=M(0x2a2f25),gl=new THREE.MeshStandardMaterial({color:0x6fa8c8,roughness:0.2,metalness:0.3});
 const add=(geo,mat,x,y,z,rx,ry,rz)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.rotation.set(rx||0,ry||0,rz||0);m.castShadow=true;heli.add(m);return m};
 add(new THREE.BoxGeometry(2.4,1.8,4.2),hm,0,1.7,0);add(new THREE.BoxGeometry(2.2,1.2,1.2),gl,0,1.9,2.4);
 add(new THREE.BoxGeometry(0.5,0.5,5),hm,0,2.2,-4.4);add(new THREE.BoxGeometry(0.15,1.4,0.8),hm,0,2.8,-6.8);
 for(const s of[-1,1]){add(new THREE.BoxGeometry(0.12,0.12,4.6),dk,s*1.1,0.2,0.3);add(new THREE.BoxGeometry(0.1,0.6,0.1),dk,s*1.0,0.5,1.4);add(new THREE.BoxGeometry(0.1,0.6,0.1),dk,s*1.0,0.5,-0.8)}
 add(new THREE.CylinderGeometry(0.12,0.12,0.5,8),dk,0,2.85,0);
 heli.userData.rotor=add(new THREE.BoxGeometry(9,0.05,0.3),dk,0,3.1,0);heli.userData.rotor2=add(new THREE.BoxGeometry(0.3,0.05,9),dk,0,3.1,0);
 heli.userData.tail=add(new THREE.BoxGeometry(0.05,1.6,0.15),dk,0.15,2.8,-6.8);
 heli.userData.door=add(new THREE.BoxGeometry(0.06,1.3,1.4),M(0x3e4b30),-1.23,1.6,-1.5);add(new THREE.BoxGeometry(0.02,0.08,3.2),dk,-1.24,2.32,-0.7);}
function placeHeli(x,z,yaw){heli.position.set(x,0,z);heli.rotation.set(0,yaw,0);heli.userData.door.position.z=-1.5;heli.visible=true;
  const cr=Math.abs(Math.cos(yaw)),sr=Math.abs(Math.sin(yaw)),w=2.6,d=5.2,ww=w*cr+d*sr,dd=w*sr+d*cr;
  colliders.push({minX:x-ww/2,maxX:x+ww/2,minZ:z-dd/2,maxZ:z+dd/2});solids.push(heli.children[0],heli.children[1]);
  box(14,0.02,14,x,0.012,z,0x7d7d78,{collide:false,shadow:false});
  const pad=new THREE.Mesh(new THREE.RingGeometry(3.2,3.6,40),new THREE.MeshBasicMaterial({color:0xf2d23c}));pad.material.userData.own=true;pad.rotation.x=-Math.PI/2;pad.position.set(x,0.03,z);world.add(pad);
  const hm=new THREE.Mesh(new THREE.PlaneGeometry(2.4,2.4),new THREE.MeshBasicMaterial({map:emojiTex('H'),transparent:true,color:0xf2d23c}));hm.material.userData.own=true;hm.rotation.x=-Math.PI/2;hm.position.set(x+3.6*Math.sin(yaw+2.3),0.04,z+3.6*Math.cos(yaw+2.3));world.add(hm)}
// ================= ENEMIES =================
const enemies=[];
function makeEnemy(type,x,z){
  const T=ETYPES[type];const e={type,T,hp:T.hp,max:T.hp,alive:true,grp:new THREE.Group(),parts:[],cd:2,alert:false,t:rng()*10,home:new THREE.Vector3(x,0,z),dieT:0,dir:rng()<0.5?1:-1,ax:rng()<0.5?'x':'z',losT:0,sees:false};
  const s=e.grp;s.position.set(x,0,z);s.scale.setScalar(T.scale);world.add(s);
  const uni=M(T.uni),skin=M(0xd6a77a),blk=M(0x222222),hat=M(T.hat);
  const add=(w,h,d,px,py,pz,m,tag)=>{const p=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);p.position.set(px,py,pz);p.castShadow=true;p.userData.tag=tag;p.userData.enemy=e;s.add(p);e.parts.push(p);return p};
  add(0.25,0.85,0.28,-0.15,0.43,0,uni,'body');add(0.25,0.85,0.28,0.15,0.43,0,uni,'body');
  add(type==='heavy'||type==='boss'?0.8:0.62,0.75,0.42,0,1.25,0,uni,'body');add(0.66,0.3,0.4,0,1.45,0,hat,'body');
  add(0.32,0.32,0.32,0,1.82,0,skin,'head');add(0.38,0.14,0.38,0,2.0,0,hat,'head');
  if(type==='guard'){add(0.4,0.04,0.5,0,1.93,0.1,hat,'head')}
  if(type==='heavy'||type==='boss'){add(0.36,0.12,0.06,0,1.84,0.17,M(0x111111),'head')}
  add(0.18,0.6,0.18,-0.4,1.2,0.12,uni,'body');add(0.18,0.6,0.18,0.4,1.2,0.12,uni,'body');
  e.gun=add(0.08,0.12,type==='guard'?0.4:0.75,0.15,1.3,0.45,blk,'body');
  const c=document.createElement('canvas');c.width=128;c.height=16;e.hpC=c;e.hpTex=new THREE.CanvasTexture(c);
  e.hpS=new THREE.Sprite(new THREE.SpriteMaterial({map:e.hpTex,depthTest:false}));e.hpS.material.userData.own=true;e.hpS.scale.set(1,0.125,1);e.hpS.position.y=2.35;s.add(e.hpS);drawEHp(e);
  enemies.push(e);return e}
function drawEHp(e){const x=e.hpC.getContext('2d');x.fillStyle='#000';x.fillRect(0,0,128,16);x.fillStyle=e.type==='boss'?'#ffb020':'#e04040';x.fillRect(2,2,124*Math.max(0,e.hp)/e.max,12);e.hpTex.needsUpdate=true}
const aliveEnemies=()=>enemies.filter(e=>e.alive).length;
// ================= PLAYER / COMBAT =================
const player={pos:new THREE.Vector3(),yaw:0,pitch:0,hp:100,ammo:30,reload:0,bag:[],alive:true,gun:GEAR.gun[0],armor:GEAR.armor[0],bagG:GEAR.bag[0],kills:0};
let BAGCAP=12;const keys={};
let state='menu'; // menu | base | play | loot | extracting | end
let openC=null,fireCd=0;
const ray=new THREE.Raycaster();
function losBlocked(a,b){const d=b.clone().sub(a);const len=d.length();ray.set(a,d.normalize());ray.far=len;return ray.intersectObjects(solids,false).length>0}
const tracers=[];
function tracer(a,b,color){const geo=new THREE.BufferGeometry().setFromPoints([a,b]);const l=new THREE.Line(geo,new THREE.LineBasicMaterial({color,transparent:true}));scene.add(l);tracers.push({l,t:0.08})}
const flash=new THREE.PointLight(0xffc060,0,6);scene.add(flash);
const vm=new THREE.Group();vm.scale.setScalar(0.5);vm.position.set(0.08,0.0,-0.12);camera.add(vm);scene.add(camera);
camera.add(flashlight);flashlight.position.set(-0.25,0.15,-0.9);flashlight.target.position.set(0,0,-5);camera.add(flashlight.target);
const vmParts={};
{const gm=M(0x222428);vmParts.a=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.1,0.5),gm);vmParts.a.position.set(0.22,-0.2,-0.45);vm.add(vmParts.a);
 const b=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.16,0.08),gm);b.position.set(0.22,-0.29,-0.35);vm.add(b);
 vmParts.c=new THREE.Mesh(new THREE.BoxGeometry(0.04,0.04,0.25),M(0x111111));vmParts.c.position.set(0.22,-0.18,-0.8);vm.add(vmParts.c);
 vmParts.scope=new THREE.Mesh(new THREE.CylinderGeometry(0.035,0.035,0.22,10),M(0x111111));vmParts.scope.rotation.x=Math.PI/2;vmParts.scope.position.set(0.22,-0.12,-0.45);vm.add(vmParts.scope);
 vmParts.mag=new THREE.Mesh(new THREE.BoxGeometry(0.05,0.14,0.08),M(0x3a2a1a));vmParts.mag.position.set(0.22,-0.3,-0.55);vm.add(vmParts.mag);}
function styleVM(){const id=player.gun.id;vmParts.scope.visible=id==='g2';vmParts.mag.visible=id==='g1';vmParts.c.scale.z=id==='g2'?1.8:1;vmParts.a.material=M(id==='g1'?0x2b2420:id==='g2'?0x2f3a2a:0x222428)}
const mflash=new THREE.Mesh(new THREE.PlaneGeometry(0.22,0.22),new THREE.MeshBasicMaterial({color:0xffd27a,transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide}));mflash.position.set(0.22,-0.18,-0.97);vm.add(mflash);
const particles=[];function burst(p,color,n){for(let i=0;i<n;i++){const m=new THREE.Mesh(new THREE.BoxGeometry(0.07,0.07,0.07),new THREE.MeshBasicMaterial({color}));m.position.copy(p);scene.add(m);particles.push({m,v:new THREE.Vector3((Math.random()-0.5)*4,Math.random()*4,(Math.random()-0.5)*4),t:0.8})}}
function hitMarker(kill){const h=$('hitm');h.className='on'+(kill?' kill':'');clearTimeout(hitMarker.t);hitMarker.t=setTimeout(()=>h.className=kill?'kill':'',kill?400:90)}
let runT=0;const fmtT=t=>{t=Math.max(0,t);t=Math.round(t*10)/10;const m=Math.floor(t/60),s=t%60;return String(m).padStart(2,'0')+':'+s.toFixed(1).padStart(4,'0')};
// ---------- UI helpers ----------
function toast(t,ms=1600){const e=$('toast');e.innerHTML=t;e.style.opacity=1;clearTimeout(toast.h);toast.h=setTimeout(()=>e.style.opacity=0,ms)}
const bagValue=()=>player.bag.reduce((s,i)=>s+(i.key?0:i.v),0);
const fmt=v=>'$'+Math.round(v).toLocaleString('en-US');
function updHud(){$('hpfill').style.width=Math.max(0,player.hp)+'%';$('hptxt').textContent=Math.max(0,Math.ceil(player.hp));
  $('ammo').textContent=player.reload>0?'換彈中…':player.ammo+' / ∞';$('valtxt').textContent=fmt(bagValue());
  if(level){const k=player.bag.some(i=>i.key);$('raidinfo').innerHTML=`${level.theme.name} <small>#${level.seed}</small>　敵人 ${aliveEnemies()}/${enemies.length}${k?'　🔑':''}${level.event&&level.event!=='none'?'　<span class="ev">'+EVENTS[level.event].n+'</span>':''}`}}
function cellHTML(it){return `<div class="ic">${it.ic}</div><div class="nm">${it.name}</div><div class="pv">${it.key?'鑰匙':fmt(it.v)}</div>`}
const spinT=it=>RAR[it.r].t*UPG.luck.eff[S.upg.luck]*(level&&level.event==='lag'?1.6:1)*(window.__fastLoot?0.05:1);
function renderLoot(){
  if(!openC)return;const cg=$('cgrid');
  if(cg.children.length!==12){cg.innerHTML='';for(let i=0;i<12;i++){const d=document.createElement('div');d.className='cell';d.dataset.i=i;cg.appendChild(d)}}
  for(let i=0;i<12;i++){const d=cg.children[i],it=openC.items[i];let cls='cell',html='';
    if(!it){}else if(it.state==='wait'){cls+=' wait'}
    else if(it.state==='spin'){cls+=' spinning r'+it.r;html=`<div class="spin"></div><div class="spinbar"><i style="width:${Math.min(100,it.p/spinT(it)*100)}%"></i></div>`}
    else{cls+=' item r'+it.r+(it.pop?' pop':'');html=cellHTML(it);if(it.pop)setTimeout(()=>{it.pop=false},600)}
    if(d.className!==cls)d.className=cls;
    if(it&&it.state==='spin'){if(!d.querySelector('.spin'))d.innerHTML=html;else d.querySelector('.spinbar i').style.width=Math.min(100,it.p/spinT(it)*100)+'%';d.dataset.h=''}
    else if(d.dataset.h!==html){d.innerHTML=html;d.dataset.h=html}}
  renderBag()}
function renderBag(){const bg=$('bgrid');let h='';for(let i=0;i<BAGCAP;i++){const it=player.bag[i];h+=it?`<div class="cell item r${it.r}">${cellHTML(it)}</div>`:'<div class="cell"></div>'}
  if(bg.dataset.h!==h){bg.innerHTML=h;bg.dataset.h=h}$('bpcount').textContent=player.bag.length+'/'+BAGCAP;$('bpval').textContent=fmt(bagValue());updHud()}
function take(i){const it=openC&&openC.items[i];if(!it||it.state!=='done')return false;
  if(player.bag.length>=BAGCAP){toast('背包滿了。人生也是。');SFX.deny();return false}
  openC.items.splice(i,1);player.bag.push(it);SFX.pickup();if(it.key)toast('🔑 拿到鑰匙！去找上鎖的門。',1600);if(openC.cur>i)openC.cur--;renderLoot();return true}
function takeAll(){if(!openC)return;if(!openC.dummy)openC.auto=true;for(let i=openC.items.length-1;i>=0;i--){if(openC.items[i].state==='done')take(i)}}
$('cgrid').addEventListener('click',e=>{const c=e.target.closest('.cell');if(c)take(+c.dataset.i)});
$('btnTakeAll').onclick=takeAll;
$('btnSkip').onclick=()=>{if(!openC||openC.dummy)return;const it=openC.items.find(i=>i.state==='spin');if(!it||it.paid)return;if(!it.key)it.v=Math.max(1,Math.floor(it.v/2));it.paid=true;it.p=spinT(it);SFX.pickup();toast('💸 已付費加速：價值 -50%<br><small>恭喜成為尊榮會員</small>',1300)};$('btnClose').onclick=()=>closeLoot();
let lootClosedT=-99,diedLooting=false;
function openLoot(c){openC=c;if(!c.searched&&!c.dummy){c.searched=true;level.searched++}state='loot';$('lootTitle').textContent=c.label;$('cgrid').innerHTML='';$('loot').classList.remove('hidden');
  if(document.pointerLockElement)document.exitPointerLock();renderLoot()}
function closeLoot(){if(state!=='loot')return;if(!openC.dummy)lootClosedT=runT;openC=null;state='play';$('loot').classList.add('hidden');lock()}
function openBag(){openLoot({label:'（只是看看背包）',items:[],cur:-1,dummy:true})}
function stepLoot(dt){
  if(!openC||openC.dummy)return;const its=openC.items;
  let cur=its.findIndex(i=>i.state==='spin');
  if(cur<0){cur=its.findIndex(i=>i.state==='wait');if(cur<0)return;its[cur].state='spin';its[cur].p=0;its[cur].tk=0}
  const it=its[cur];it.p+=dt;it.tk=(it.tk||0)+dt;if(it.tk>0.12){it.tk=0;SFX.tick()}
  if(it.p>=spinT(it)){it.state='done';const oc=openC;if(oc.auto)setTimeout(()=>{if(openC===oc&&it.state==='done'){const j=oc.items.indexOf(it);if(j>=0)take(j)}},250);it.pop=true;SFX.reveal(it.r);
    if(it.r===4){const f=$('flashfx');f.className='on';setTimeout(()=>f.className='',60)}if(it.r>=3&&!it.key)toast(`<span style="color:${RCSS[it.r]}">${RAR[it.r].n}！${it.name}</span>`,1200)}}
// ---------- input ----------
function lock(){if((state==='play'||state==='hub')&&!window.__noLock)canvas.requestPointerLock&&canvas.requestPointerLock()}
canvas.addEventListener('click',()=>{if((state==='play'||state==='hub')&&!document.pointerLockElement)lock()});
addEventListener('mousemove',e=>{if((state!=='play'&&state!=='hub')||!document.pointerLockElement)return;
  player.yaw-=e.movementX*0.0022;player.pitch=Math.max(-1.45,Math.min(1.45,player.pitch-e.movementY*0.0022))});
let mouseHeld=false;addEventListener('pointerdown',()=>{if(state==='extracting')skipCine()});
addEventListener('mousedown',e=>{if(e.button===0&&state==='play'&&(document.pointerLockElement||window.__noLock)&&e.target===canvas){mouseHeld=true;fire()}});
addEventListener('mouseup',e=>{if(e.button===0)mouseHeld=false});addEventListener('blur',()=>{mouseHeld=false;for(const k in keys)keys[k]=false});
addEventListener('keydown',e=>{if(e.target&&e.target.tagName==='INPUT')return;keys[e.code]=true;if(e.repeat)return;
  if(state==='hub'){if(e.code==='KeyE')useStation();if(e.code==='Tab'||e.code==='KeyM'){e.preventDefault();openPanel()}return}
  if(state==='base'){if(e.code==='Escape'||e.code==='Tab'||e.code==='KeyM'){e.preventDefault();closePanel()}return}
  if(state==='extracting'){if(e.code==='KeyE'||e.code==='Space'||e.code==='Enter')skipCine();return}
  if(e.code==='KeyE'){if(state==='loot')closeLoot();else if(state==='play')interact()}
  if(e.code==='Tab'){e.preventDefault();if(state==='play')openBag();else if(state==='loot')closeLoot()}
  if(e.code==='Escape'&&state==='loot')closeLoot();
  if(e.code==='KeyR'&&state==='play')startReload();
  if(e.code==='KeyF'&&state==='loot')takeAll();});
addEventListener('keyup',e=>{keys[e.code]=false});
function startReload(){if(player.reload>0||player.ammo===player.gun.mag)return;player.reload=player.gun.rl;SFX.reload();updHud()}
function fire(){
  if(fireCd>0||player.reload>0||!player.alive)return;if(player.ammo<=0){startReload();return}
  const G=player.gun;player.ammo--;fireCd=G.rate;vm.position.z=G.id==='g2'?-0.04:-0.09;SFX.shoot();mflash.material.opacity=1;mflash.rotation.z=Math.random()*3;
  const o=camera.getWorldPosition(new THREE.Vector3()),dir=camera.getWorldDirection(new THREE.Vector3());
  dir.x+=(Math.random()-0.5)*G.spread;dir.y+=(Math.random()-0.5)*G.spread;dir.normalize();
  ray.set(o,dir);ray.far=200;const tg=solids.slice();for(const e of enemies)if(e.alive)tg.push(...e.parts);
  const hits=ray.intersectObjects(tg,false);
  const end=hits.length?hits[0].point:o.clone().addScaledVector(dir,120);
  const muzzle=vm.localToWorld(new THREE.Vector3(0.22,-0.18,-0.95));
  tracer(muzzle,end,0xffe08a);flash.position.copy(muzzle);flash.intensity=3;
  if(hits.length&&hits[0].object.userData.enemy){const e=hits[0].object.userData.enemy;if(e.alive){
    const head=hits[0].object.userData.tag==='head';damageEnemy(e,G.dmg*(head?2.4:1),head,hits[0].point)}}
  if(player.ammo<=0)startReload();updHud()}
function damageEnemy(e,dmg,head,pt){e.hp-=dmg;e.alert=true;drawEHp(e);SFX.hit(head);hitMarker(false);if(pt)burst(pt,0x9b1c1c,head?10:5);
  for(const o of enemies)if(o.alive&&o!==e&&o.grp.position.distanceTo(e.grp.position)<20)o.alert=true;
  if(e.hp<=0)killEnemy(e)}
function killEnemy(e){e.alive=false;e.hp=0;player.kills++;SFX.kill();hitMarker(true);burst(e.grp.position.clone().setY(1.4),0xb02020,30);drawEHp(e);e.hpS.visible=false;
  const c=container('corpse',e.grp.position.x,e.grp.position.z,0,{label:`${e.T.n}的屍體`,n:e.type==='boss'?5:undefined});if(e.type==='boss'){c.items.forEach(i=>{if(i.r<4){const L=ITEMS.filter(q=>q[0]===4);const q=pick(L);Object.assign(i,{r:4,ic:q[1],name:q[2],v:Math.round(q[3]*level.vmult)})}})}
  const n=aliveEnemies();toast(`<span style="color:#ff5a4a">✖ 擊殺 ${e.T.n}</span><br>${n?`剩下 ${n} 名敵人。`:'全圖敵人：清空。直升機在等你。'}`,2400);
  updObjective();updHud()}
function updObjective(){if(!level)return;const n=aliveEnemies();const tl=BAL.raidTime-runT;
  $('objective').textContent=n?(tl<=BAL.boardWindow?'駕駛不想等了：現在就能上直升機！':`目標：搜刮・清除 ${n} 名敵人・上直升機撤離`):'目標：上直升機（E）撤離'}
function interact(){
  if(nearHeli()){if(!canBoard()){toast(`駕駛說：外面還有 ${aliveEnemies()} 個敵人，先處理他們。<br><small>（或等到剩 1 分鐘，他就懶得管了）</small>`);SFX.deny();return}extract();return}
  const d=nearDoor(),c0=nearContainer();if(d&&(!c0||Math.hypot(d.pos.x-player.pos.x,d.pos.z-player.pos.z)<Math.hypot(c0.pos.x-player.pos.x,c0.pos.z-player.pos.z))){if(d.open)return;const ki=player.bag.findIndex(i=>i.key);if(ki<0){toast('🔒 上鎖了。鑰匙應該在某個容器裡。');SFX.deny();return}
    player.bag.splice(ki,1);d.open=true;const i=colliders.indexOf(d.col);if(i>=0)colliders.splice(i,1);const j=solids.indexOf(d.mesh);if(j>=0)solids.splice(j,1);d.signs.forEach(s=>s.visible=false);SFX.door();toast('🔓 門開了。裡面一定有好東西（行銷話術）。');updHud();return}
  if(c0)openLoot(c0)}
function nearContainer(){
  const dir=new THREE.Vector3(-Math.sin(player.yaw),0,-Math.cos(player.yaw));let best=null,bd=1e9;
  for(const c of containers){const d=new THREE.Vector3(c.pos.x-player.pos.x,0,c.pos.z-player.pos.z);const L=d.length();
    if(L<c.reach&&(L<c.reach-1.2||d.normalize().dot(dir)>0.35)&&L<bd){bd=L;best=c}}
  return best}
function nearDoor(){for(const d of doors)if(!d.open&&Math.hypot(d.pos.x-player.pos.x,d.pos.z-player.pos.z)<1.9)return d;return null}
const nearHeli=()=>Math.hypot(player.pos.x-heli.position.x,player.pos.z-heli.position.z)<5.5;
const canBoard=()=>aliveEnemies()===0||BAL.raidTime-runT<=BAL.boardWindow;
// ---------- movement ----------
function collide(p,R){R=R||BAL.R;for(const b of colliders){if(b.off)continue;
  const cx=Math.max(b.minX,Math.min(p.x,b.maxX)),cz=Math.max(b.minZ,Math.min(p.z,b.maxZ));const dx=p.x-cx,dz=p.z-cz,d2=dx*dx+dz*dz;
  if(d2<R*R){if(d2>1e-8){const d=Math.sqrt(d2);p.x=cx+dx/d*R;p.z=cz+dz/d*R}
    else{const o=[p.x-b.minX,b.maxX-p.x,p.z-b.minZ,b.maxZ-p.z],m=Math.min(...o);
      if(m===o[0])p.x=b.minX-R;else if(m===o[1])p.x=b.maxX+R;else if(m===o[2])p.z=b.minZ-R;else p.z=b.maxZ+R}}}}
function inBounds(p){const H=BAL.half;p.x=Math.max(-H,Math.min(H,p.x));p.z=Math.max(-H,Math.min(H,p.z))}
let bob=0;
function move(dt){
  let f=(keys.KeyW?1:0)-(keys.KeyS?1:0),s=(keys.KeyD?1:0)-(keys.KeyA?1:0);
  if(TOUCH.enabled&&(TOUCH.move.x||TOUCH.move.y)){f=TOUCH.move.y;s=TOUCH.move.x}
  if(Math.hypot(f,s)<0.15)return;const mag=Math.min(1,Math.hypot(f,s));const sp=((keys.ShiftLeft||keys.ShiftRight)?6.2:3.8)*player.armor.spd;
  const sy=Math.sin(player.yaw),cy=Math.cos(player.yaw);let vx=-sy*f+cy*s,vz=-cy*f-sy*s;const l=Math.hypot(vx,vz);vx/=l;vz/=l;vx*=mag;vz*=mag;
  for(let i=0;i<3;i++){player.pos.x+=vx*sp*dt/3;player.pos.z+=vz*sp*dt/3;collide(player.pos)}inBounds(player.pos);bob+=dt*sp*2.2}
const angDiff=(a,b)=>{let d=a-b;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;return d};
// ---------- enemy AI ----------
function enemyAI(e,dt){
  if(!e.alive){if(e.dieT<1){e.dieT=Math.min(1,e.dieT+dt*2.5);e.grp.rotation.x=-e.dieT*Math.PI/2;e.grp.position.y=e.dieT*0.15}return}
  const T=e.T;e.t+=dt;const eye=e.grp.position.clone().setY(1.8*T.scale),pe=camera.position.clone();const dist=eye.distanceTo(pe);
  e.losT-=dt;if(e.losT<=0){e.losT=0.15;e.sees=player.alive&&dist<T.range&&!losBlocked(eye,pe)}
  const sees=e.sees;if(sees&&(e.alert||dist<T.range*0.7))e.alert=true;
  if(e.alert&&sees){
    const want=Math.atan2(pe.x-eye.x,pe.z-eye.z);e.grp.rotation.y+=angDiff(want,e.grp.rotation.y)*Math.min(1,dt*6);
    if(T.advance&&dist>7){const p=e.grp.position;p.x+=Math.sin(want)*T.speed*dt;p.z+=Math.cos(want)*T.speed*dt;collide(p,0.4);inBounds(p)}
    e.cd-=dt;
    if(state==='loot'&&openC){e.cd=Math.max(e.cd,0.8)}
    else if(e.cd<=0){e.cd=T.cd[0]+Math.random()*(T.cd[1]-T.cd[0]);
      const muzzle=e.gun.localToWorld(new THREE.Vector3(0,0,0.4));const acc=T.acc+level.theme.tier*0.02;const hit=Math.random()<Math.max(0.2,Math.min(0.7,acc-dist/50));
      const target=hit?pe.clone().add(new THREE.Vector3(0,-0.2,0)):pe.clone().add(new THREE.Vector3((Math.random()-0.5)*2,(Math.random()-0.5)*1.5,(Math.random()-0.5)*2));
      tracer(muzzle,target,e.type==='boss'?0xffb020:0xff6040);SFX.enemyShot(dist);
      if(hit&&!window.__god){player.hp-=T.dmg*(1-player.armor.red);SFX.hurt();const d=$('dmg');d.style.opacity=1;setTimeout(()=>d.style.opacity=0,150);updHud();if(player.hp<=0)die('shot')}}
  }else{const p=e.grp.position;const sp=T.speed*(e.alert?1.3:1)*dt;const before=p.clone();
    if(e.ax==='x')p.x+=e.dir*sp;else p.z+=e.dir*sp;collide(p,0.4);inBounds(p);
    const moved=p.distanceTo(before);if(moved<sp*0.5||Math.abs((e.ax==='x'?p.x-e.home.x:p.z-e.home.z))>5){e.dir*=-1;if(moved<sp*0.5&&rng()<0.3)e.ax=e.ax==='x'?'z':'x'}
    const want=e.ax==='x'?(e.dir>0?Math.PI/2:-Math.PI/2):(e.dir>0?0:Math.PI);e.grp.rotation.y+=angDiff(want,e.grp.rotation.y)*Math.min(1,dt*4);e.cd=Math.max(e.cd,0.6)}}
// ================= LEVEL BUILD =================
const EVENTS={none:{n:'',d:''},airdrop:{n:'📦 空投',d:'35 秒後空投補給降落。'},blackout:{n:'🌑 停電',d:'全區停電。手電筒已開啟，物資價值 ×1.2。'},
  lag:{n:'🐌 伺服器延遲',d:'轉圈圈變慢 60%，但價值 ×1.3。'},reinforce:{n:'🚨 增援',d:'90 秒後會有一名增援抵達。'}};
const ground=new THREE.Mesh(new THREE.PlaneGeometry(260,260),new THREE.MeshStandardMaterial({color:0x6f8a4e,roughness:1}));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
function setLighting(th,dark){scene.background.setHex(dark?0x0b0f18:th.sky);scene.fog.color.setHex(dark?0x0b0f18:th.sky);scene.fog.near=dark?10:th.fog[0];scene.fog.far=dark?55:th.fog[1];
  hemi.intensity=dark?0.12:th.hemi;sun.intensity=dark?0.05:th.sun;sun.color.setHex(th.night?0x9fb4ff:0xfff1d6);ground.material.color.setHex(th.ground);flashlight.intensity=(dark||th.night)?(dark?40:22):0}
function buildLevel(ti,seed,isRandom){
  const th0=THEMES[ti];rng=mulberry(seed*2654435761>>>0||1);
  const er=rng();let event='none';if(er<0.15)event='airdrop';else if(er<0.27)event='blackout';else if(er<0.39)event='lag';else if(er<0.51)event='reinforce';
  const boss=rng()<0.08;
  const vmult=th0.mult*(isRandom?1+BAL.randomBonus:1)*(event==='blackout'?1.2:event==='lag'?1.3:1);
  let res=null,attempt=0;
  for(attempt=0;attempt<21;attempt++){
    const th=attempt===20?Object.assign({},th0,{lock:0}):th0;const minimal=attempt>=10;
    clearWorld();level={theme:th0,ti,seed,vmult,event,boss,isRandom,searched:0,keyC:null,spawn:new THREE.Vector3(ri(-8,8),0,30),spots:[],attempt};
    box(BAL.half*2+0.6,1.2,0.3,0,0.6,-BAL.half-0.3,0x555a5e,{collide:false});box(BAL.half*2+0.6,1.2,0.3,0,0.6,BAL.half+0.3,0x555a5e,{collide:false});box(0.3,1.2,BAL.half*2,-BAL.half-0.3,0.6,0,0x555a5e,{collide:false});box(0.3,1.2,BAL.half*2,BAL.half+0.3,0.6,0,0x555a5e,{collide:false});
    box(BAL.half*2,0.02,BAL.half*2,0,0.005,0,th.yardC,{collide:false,shadow:false});
    const hx=ri(-16,16),hz=ri(-28,-23),hy=rng()*Math.PI*2;placeHeli(hx,hz,hy);
    const reserved=[{minX:hx-7,maxX:hx+7,minZ:hz-7,maxZ:hz+7},{minX:level.spawn.x-4,maxX:level.spawn.x+4,minZ:26,maxZ:BAL.half}];
    const nb=ri(th.bld.n[0],th.bld.n[1]);const blds=[];
    for(let b=0;b<nb;b++){const cols=ri(th.bld.cols[0],th.bld.cols[1]),rows=ri(th.bld.rows[0],th.bld.rows[1]),cell=th.bld.cell;const W=cols*cell,D=rows*cell;
      for(let t=0;t<40;t++){const x0=-24+rng()*(48-W),z0=-20+rng()*(40-D);const r={minX:x0,maxX:x0+W,minZ:z0,maxZ:z0+D};if(overlaps(r,reserved,3.5))continue;reserved.push(r);blds.push(genBuilding(th,x0,z0,cols,rows,cell));break}}
    const locked=blds.find(b=>b.locked);
    genYard(th,reserved,minimal);
    if(locked){const cands=containers.filter(c=>c.room!==locked.locked&&c.kind!=='corpse');if(cands.length)level.keyC=pick(cands);else{continue}}
    res=validate();if(res.ok)break}
  // place key
  if(level.keyC)level.keyC.items.unshift({key:true,r:2,ic:'🔑',name:'門禁鑰匙',v:0,p:0,state:'wait'});
  // spots: reached cells far from spawn
  const seen=res.seen,sp=level.spawn;
  for(let i=0;i<4000&&level.spots.length<60;i++){const x=-BAL.half+2+rng()*(BAL.half*2-4),z=-BAL.half+2+rng()*(BAL.half*2-4);const X=Math.floor((x+RO)/RC),Z=Math.floor((z+RO)/RC);
    if(!seen[Z*RN+X])continue;if(Math.hypot(x-sp.x,z-sp.z)<18)continue;if(Math.hypot(x-heli.position.x,z-heli.position.z)<6)continue;
    let ok=true;for(let dz=-3;dz<=3&&ok;dz++)for(let dx=-3;dx<=3;dx++)if(!seen[(Z+dz)*RN+X+dx]){ok=false;break}if(ok)level.spots.push(new THREE.Vector3(x,0,z))}
  const list=th0.enemies[rng()<0.5?0:1].slice();if(boss)list.push('boss');
  const used=[];for(const t of list){let s=null;for(let k=0;k<20;k++){const c=pick(level.spots);if(c&&used.every(u=>u.distanceTo(c)>10)){s=c;break}}s=s||pick(level.spots)||new THREE.Vector3(0,0,0);used.push(s);makeEnemy(t,s.x,s.z)}
  setLighting(th0,event==='blackout');
  level.valid=res.ok;level.bad=res.bad;return level}
// ================= RAID FLOW =================
let raidT={airdrop:false,reinforce:false,warn60:false,warn20:false};
function newSeed(){return (Math.floor(Math.random()*900000)+100000)}
function deploy(ti,seed,isRandom){
  if(ti==null||ti<0){ti=Math.floor(Math.random()*5);isRandom=true}
  seed=seed||newSeed();
  // gear check-out
  const eq={gun:gearOf('gun',S.equip.gun),armor:gearOf('armor',S.equip.armor),bag:gearOf('bag',S.equip.bag)};
  for(const k of['gun','armor','bag']){if(eq[k].price>0&&!(S.gear[eq[k].id]>0)){eq[k]=GEAR[k][0];S.equip[k]=eq[k].id}}
  const out=[];for(const k of['gun','armor','bag'])if(eq[k].price>0){S.gear[eq[k].id]--;out.push(eq[k].id)}
  S.inRaid={gear:out,theme:ti,seed};S.stats.raids++;save();
  $('base').classList.add('hidden');$('end').classList.add('hidden');
  buildLevel(ti,seed,isRandom);
  Object.assign(player,{hp:100,reload:0,bag:[],alive:true,gun:eq.gun,armor:eq.armor,bagG:eq.bag,kills:0,ammo:eq.gun.mag,yaw:0,pitch:0});player.pos.copy(level.spawn);
  BAGCAP=eq.bag.cap;styleVM();vm.visible=true;vm.rotation.set(0,0,0);vm.position.set(0.08,0,-0.12);
  runT=0;lootClosedT=-99;diedLooting=false;raidT={airdrop:false,reinforce:false,warn60:false,warn20:false};cine.done=false;
  $('hud').classList.remove('hidden');if(TOUCH.enabled)$('touchui').classList.remove('hidden');$('loot').classList.add('hidden');
  state='play';updObjective();updHud();renderBag();lock();
  const ev=EVENTS[level.event];
  toast(`<b>${level.theme.name}</b>　<small>種子 #${seed}${isRandom?'　隨機部署 +10%':''}</small><br><small>${level.theme.twist}</small>${ev.d?`<br><span class="ev">${ev.n}：${ev.d}</span>`:''}${level.boss?'<br><span style="color:#ffb020">⚠ 情報：本區有「隊長」坐鎮。</span>':''}`,5200);
  SFX.unlock&&SFX.unlock()}
function raidEvents(){
  const tl=BAL.raidTime-runT;
  if(level.event==='airdrop'&&!raidT.airdrop&&runT>35){raidT.airdrop=true;const s=pick(level.spots)||new THREE.Vector3();const nc0=colliders.length;const c=container('airdrop',s.x,s.z,rng()*3);c.cols=colliders.slice(nc0);c.cols.forEach(b=>b.off=true);c.grp.position.y=30;c.drop=true;level.drop=c;toast('📦 空投降落中！（地圖上的藍色箱子）',2500);SFX.alarm&&SFX.alarm()}
  if(level.drop&&level.drop.drop){const g=level.drop.grp;g.position.y=Math.max(0,g.position.y-0.25);level.drop.marker.position.y=g.position.y+1.65;if(g.position.y<=0){level.drop.drop=false;(level.drop.cols||[]).forEach(b=>b.off=false);burst(g.position.clone().setY(0.3),0xcdb88e,30)}}
  if(level.event==='reinforce'&&!raidT.reinforce&&runT>90){raidT.reinforce=true;let s=null;for(const c of level.spots)if(c.distanceTo(player.pos)>20){s=c;break}s=s||level.spots[0]||new THREE.Vector3();const e=makeEnemy('grunt',s.x,s.z);e.alert=true;toast('🚨 增援抵達。他看起來比你更不想加班。',2500);SFX.alarm&&SFX.alarm();updObjective()}
  if(!raidT.warn60&&tl<=BAL.boardWindow){raidT.warn60=true;toast('⏰ 剩 1 分鐘！駕駛不管敵人了，<b>現在可以直接登機</b>。',3000);SFX.alarm&&SFX.alarm();updObjective()}
  if(!raidT.warn20&&tl<=20){raidT.warn20=true;toast('⏰ 剩 20 秒！直升機要走了！',2000)}
  if(tl<=0&&state!=='extracting')die('mia')}
// ---------- settle ----------
function stashCap(){return UPG.stash.eff[S.upg.stash]}
function addToStash(items){let sold=0;for(const it of items){if(it.key)continue;const o={r:it.r,ic:it.ic,name:it.name,v:it.v};if(S.stash.length<stashCap())S.stash.push(o);else{sold+=Math.round(it.v*0.5)}}S.money+=sold;return sold}
function checkQuest(R){const q=S.quest;if(!q||q.done)return false;let ok=false;
  if(q.type==='theme')ok=R.ok&&R.ti===q.theme;if(q.type==='rare')ok=R.ok&&R.bag.filter(i=>i.r>=q.r&&!i.key).length>=q.n;if(q.type==='kills')ok=R.ok&&R.kills>=q.n;
  if(q.type==='speed')ok=R.ok&&R.t<=q.s;if(q.type==='value')ok=R.ok&&R.value>=q.v;if(q.type==='empty')ok=R.ok&&R.bag.filter(i=>!i.key).length===0;
  if(ok)q.done=true;return ok}
function settle(ok){const R={ok,ti:level.ti,bag:player.bag.slice(),kills:player.kills,t:runT,value:bagValue()};let info={};
  if(ok){for(const id of S.inRaid.gear)S.gear[id]=(S.gear[id]||0)+1;info.sold=addToStash(R.bag);S.stats.extracts++;S.stats.best=Math.max(S.stats.best,R.value);S.stats.earned+=R.value}
  else{const N=UPG.secure.eff[S.upg.secure];const keep=R.bag.filter(i=>!i.key).sort((a,b)=>b.v-a.v).slice(0,N);info.kept=keep;info.sold=addToStash(keep);
    info.lostGear=[];info.insured=[];for(const id of S.inRaid.gear){if(Math.random()<BAL.insurance){S.gear[id]=(S.gear[id]||0)+1;info.insured.push(id)}else info.lostGear.push(id)}S.stats.deaths++}
  info.quest=checkQuest(R);S.inRaid=null;S.seedN++;save();return info}
const gearName=id=>{for(const k in GEAR){const g=GEAR[k].find(x=>x.id===id);if(g)return g.n}return id};
function die(reason){if(!player.alive||state==='end')return;diedLooting=reason==='shot'&&runT-lootClosedT<4;player.alive=false;state='end';if(document.pointerLockElement)document.exitPointerLock();
  const lost=bagValue(),n=player.bag.length;$('loot').classList.add('hidden');openC=null;const info=settle(false);
  $('endTitle').textContent=reason==='mia'?'直升機走了':'行動失敗';$('endTitle').style.color='#e04040';
  const head=reason==='mia'?'你還在搜最後一個抽屜，頭頂傳來越來越小的螺旋槳聲。官方紀錄：失蹤（MIA）。':diedLooting?'你剛關掉轉圈圈視窗，還沉浸在開箱的餘韻裡，背後就傳來槍響。':'你在離直升機不遠的地方倒下。';
  $('endBody').innerHTML=`<div>${head}</div><div class="big" style="color:#e04040">-${fmt(lost)}</div>
  <div class="sat">背包裡的 ${n} 件寶物已歸零。那些轉圈圈的時間，請當作是一種冥想。</div>
  ${info.kept.length?`<div>🔐 安全箱保住：${info.kept.map(i=>i.ic+' '+i.name).join('、')}</div>`:''}
  ${info.lostGear.length?`<div style="color:#ff9a8a">遺失裝備：${info.lostGear.map(gearName).join('、')}</div>`:''}
  ${info.insured.length?`<div style="color:#9fe0a8">保險理賠：${info.insured.map(gearName).join('、')}（保險公司表示非常遺憾，並調漲了保費）</div>`:''}
  ${info.quest?'<div style="color:#ffd54a">✔ 任務達成！回基地找老K領錢。</div>':''}`;
  $('end').classList.remove('hidden');$('touchui').classList.add('hidden')}
// ---------- extraction cinematic ----------
const CINE_LEN=7.6;const cine={t:0,p0:new THREE.Vector3(),q0:new THREE.Quaternion(),heli0:new THREE.Vector3(),yaw0:0,titled:false,done:false,whoosh:false};
const dummyCam=new THREE.PerspectiveCamera();
const ease=x=>x<0.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2, clamp01=x=>Math.max(0,Math.min(1,x)), seg=(t,a,b)=>clamp01((t-a)/(b-a));
const DUSTN=160,dustPos=new Float32Array(DUSTN*3),dustV=new Float32Array(DUSTN*3),dustLife=new Float32Array(DUSTN);
const dustGeo=new THREE.BufferGeometry();dustGeo.setAttribute('position',new THREE.BufferAttribute(dustPos,3));
const dust=new THREE.Points(dustGeo,new THREE.PointsMaterial({map:(()=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),gr=x.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=gr;x.fillRect(0,0,64,64);return new THREE.CanvasTexture(c)})(),color:0xcdb88e,size:1.4,transparent:true,opacity:0.55,depthWrite:false}));dust.frustumCulled=false;dust.visible=false;scene.add(dust);
function resetDust(){for(let i=0;i<DUSTN;i++){dustPos[i*3+1]=-50;dustLife[i]=0}dustGeo.attributes.position.needsUpdate=true}resetDust();
let dustI=0;
function stepDust(dt,spawn){
  for(let k=0;k<spawn;k++){const i=dustI++%DUSTN,a=Math.random()*Math.PI*2,r=1.5+Math.random()*2;
    dustPos[i*3]=heli.position.x+Math.cos(a)*r;dustPos[i*3+1]=0.2+Math.random()*0.3;dustPos[i*3+2]=heli.position.z+Math.sin(a)*r;
    const sp=6+Math.random()*6;dustV[i*3]=Math.cos(a)*sp;dustV[i*3+1]=0.5+Math.random()*1.5;dustV[i*3+2]=Math.sin(a)*sp;dustLife[i]=1.2}
  for(let i=0;i<DUSTN;i++){if(dustLife[i]<=0)continue;dustLife[i]-=dt;
    dustPos[i*3]+=dustV[i*3]*dt;dustPos[i*3+1]+=dustV[i*3+1]*dt;dustPos[i*3+2]+=dustV[i*3+2]*dt;dustV[i*3]*=0.96;dustV[i*3+2]*=0.96;
    if(dustLife[i]<=0)dustPos[i*3+1]=-50}
  dustGeo.attributes.position.needsUpdate=true}
const CINE_SUBS=['直升機準時抵達。這是整局最不真實的部分。','敵人很少，直升機很準時，你的背包很重。','你帶走了物資，也帶走了一身轉圈圈的回憶。','撤離比搜刮還快。這就是效率。'];
let cineRS=6;
let extractInfo=null;
function extract(){
  extractInfo=settle(true);state='extracting';cine.t=0;cine.titled=cine.done=cine.whoosh=cine.clunk=false;
  keys.KeyW=keys.KeyA=keys.KeyS=keys.KeyD=false;mouseHeld=false;TOUCH.firing=false;TOUCH.move.x=TOUCH.move.y=0;
  if(document.pointerLockElement)document.exitPointerLock();$('touchui').classList.add('hidden');
  cine.p0.copy(camera.position);cine.q0.copy(camera.quaternion);cine.heli0.copy(heli.position);cine.yaw0=heli.rotation.y;
  document.body.classList.add('cine');$('cine').classList.remove('hidden');
  $('cineSub').textContent=CINE_SUBS[Math.floor(Math.random()*CINE_SUBS.length)];SFX.holster()}
function skipCine(){if(state!=='extracting'||cine.t<1||cine.done)return;finishCine(true)}
function finishCine(skipped){if(skipped){cine.t=CINE_LEN-0.02;cine.titled=true;stepCine(0.01);vm.visible=false;heli.userData.door.position.z=0}cine.done=true;if(!cine.titled)SFX.sting();dust.visible=false;
  $('cine').classList.add('hidden');$('cine').classList.remove('titled');document.body.classList.remove('cine');SFX.rotor(0);showExtract()}
function heli0dir(){const d=new THREE.Vector3(-cine.heli0.x,0,-cine.heli0.z);if(d.lengthSq()<1)d.set(0,0,1);return d.normalize()}
function stepCine(dt){
  const T=cine.t+=dt,L=heli.localToWorld.bind(heli);
  const h=clamp01(T/0.7),he=1-Math.pow(1-h,2);vm.rotation.x=-he*1.1;vm.position.y=-he*0.45;vm.visible=h<1;
  cineRS=T<2.0?6+T*2:T<3.6?10+(T-2)/1.6*30:40;
  const fT=Math.max(0,T-3.6);
  if(fT>0){const d=heli0dir(),yawT=Math.atan2(d.x,d.z);
    heli.rotation.y=cine.yaw0+angDiff(yawT,cine.yaw0)*ease(seg(T,3.9,5.0));
    heli.position.y=Math.min(fT,1.2)*2.2+Math.max(0,fT-1.2)*5;
    const fwd=Math.max(0,fT-1.0),dist=fwd*fwd*4.5;heli.position.x=cine.heli0.x+d.x*dist;heli.position.z=cine.heli0.z+d.z*dist;
    heli.rotation.x=0.25*ease(seg(T,4.3,5.0));if(!cine.whoosh&&T>4.4){cine.whoosh=true;SFX.whoosh()}}
  dust.visible=T>2&&T<6.5;stepDust(dt,(T>2.0&&heli.position.y<7)?Math.round(dt*240*seg(T,2,3.2)):0);
  if(T<2.5){const door=L(new THREE.Vector3(-2.8,1.7,-0.6)),seat=L(new THREE.Vector3(-0.35,1.95,-0.6)),out=L(new THREE.Vector3(-6,1.4,-0.6));
    const w=ease(seg(T,0.6,2.1));const a=cine.p0.clone().lerp(door,w),b=door.clone().lerp(seat,w);camera.position.copy(a.lerp(b,w));
    dummyCam.position.copy(seat);dummyCam.lookAt(out);camera.quaternion.copy(cine.q0).slerp(dummyCam.quaternion,ease(seg(T,0.7,2.1)));
    heli.userData.door.position.z=-1.5+1.5*ease(seg(T,1.9,2.35));
    if(T>2.1){camera.position.x+=(Math.random()-0.5)*0.02;camera.position.y+=(Math.random()-0.5)*0.02}
    if(T>2.35&&!cine.clunk){cine.clunk=true;SFX.door()}
  }else if(T<4.9){const d=heli0dir();camera.position.copy(cine.heli0).add(new THREE.Vector3(-d.x*10+d.z*5,1.2,-d.z*10-d.x*5));camera.lookAt(heli.position.x,heli.position.y+1.6,heli.position.z)}
  else{const k=T-4.9,ang=heli.rotation.y+2.2+k*0.35,r=9+k*1.5;
    camera.position.set(heli.position.x+Math.sin(ang)*r,heli.position.y+1.5+k*0.8,heli.position.z+Math.cos(ang)*r);camera.lookAt(heli.position.x,heli.position.y+1,heli.position.z)}
  if(!cine.titled&&T>5.0){cine.titled=true;$('cine').classList.add('titled');SFX.sting()}
  if(T>=CINE_LEN&&!cine.done)finishCine(false)}
function showExtract(){state='end';const v=bagValue(),bag=player.bag.filter(i=>!i.key).sort((a,b)=>b.r-a.r||b.v-a.v);const info=extractInfo||settle(true);extractInfo=null;
  const fs=bag.filter(i=>i.r===4).length;let sat;
  if(!bag.length)sat='你兩手空空撤離了。恭喜，你是本局唯一沒被開箱綁架的人。';
  else if(v<300)sat='冒著生命危險，帶回一雙襪子等級的財富。市場對你的評價：穩健。';
  else if(v<3000)sat='小有收穫。下一局你一定會再多轉幾個圈圈，對吧？';
  else if(v<15000)sat='大賺！你的多巴胺正在敲鑼打鼓。請記得：這些都是像素。';
  else sat='超級大撈一筆！系統已記住你，下次的轉圈圈會更長一點。（開玩笑的…大概）';
  $('endTitle').textContent='撤離成功';$('endTitle').style.color='#5fd17a';
  $('endBody').innerHTML=`<div>${level.theme.name} <small>#${level.seed}</small>　本局帶出物資</div><div class="big">${fmt(v)}</div>
  <div class="list">${bag.map(i=>`<span class="r${i.r}">${i.ic} ${i.name}</span>`).join('')||'<i>（空）</i>'}</div>
  <div class="big" style="font-size:26px;color:#9fd8ff">⏱ 用時 ${fmtT(runT)}</div>
  <div>擊殺：${player.kills} / ${enemies.length}　·　搜刮容器：${level.searched}${fs?`　·　傳說物品：${fs}`:''}${bag.some(i=>i.paid)?`　·　付費加速：${bag.filter(i=>i.paid).length} 次（感謝您的贊助）`:''}</div>
  <div>已存入倉庫${info.sold?`　·　倉庫滿了，${fmt(info.sold)} 已被老K半價收購`:''}</div>
  ${info.quest?'<div style="color:#ffd54a">✔ 任務達成！回基地找老K領錢。</div>':''}
  <div class="sat">${sat}</div>`;
  $('end').classList.remove('hidden')}
// ================= BASE HUB (walkable) =================
const stations=[];let hubSt=null,npcGrp=null,npcBubble=null,npcBubT=0,hubT=0;
function textSprite(txt,o={}){const c=document.createElement('canvas');c.width=512;c.height=128;const tex=new THREE.CanvasTexture(c);
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,depthTest:false,transparent:true}));s.material.userData.own=true;s.renderOrder=20;
  s.userData.draw=t=>{const x=c.getContext('2d');x.clearRect(0,0,512,128);x.fillStyle=o.bg||'rgba(10,12,16,.82)';x.beginPath();x.roundRect?x.roundRect(4,14,504,100,26):x.rect(4,14,504,100);x.fill();
    if(o.border){x.strokeStyle=o.border;x.lineWidth=6;x.stroke()}let fs=56;x.font=`bold ${fs}px sans-serif`;while(x.measureText(t).width>480&&fs>18){fs-=2;x.font=`bold ${fs}px sans-serif`}
    x.fillStyle=o.fg||'#ffd54a';x.textAlign='center';x.textBaseline='middle';x.fillText(t,256,66);tex.needsUpdate=true};
  s.userData.draw(txt);const w=o.w||1.7;s.scale.set(w,w/4,1);return s}
function addStation(id,label,tab,x,z,w,h,d,ly,r){
  const ol=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(w+0.12,h+0.12,d+0.12)),new THREE.LineBasicMaterial({color:0xffd54a,transparent:true,opacity:0.9,depthTest:false}));ol.renderOrder=15;
  ol.material.userData.own=true;ol.position.set(x,h/2,z);ol.visible=false;world.add(ol);
  const lb=textSprite(`[E] ${label}`,{border:'#ffd54a'});lb.position.set(x,(ly||h)+0.55,z);lb.visible=false;world.add(lb);
  const st={id,label,tab,pos:new THREE.Vector3(x,0,z),r:r||2.1,ol,lb};stations.push(st);return st}
function buildBase(){
  clearWorld();stations.length=0;rng=mulberry(4242);level=null;
  const th={sky:0x9ab3c4,hemi:0.8,sun:1.0,ground:0x6b6a5a};scene.background.setHex(th.sky);scene.fog.color.setHex(th.sky);scene.fog.near=30;scene.fog.far=90;hemi.intensity=0.8;sun.intensity=1.0;sun.color.setHex(0xfff1d6);ground.material.color.setHex(th.ground);flashlight.intensity=0;
  box(16,0.1,12,0,0.05,0,0x5c5a55,{collide:false});
  box(16,4.5,0.3,0,2.25,-6,0x8a8f7a);box(0.3,4.5,12,-8,2.25,0,0x8a8f7a);box(0.3,4.5,12,8,2.25,0,0x8a8f7a);
  box(16.6,0.3,12.6,0,4.6,0,0x4a5240,{collide:false});
  box(15.4,0.02,0.6,0,4.44,5.5,EM(0xfff4e0,0x8a7a5a),{collide:false,shadow:false});
  colliders.push({minX:-8,maxX:8,minZ:6,maxZ:6.4}); // open garage door: invisible barrier
  for(let i=0;i<6;i++)box(0.2,0.6,0.2,-7.5+i*3,0.3,6.2,0xd8a020,{collide:false});
  const l=lamps[0];l.position.set(0,3.8,0);l.intensity=26;l.distance=20;l.color.setHex(0xffe8c0);
  // 1) stash lockers — count grows with stash upgrade
  const n=2+S.upg.stash*2;for(let i=0;i<n;i++){const x=-7.35+i*0.72;box(0.68,2.1,0.6,x,1.05,-5.5,i%2?0x55606e:0x4a5462);box(0.05,0.3,0.03,x+0.22,1.2,-5.19,0xc8c8c8,{collide:false});for(const y of[1.75,1.85])box(0.4,0.03,0.02,x,y,-5.19,0x2a2f36,{collide:false})}
  const sx=-7.35+(n-1)*0.36;addStation('stash','倉庫','stash',sx,-5.5,n*0.72,2.1,0.6,2.1,2.3);
  // 2) workbench — tools appear with luck/secure upgrades
  box(2.4,0.9,0.9,3.6,0.45,-5.4,0x6b4a2f);box(2.4,1.2,0.08,3.6,1.5,-5.82,0x3a3e44,{collide:false});
  const tools=1+S.upg.luck+S.upg.secure;for(let i=0;i<tools;i++)box(0.12,0.5,0.06,2.7+i*0.45,1.5,-5.76,[0xb0b0b0,0xd04040,0x40a0d0,0xe0c040][i%4],{collide:false});
  box(0.5,0.25,0.35,3.2,1.02,-5.3,0x2f6b3a,{collide:false});box(0.3,0.15,0.3,4.2,0.98,-5.4,0x888888,{collide:false});
  addStation('upg','工作台','upg',3.6,-5.4,2.4,0.9,0.9,1.4);
  // gear rack (shows equipped gear)
  box(2.6,2.2,0.3,0.4,1.1,-5.7,0x3a3e44);
  const icons=['🔫','🦺','🎒'];icons.forEach((ic,i)=>{const s=new THREE.Sprite(new THREE.SpriteMaterial({map:emojiTex(ic)}));s.material.userData.own=true;s.position.set(-0.4+i*0.8,1.3,-5.45);s.scale.setScalar(0.7);world.add(s)});
  // 3) trophy shelf — rows grow with shelf upgrade, real items shown as rarity-colored blocks
  const cap=UPG.shelf.eff[S.upg.shelf],rows=Math.max(1,Math.ceil(cap/3));
  box(0.5,0.6+rows*0.8,4.4,7.55,(0.6+rows*0.8)/2,-2,0x5a3a22);
  for(let r=0;r<rows;r++)box(0.6,0.06,4.4,7.45,0.6+r*0.8,-2,0x7a5a3a,{collide:false});
  S.trophies.forEach((t,i)=>{const y=0.63+Math.floor(i/3)*0.8,z=-3.3+(i%3)*1.3;const col=parseInt(RCSS[t.r].slice(1),16);
    box(0.4,0.4,0.4,7.25,y+0.2,z,EM(col,col),{collide:false});const s=new THREE.Sprite(new THREE.SpriteMaterial({map:emojiTex(t.ic),depthTest:true}));s.material.userData.own=true;s.position.set(7.0,y+0.62,z);s.scale.setScalar(0.42);world.add(s)});
  if(!cap){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:emojiTex('🔒')}));s.material.userData.own=true;s.position.set(7.2,1.0,-2);s.scale.setScalar(0.6);world.add(s)}
  addStation('shelf','展示櫃','stash',7.55,-2,0.5,0.6+rows*0.8,4.4,0.6+rows*0.8,2.4);
  // 4) NPC 老K behind a table
  box(2.2,0.8,1.1,-4,0.4,1,0x6b4a2f);
  const mp=Math.min(12,Math.floor(Math.log10(Math.max(10,S.money))*2));for(let i=0;i<mp;i++)box(0.4,0.08,0.2,-4.6+(i%4)*0.35,0.84+Math.floor(i/4)*0.08,1.2,0x3f8a4a,{collide:false});
  const k=new THREE.Group();k.position.set(-4,0,-0.2);world.add(k);npcGrp=k;colliders.push({minX:-4.4,maxX:-3.6,minZ:-0.5,maxZ:0.1});
  const add=(w,h,d,x,y,z,c,p)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),M(c));m.position.set(x,y,z);m.castShadow=true;(p||k).add(m);return m};
  add(0.25,0.85,0.28,-0.15,0.43,0,0x3a3a3a);add(0.25,0.85,0.28,0.15,0.43,0,0x3a3a3a);const torso=add(0.66,0.75,0.42,0,1.25,0,0x8a5a2a);
  const head=new THREE.Group();head.position.set(0,1.82,0);k.add(head);add(0.32,0.32,0.32,0,0,0,0xd6a77a,head);add(0.36,0.1,0.06,0,0.04,0.17,0x111111,head);add(0.4,0.1,0.4,0,0.2,0,0xb03030,head);
  const armL=add(0.16,0.6,0.16,-0.42,1.3,0,0x8a5a2a),armR=add(0.16,0.6,0.16,0.42,1.3,0,0x8a5a2a);k.userData={head,armL,armR,torso};
  npcBubble=textSprite(NPC_LINES[npcLine]||'',{bg:'rgba(255,255,255,.92)',fg:'#222',w:3.2});npcBubble.position.set(0,3.05,0);k.add(npcBubble);npcBubT=0;
  addStation('npc','老K・任務','quest',-4,-0.2,0.8,2.1,0.6,1.85,2.4).pos.set(-4,0,0.6);
  // 5) shop vending machine
  box(1.0,2.1,1.2,-7.3,1.05,3.4,0xb03030);box(0.04,1.4,0.9,-6.79,1.25,3.4,EM(0x9fd8ff,0x3a6a8a),{collide:false});box(0.04,0.3,0.6,-6.79,0.35,3.4,0x222222,{collide:false});
  const sh=textSprite('🛒 老K百貨',{bg:'#ffd54a',fg:'#222',w:1.1});sh.position.set(-6.75,2.3,3.4);world.add(sh);
  addStation('shop','商店','shop',-7.3,3.4,1.0,2.1,1.2,2.1,2.3);
  // 6) deploy map table
  box(2.2,0.85,1.4,3.6,0.425,2.6,0x4a3a2a);box(2.0,0.02,1.2,3.6,0.86,2.6,EM(0x5d7a4a,0x1a2a14),{collide:false});
  for(let i=0;i<5;i++){const t=THEMES[i];box(0.12,0.2,0.12,2.85+i*0.38,0.97,2.4+(i%2)*0.4,EM(t.sky,t.sky),{collide:false})}
  const ms=textSprite('🚁 出擊',{bg:'#2f6b3a',fg:'#fff',w:1.0});ms.position.set(3.6,1.9,2.6);world.add(ms);
  addStation('deploy','出擊・選地圖','deploy',3.6,2.6,2.2,0.85,1.4,1.2,2.2);
  placeHeli(0,15,0.6);baseCamT=0}
function enterHub(){state='hub';const hh=$('hubhint');if(hh){hh.style.visibility='';hh.textContent=TOUCH.enabled?'走動中：左搖桿移動、右側拖曳轉視角、E 互動、📋 選單':'走動中：WASD 移動、滑鼠轉視角、E 互動、Tab 選單';hh.classList.add('big');clearTimeout(enterHub._t);enterHub._t=setTimeout(()=>hh.classList.remove('big'),5000)}player.pos.set(0,0,3.6);player.yaw=0;player.pitch=-0.08;$('base').classList.add('hidden');$('hud').classList.remove('hidden');
  if(TOUCH.enabled)$('touchui').classList.remove('hidden');lock()}
function openPanel(tab){const hh=$('hubhint');if(hh)hh.style.visibility='hidden';if(tab)baseTab=tab;state='base';if(document.pointerLockElement)document.exitPointerLock();$('touchui').classList.add('hidden');$('base').classList.remove('hidden');SFX.tick&&SFX.tick();renderBase()}
function closePanel(){if(state!=='base')return;const hh=$('hubhint');if(hh)hh.style.visibility='';state='hub';$('base').classList.add('hidden');if(TOUCH.enabled)$('touchui').classList.remove('hidden');lock()}
function useStation(){if(state!=='hub'||!hubSt)return;if(hubSt.id==='npc'){npcLine=(npcLine+1)%NPC_LINES.length;npcBubble&&npcBubble.userData.draw(NPC_LINES[npcLine])}openPanel(hubSt.tab)}
function stepHub(dt){hubT+=dt;
  if(npcGrp){const u=npcGrp.userData;u.head.rotation.y=Math.sin(hubT*0.7)*0.5;u.head.position.y=1.82+Math.sin(hubT*2)*0.015;u.armL.rotation.x=Math.sin(hubT*1.3)*0.25;u.armR.rotation.x=-Math.sin(hubT*1.3)*0.25;u.torso.scale.y=1+Math.sin(hubT*2)*0.015;
    const dx=player.pos.x-npcGrp.position.x,dz=player.pos.z-npcGrp.position.z;npcGrp.rotation.y+=(Math.atan2(dx,dz)*(Math.hypot(dx,dz)<5?1:0)-npcGrp.rotation.y)*Math.min(1,dt*3);
    npcBubT+=dt;if(npcBubT>6){npcBubT=0;npcLine=(npcLine+1)%NPC_LINES.length;npcBubble.userData.draw(NPC_LINES[npcLine])}}
  let best=null,bd=1e9;if(state==='hub'){const fx=-Math.sin(player.yaw),fz=-Math.cos(player.yaw);
    for(const s of stations){const dx=s.pos.x-player.pos.x,dz=s.pos.z-player.pos.z,d=Math.hypot(dx,dz);if(d>s.r)continue;const dot=(dx*fx+dz*fz)/Math.max(0.01,d);if(dot<0.25&&d>1.0)continue;const sc=d-dot;if(sc<bd){bd=sc;best=s}}}
  hubSt=best;for(const s of stations){const on=s===best;s.ol.visible=on;s.lb.visible=on;if(on){s.ol.material.opacity=0.65+Math.sin(hubT*6)*0.3}}}
const hubPrompt=()=>hubSt?`按 <kbd>E</kbd> ${hubSt.label}　<small>（Tab / M：快速選單）</small>`:`走到設施前按 <kbd>E</kbd> 互動　<small>Tab / M：快速選單</small>`;
// ================= BASE =================
let baseTab='deploy',baseCamT=0,npcLine=0;
function toBase(){
  if(state==='play'||state==='loot'||state==='extracting')return;
  state='base';$('end').classList.add('hidden');$('start').classList.add('hidden');$('hud').classList.add('hidden');$('loot').classList.add('hidden');
  if(document.pointerLockElement)document.exitPointerLock();vm.visible=false;resetDust();
  npcLine=Math.floor(Math.random()*NPC_LINES.length);buildBase();enterHub();renderBase()}
const rcls=r=>'r'+r;
function renderBase(){
  $('bmoney').textContent=fmt(S.money);$('bnpc').textContent=NPC_LINES[npcLine];
  document.querySelectorAll('#btabs [data-tab]').forEach(b=>b.classList.toggle('on',b.dataset.tab===baseTab));
  let h='';
  if(baseTab==='deploy'){
    const eq=['gun','armor','bag'].map(k=>gearOf(k,S.equip[k]));
    h+=`<div class="sub">目前裝備：${eq.map(g=>g.n+(g.price?` <small>(庫存 ${S.gear[g.id]||0})</small>`:'')).join('・')}　<small>非免費裝備陣亡會遺失（保險 25% 理賠）</small></div><div class="themes">`;
    THEMES.forEach((t,i)=>{h+=`<div class="tcard" data-deploy="${i}" style="--c:#${t.sky.toString(16).padStart(6,'0')}"><b>${t.name}</b><div>${'★'.repeat(t.tier)}${'☆'.repeat(5-t.tier)}</div><div>價值 ×${t.mult}</div><small>${t.twist}</small></div>`});
    h+=`<div class="tcard rnd" data-deploy="-1"><b>🎲 隨機部署</b><div>？？？</div><div>價值 +10%</div><small>老K幫你抽。他的手氣跟他的人生一樣。</small></div></div>
    <div class="sub">種子（選填）：<input id="bseed" inputmode="numeric" placeholder="留空 = 隨機" maxlength="7"></div>`}
  if(baseTab==='stash'){const cap=stashCap();
    h+=`<div class="sub">倉庫 ${S.stash.length}/${cap}　總值 ${fmt(S.stash.reduce((s,i)=>s+i.v,0))}　<button data-act="sellcommon">賣掉所有普通/精良</button> <button data-act="sellall">全部賣掉</button></div><div class="sgrid">`;
    S.stash.forEach((it,i)=>{h+=`<div class="cell item ${rcls(it.r)}">${cellHTML(it)}<div class="acts"><button data-sell="${i}">賣</button>${it.r>=3?`<button data-show="${i}">展示</button>`:''}</div></div>`});
    if(!S.stash.length)h+='<i>空空如也。去搜點東西回來吧。</i>';
    h+=`</div><div class="sub">🏆 展示櫃 ${S.trophies.length}/${UPG.shelf.eff[S.upg.shelf]}</div><div class="sgrid">`;
    S.trophies.forEach((it,i)=>{h+=`<div class="cell item ${rcls(it.r)}">${cellHTML(it)}<div class="acts"><button data-unshow="${i}">收回</button></div></div>`});h+='</div>'}
  if(baseTab==='shop'){h+='<div class="shop">';
    for(const k of['gun','armor','bag']){h+=`<div class="scol"><h3>${{gun:'武器',armor:'護甲',bag:'背包'}[k]}</h3>`;
      for(const g of GEAR[k]){const own=g.price?(S.gear[g.id]||0):'∞',eq=S.equip[k]===g.id;
        const stat=k==='gun'?`傷害 ${g.dmg}・彈匣 ${g.mag}`:k==='armor'?`減傷 ${Math.round(g.red*100)}%${g.spd<1?'・移速 '+Math.round(g.spd*100)+'%':''}`:`${g.cap} 格`;
        h+=`<div class="gcard${eq?' eq':''}"><b>${g.n}</b> <small>${stat}</small><div><small>${g.d}</small></div><div>庫存 ${own}　${g.price?`<button data-buy="${k}:${g.id}" ${S.money<g.price?'disabled':''}>買 ${fmt(g.price)}</button>`:''} <button data-equip="${k}:${g.id}" ${eq||(g.price&&!(S.gear[g.id]>0))?'disabled':''}>${eq?'已裝備':'裝備'}</button></div></div>`}
      h+='</div>'}h+='</div>'}
  if(baseTab==='upg'){h+='<div class="shop">';
    for(const k in UPG){const u=UPG[k],lv=S.upg[k],mx=u.lv.length-1;const val=k==='luck'?`轉圈 ×${u.eff[lv]}`:k==='stash'?`${u.eff[lv]} 格`:k==='shelf'?`${u.eff[lv]} 格`:`保留 ${u.eff[lv]} 件`;
      h+=`<div class="gcard"><b>${u.n}</b> <small>Lv ${lv}/${mx}</small><div><small>${u.d}</small></div><div>目前：${val}　${lv<mx?`<button data-upg="${k}" ${S.money<u.lv[lv+1]?'disabled':''}>升級 ${fmt(u.lv[lv+1])}</button>`:'<b>MAX</b>'}</div></div>`}
    h+=`</div><div class="sub">戰績：出擊 ${S.stats.raids}・撤離 ${S.stats.extracts}・陣亡 ${S.stats.deaths}・最佳單局 ${fmt(S.stats.best)}・累計 ${fmt(S.stats.earned)}　<button data-act="reset">重置存檔</button></div>`}
  if(baseTab==='quest'){const q=S.quest;
    h+=`<div class="quest"><div class="npc">🧔 老K的任務板</div>`;
    if(!q)h+=`<div>目前沒有任務。</div><button data-act="newq">接任務</button>`;
    else h+=`<div class="qt">${q.t}</div><div>獎金 ${fmt(q.reward)}</div>${q.done?`<button data-act="claim">✔ 領取獎金</button>`:`<div><small>進行中…（下一局達成即可）</small></div><button data-act="dropq">放棄（老K會翻白眼）</button>`}`;
    h+='</div>'}
  $('bbody').innerHTML=h}
function sellItem(i){const it=S.stash.splice(i,1)[0];if(it){S.money+=it.v;SFX.cash&&SFX.cash()}}
$('bclose').onclick=()=>closePanel();$('btnMenu').onclick=e=>{e.stopPropagation();if(state==='hub')openPanel()};
$('btabs').addEventListener('click',e=>{const b=e.target.closest('[data-tab]');if(!b)return;baseTab=b.dataset.tab;SFX.tick();renderBase()});
$('bbody').addEventListener('click',e=>{const t=e.target.closest('[data-deploy],[data-sell],[data-show],[data-unshow],[data-buy],[data-equip],[data-upg],[data-act]');if(!t)return;const d=t.dataset;
  if(d.deploy!=null){const v=parseInt(($('bseed')||{}).value||'',10);const i=+d.deploy;deploy(i<0?null:i,v>0?v:null,i<0);return}
  if(d.sell!=null)sellItem(+d.sell);
  if(d.show!=null){if(S.trophies.length>=UPG.shelf.eff[S.upg.shelf]){toast('展示櫃滿了（或還沒蓋）。去「升級」。');SFX.deny()}else{const tr=S.stash.splice(+d.show,1)[0];S.trophies.push(tr);SFX.reveal(tr.r);buildBase()}}
  if(d.unshow!=null){if(S.stash.length>=stashCap()){toast('倉庫滿了。');SFX.deny()}else{S.stash.push(S.trophies.splice(+d.unshow,1)[0]);buildBase()}}
  if(d.buy){const [k,id]=d.buy.split(':');const g=gearOf(k,id);if(S.money>=g.price){S.money-=g.price;S.gear[id]=(S.gear[id]||0)+1;S.equip[k]=id;SFX.cash&&SFX.cash();toast(`買了 ${g.n}，並已裝備。`)}}
  if(d.equip){const [k,id]=d.equip.split(':');S.equip[k]=id;SFX.pickup();buildBase()}
  if(d.upg){const u=UPG[d.upg],lv=S.upg[d.upg];if(lv<u.lv.length-1&&S.money>=u.lv[lv+1]){S.money-=u.lv[lv+1];S.upg[d.upg]++;SFX.cash&&SFX.cash();toast(`${u.n} 升到 Lv ${S.upg[d.upg]}`);buildBase()}}
  if(d.act==='sellcommon'){for(let i=S.stash.length-1;i>=0;i--)if(S.stash[i].r<=1)sellItem(i)}
  if(d.act==='sellall'){while(S.stash.length)sellItem(0)}
  if(d.act==='newq'){S.quest=Object.assign(QUESTS[S.questN%QUESTS.length](S.questN),{done:false});S.questN++;npcLine=(npcLine+1)%NPC_LINES.length}
  if(d.act==='claim'&&S.quest&&S.quest.done){S.money+=S.quest.reward;toast(`領到 ${fmt(S.quest.reward)}！老K：「別花在轉蛋上。」`);S.quest=null;SFX.cash&&SFX.cash()}
  if(d.act==='dropq'){S.quest=null}
  if(d.act==='reset'){if(confirm('確定重置存檔？')){S=defSave();buildBase()}}
  save();renderBase()});
$('btnBase').onclick=()=>{SFX.resume();toBase()};
$('btnStart').onclick=()=>{SFX.resume();toBase()};
// ================= LOOP =================
let last=performance.now();
function loop(now){
  if(window.__frameMode){if(!window.__frames){requestAnimationFrame(loop);return}window.__frames--}
  const dt=window.__frameMode?1/30:Math.min(0.05,(now-last)/1000);last=now;
  const inRaid=state==='play'||state==='loot';
  if(inRaid)runT+=dt;
  if(TOUCH.enabled){if(state==='play'||state==='hub'){player.yaw-=TOUCH.look.dx*0.005;player.pitch=Math.max(-1.45,Math.min(1.45,player.pitch-TOUCH.look.dy*0.005));if(TOUCH.firing&&state==='play')fire()}TOUCH.look.dx=TOUCH.look.dy=0}
  if(mouseHeld&&state==='play')fire();else if(state!=='play')mouseHeld=false;
  if(level){const tl=BAL.raidTime-runT;const te=$('timer');te.textContent=fmtT(tl);te.className=tl<=BAL.boardWindow?'warn':''}
  if(state==='hub'||(state==='play'&&player.alive))move(dt);
  if(state==='loot'){stepLoot(dt);renderLoot()}
  if(inRaid){for(const e of enemies)enemyAI(e,dt);raidEvents()}else for(const e of enemies)if(!e.alive&&e.dieT<1)enemyAI(e,dt);
  fireCd-=dt;if(player.reload>0){player.reload-=dt;if(player.reload<=0){player.ammo=player.gun.mag;player.reload=0;updHud()}}
  vm.position.z=-0.12+(vm.position.z+0.12)*0.8;flash.intensity*=0.6;mflash.material.opacity*=0.5;
  for(let i=particles.length-1;i>=0;i--){const q=particles[i];q.t-=dt;q.v.y-=9*dt;q.m.position.addScaledVector(q.v,dt);if(q.m.position.y<0.03){q.m.position.y=0.03;q.v.set(0,0,0)}if(q.t<=0){scene.remove(q.m);q.m.geometry.dispose();q.m.material.dispose();particles.splice(i,1)}}
  for(let i=tracers.length-1;i>=0;i--){const t=tracers[i];t.t-=dt;t.l.material.opacity=Math.max(0,t.t/0.08);if(t.t<=0){scene.remove(t.l);t.l.geometry.dispose();t.l.material.dispose();tracers.splice(i,1)}}
  for(const d of doors)if(d.open&&d.t<1){d.t=Math.min(1,d.t+dt*1.5);d.mesh.position.y=1.15-d.t*2.25}
  if(state==='hub'||state==='base')stepHub(dt);
  document.body.classList.toggle('inhub',state==='hub'||state==='base');
  if(state!=='extracting'&&!(state==='end'&&cine.done)&&state!=='menu'){camera.position.set(player.pos.x,1.6+Math.sin(bob)*0.03,player.pos.z);camera.rotation.set(player.pitch,player.yaw,0,'YXZ')}
  else if(state==='menu'){baseCamT+=dt;camera.position.set(Math.sin(baseCamT*0.1)*14,5,Math.cos(baseCamT*0.1)*14);camera.lookAt(0,1,0)}
  for(const c of containers){c.marker.visible=c.items.length>0;c.marker.rotation.y+=dt*2;c.marker.material.color.setHex(c.kind==='airdrop'?0x5ab0ff:c.searched?0x888888:0xf5c542)}
  const rs=state==='extracting'?cineRS:state==='base'?3:(level&&canBoard()?22:6);
  if(inRaid||state==='extracting'){const hd=player.pos.distanceTo(heli.position);SFX.rotor(Math.min(1,(rs/40)*Math.max(0.15,1-hd/60)))}else SFX.rotor(0);
  heli.userData.rotor.rotation.y+=dt*rs;heli.userData.rotor2.rotation.y+=dt*rs;heli.userData.tail.rotation.x+=dt*rs*2;
  if(state==='extracting')stepCine(dt);
  let pr='';if(state==='hub')pr=hubPrompt();else if(state==='play'){if(nearHeli())pr=canBoard()?'按 <kbd>E</kbd> 登機撤離':`還有 ${aliveEnemies()} 名敵人（或等到剩 1 分鐘）`;else{const d=nearDoor(),c=nearContainer();if(d&&(!c||Math.hypot(d.pos.x-player.pos.x,d.pos.z-player.pos.z)<c.pos.distanceTo(new THREE.Vector3(player.pos.x,c.pos.y,player.pos.z))))pr=player.bag.some(i=>i.key)?'按 <kbd>E</kbd> 用鑰匙開門':'🔒 上鎖的門（需要鑰匙）';else{if(c)pr=`按 <kbd>E</kbd> 搜刮${c.label}${c.items.length?'':'（空）'}`}}}
  const pe=$('prompt');if(pe.dataset.h!==pr){pe.innerHTML=pr;pe.dataset.h=pr;pe.style.display=pr?'block':'none'}
  renderer.render(scene,camera);requestAnimationFrame(loop)}
// title backdrop: a random house level
if(S.inRaid){const g0=S.inRaid.gear||[];const g=[];for(const id of g0){if(Math.random()<BAL.insurance)S.gear[id]=(S.gear[id]||0)+1;else g.push(id)}S.inRaid=null;S.stats.deaths++;save();setTimeout(()=>toast(`上一局中途離開，視同陣亡。${g.length?'遺失：'+g.map(gearName).join('、'):''}`,4000),300)}
buildLevel(0,7,false);updHud();requestAnimationFrame(loop);
window.__game={stations,openPanel,closePanel,useStation,get hubSt(){return hubSt},get state(){return state},get level(){return level},get S(){return S},cine,skipCine,player,containers,enemies,doors,heli,openLoot,closeLoot,takeAll,interact,fire,nearContainer,nearDoor,bagValue,deploy,toBase,buildLevel,validate,
  hurtEnemy(i,d){const e=enemies[i];if(e&&e.alive)damageEnemy(e,d||999,false,null)},killAll(){for(const e of enemies)if(e.alive)killEnemy(e)},setRunT(t){runT=t},
  start(){$('btnStart').click()},
  face(x,z,y){const e=new THREE.Vector3(x,y==null?1.6:y,z);const d=e.sub(new THREE.Vector3(player.pos.x,1.6,player.pos.z));player.yaw=Math.atan2(-d.x,-d.z);player.pitch=Math.atan2(d.y,Math.hypot(d.x,d.z))},
  // teleport next to a container on the reachable side (for tests)
  reach(c){const g=validate().seen;let best=null,bd=1e9;for(let a=0;a<32;a++)for(const r of[1.0,1.4,1.8]){const x=c.pos.x+Math.cos(a/32*6.283)*r,z=c.pos.z+Math.sin(a/32*6.283)*r;const X=Math.floor((x+RO)/RC),Z=Math.floor((z+RO)/RC);if(g[Z*RN+X]&&r<bd){bd=r;best=[x,z]}}
    if(!best)return false;player.pos.set(best[0],0,best[1]);this.face(c.pos.x,c.pos.z,0.5);return true}};
})();
