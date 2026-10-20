/* ============ Lesson: intro → 3 game tasks → congrats / retry. Checkpoint test. ============ */

function lessonOptions(L){
  const lo = L.l.toLowerCase();
  const conf = (CONFUSABLE[lo]||[]).slice(0,2);
  const rand = shuffle(LETTERS.filter(x=>x.l!==L.l && !conf.includes(x.l.toLowerCase()))).slice(0,3-conf.length).map(x=>x.l.toLowerCase());
  return shuffle([lo,...conf,...rand]).slice(0,4).concat([]).filter((v,i,a)=>a.indexOf(v)===i);
}
function buildTasks(L){
  const others = shuffle(LETTERS.filter(x=>x.l!==L.l)).slice(0,2);
  let soundOpts = lessonOptions(L); if(!soundOpts.includes(L.l.toLowerCase())) soundOpts[0]=L.l.toLowerCase(); soundOpts=shuffle(soundOpts);
  return [
    { kind:'sound', L, opts: soundOpts },
    { kind:'picture', L, opts: shuffle([{w:L.word,p:L.pic,ok:true,t:L.tint},{w:L.alt[0],p:L.alt[1],ok:true,t:L.tint,alt:true},...others.map(o=>({w:o.word,p:o.pic,ok:false,t:o.tint}))]).filter(o=>!o.alt).slice(0,3) },
    { kind:'bubble', L },
  ];
}

/* ---------- Lesson container ---------- */
function LessonScreen(){
  const { route, go, progress, setProgress } = useApp();
  const L = getLetter(route.letter||'A');
  const [phase,setPhase] = useState('intro'); // intro | task | done
  const [ti,setTi] = useState(0);
  const [mistakes,setMistakes] = useState(0);
  const [fb,setFb] = useState(null); // {ok}
  const tasks = useMemo(()=>buildTasks(L),[L.l]);
  const total = tasks.length + 1;
  const step = phase==='intro'?0:(phase==='task'?ti+1:total);
  const t = TINTS[L.tint];

  const answer = ok => {
    if(ok){ sfx.good(); setFb({ok:true}); speak(['Great job!','You got it!','Super!','Yes! Well done!'][ti%4]); }
    else { sfx.bad(); setMistakes(m=>m+1); setFb({ok:false}); speak("Oops! That's okay. Let's try again."); }
  };
  const next = ()=>{
    if(!fb.ok){ setFb(null); return; }
    setFb(null);
    if(ti < tasks.length-1) setTi(ti+1);
    else {
      const stars = mistakes===0?3:mistakes<=2?2:1;
      setProgress(p=>({...p, done:{...p.done,[L.l]:Math.max(p.done[L.l]||0,stars)}, xp:p.xp+10*stars}));
      setPhase('done');
    }
  };

  if(phase==='done') return <ResultScreen pass stars={mistakes===0?3:mistakes<=2?2:1} title={`You learned ${L.l}!`} sub={`${L.l} is for ${L.word}`} L={L}
    onContinue={()=>go('learn')} onPractice={()=>go('write',{letter:L.l})}/>;

  return <div className="screen-enter" style={{position:'absolute',inset:0,background:'var(--cream)'}}>
    <div style={{position:'absolute',top:40,left:32,right:32,display:'flex',alignItems:'center',gap:20,zIndex:20}}>
      <button className="icon-btn" onClick={()=>go('learn')} aria-label="Close"><Icon n="x" s={28} w={2.6}/></button>
      <div style={{flex:1}}><Progress value={step/total} color={t[0]} h={20}/></div>
      <span className="chip"><span className="letter" style={{fontSize:24,color:t[1]}}>{L.l}</span>Level</span>
    </div>
    {phase==='intro' && <LessonIntro L={L} onNext={()=>{sfx.good();setPhase('task');}}/>}
    {phase==='task' && <TaskView key={ti} task={tasks[ti]} onAnswer={answer} locked={!!fb}/>}
    {fb && fb.ok && <FeedbackSheet ok onNext={next}/>}
    {fb && !fb.ok && <RetryOverlay L={L} hint={hintFor(tasks[ti])} onRetry={next} onExit={()=>go('learn')}/>}
  </div>;
}
function hintFor(task){
  const L=task.L;
  if(task.kind==='sound') return `Listen for "${L.snd}". ${L.l.toLowerCase()} has its own shape — look for it carefully.`;
  if(task.kind==='picture') return `Say each word out loud. Which one starts with "${L.snd}", like ${L.word}?`;
  return `Only pop the bubbles with ${L.l.toLowerCase()} in them.`;
}

/* ---------- Intro: meet the letter ---------- */
function LessonIntro({ L, onNext }){
  const t = TINTS[L.tint];
  const script = `${L.l}. ${L.l} says ${L.snd}. ${L.l} is for ${L.word}!`;
  const [beat,setBeat] = useState(0); // 0 letter, 1 sound, 2 word
  const play = useCallback(async ()=>{
    setBeat(0); await speak(`${L.l}.`,{id:'intro'}); setBeat(1); await speak(`${L.l} says ${L.snd}.`,{id:'intro'}); setBeat(2); await speak(`${L.l} is for ${L.word}!`,{id:'intro'});
  },[L.l]);
  useEffect(()=>{ const tm=setTimeout(play,450); return ()=>{clearTimeout(tm);speechSynthesis&&speechSynthesis.cancel();}; },[L.l]);
  const playing = useSpeaking('intro');
  return <div style={{position:'absolute',inset:0,padding:'130px 70px 50px',display:'grid',gridTemplateColumns:'1.15fr 1fr',gap:40}}>
    <div style={{position:'relative',borderRadius:44,background:t[2],display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
      <div style={{position:'absolute',width:460,height:460,borderRadius:'50%',background:'rgba(255,255,255,.45)'}}/>
      <button onClick={()=>{sfx.tap();speak(`${L.l}. ${L.l} says ${L.snd}`,{id:'intro'});}} className="popin" style={{position:'relative',display:'flex',alignItems:'baseline',gap:26,transform:beat===0&&playing?'scale(1.06)':'none',transition:'.3s'}}>
        <span className="letter" style={{fontSize:300,lineHeight:1,color:t[0],textShadow:`0 10px 0 ${t[1]}`}}>{L.l}</span>
        <span className="letter" style={{fontSize:220,lineHeight:1,color:t[1]}}>{L.l.toLowerCase()}</span>
      </button>
      <div style={{position:'relative',marginTop:16,display:'flex',gap:12,alignItems:'center',padding:'10px 22px',borderRadius:999,background:'var(--paper)',fontWeight:700,fontSize:'1.4em',color:t[1],opacity:beat>=1?1:.35,transition:'.3s'}}>
        <Icon n="speaker" s={28}/> says “{L.snd}”
      </div>
      <div style={{position:'absolute',top:22,left:24,fontSize:14,fontWeight:700,letterSpacing:'.12em',color:t[1]}}>TAP THE LETTER TO HEAR IT</div>
    </div>
    <div style={{display:'flex',flexDirection:'column'}}>
      <div style={{display:'flex',alignItems:'flex-end',gap:6}}>
        <Mascot size={170}/>
        <div className="bubble tail-l" style={{marginBottom:50,flex:1,fontSize:'1.35em'}}>
          {beat<2 ? <>This is the letter <b style={{color:t[1]}}>{L.l}</b>!</> : <>Can you say <b style={{color:t[1]}}>{L.word}</b>?</>}
        </div>
      </div>
      <div className="card" style={{flex:1,marginTop:6,display:'flex',alignItems:'center',gap:24,padding:28,opacity:beat>=2?1:.5,transform:beat>=2?'none':'translateY(8px)',transition:'.4s'}}>
        <Pic emoji={L.pic} tint={L.tint} size={150} radius={34}/>
        <div style={{flex:1}}>
          <div style={{fontSize:'2.6em',fontWeight:700,letterSpacing:'.06em',lineHeight:1.1}}><span style={{color:t[1]}}>{L.word[0]}</span>{L.word.slice(1)}</div>
          <div className="muted" style={{marginTop:8,fontSize:'1.1em'}}>{L.l} is for {L.word}</div>
        </div>
        <SpeakBtn text={L.word}/>
      </div>
      <div style={{display:'flex',gap:16,marginTop:28}}>
        <button className="btn ghost" style={{flex:'none',width:180}} onClick={play}><Icon n="replay" s={26} w={2.4}/>Again</button>
        <button className="btn" style={{flex:1}} onClick={onNext}>Let's play!</button>
      </div>
    </div>
  </div>;
}

/* ---------- Task renderer ---------- */
function TaskView({ task, onAnswer, locked }){
  if(task.kind==='sound') return <SoundTask task={task} onAnswer={onAnswer} locked={locked}/>;
  if(task.kind==='picture') return <PictureTask task={task} onAnswer={onAnswer} locked={locked}/>;
  return <BubbleTask task={task} onAnswer={onAnswer} locked={locked}/>;
}
function TaskPrompt({ text, say, kicker }){
  useEffect(()=>{ const tm=setTimeout(()=>speak(say||text,{id:'prompt'}),350); return ()=>clearTimeout(tm); },[text]);
  return <div style={{display:'flex',alignItems:'center',gap:18}}>
    <Mascot size={110}/>
    <div><div style={{fontSize:14,fontWeight:700,letterSpacing:'.12em',color:'var(--ink-3)'}}>{kicker}</div>
      <div className="h2" style={{display:'flex',alignItems:'center',gap:14}}>{text}<SpeakBtn id="prompt" text={say||text}/></div></div>
  </div>;
}

function SoundTask({ task, onAnswer, locked }){
  const { L, opts } = task; const t=TINTS[L.tint];
  const [pick,setPick]=useState(null);
  const playing = useSpeaking('snd');
  const sound = ()=>speak(`${L.snd}... ${L.snd}`,{id:'snd'});
  useEffect(()=>{ const tm=setTimeout(sound,2400); return ()=>clearTimeout(tm); },[]);
  return <div style={{position:'absolute',inset:0,padding:'120px 80px 50px',display:'flex',flexDirection:'column'}}>
    <TaskPrompt kicker="LISTEN & MATCH" text="Which letter makes this sound?" say={`Which letter makes this sound? ${L.snd}`}/>
    <div style={{flex:1,display:'flex',alignItems:'center',gap:56,justifyContent:'center'}}>
      <button onClick={()=>{sfx.tap();sound();}} className={playing?'playing':''} style={{width:220,height:220,borderRadius:'50%',background:'var(--sky)',color:'#fff',boxShadow:'0 10px 0 var(--sky-d)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:6,flex:'none',animation:playing?'pulse 1s infinite':undefined}}>
        <Icon n="speaker" s={84} w={2}/><span style={{fontWeight:700,fontSize:'1.1em'}}>Tap to hear</span>
      </button>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:22}}>
        {opts.map(o=>{ const on=pick===o; return <button key={o} disabled={locked} onClick={()=>{sfx.tap();setPick(o);speak(o.toUpperCase()==='A'?'ay':o,{id:'opt'});}}
          style={{width:190,height:170,borderRadius:34,background:on?t[2]:'var(--paper)',border:`3px solid ${on?t[0]:'var(--line)'}`,boxShadow:`0 8px 0 ${on?t[1]:'var(--line)'}`,transform:on?'translateY(-4px)':'none',transition:'.12s',display:'grid',placeItems:'center'}}>
          <span className="letter" style={{fontSize:110,lineHeight:1,color:on?t[1]:'var(--ink)'}}>{o}</span>
        </button>;})}
      </div>
    </div>
    <button className="btn" style={{alignSelf:'flex-end',width:320}} disabled={!pick||locked} onClick={()=>onAnswer(pick===L.l.toLowerCase())}>Check</button>
  </div>;
}

function PictureTask({ task, onAnswer, locked }){
  const { L, opts } = task; const t=TINTS[L.tint];
  const [pick,setPick]=useState(null);
  return <div style={{position:'absolute',inset:0,padding:'120px 80px 50px',display:'flex',flexDirection:'column'}}>
    <TaskPrompt kicker="PICTURE PUZZLE" text={<>Which one starts with <span className="letter" style={{color:t[1],fontSize:'1.2em'}}>{L.l}</span>?</>} say={`Which picture starts with ${L.l}? ${L.l} says ${L.snd}.`}/>
    <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:32}}>
      {opts.map((o,i)=>{ const on=pick===i; return <button key={i} disabled={locked} onClick={()=>{sfx.tap();setPick(i);speak(o.w,{id:'opt'});}} className="rise"
        style={{animationDelay:i*.08+'s',width:280,padding:'26px 20px 22px',borderRadius:38,background:on?t[2]:'var(--paper)',border:`3px solid ${on?t[0]:'var(--line)'}`,boxShadow:`0 9px 0 ${on?t[1]:'var(--line)'}`,transform:on?'translateY(-5px)':'none',transition:'transform .12s',display:'flex',flexDirection:'column',alignItems:'center',gap:16}}>
        <Pic emoji={o.p} tint={o.t} size={190} radius={32}/>
        <div style={{display:'flex',alignItems:'center',gap:10,fontSize:'1.5em',fontWeight:700,letterSpacing:'.05em'}}>{o.w}<Icon n="speaker" s={22} color="var(--sky-d)"/></div>
      </button>;})}
    </div>
    <button className="btn" style={{alignSelf:'flex-end',width:320}} disabled={pick==null||locked} onClick={()=>onAnswer(opts[pick].ok)}>Check</button>
  </div>;
}

function BubbleTask({ task, onAnswer, locked }){
  const { L } = task; const t=TINTS[L.tint];
  const lo = L.l.toLowerCase();
  const NEED = 4;
  const bubbles = useMemo(()=>{
    const conf = CONFUSABLE[lo]||['o','e','s'];
    const letters = shuffle([...Array(NEED).fill(lo), ...conf.slice(0,3), conf[0]||'o', 'x'===lo?'k':'o']).slice(0,9);
    if(letters.filter(x=>x===lo).length<NEED) letters.splice(0,NEED,...Array(NEED).fill(lo));
    const cols=['var(--sky-l)','var(--blush-l)','var(--sun-l)','var(--plum-l)','var(--leaf-l)'];
    const spots=[[120,40],[330,10],[560,60],[790,20],[200,230],[450,210],[700,240],[880,200],[60,250]];
    return shuffle(letters).map((c,i)=>({c,id:i,x:spots[i][0],y:spots[i][1],bg:cols[i%5],d:(i*0.37)%2,sz:130+(i%3)*14}));
  },[L.l]);
  const [popped,setPopped]=useState({}); const [wrong,setWrong]=useState(null);
  const got = Object.keys(popped).length;
  const tap = b=>{
    if(locked||popped[b.id]) return;
    if(b.c===lo){ sfx.pop(); const np={...popped,[b.id]:1}; setPopped(np); if(Object.keys(np).length===NEED) setTimeout(()=>onAnswer(true),450); }
    else { setWrong(b.id); setTimeout(()=>setWrong(null),500); onAnswer(false); }
  };
  return <div style={{position:'absolute',inset:0,padding:'120px 80px 50px',display:'flex',flexDirection:'column'}}>
    <div style={{display:'flex',alignItems:'center'}}>
      <TaskPrompt kicker="BUBBLE POP" text={<>Pop every <span className="letter" style={{color:t[1],fontSize:'1.25em'}}>{lo}</span> bubble!</>} say={`Pop every bubble with the letter ${L.l}. Be careful, some letters look alike!`}/>
      <div style={{flex:1}}/>
      <div style={{display:'flex',gap:10}}>{Array.from({length:NEED}).map((_,i)=><span key={i} style={{width:46,height:46,borderRadius:'50%',background:i<got?t[0]:'var(--cream-2)',border:`3px solid ${i<got?t[1]:'var(--line)'}`,display:'grid',placeItems:'center',color:'#fff',transition:'.2s'}}>{i<got&&<Icon n="check" s={22} w={3}/>}</span>)}</div>
    </div>
    <div style={{position:'relative',flex:1,marginTop:20}}>
      {bubbles.map(b=>{ const p=popped[b.id]; return <button key={b.id} onClick={()=>tap(b)} className={wrong===b.id?'shake':''}
        style={{position:'absolute',left:b.x,top:b.y,width:b.sz,height:b.sz,borderRadius:'50%',background:`radial-gradient(circle at 32% 28%, #fff 0 10%, ${b.bg} 42%)`,border:'3px solid rgba(255,255,255,.9)',boxShadow:'0 10px 24px rgba(80,90,110,.14), inset 0 -10px 20px rgba(0,0,0,.05)',display:'grid',placeItems:'center',
          animation:p?'none':`floaty ${3+b.d}s ease-in-out ${b.d}s infinite`,transform:p?'scale(1.5)':'none',opacity:p?0:1,transition:'transform .3s, opacity .3s'}}>
        <span className="letter" style={{fontSize:b.sz*.52,lineHeight:1,color:'var(--ink)'}}>{b.c}</span>
      </button>;})}
    </div>
  </div>;
}

/* ---------- Feedback (correct) ---------- */
function FeedbackSheet({ ok, onNext, label='Continue' }){
  return <div style={{position:'absolute',left:0,right:0,bottom:0,zIndex:80,animation:'rise .3s both'}}>
    <div style={{background:'var(--leaf-l)',borderTop:'3px solid var(--leaf)',padding:'26px 80px 34px',display:'flex',alignItems:'center',gap:22}}>
      <span className="popin" style={{width:72,height:72,borderRadius:'50%',background:'var(--leaf)',color:'#fff',display:'grid',placeItems:'center',boxShadow:'0 5px 0 var(--leaf-dd)'}}><Icon n="check" s={40} w={3.4}/></span>
      <div style={{flex:1}}><div className="h2" style={{color:'var(--leaf-dd)'}}>Great job!</div><div style={{color:'var(--leaf-dd)',fontWeight:500}}>+10 sunshine points</div></div>
      <button className="btn" style={{width:320}} onClick={onNext}>{label}</button>
    </div>
  </div>;
}

/* ---------- Retry overlay (wrong) ---------- */
function RetryOverlay({ L, hint, onRetry, onExit, retryLabel='Try again' }){
  useEffect(()=>{ const tm=setTimeout(()=>speak('Oops, not quite. '+hint,{id:'hint'}),900); return ()=>clearTimeout(tm); },[]);
  return <div style={{position:'absolute',inset:0,zIndex:90,background:'rgba(47,58,51,.35)',display:'grid',placeItems:'center',animation:'rise .25s both'}}>
    <div className="popin" style={{width:720,background:'var(--paper)',borderRadius:44,padding:'36px 44px 40px',display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',boxShadow:'0 30px 60px rgba(0,0,0,.2)'}}>
      <div style={{position:'relative'}}>
        <div style={{position:'absolute',inset:'20px -10px 0',borderRadius:'50%',background:'var(--blush-l)'}}/>
        <Mascot size={190} style={{position:'relative',animation:'wiggle 1s ease-in-out 2'}}/>
      </div>
      <div className="h1" style={{marginTop:14,color:'var(--blush-d)'}}>Oops, not quite!</div>
      <div style={{fontSize:'1.2em',fontWeight:500,marginTop:6}}>Mistakes help us grow. Let's try again.</div>
      <div style={{display:'flex',gap:14,alignItems:'center',marginTop:22,padding:'16px 20px',borderRadius:22,background:'var(--sun-l)',textAlign:'left',width:'100%'}}>
        <Icon n="bulb" s={34} color="var(--sun-d)"/><span style={{flex:1,fontSize:'1.05em',fontWeight:500}}>{hint}</span><SpeakBtn id="hint" text={hint}/>
      </div>
      <div style={{display:'flex',gap:16,marginTop:28,width:'100%'}}>
        <button className="btn ghost" style={{width:200}} onClick={onExit}>Quit</button>
        <button className="btn blush" style={{flex:1}} onClick={()=>{sfx.tap();onRetry();}}><Icon n="replay" s={26} w={2.6}/>{retryLabel}</button>
      </div>
    </div>
  </div>;
}

/* ---------- Result: congrats or failed checkpoint ---------- */
function ResultScreen({ pass, stars=3, title, sub, L, onContinue, onPractice, onRetry, stats }){
  const { progress } = useApp();
  useEffect(()=>{ if(pass){ sfx.win(); setTimeout(()=>speak(`Hooray! ${title}`),500); } else { sfx.bad(); setTimeout(()=>speak(`${title} ${sub}`),400);} },[]);
  const t = pass?TINTS.leaf:TINTS.blush;
  return <div className="screen-enter" style={{position:'absolute',inset:0,background:pass?'var(--leaf-l)':'var(--blush-l)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
    {pass && <Confetti/>}
    <div style={{position:'absolute',width:900,height:900,borderRadius:'50%',background:'rgba(255,255,255,.4)',top:-200}}/>
    {pass && <div style={{position:'absolute',top:120,width:560,height:560,background:'repeating-conic-gradient(rgba(255,255,255,.55) 0 10deg, transparent 10deg 30deg)',borderRadius:'50%',animation:'spin 30s linear infinite',maskImage:'radial-gradient(circle, #000 30%, transparent 70%)',WebkitMaskImage:'radial-gradient(circle, #000 30%, transparent 70%)'}}/>}
    <div style={{position:'relative',display:'flex',flexDirection:'column',alignItems:'center'}}>
      {pass && <div className="popin" style={{display:'flex',gap:10,marginBottom:6,alignItems:'flex-end'}}>
        {[0,1,2].map(i=><Icon key={i} n="star" s={i===1?96:76} w={1.6} fill={i<stars?'var(--sun)':'#E6DDCA'} color={i<stars?'var(--sun-d)':'#D6CCB6'} style={{animation:`popin .5s ${.3+i*.18}s both`,marginBottom:i===1?18:0}}/>)}
      </div>}
      <div style={{position:'relative'}}>
        {L && pass && <div className="letter popin" style={{position:'absolute',right:-90,top:20,width:110,height:110,borderRadius:30,background:TINTS[L.tint][0],color:'#fff',display:'grid',placeItems:'center',fontSize:80,boxShadow:`0 7px 0 ${TINTS[L.tint][1]}`,transform:'rotate(10deg)',animationDelay:'.5s'}}>{L.l}</div>}
        <Mascot size={250} style={{animation:pass?'bob 1.4s ease-in-out infinite':'wiggle 1.2s ease-in-out 2'}}/>
      </div>
      <div className="h1" style={{fontSize:'3.2em',marginTop:12,color:t[1]}}>{title}</div>
      <div style={{fontSize:'1.35em',fontWeight:500,marginTop:6,display:'flex',gap:12,alignItems:'center'}}>{sub}<SpeakBtn text={`${title}. ${sub}`}/></div>
      <div style={{display:'flex',gap:16,marginTop:28}}>
        {(stats||[[pass?'+'+(stars*10):'0','points','sun','star'],[progress.streak+' days','streak','blush','flame']]).map(([v,l,c,ic])=><div key={l} className="card rise" style={{padding:'14px 24px',display:'flex',gap:12,alignItems:'center',minWidth:190}}>
          <Icon n={ic} s={34} fill={TINTS[c][0]} color={TINTS[c][1]} w={1.6}/><div><div style={{fontWeight:800,fontSize:'1.4em',lineHeight:1.1}}>{v}</div><div className="muted" style={{fontSize:'.9em'}}>{l}</div></div></div>)}
      </div>
      <div style={{display:'flex',gap:16,marginTop:34}}>
        {pass ? <>{onPractice && <button className="btn ghost" style={{width:260}} onClick={onPractice}><Icon n="pencil" s={24}/>Practice writing</button>}
          <button className="btn" style={{width:300}} onClick={onContinue}>Continue</button></>
        : <><button className="btn ghost" style={{width:240}} onClick={onContinue}>Back to map</button>
          <button className="btn blush" style={{width:300}} onClick={onRetry}><Icon n="replay" s={26} w={2.6}/>Try again</button></>}
      </div>
    </div>
  </div>;
}

/* ---------- Checkpoint test ---------- */
function CheckpointScreen(){
  const { route, go, setProgress } = useApp();
  const node = PATH.find(p=>p.id===route.id) || PATH.find(p=>p.type==='checkpoint');
  const [seed,setSeed]=useState(0);
  const qs = useMemo(()=>{
    const Ls = node.letters.map(getLetter);
    const pool = shuffle([...Ls,...Ls]).slice(0,5);
    return pool.map((L,i)=> i%2===0 ? buildTasks(L)[0] : buildTasks(L)[1]);
  },[node.id,seed]);
  const [qi,setQi]=useState(0); const [hearts,setHearts]=useState(3); const [right,setRight]=useState(0); const [fb,setFb]=useState(null); const [end,setEnd]=useState(null);
  const answer = ok=>{ if(ok){sfx.good();setRight(r=>r+1);} else {sfx.bad();setHearts(h=>h-1);} setFb({ok}); };
  const next = ()=>{
    const r = right; const h = hearts;
    setFb(null);
    if(h<=0 || qi===qs.length-1){
      const pass = r>=4;
      if(pass) setProgress(p=>({...p,cps:{...p.cps,[node.id]:true},xp:p.xp+50,stars:p.stars+1}));
      setEnd({pass,r});
    } else setQi(qi+1);
  };
  const restart = ()=>{ setSeed(s=>s+1); setQi(0); setHearts(3); setRight(0); setEnd(null); };
  if(end) return end.pass
    ? <ResultScreen pass stars={end.r===5?3:2} title="Checkpoint passed!" sub={`Unit ${node.unit} complete — new letters unlocked!`} onContinue={()=>go('learn')} stats={[[`${end.r}/5`,'correct','leaf','check'],['+50','points','sun','star']]}/>
    : <ResultScreen pass={false} title="So close!" sub={`You got ${end.r} of 5. You need 4 to pass.`} onContinue={()=>go('learn')} onRetry={restart} stats={[[`${end.r}/5`,'correct','blush','target'],[node.letters.join(' '),'practice these','sky','book']]}/>;
  return <div className="screen-enter" style={{position:'absolute',inset:0,background:'var(--cream)'}}>
    <div style={{position:'absolute',top:40,left:32,right:32,display:'flex',alignItems:'center',gap:20,zIndex:20}}>
      <button className="icon-btn" onClick={()=>go('learn')}><Icon n="x" s={28} w={2.6}/></button>
      <span className="chip" style={{background:'var(--sun-l)',borderColor:'var(--sun)',color:'var(--sun-d)'}}><Icon n="shield" s={22} fill="var(--sun)" color="var(--sun-d)" w={1.6}/>Checkpoint {node.unit}</span>
      <div style={{flex:1}}><Progress value={(qi+(fb?1:0))/qs.length} color="var(--sun)" h={20}/></div>
      <div style={{display:'flex',gap:6}}>{[0,1,2].map(i=><Icon key={i} n="heart" s={36} w={1.8} fill={i<hearts?'var(--blush)':'#E6DDCA'} color={i<hearts?'var(--blush-d)':'#D6CCB6'} style={{transition:'.3s',transform:i===hearts&&fb&&!fb.ok?'scale(.6)':'none'}}/>)}</div>
    </div>
    <TaskView key={seed+'-'+qi} task={qs[qi]} onAnswer={answer} locked={!!fb}/>
    {fb && <div style={{position:'absolute',left:0,right:0,bottom:0,zIndex:80,animation:'rise .3s both'}}>
      <div style={{background:fb.ok?'var(--leaf-l)':'var(--blush-l)',borderTop:`3px solid ${fb.ok?'var(--leaf)':'var(--blush)'}`,padding:'26px 80px 34px',display:'flex',alignItems:'center',gap:22}}>
        <span className="popin" style={{width:72,height:72,borderRadius:'50%',background:fb.ok?'var(--leaf)':'var(--blush)',color:'#fff',display:'grid',placeItems:'center'}}><Icon n={fb.ok?'check':'x'} s={38} w={3.4}/></span>
        <div style={{flex:1}}><div className="h2" style={{color:fb.ok?'var(--leaf-dd)':'var(--blush-d)'}}>{fb.ok?'Correct!':'Not this time'}</div>
          <div style={{fontWeight:500,color:fb.ok?'var(--leaf-dd)':'var(--blush-d)'}}>{fb.ok?`${right} right so far`:`The answer was ${qs[qi].L.l.toLowerCase()} — ${qs[qi].L.word}`}</div></div>
        <button className={'btn '+(fb.ok?'':'blush')} style={{width:300}} onClick={next}>Continue</button>
      </div>
    </div>}
  </div>;
}

Object.assign(window,{ LessonScreen, CheckpointScreen, ResultScreen, RetryOverlay, FeedbackSheet, buildTasks, TaskView });
