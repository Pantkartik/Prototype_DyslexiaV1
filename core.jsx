/* ============ Sproutly core: data, store, speech, sfx, icons, shared UI ============ */
const { useState, useEffect, useRef, useMemo, useCallback, createContext, useContext } = React;

/* ---------- Letter curriculum ---------- */
const LETTERS = [
  { l:'A', word:'Apple',   pic:'🍎', snd:'ah',   alt:['Ant','🐜'],   tint:'blush' },
  { l:'B', word:'Ball',    pic:'⚽', snd:'buh',  alt:['Bee','🐝'],   tint:'sky' },
  { l:'C', word:'Cat',     pic:'🐱', snd:'kuh',  alt:['Cake','🍰'],  tint:'sun' },
  { l:'D', word:'Dog',     pic:'🐶', snd:'duh',  alt:['Duck','🦆'],  tint:'leaf' },
  { l:'E', word:'Egg',     pic:'🥚', snd:'eh',   alt:['Elephant','🐘'], tint:'plum' },
  { l:'F', word:'Fish',    pic:'🐟', snd:'fff',  alt:['Frog','🐸'],  tint:'sky' },
  { l:'G', word:'Grapes',  pic:'🍇', snd:'guh',  alt:['Goat','🐐'],  tint:'plum' },
  { l:'H', word:'Hat',     pic:'🎩', snd:'huh',  alt:['House','🏠'], tint:'blush' },
  { l:'I', word:'Igloo',   pic:'🧊', snd:'ih',   alt:['Insect','🐛'],tint:'sky' },
  { l:'J', word:'Jam',     pic:'🍯', snd:'juh',  alt:['Jet','✈️'],  tint:'sun' },
  { l:'K', word:'Kite',    pic:'🪁', snd:'kuh',  alt:['Key','🔑'],   tint:'leaf' },
  { l:'L', word:'Lion',    pic:'🦁', snd:'lll',  alt:['Leaf','🍃'],  tint:'sun' },
  { l:'M', word:'Moon',    pic:'🌙', snd:'mmm',  alt:['Mouse','🐭'], tint:'plum' },
  { l:'N', word:'Nest',    pic:'🪺', snd:'nnn',  alt:['Nose','👃'],  tint:'leaf' },
  { l:'O', word:'Octopus', pic:'🐙', snd:'oh',   alt:['Orange','🍊'],tint:'blush' },
  { l:'P', word:'Pig',     pic:'🐷', snd:'puh',  alt:['Pear','🍐'],  tint:'blush' },
  { l:'Q', word:'Queen',   pic:'👑', snd:'kwuh', alt:['Quilt','🛏️'], tint:'sun' },
  { l:'R', word:'Rabbit',  pic:'🐰', snd:'rrr',  alt:['Rain','🌧️'], tint:'sky' },
  { l:'S', word:'Sun',     pic:'☀️', snd:'sss',  alt:['Snake','🐍'], tint:'sun' },
  { l:'T', word:'Tree',    pic:'🌳', snd:'tuh',  alt:['Turtle','🐢'],tint:'leaf' },
  { l:'U', word:'Umbrella',pic:'☂️', snd:'uh',   alt:['Up','⬆️'],   tint:'plum' },
  { l:'V', word:'Van',     pic:'🚐', snd:'vvv',  alt:['Violin','🎻'],tint:'sky' },
  { l:'W', word:'Whale',   pic:'🐳', snd:'wuh',  alt:['Worm','🪱'],  tint:'sky' },
  { l:'X', word:'Fox',     pic:'🦊', snd:'ks',   alt:['Box','📦'],   tint:'blush' },
  { l:'Y', word:'Yo-yo',   pic:'🪀', snd:'yuh',  alt:['Yak','🐃'],   tint:'sun' },
  { l:'Z', word:'Zebra',   pic:'🦓', snd:'zzz',  alt:['Zip','🤐'],   tint:'leaf' },
];
// Letters that dyslexic learners commonly mix up — used as smart distractors
const CONFUSABLE = { b:['d','p','q'], d:['b','p','q'], p:['q','b','d'], q:['p','d','b'], m:['w','n','u'], w:['m','v','u'], n:['u','h','m'], u:['n','v','w'], a:['e','o','d'], e:['a','c','o'], c:['e','o','s'], f:['t','l','j'], t:['f','l','i'], i:['l','j','t'], l:['i','t','j'], j:['i','g','y'], g:['q','j','y'], y:['g','v','j'], s:['z','c','x'], z:['s','x','n'], h:['n','k','b'], k:['h','x','r'], o:['a','c','e'], r:['n','h','k'], v:['u','w','y'], x:['k','z','s'] };
const UNIT_SIZE = 4;
// Build the path: 4 letters then a checkpoint
const PATH = (() => { const out=[]; LETTERS.forEach((L,i)=>{ out.push({type:'letter', id:L.l, idx:i}); if((i+1)%UNIT_SIZE===0 || i===LETTERS.length-1) out.push({type:'checkpoint', id:'cp'+Math.ceil((i+1)/UNIT_SIZE), unit:Math.ceil((i+1)/UNIT_SIZE), letters:LETTERS.slice(Math.floor(i/UNIT_SIZE)*UNIT_SIZE, i+1).map(x=>x.l)}); }); return out; })();
const UNIT_NAMES = ['First Sounds','Fun Friends','Tall Letters','Round & Round','Quiet Letters','Zippy Letters','Last Stop'];
const TINTS = { leaf:['var(--leaf)','var(--leaf-dd)','var(--leaf-l)'], blush:['var(--blush)','var(--blush-d)','var(--blush-l)'], sun:['var(--sun)','var(--sun-d)','var(--sun-l)'], sky:['var(--sky)','var(--sky-d)','var(--sky-l)'], plum:['var(--plum)','var(--plum-d)','var(--plum-l)'] };
const shuffle = a => { const b=[...a]; for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];} return b; };
const getLetter = l => LETTERS.find(x=>x.l===l.toUpperCase());

/* ---------- Store ---------- */
const DEFAULT_SETTINGS = { font:'Lexend', size:1, spacing:'wide', tint:'cream', rate:0.85, autoRead:true, sfx:true, voice:'Sprout' };
const DEFAULT_PROGRESS = { done:{A:3,B:3,C:2}, cps:{}, xp:340, streak:6, stars:8, traced:{A:5,B:3,C:2} };
const loadLS = (k,d) => { try{ const v=JSON.parse(localStorage.getItem(k)); return v?{...d,...v}:d; }catch(e){ return d; } };

const AppCtx = createContext(null);
const useApp = () => useContext(AppCtx);

function useAppStore(){
  const [route, setRoute] = useState(()=> loadLS('sp_route',{name:'login'}) );
  const [settings, setSettings] = useState(()=> loadLS('sp_settings', DEFAULT_SETTINGS));
  const [progress, setProgress] = useState(()=> loadLS('sp_progress', DEFAULT_PROGRESS));
  const [user, setUser] = useState(()=> loadLS('sp_user', { parent:'Priya', kids:[{id:'maya',name:'Maya',age:7,color:'leaf'},{id:'arjun',name:'Arjun',age:5,color:'sky'}], activeKid:'maya', role:'child' }));
  const [toast, setToast] = useState(null);
  useEffect(()=>{ localStorage.setItem('sp_route', JSON.stringify(route)); },[route]);
  useEffect(()=>{ localStorage.setItem('sp_settings', JSON.stringify(settings)); },[settings]);
  useEffect(()=>{ localStorage.setItem('sp_progress', JSON.stringify(progress)); },[progress]);
  useEffect(()=>{ localStorage.setItem('sp_user', JSON.stringify(user)); },[user]);
  const go = useCallback((name, params={}) => { window.speechSynthesis && speechSynthesis.cancel(); setRoute({name, ...params}); }, []);
  const showToast = useCallback((msg)=>{ setToast({msg,k:Date.now()}); setTimeout(()=>setToast(null),2400); },[]);
  const kid = user.kids.find(k=>k.id===user.activeKid) || user.kids[0];
  return { route, go, settings, setSettings, progress, setProgress, user, setUser, kid, toast, showToast };
}

/* ---------- Speech ---------- */
let _voice = null;
function pickVoice(){
  if(!window.speechSynthesis) return null;
  const vs = speechSynthesis.getVoices();
  _voice = vs.find(v=>/Samantha|Karen|Moira|Tessa|Google UK English Female|Google US English/i.test(v.name)) || vs.find(v=>/^en/i.test(v.lang)) || null;
  return _voice;
}
if(window.speechSynthesis){ pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
const speechState = { rate:0.85, listeners:new Set(), speaking:null };
function speak(text, { onWord, id } = {}){
  return new Promise(resolve=>{
    if(!window.speechSynthesis){ setTimeout(resolve, 600); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if(_voice) u.voice = _voice;
    u.rate = speechState.rate; u.pitch = 1.15;
    speechState.speaking = id || text; speechState.listeners.forEach(f=>f());
    let fallbackTimer = null;
    if(onWord){
      let got = false;
      u.onboundary = e => { if(e.name==='word' || e.charIndex!=null){ got=true; onWord(e.charIndex); } };
      // fallback: if no boundary events, estimate
      const words = [...text.matchAll(/\S+/g)].map(m=>m.index);
      let i=0; fallbackTimer = setInterval(()=>{ if(got){clearInterval(fallbackTimer);return;} if(i<words.length) onWord(words[i++]); }, 380/speechState.rate);
    }
    const end = ()=>{ clearInterval(fallbackTimer); speechState.speaking=null; speechState.listeners.forEach(f=>f()); resolve(); };
    u.onend = end; u.onerror = end;
    speechSynthesis.speak(u);
    // safety
    setTimeout(()=>{ if(speechState.speaking===(id||text) && !speechSynthesis.speaking) end(); }, 400 + text.length*120);
  });
}
function useSpeaking(id){
  const [, force] = useState(0);
  useEffect(()=>{ const f=()=>force(x=>x+1); speechState.listeners.add(f); return ()=>speechState.listeners.delete(f); },[]);
  return speechState.speaking === id;
}

/* ---------- SFX (WebAudio, no files) ---------- */
let _ac=null; const sfxState={on:true};
function tone(freqs, dur=.12, type='sine', gap=.09, vol=.18){
  if(!sfxState.on) return;
  try{
    _ac = _ac || new (window.AudioContext||window.webkitAudioContext)();
    freqs.forEach((f,i)=>{ const o=_ac.createOscillator(), g=_ac.createGain(); o.type=type; o.frequency.value=f; const t=_ac.currentTime+i*gap; g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(vol,t+.01); g.gain.exponentialRampToValueAtTime(.001,t+dur); o.connect(g).connect(_ac.destination); o.start(t); o.stop(t+dur+.02); });
  }catch(e){}
}
const sfx = {
  tap:()=>tone([660],.06,'sine',0,.08),
  good:()=>tone([660,880,1175],.16,'triangle',.08),
  bad:()=>tone([330,247],.2,'sine',.12,.14),
  pop:()=>tone([900+Math.random()*300],.07,'sine',0,.12),
  win:()=>tone([523,659,784,1047,1319],.22,'triangle',.1),
};

/* ---------- Icons ---------- */
const ICONS = {
  home:'M3 11.5 12 4l9 7.5M5.5 9.5V20h13V9.5M10 20v-5.5h4V20',
  map:'M9 4 3 6.5v13.5l6-2.5 6 2.5 6-2.5V4l-6 2.5L9 4Zm0 0v13.5m6-11v13.5',
  pencil:'M4 20l1.2-4.6L16.5 4.1a2 2 0 0 1 2.8 0l.6.6a2 2 0 0 1 0 2.8L8.6 18.8 4 20Zm10.5-13.9 3.4 3.4',
  user:'M12 12a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4Zm-7.5 8.4c.8-3.6 3.8-5.8 7.5-5.8s6.7 2.2 7.5 5.8',
  speaker:'M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4Zm11.5-.8a4.5 4.5 0 0 1 0 6.6m2.7-9.3a8.3 8.3 0 0 1 0 12',
  star:'M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.8L12 3.5Z',
  lock:'M6.5 10.5h11v9.5h-11v-9.5Zm2.5 0V8a3 3 0 0 1 6 0v2.5',
  check:'M5 12.5l4.5 4.5L19 7.5',
  x:'M6 6l12 12M18 6 6 18',
  heart:'M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z',
  flame:'M12 21c-3.9 0-6.5-2.6-6.5-6.2 0-3.4 2.6-5.2 3.4-8.8 2.4 1.4 3.4 3.4 3.4 5.2 1-.6 1.6-1.8 1.7-3.2 2.4 1.8 4.5 4.3 4.5 6.8 0 3.6-2.6 6.2-6.5 6.2Z',
  back:'M14.5 5.5 8 12l6.5 6.5',
  next:'M9.5 5.5 16 12l-6.5 6.5',
  replay:'M4.5 12a7.5 7.5 0 1 0 2.2-5.3M4.5 4.5v4h4',
  eraser:'M8.5 19.5h11M4.8 14.7l8.9-8.9a2 2 0 0 1 2.8 0l2.7 2.7a2 2 0 0 1 0 2.8l-7.6 7.6a2 2 0 0 1-1.4.6H9.4a2 2 0 0 1-1.4-.6l-3.2-3.2a.7.7 0 0 1 0-1Zm4-4 6.6 6.6',
  trash:'M5 7h14M10 7V4.5h4V7m-7.5 0 1 12.5h9l1-12.5',
  gear:'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7.4-3a7.4 7.4 0 0 0-.1-1.3l2-1.6-2-3.4-2.4 1a7.5 7.5 0 0 0-2.2-1.3L14.3 3h-4l-.4 2.4a7.5 7.5 0 0 0-2.2 1.3l-2.4-1-2 3.4 2 1.6a7.4 7.4 0 0 0 0 2.6l-2 1.6 2 3.4 2.4-1a7.5 7.5 0 0 0 2.2 1.3l.4 2.4h4l.4-2.4a7.5 7.5 0 0 0 2.2-1.3l2.4 1 2-3.4-2-1.6c.1-.4.1-.9.1-1.3Z',
  book:'M4 5.5c2.7-1 5.4-1 8 .8 2.6-1.8 5.3-1.8 8-.8v13c-2.7-1-5.4-1-8 .8-2.6-1.8-5.3-1.8-8-.8v-13ZM12 6.3v13',
  chart:'M4 20h16M7 16.5V11m5 5.5V6.5m5 10v-7.5',
  logout:'M14 4.5H6v15h8m-3-7.5h9m-3-3.5 3.5 3.5-3.5 3.5',
  clock:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13.5V12l3 2',
  swap:'M7 7.5h12m0 0-3.5-3.5M19 7.5 15.5 11M17 16.5H5m0 0 3.5 3.5M5 16.5 8.5 13',
  plus:'M12 5v14M5 12h14',
  mail:'M3.5 6h17v12h-17V6Zm0 .5 8.5 6.5 8.5-6.5',
  key:'M14.5 9.5a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm-.7 2.3L20 18v2.5h-2.5V19H16v-1.5h-1.5l-2.2-2.2',
  eye:'M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Zm9.5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  bulb:'M9 18h6m-5 3h4m-6.5-9.5a5.5 5.5 0 1 1 9.5 3.8c-.9.9-1.5 2-1.5 3.2V18H9.5v-.5c0-1.2-.6-2.3-1.5-3.2a5.5 5.5 0 0 1-.5-.8',
  shield:'M12 3.5 5 6v5.5c0 4.4 3 8 7 9 4-1 7-4.6 7-9V6l-7-2.5Z',
  bell:'M6 16.5V11a6 6 0 1 1 12 0v5.5l1.5 2h-15l1.5-2Zm4 3.5a2 2 0 0 0 4 0',
  target:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-4.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0-3.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  hand:'M8 13V5.5a1.5 1.5 0 0 1 3 0V11m0-1.5V4a1.5 1.5 0 0 1 3 0v6.5m0-5a1.5 1.5 0 0 1 3 0V12m0-3.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-1.2a6 6 0 0 1-4.8-2.4L4.3 14.8a1.6 1.6 0 0 1 2.4-2.1L8 14',
};
function Icon({ n, s=26, w=2.2, fill, style, color }){
  return <svg width={s} height={s} viewBox="0 0 24 24" fill={fill||'none'} stroke={color||'currentColor'} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" style={{display:'block',flex:'none',...style}}><path d={ICONS[n]}/></svg>;
}

/* ---------- Shared components ---------- */
function Mascot({ size=220, bob=true, style, className='', flip }){
  return <img src="assets/sprout.png" alt="Sprout the mascot" draggable={false}
    className={(bob?'bob ':'')+className}
    style={{width:size, height:'auto', display:'block', userSelect:'none', pointerEvents:'none', filter:'drop-shadow(0 14px 18px rgba(60,80,40,.18))', transform: flip?'scaleX(-1)':undefined, ...style}}/>;
}
function SpeakBtn({ text, id, size, lg, style, onWord, label }){
  const sid = id || text;
  const on = useSpeaking(sid);
  return <button className={'speak'+(lg?' lg':'')+(on?' playing':'')} style={{...(size?{width:size,height:size}:{}),...style}} aria-label={label||'Read aloud'}
    onClick={e=>{ e.stopPropagation(); speak(text,{id:sid,onWord}); }}>
    <Icon n="speaker" s={lg?34:24}/>
  </button>;
}
function StatusBar({ dark }){
  const t = new Date(); const hh = t.getHours()%12||12, mm = String(t.getMinutes()).padStart(2,'0');
  return <div className="sbar" style={{color: dark?'#fff':'var(--ink)'}}>
    <span>{hh}:{mm}</span>
    <span className="r"><svg width="18" height="13" viewBox="0 0 18 13"><path d="M9 12.5 1 4.2a11.5 11.5 0 0 1 16 0L9 12.5Z" fill="currentColor"/></svg><span style={{fontSize:13}}>100%</span><span className="batt"><i/></span></span>
  </div>;
}
function TabBar(){
  const { route, go } = useApp();
  const tabs = [['home','Home','home'],['learn','Learn','map'],['write','Write','pencil'],['me','Me','user']];
  return <div className="tabbar">
    {tabs.map(([id,label,ic])=>(
      <button key={id} className={'tab'+(route.name===id?' on':'')} onClick={()=>{sfx.tap();go(id);}}>
        <Icon n={ic} s={26}/>{label}
      </button>))}
  </div>;
}
function Pic({ emoji, tint='leaf', size=120, radius=28, style }){
  const t = TINTS[tint]||TINTS.leaf;
  return <div style={{width:size,height:size,borderRadius:radius,background:t[2],display:'grid',placeItems:'center',fontSize:size*.56,lineHeight:1,flex:'none',...style}}>
    <span style={{filter:'saturate(.9)'}}>{emoji}</span>
  </div>;
}
function Stars({ n=0, of=3, s=26 }){
  return <div style={{display:'flex',gap:3}}>{Array.from({length:of}).map((_,i)=>
    <Icon key={i} n="star" s={s} w={1.8} fill={i<n?'var(--sun)':'#E6DDCA'} color={i<n?'var(--sun-d)':'#D6CCB6'}/>)}</div>;
}
function TopStats(){
  const { progress } = useApp();
  return <div style={{display:'flex',gap:10}}>
    <span className="chip" style={{color:'var(--blush-d)'}}><Icon n="flame" s={22} fill="var(--blush)" color="var(--blush-d)" w={1.6}/>{progress.streak}</span>
    <span className="chip" style={{color:'var(--sun-d)'}}><Icon n="star" s={22} fill="var(--sun)" color="var(--sun-d)" w={1.6}/>{progress.xp}</span>
  </div>;
}
function Progress({ value, color='var(--leaf)', h=18, bg='var(--cream-2)' }){
  return <div style={{height:h,borderRadius:h,background:bg,overflow:'hidden'}}>
    <div style={{height:'100%',width:`${Math.max(0,Math.min(1,value))*100}%`,background:color,borderRadius:h,transition:'width .5s cubic-bezier(.2,.9,.3,1)',boxShadow:'inset 0 -4px 0 rgba(0,0,0,.08)',position:'relative'}}>
      <div style={{position:'absolute',top:4,left:10,right:10,height:4,borderRadius:4,background:'rgba(255,255,255,.4)'}}/>
    </div>
  </div>;
}

/* ---------- Confetti ---------- */
function Confetti({ count=160 }){
  const ref = useRef();
  useEffect(()=>{
    const c = ref.current, ctx = c.getContext('2d'); const W=c.width=1194, H=c.height=834;
    const cols=['#7FBF6A','#F08A7A','#F7C948','#6DB6E8','#A98BE0','#fff'];
    const ps = Array.from({length:count},()=>({x:W/2+(Math.random()-.5)*200,y:H*.42,vx:(Math.random()-.5)*22,vy:-Math.random()*20-6,r:Math.random()*Math.PI,vr:(Math.random()-.5)*.4,w:8+Math.random()*10,h:6+Math.random()*8,c:cols[Math.floor(Math.random()*cols.length)],shape:Math.random()<.3?'c':'r'}));
    let raf, t=0;
    const loop=()=>{ t++; ctx.clearRect(0,0,W,H); ps.forEach(p=>{ p.vy+=.45; p.vx*=.985; p.x+=p.vx; p.y+=p.vy; p.r+=p.vr; ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.r); ctx.fillStyle=p.c; if(p.shape==='c'){ctx.beginPath();ctx.arc(0,0,p.w/2,0,7);ctx.fill();} else ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h*Math.abs(Math.cos(p.r*2))+2); ctx.restore(); }); if(t<260) raf=requestAnimationFrame(loop); };
    loop(); return ()=>cancelAnimationFrame(raf);
  },[]);
  return <canvas ref={ref} style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:150}}/>;
}

function Toast(){
  const { toast } = useApp();
  if(!toast) return null;
  return <div key={toast.k} className="popin" style={{position:'absolute',top:46,left:'50%',marginLeft:-220,width:440,zIndex:190,background:'var(--ink)',color:'#fff',borderRadius:20,padding:'16px 22px',display:'flex',gap:12,alignItems:'center',fontWeight:500,boxShadow:'0 12px 30px rgba(0,0,0,.2)'}}>
    <Icon n="lock" s={24}/>{toast.msg}
  </div>;
}

/* Back + title header used in sub-screens */
function SubHeader({ onBack, title, right, children }){
  return <div style={{position:'absolute',top:40,left:32,right:32,display:'flex',alignItems:'center',gap:18,zIndex:20}}>
    <button className="icon-btn" onClick={onBack} aria-label="Back"><Icon n="back" s={28} w={2.6}/></button>
    {title && <div className="h3">{title}</div>}
    <div style={{flex:1}}>{children}</div>
    {right}
  </div>;
}

Object.assign(window, { LETTERS, CONFUSABLE, PATH, UNIT_NAMES, UNIT_SIZE, TINTS, shuffle, getLetter, AppCtx, useApp, useAppStore, speak, speechState, useSpeaking, sfx, sfxState, Icon, Mascot, SpeakBtn, StatusBar, TabBar, Pic, Stars, TopStats, Progress, Confetti, Toast, SubHeader, DEFAULT_SETTINGS, DEFAULT_PROGRESS });
