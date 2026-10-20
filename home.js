/* ============ Home: daily story / short lesson + small tasks ============ */

const STORIES = [
  { id:'bee', title:'Ben the Busy Bee', letter:'B', tint:'sun', mins:3, cover:'🐝',
    pages:[
      { pic:'🐝', bg:'sun', text:'Ben is a bee. Ben is big and busy.' },
      { pic:'🌼', bg:'leaf', text:'Ben buzzes by a blue bell flower.' },
      { pic:'🍯', bg:'sun', text:'Ben brings back a bit of honey.' },
      { pic:'🏠', bg:'sky', text:'Back at the hive, Ben has a big nap.' },
    ],
    quiz:{ q:'Where does Ben have a nap?', opts:[['🏠','At the hive',true],['🌊','In the sea',false],['🚌','On a bus',false]] } },
  { id:'cat', title:'The Cat and the Cake', letter:'C', tint:'blush', mins:3, cover:'🐱',
    pages:[
      { pic:'🐱', bg:'blush', text:'Cara the cat can smell a cake.' },
      { pic:'🍰', bg:'sun', text:'The cake is on a cup on the cart.' },
      { pic:'🐾', bg:'leaf', text:'Cara creeps up close. Can she get it?' },
      { pic:'🎉', bg:'plum', text:'Cara shares the cake with her friends.' },
    ],
    quiz:{ q:'Who does Cara share the cake with?', opts:[['🐶','A dog',false],['👫','Her friends',true],['🐟','A fish',false]] } },
  { id:'ant', title:'Ant on an Apple', letter:'A', tint:'leaf', mins:2, cover:'🐜',
    pages:[
      { pic:'🐜', bg:'leaf', text:'An ant sat on an apple.' },
      { pic:'🍎', bg:'blush', text:'The apple was red and round.' },
      { pic:'🌧️', bg:'sky', text:'Rain came. The ant ran and hid.' },
    ],
    quiz:{ q:'What did the ant sit on?', opts:[['🍎','An apple',true],['🍌','A banana',false],['🪨','A rock',false]] } },
];

function HomeScreen(){
  const { go, kid, progress } = useApp();
  const hr = new Date().getHours(); const greet = hr<12?'Good morning':hr<17?'Good afternoon':'Good evening';
  const featured = STORIES[0];
  const nodes = pathStatus(progress); const cur = nodes.find(n=>n.status==='current');
  const quests = [
    { ic:'map', t:'Finish 1 letter level', d:cur&&cur.type==='letter'?`Next up: ${cur.id}`:'Checkpoint next', v:.0, c:'leaf', act:()=>go(cur&&cur.type==='letter'?'lesson':'checkpoint',cur&&cur.type==='letter'?{letter:cur.id}:{id:cur&&cur.id}) },
    { ic:'pencil', t:'Trace 3 letters', d:'2 of 3 done', v:.66, c:'sky', act:()=>go('write') },
    { ic:'book', t:'Read today\u2019s story', d:'3 minutes', v:0, c:'sun', act:()=>go('story',{id:featured.id}) },
  ];
  const say = `${greet}, ${kid.name}! Today's story is ${featured.title}. Let's read together!`;
  useEffect(()=>{ const tm=setTimeout(()=>speak(say,{id:'hello'}),500); return ()=>clearTimeout(tm); },[]);
  return <div className="screen-enter scroll" style={{position:'absolute',inset:0,overflowY:'auto',paddingBottom:130}}>
    <div style={{padding:'40px 32px 0',display:'flex',alignItems:'center',gap:16}}>
      <div style={{width:60,height:60,borderRadius:'50%',background:TINTS[kid.color][0],color:'#fff',display:'grid',placeItems:'center',fontSize:30}} className="letter">{kid.name[0]}</div>
      <div><div className="muted" style={{fontWeight:500}}>{greet},</div><div className="h2" style={{lineHeight:1.1}}>{kid.name}!</div></div>
      <div style={{flex:1}}/><TopStats/>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'1.45fr 1fr',gap:24,padding:'24px 32px 0'}}>
      {/* hero story */}
      <div style={{position:'relative',borderRadius:40,background:'var(--sun-l)',padding:'30px 34px',minHeight:380,overflow:'hidden',display:'flex',flexDirection:'column'}}>
        <div style={{position:'absolute',right:-60,top:-60,width:340,height:340,borderRadius:'50%',background:'rgba(255,255,255,.5)'}}/>
        <div style={{position:'absolute',right:60,top:48,fontSize:150,lineHeight:1,animation:'floaty 4s ease-in-out infinite'}}>{featured.cover}</div>
        <Mascot size={190} style={{position:'absolute',right:200,bottom:-8}}/>
        <span className="chip" style={{alignSelf:'flex-start',background:'var(--paper)',borderColor:'var(--sun)',color:'var(--sun-d)'}}><Icon n="book" s={22}/>Today's story</span>
        <div className="h1" style={{marginTop:18,maxWidth:340,position:'relative'}}>{featured.title}</div>
        <div className="muted" style={{fontSize:'1.1em',marginTop:6,position:'relative'}}>Words with <b className="letter" style={{color:'var(--sun-d)',fontSize:'1.2em'}}>{featured.letter}</b> · {featured.mins} min</div>
        <div style={{flex:1}}/>
        <div style={{display:'flex',gap:14,position:'relative'}}>
          <button className="btn sun" style={{width:220}} onClick={()=>{sfx.good();go('story',{id:featured.id});}}><Icon n="book" s={26}/>Read now</button>
          <SpeakBtn id="hello" text={say} lg/>
        </div>
      </div>
      {/* quests */}
      <div className="card" style={{padding:24,display:'flex',flexDirection:'column'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}><div className="h3">Today's tasks</div><span className="muted" style={{fontWeight:600}}>1 / 3</span></div>
        <div style={{display:'flex',flexDirection:'column',gap:12,marginTop:16,flex:1}}>
          {quests.map((q,i)=>{ const tt=TINTS[q.c]; return <button key={i} onClick={()=>{sfx.tap();q.act();}} style={{display:'flex',alignItems:'center',gap:14,padding:14,borderRadius:22,background:'var(--cream)',textAlign:'left'}}>
            <span style={{width:56,height:56,borderRadius:18,background:tt[2],color:tt[1],display:'grid',placeItems:'center'}}><Icon n={q.ic} s={28}/></span>
            <div style={{flex:1}}><div style={{fontWeight:600,fontSize:'1.05em'}}>{q.t}</div><div className="muted" style={{fontSize:'.9em',marginBottom:6}}>{q.d}</div><Progress value={q.v} color={tt[0]} h={10}/></div>
            <Icon n="next" s={24} color="var(--ink-3)"/>
          </button>;})}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:12,marginTop:14,padding:'12px 14px',borderRadius:18,background:'var(--blush-l)'}}>
          <Icon n="flame" s={30} fill="var(--blush)" color="var(--blush-d)" w={1.6}/><span style={{fontWeight:600,flex:1}}>Finish all 3 to grow your streak!</span>
        </div>
      </div>
    </div>
    {/* letter of the day + more stories */}
    <div style={{display:'grid',gridTemplateColumns:'1fr 2fr',gap:24,padding:'24px 32px 0'}}>
      {cur && cur.type==='letter' && (()=>{ const L=getLetter(cur.id); const tt=TINTS[L.tint]; return <button onClick={()=>go('lesson',{letter:L.l})} className="card" style={{padding:22,display:'flex',alignItems:'center',gap:18,textAlign:'left',background:tt[2],borderColor:tt[0]}}>
        <span className="letter" style={{width:100,height:100,borderRadius:28,background:tt[0],color:'#fff',display:'grid',placeItems:'center',fontSize:66,boxShadow:`0 6px 0 ${tt[1]}`}}>{L.l}</span>
        <div><div style={{fontSize:13,fontWeight:700,letterSpacing:'.12em',color:tt[1]}}>NEXT LETTER</div><div className="h3" style={{marginTop:2}}>{L.l} is for {L.word}</div><div style={{marginTop:8,fontWeight:600,color:tt[1],display:'flex',alignItems:'center',gap:4}}>Start level<Icon n="next" s={20} w={2.6}/></div></div>
      </button>; })()}
      <div>
        <div className="h3" style={{marginBottom:12}}>More stories</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          {STORIES.slice(1).map(s=>{ const tt=TINTS[s.tint]; return <button key={s.id} onClick={()=>go('story',{id:s.id})} className="card" style={{padding:16,display:'flex',gap:14,alignItems:'center',textAlign:'left'}}>
            <Pic emoji={s.cover} tint={s.tint} size={78} radius={22}/>
            <div style={{flex:1}}><div style={{fontWeight:600,fontSize:'1.05em',lineHeight:1.3}}>{s.title}</div><div className="muted" style={{fontSize:'.9em'}}>Letter {s.letter} · {s.mins} min</div></div>
          </button>; })}
        </div>
      </div>
    </div>
    <TabBar/>
  </div>;
}

/* ---------- Story reader with word-by-word highlight ---------- */
function StoryScreen(){
  const { route, go, setProgress } = useApp();
  const S = STORIES.find(s=>s.id===route.id) || STORIES[0];
  const [pg,setPg]=useState(0);
  const [hl,setHl]=useState(-1);
  const [quiz,setQuiz]=useState(false); const [pick,setPick]=useState(null); const [done,setDone]=useState(false);
  const page = S.pages[pg]; const tt=TINTS[page?page.bg:S.tint];
  const words = page ? [...page.text.matchAll(/\S+/g)].map(m=>({w:m[0],i:m.index})) : [];
  const read = ()=>{ setHl(-1); speak(page.text,{id:'story',onWord:ci=>{ const k=words.findIndex((w,j)=>ci>=w.i && (j===words.length-1||ci<words[j+1].i)); setHl(k); }}).then(()=>setHl(-1)); };
  useEffect(()=>{ if(!quiz){ const tm=setTimeout(read,500); return ()=>clearTimeout(tm);} },[pg,quiz]);
  useEffect(()=>{ if(quiz) speak(S.quiz.q,{id:'q'}); },[quiz]);
  const playing = useSpeaking('story');
  const isLetterWord = w => w.replace(/[^a-z]/gi,'')[0]?.toUpperCase()===S.letter;

  if(done) return <ResultScreen pass stars={3} title="Story finished!" sub={`You read ${S.title}`} onContinue={()=>go('home')} stats={[['+20','points','sun','star'],[S.pages.length+' pages','read','sky','book']]}/>;

  return <div className="screen-enter" style={{position:'absolute',inset:0,background:'var(--cream)'}}>
    <SubHeader onBack={()=>go('home')} title={S.title} right={<div style={{display:'flex',gap:8}}>{[...S.pages,0].map((_,i)=><span key={i} style={{width:(quiz?S.pages.length:pg)===i?32:12,height:12,borderRadius:12,background:i<=(quiz?S.pages.length:pg)?'var(--sun)':'var(--line)',transition:'.3s'}}/>)}</div>}/>
    {!quiz ? <div key={pg} className="rise" style={{position:'absolute',top:120,left:40,right:40,bottom:40,display:'grid',gridTemplateColumns:'1fr 1fr',gap:34}}>
      <div style={{borderRadius:44,background:tt[2],position:'relative',overflow:'hidden',display:'grid',placeItems:'center'}}>
        <div style={{position:'absolute',width:400,height:400,borderRadius:'50%',background:'rgba(255,255,255,.5)'}}/>
        <div style={{position:'relative',fontSize:230,lineHeight:1,animation:'floaty 4s ease-in-out infinite'}}>{page.pic}</div>
        <Mascot size={130} style={{position:'absolute',left:24,bottom:16}}/>
        <span style={{position:'absolute',top:22,right:26,fontWeight:700,color:tt[1]}}>{pg+1} / {S.pages.length}</span>
      </div>
      <div style={{display:'flex',flexDirection:'column'}}>
        <div className="card" style={{flex:1,padding:'40px 40px',display:'flex',flexDirection:'column',justifyContent:'center'}}>
          <p style={{fontSize:'2.6em',fontWeight:500,lineHeight:1.75,letterSpacing:'.05em',wordSpacing:'.22em'}}>
            {words.map((w,k)=><React.Fragment key={k}><span onClick={()=>speak(w.w.replace(/[^a-z'-]/gi,''))} style={{cursor:'pointer',borderRadius:12,padding:'2px 6px',margin:'0 -6px',background:hl===k?'var(--sun)':'transparent',transition:'background .12s',color:isLetterWord(w.w)?'var(--sun-d)':undefined,fontWeight:isLetterWord(w.w)?700:500,textDecoration:isLetterWord(w.w)?'underline':'none',textDecorationThickness:3,textUnderlineOffset:8,textDecorationColor:'var(--sun)'}}>{w.w}</span>{' '}</React.Fragment>)}
          </p>
          <div className="muted" style={{marginTop:20,display:'flex',alignItems:'center',gap:8,fontWeight:500}}><Icon n="hand" s={22}/>Tap any word to hear it</div>
        </div>
        <div style={{display:'flex',gap:16,marginTop:24}}>
          <button className="btn ghost" style={{width:90,padding:0}} disabled={pg===0} onClick={()=>setPg(pg-1)}><Icon n="back" s={30} w={2.8}/></button>
          <button className={'btn sky'} style={{flex:1}} onClick={read}><Icon n={playing?'speaker':'replay'} s={26}/>{playing?'Reading…':'Read to me'}</button>
          <button className="btn" style={{width:200}} onClick={()=>{sfx.tap(); pg<S.pages.length-1?setPg(pg+1):setQuiz(true);}}>Next<Icon n="next" s={24} w={3}/></button>
        </div>
      </div>
    </div>
    : <div className="rise" style={{position:'absolute',top:120,left:80,right:80,bottom:40,display:'flex',flexDirection:'column'}}>
      <div style={{display:'flex',alignItems:'flex-end',gap:10}}>
        <Mascot size={150}/>
        <div className="bubble tail-l" style={{marginBottom:40}}><div style={{fontSize:13,fontWeight:700,letterSpacing:'.12em',color:'var(--ink-3)'}}>QUICK QUESTION</div>
          <div className="h2" style={{display:'flex',alignItems:'center',gap:14}}>{S.quiz.q}<SpeakBtn id="q" text={S.quiz.q}/></div></div>
      </div>
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:28}}>
        {S.quiz.opts.map(([e,l,ok],i)=>{ const on=pick===i; const st = on ? (ok?TINTS.leaf:TINTS.blush) : null;
          return <button key={i} onClick={()=>{ setPick(i); speak(l); if(ok){sfx.good();} else sfx.bad(); }} className={on&&!ok?'shake':''}
            style={{width:270,padding:'26px 20px',borderRadius:38,background:st?st[2]:'var(--paper)',border:`3px solid ${st?st[0]:'var(--line)'}`,boxShadow:`0 8px 0 ${st?st[1]:'var(--line)'}`,display:'flex',flexDirection:'column',alignItems:'center',gap:14}}>
            <span style={{fontSize:110,lineHeight:1}}>{e}</span><span style={{fontSize:'1.4em',fontWeight:700}}>{l}</span>
          </button>; })}
      </div>
      <button className="btn" style={{alignSelf:'flex-end',width:320}} disabled={pick==null||!S.quiz.opts[pick][2]} onClick={()=>{ setProgress(p=>({...p,xp:p.xp+20})); setDone(true); }}>Finish</button>
    </div>}
  </div>;
}

Object.assign(window,{ HomeScreen, StoryScreen, STORIES });
