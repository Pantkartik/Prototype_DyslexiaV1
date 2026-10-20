/* ============ Me / Profile + settings, Parent gate ============ */

function ProfileScreen(){
  const { go, kid, user, setUser, progress, settings, setSettings } = useApp();
  const [sw,setSw]=useState(false);
  const set = (k,v)=>setSettings(s=>({...s,[k]:v}));
  const t = TINTS[kid.color];
  const learned = Object.keys(progress.done).length;
  const badges = [['🌱','First sprout',true],['🔥','5-day streak',progress.streak>=5],['📖','Story reader',true],['✏️','Neat writer',Object.values(progress.traced).reduce((a,b)=>a+b,0)>=10],['🛡️','Checkpoint hero',Object.keys(progress.cps).length>0],['🏆','Alphabet champ',false]];
  const Row = ({ic,label,children,sub})=><div style={{display:'flex',alignItems:'center',gap:16,padding:'14px 0',borderBottom:'2px solid var(--cream-2)'}}>
    <span style={{width:46,height:46,borderRadius:14,background:'var(--cream-2)',display:'grid',placeItems:'center',color:'var(--ink-2)'}}><Icon n={ic} s={24}/></span>
    <div style={{flex:1}}><div style={{fontWeight:600}}>{label}</div>{sub&&<div className="muted" style={{fontSize:'.85em'}}>{sub}</div>}</div>{children}</div>;
  return <div className="screen-enter scroll" style={{position:'absolute',inset:0,overflowY:'auto',paddingBottom:130}}>
    <div style={{padding:'40px 32px 0',display:'flex',alignItems:'center'}}>
      <div className="h2">Me</div><div style={{flex:1}}/>
      <button className="btn sm ghost" onClick={()=>go('parentGate',{next:'parent'})}><Icon n="shield" s={22}/>Parent dashboard</button>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'420px 1fr',gap:24,padding:'22px 32px 0'}}>
      <div style={{display:'flex',flexDirection:'column',gap:20}}>
        <div style={{borderRadius:40,background:t[2],padding:'28px 28px 24px',position:'relative',overflow:'hidden'}}>
          <Mascot size={120} style={{position:'absolute',right:10,top:10}}/>
          <div className="letter" style={{width:96,height:96,borderRadius:'50%',background:t[0],color:'#fff',display:'grid',placeItems:'center',fontSize:50,border:'5px solid var(--paper)'}}>{kid.name[0]}</div>
          <div className="h1" style={{marginTop:12}}>{kid.name}</div>
          <div style={{fontWeight:500,color:t[1]}}>Age {kid.age} · Growing reader</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginTop:20}}>
            {[[learned,'letters','leaf'],[progress.streak,'day streak','blush'],[progress.xp,'points','sun']].map(([v,l,c])=><div key={l} style={{background:'var(--paper)',borderRadius:20,padding:'12px 10px',textAlign:'center'}}><div style={{fontWeight:800,fontSize:'1.5em',color:TINTS[c][1]}}>{v}</div><div className="muted" style={{fontSize:'.8em'}}>{l}</div></div>)}
          </div>
          <button className="btn sm ghost" style={{width:'100%',marginTop:18}} onClick={()=>setSw(true)}><Icon n="swap" s={22}/>Switch learner</button>
        </div>
        <div className="card" style={{padding:22}}>
          <div className="h3" style={{marginBottom:14}}>My badges</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
            {badges.map(([e,l,on])=><div key={l} style={{textAlign:'center',opacity:on?1:.4}}><div style={{width:76,height:76,margin:'0 auto',borderRadius:'50%',background:on?'var(--sun-l)':'var(--cream-2)',border:`3px solid ${on?'var(--sun)':'var(--line)'}`,display:'grid',placeItems:'center',fontSize:36,filter:on?'none':'grayscale(1)'}}>{e}</div><div style={{fontSize:'.8em',fontWeight:600,marginTop:6,lineHeight:1.3}}>{l}</div></div>)}
          </div>
        </div>
      </div>
      <div className="card" style={{padding:'24px 28px'}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}><div className="h3">Reading comfort</div><span className="chip" style={{height:32,fontSize:'.8em',background:'var(--leaf-l)',borderColor:'var(--leaf)',color:'var(--leaf-dd)'}}>Changes the whole app</span></div>
        <div style={{marginTop:16,padding:'18px 22px',borderRadius:22,background:'var(--cream)',fontSize:'1.4em',fontWeight:500}}>The big dog dug a deep pit.</div>
        <div style={{fontSize:13,fontWeight:700,letterSpacing:'.12em',color:'var(--ink-3)',margin:'18px 0 8px'}}>FONT</div>
        <div className="seg">{[['Lexend','Lexend'],['Andika','Andika'],['Atkinson','Atkinson Hyperlegible']].map(([k,f])=><button key={k} className={settings.font===k?'on':''} style={{fontFamily:f}} onClick={()=>set('font',k)}>{k}</button>)}</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}}>
          <div><div style={{fontSize:13,fontWeight:700,letterSpacing:'.12em',color:'var(--ink-3)',margin:'18px 0 8px'}}>TEXT SIZE</div>
            <div className="seg">{[[.92,'A'],[1,'A'],[1.1,'A']].map(([v,l],i)=><button key={v} className={settings.size===v?'on':''} style={{fontSize:16+i*5}} onClick={()=>set('size',v)}>{l}</button>)}</div></div>
          <div><div style={{fontSize:13,fontWeight:700,letterSpacing:'.12em',color:'var(--ink-3)',margin:'18px 0 8px'}}>LETTER SPACING</div>
            <div className="seg">{['normal','wide','extra'].map(v=><button key={v} className={settings.spacing===v?'on':''} onClick={()=>set('spacing',v)} style={{textTransform:'capitalize'}}>{v}</button>)}</div></div>
        </div>
        <div style={{fontSize:13,fontWeight:700,letterSpacing:'.12em',color:'var(--ink-3)',margin:'18px 0 8px'}}>PAGE TINT</div>
        <div style={{display:'flex',gap:12}}>{[['cream','#FBF6EC'],['peach','#FCE6D8'],['mint','#DFF1E2'],['blue','#DDEBF7'],['lilac','#ECE4F7']].map(([k,c])=><button key={k} onClick={()=>set('tint',k)} style={{flex:1,height:52,borderRadius:16,background:c,border:`3px solid ${settings.tint===k?'var(--leaf)':'var(--line)'}`,fontWeight:600,fontSize:'.85em',textTransform:'capitalize'}}>{k}</button>)}</div>
        <div style={{marginTop:10}}>
          <Row ic="speaker" label="Voice speed" sub="How fast Sprout talks">
            <div className="seg" style={{width:250}}>{[[.7,'Slow'],[.85,'Calm'],[1,'Normal']].map(([v,l])=><button key={v} className={settings.rate===v?'on':''} onClick={()=>{set('rate',v);speechState.rate=v;speak('Hi, I am Sprout!');}}>{l}</button>)}</div>
          </Row>
          <Row ic="bell" label="Read screens out loud" sub="Sprout reads new pages automatically"><button className={'toggle'+(settings.autoRead?' on':'')} onClick={()=>set('autoRead',!settings.autoRead)}/></Row>
          <Row ic="star" label="Sound effects"><button className={'toggle'+(settings.sfx?' on':'')} onClick={()=>set('sfx',!settings.sfx)}/></Row>
          <Row ic="logout" label="Sign out" sub={user.parent+"'s family account"}><button className="btn sm ghost" onClick={()=>go('login')}>Sign out</button></Row>
        </div>
      </div>
    </div>
    {sw && <div style={{position:'absolute',inset:0,zIndex:90,background:'rgba(47,58,51,.35)',display:'grid',placeItems:'center'}} onClick={()=>setSw(false)}>
      <div className="popin card" onClick={e=>e.stopPropagation()} style={{width:640,padding:34,borderRadius:40}}>
        <div className="h2">Who's learning?</div>
        <div style={{display:'flex',gap:18,marginTop:22}}>
          {user.kids.map(k=>{ const tt=TINTS[k.color]; const on=k.id===kid.id; return <button key={k.id} onClick={()=>{sfx.tap();setUser(u=>({...u,activeKid:k.id}));setSw(false);speak('Hi '+k.name+'!');}} style={{flex:1,padding:22,borderRadius:30,background:on?tt[2]:'var(--cream)',border:`3px solid ${on?tt[0]:'var(--line)'}`,display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
            <span className="letter" style={{width:84,height:84,borderRadius:'50%',background:tt[0],color:'#fff',display:'grid',placeItems:'center',fontSize:42}}>{k.name[0]}</span><b style={{fontSize:'1.2em'}}>{k.name}</b></button>;})}
          <button onClick={()=>{setSw(false);go('parentGate',{next:'parent'});}} style={{flex:1,padding:22,borderRadius:30,background:'var(--sky-l)',border:'3px solid var(--sky)',display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
            <span style={{width:84,height:84,borderRadius:'50%',background:'var(--sky)',color:'#fff',display:'grid',placeItems:'center'}}><Icon n="shield" s={40}/></span><b style={{fontSize:'1.2em'}}>Parent</b></button>
        </div>
      </div>
    </div>}
    <TabBar/>
  </div>;
}

/* Parent gate: hold-to-unlock + simple math so kids don't wander in */
function ParentGateScreen(){
  const { go, route, setUser } = useApp();
  const [a] = useState(()=>3+Math.floor(Math.random()*5)); const [b] = useState(()=>4+Math.floor(Math.random()*5));
  const [val,setVal]=useState(''); const [err,setErr]=useState(false);
  const press = d=>{ sfx.tap(); const v=(val+d).slice(0,2); setVal(v); setErr(false);
    if(v.length===String(a*b).length){ if(+v===a*b){ sfx.good(); setUser(u=>({...u,role:'parent'})); setTimeout(()=>go(route.next||'parent'),250); } else { sfx.bad(); setErr(true); setTimeout(()=>setVal(''),500);} } };
  return <div className="screen-enter" style={{position:'absolute',inset:0,background:'var(--sky-l)',display:'grid',gridTemplateColumns:'1fr 1fr',alignItems:'center',padding:'0 90px'}}>
    <button className="icon-btn" style={{position:'absolute',top:40,left:32}} onClick={()=>go('me')}><Icon n="back" s={28} w={2.6}/></button>
    <div>
      <span className="chip" style={{background:'var(--paper)',borderColor:'var(--sky)',color:'var(--sky-d)'}}><Icon n="shield" s={22}/>Grown-ups only</span>
      <div className="h1" style={{marginTop:18,maxWidth:420}}>Ask a grown-up to continue</div>
      <div className="muted" style={{fontSize:'1.15em',marginTop:10,maxWidth:420}}>Solve this to open the parent dashboard.</div>
      <div style={{fontSize:76,fontWeight:800,marginTop:30,letterSpacing:'.04em'}}>{a} × {b} = <span style={{display:'inline-block',minWidth:120,borderBottom:`6px solid ${err?'var(--blush)':'var(--sky)'}`,color:err?'var(--blush-d)':'var(--ink)'}} className={err?'shake':''}>{val||'\u00a0'}</span></div>
      <div className="muted" style={{marginTop:24,fontSize:'.9em'}}>Hint for reviewers: the answer is {a*b}</div>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(3,120px)',gap:16,justifyContent:'center'}}>
      {[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map((d,i)=> d===''?<span key={i}/> :
        <button key={i} onClick={()=>d==='⌫'?setVal(val.slice(0,-1)):press(String(d))} style={{height:100,borderRadius:28,background:'var(--paper)',boxShadow:'0 6px 0 #BFD9EC',fontSize:40,fontWeight:700}}>{d}</button>)}
    </div>
  </div>;
}

Object.assign(window,{ ProfileScreen, ParentGateScreen });
