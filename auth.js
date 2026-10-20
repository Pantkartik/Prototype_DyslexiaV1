/* ============ Auth: login, signup, role, child setup ============ */

function AuthShell({ children, mascotLine, side='left' }){
  return <div className="screen-enter" style={{position:'absolute',inset:0,display:'grid',gridTemplateColumns:'500px 1fr'}}>
    <div style={{position:'relative',background:'var(--leaf-l)',overflow:'hidden',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:40}}>
      <div style={{position:'absolute',width:620,height:620,borderRadius:'50%',background:'#CFE7C2',bottom:-330,left:-60}}/>
      <div style={{position:'absolute',width:180,height:180,borderRadius:'50%',background:'var(--sun-l)',top:70,right:-40}}/>
      <div style={{position:'absolute',top:48,left:44,display:'flex',alignItems:'center',gap:10}}>
        <div style={{width:44,height:44,borderRadius:14,background:'var(--leaf)',display:'grid',placeItems:'center',color:'#fff',fontWeight:800,fontSize:24,boxShadow:'0 4px 0 var(--leaf-dd)'}}>S</div>
        <span style={{fontWeight:800,fontSize:26,color:'var(--leaf-dd)',letterSpacing:'.01em'}}>Sproutly</span>
      </div>
      {mascotLine && <div className="bubble tail-b rise" style={{position:'relative',maxWidth:360,marginBottom:28,display:'flex',gap:14,alignItems:'center'}}>
        <span style={{flex:1}}>{mascotLine}</span><SpeakBtn text={mascotLine}/>
      </div>}
      <Mascot size={300} style={{position:'relative'}}/>
    </div>
    <div style={{position:'relative',display:'flex',flexDirection:'column',justifyContent:'center',padding:'40px 90px'}}>{children}</div>
  </div>;
}

function LoginScreen(){
  const { go } = useApp();
  const [email,setEmail]=useState('priya@family.com'); const [pw,setPw]=useState('sprout123'); const [show,setShow]=useState(false);
  return <AuthShell mascotLine="Hi! I'm Sprout. Let's grow some letters together!">
    <div className="h1" style={{marginBottom:8}}>Welcome back</div>
    <div className="muted" style={{fontSize:'1.15em',marginBottom:36}}>Sign in to keep learning.</div>
    <div style={{display:'grid',gap:18}}>
      <div className="field"><Icon n="mail" color="var(--ink-3)"/><div style={{flex:1,display:'flex',flexDirection:'column'}}><label>Email</label><input value={email} onChange={e=>setEmail(e.target.value)}/></div></div>
      <div className="field"><Icon n="key" color="var(--ink-3)"/><div style={{flex:1,display:'flex',flexDirection:'column'}}><label>Password</label><input type={show?'text':'password'} value={pw} onChange={e=>setPw(e.target.value)}/></div>
        <button onClick={()=>setShow(!show)} style={{color:'var(--ink-3)'}}><Icon n="eye"/></button></div>
    </div>
    <button style={{alignSelf:'flex-end',marginTop:14,color:'var(--sky-d)',fontWeight:600}}>Forgot password?</button>
    <button className="btn" style={{marginTop:28}} onClick={()=>{sfx.good();go('role');}}>Sign in</button>
    <div style={{display:'flex',alignItems:'center',gap:14,margin:'26px 0',color:'var(--ink-3)',fontWeight:500}}><div style={{flex:1,height:2,background:'var(--line)'}}/>or<div style={{flex:1,height:2,background:'var(--line)'}}/></div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
      <button className="btn ghost sm" onClick={()=>go('role')}><svg width="20" height="22" viewBox="0 0 17 20"><path fill="currentColor" d="M14.1 10.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9C3.6 4.8 2 5.8 1.1 7.4c-1.9 3.2-.5 8 1.3 10.6.9 1.3 1.9 2.7 3.3 2.6 1.3-.1 1.8-.9 3.4-.9s2 .9 3.4.8c1.4 0 2.3-1.3 3.2-2.6 1-1.5 1.4-2.9 1.4-3-.1 0-2.9-1.1-3-4.3ZM11.5 3c.7-.9 1.2-2.1 1.1-3.3-1 0-2.3.7-3 1.6-.7.8-1.2 2-1.1 3.2 1.2.1 2.3-.6 3-1.5Z"/></svg>Apple</button>
      <button className="btn ghost sm" onClick={()=>go('role')}><svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.2-2.1 3.5-5.1 3.5-8.8Z"/><path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.9-3c-1 .7-2.4 1.1-4 1.1-3.1 0-5.7-2.1-6.7-4.9H1.3v3.1A12 12 0 0 0 12 24Z"/><path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6h-4a12 12 0 0 0 0 10.8l4-3.1Z"/><path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1C6.3 6.9 8.9 4.8 12 4.8Z"/></svg>Google</button>
    </div>
    <div style={{marginTop:34,textAlign:'center',fontSize:'1.05em'}} className="muted">New to Sproutly? <button style={{color:'var(--leaf-dd)',fontWeight:700}} onClick={()=>go('signup')}>Create an account</button></div>
  </AuthShell>;
}

function SignupScreen(){
  const { go, setUser } = useApp();
  const [name,setName]=useState('Priya'); const [email,setEmail]=useState(''); const [pw,setPw]=useState(''); const [agree,setAgree]=useState(true);
  const strong = pw.length>=8;
  return <AuthShell mascotLine="A grown-up should make the account. Then we can play!">
    <button className="icon-btn" style={{position:'absolute',top:46,left:60}} onClick={()=>go('login')}><Icon n="back" s={28} w={2.6}/></button>
    <div className="h1" style={{marginBottom:8}}>Create your account</div>
    <div className="muted" style={{fontSize:'1.15em',marginBottom:30}}>One family account. Add every learner inside.</div>
    <div style={{display:'grid',gap:16}}>
      <div className="field"><Icon n="user" color="var(--ink-3)"/><div style={{flex:1,display:'flex',flexDirection:'column'}}><label>Your name</label><input value={name} onChange={e=>setName(e.target.value)}/></div></div>
      <div className="field"><Icon n="mail" color="var(--ink-3)"/><div style={{flex:1,display:'flex',flexDirection:'column'}}><label>Email</label><input placeholder="you@email.com" value={email} onChange={e=>setEmail(e.target.value)}/></div></div>
      <div className="field"><Icon n="key" color="var(--ink-3)"/><div style={{flex:1,display:'flex',flexDirection:'column'}}><label>Password</label><input type="password" placeholder="8 or more letters" value={pw} onChange={e=>setPw(e.target.value)}/></div>
        {pw && <span style={{fontSize:'.85em',fontWeight:600,color:strong?'var(--leaf-dd)':'var(--blush-d)'}}>{strong?'Strong':'Too short'}</span>}</div>
    </div>
    <button onClick={()=>setAgree(!agree)} style={{display:'flex',gap:14,alignItems:'center',marginTop:22,textAlign:'left'}}>
      <span style={{width:32,height:32,borderRadius:10,border:'2.5px solid '+(agree?'var(--leaf)':'var(--line)'),background:agree?'var(--leaf)':'var(--paper)',display:'grid',placeItems:'center',color:'#fff'}}>{agree&&<Icon n="check" s={20} w={3}/>}</span>
      <span className="muted">I'm a parent or guardian and agree to the <b style={{color:'var(--ink)'}}>Terms</b> and <b style={{color:'var(--ink)'}}>Child Privacy Policy</b>.</span>
    </button>
    <button className="btn" style={{marginTop:30}} disabled={!agree} onClick={()=>{sfx.good(); setUser(u=>({...u,parent:name||'Parent'})); go('role');}}>Create account</button>
    <div style={{marginTop:28,textAlign:'center',fontSize:'1.05em'}} className="muted">Already have one? <button style={{color:'var(--leaf-dd)',fontWeight:700}} onClick={()=>go('login')}>Sign in</button></div>
  </AuthShell>;
}

function RoleScreen(){
  const { go, setUser, user } = useApp();
  const [pick,setPick]=useState(null);
  useEffect(()=>{ const t=setTimeout(()=>speak('Who is using Sproutly? Tap Parent or Child.',{id:'role'}),500); return ()=>clearTimeout(t); },[]);
  const Opt = ({id,title,sub,color,children})=>{
    const on = pick===id; const t=TINTS[color];
    return <button onClick={()=>{sfx.tap();setPick(id);}} className="rise" style={{flex:1,borderRadius:36,padding:'34px 30px 30px',background:on?t[2]:'var(--paper)',border:`3px solid ${on?t[0]:'var(--line)'}`,boxShadow:`0 8px 0 ${on?t[1]:'var(--line)'}`,transform:on?'translateY(-6px)':'none',transition:'.2s',display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',position:'relative'}}>
      {on && <span className="popin" style={{position:'absolute',top:18,right:18,width:40,height:40,borderRadius:'50%',background:t[0],color:'#fff',display:'grid',placeItems:'center'}}><Icon n="check" s={24} w={3}/></span>}
      <div style={{height:230,display:'flex',alignItems:'flex-end',justifyContent:'center'}}>{children}</div>
      <div className="h2" style={{marginTop:18}}>{title}</div>
      <div className="muted" style={{fontSize:'1.05em',marginTop:6,maxWidth:300}}>{sub}</div>
    </button>;
  };
  return <div className="screen-enter" style={{position:'absolute',inset:0,padding:'70px 90px 50px',display:'flex',flexDirection:'column'}}>
    <div style={{display:'flex',alignItems:'center',gap:16}}>
      <button className="icon-btn" onClick={()=>go('login')}><Icon n="back" s={28} w={2.6}/></button>
      <div style={{flex:1}}/>
      <div style={{display:'flex',gap:8}}>{[0,1,2].map(i=><span key={i} style={{width:i===0?36:12,height:12,borderRadius:12,background:i===0?'var(--leaf)':'var(--line)'}}/>)}</div>
    </div>
    <div style={{display:'flex',alignItems:'center',gap:16,marginTop:20}}>
      <div className="h1">Who's using Sproutly?</div><SpeakBtn id="role" text="Who is using Sproutly? Tap Parent or Child."/>
    </div>
    <div className="muted" style={{fontSize:'1.15em',marginTop:6}}>You can switch any time from the Me tab.</div>
    <div style={{display:'flex',gap:36,marginTop:34,flex:1}}>
      <Opt id="parent" title="I'm a Parent" sub="Track progress, set goals and reading comfort." color="sky">
        <div style={{width:210,height:210,borderRadius:'50%',background:'var(--sky-l)',display:'grid',placeItems:'center',position:'relative'}}>
          <div style={{width:150,height:150,borderRadius:28,background:'var(--paper)',border:'3px solid var(--sky)',padding:18,display:'flex',alignItems:'flex-end',gap:12}}>
            {[.45,.7,.55,.95].map((h,i)=><div key={i} style={{flex:1,height:`${h*100}%`,borderRadius:8,background:i===3?'var(--leaf)':'var(--sky)'}}/>)}
          </div>
          <Icon n="shield" s={54} fill="var(--sun)" color="var(--sun-d)" w={1.6} style={{position:'absolute',top:6,right:8}}/>
        </div>
      </Opt>
      <Opt id="child" title="I'm a Child" sub="Play letter games and stories with Sprout!" color="leaf">
        <Mascot size={220}/>
      </Opt>
    </div>
    <button className="btn" style={{marginTop:34,alignSelf:'center',width:420}} disabled={!pick}
      onClick={()=>{ sfx.good(); setUser(u=>({...u,role:pick})); go(pick==='parent'?'parentGate':'kidSetup', pick==='parent'?{next:'parent'}:{}); }}>Continue</button>
  </div>;
}

function KidSetupScreen(){
  const { go, setUser, user } = useApp();
  const [step,setStep]=useState(0);
  const [kidId,setKidId]=useState(user.activeKid);
  const kid = user.kids.find(k=>k.id===kidId);
  const goals = [['5','5 minutes','A tiny daily seed'],['10','10 minutes','Recommended'],['15','15 minutes','Big grower']];
  const [goal,setGoal]=useState('10');
  const [font,setFont]=useState('Lexend');
  useEffect(()=>{ if(step===0) speak("Who's learning today? Tap your name.",{id:'ks'}); if(step===1) speak('Which letters are easiest to read? Tap one.',{id:'ks'}); if(step===2) speak('How long do you want to play each day?',{id:'ks'}); },[step]);
  const prompts=["Who's learning today?","Which letters are easiest to read?","How long do you want to play each day?"];
  const fontOpts=[['Lexend','var(--font-ui)'],['Andika','Andika'],['Atkinson','Atkinson Hyperlegible']];
  return <div className="screen-enter" style={{position:'absolute',inset:0,padding:'70px 90px 50px',display:'flex',flexDirection:'column'}}>
    <div style={{display:'flex',alignItems:'center',gap:16}}>
      <button className="icon-btn" onClick={()=>step?setStep(step-1):go('role')}><Icon n="back" s={28} w={2.6}/></button>
      <div style={{flex:1,maxWidth:520,margin:'0 auto'}}><Progress value={(step+1)/3}/></div>
      <div style={{width:56}}/>
    </div>
    <div style={{display:'flex',alignItems:'flex-end',gap:24,marginTop:24}}>
      <Mascot size={150}/>
      <div className="bubble tail-l" style={{marginBottom:40,display:'flex',gap:14,alignItems:'center',fontSize:'1.6em',fontWeight:600}}>{prompts[step]}<SpeakBtn id="ks" text={prompts[step]}/></div>
    </div>
    <div key={step} className="rise" style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:28}}>
      {step===0 && <>{user.kids.map(k=>{ const t=TINTS[k.color]; const on=kidId===k.id;
        return <button key={k.id} onClick={()=>{sfx.tap();setKidId(k.id);speak(k.name);}} style={{width:250,padding:'30px 20px',borderRadius:34,background:on?t[2]:'var(--paper)',border:`3px solid ${on?t[0]:'var(--line)'}`,boxShadow:`0 7px 0 ${on?t[1]:'var(--line)'}`,display:'flex',flexDirection:'column',alignItems:'center',gap:14}}>
          <div style={{width:120,height:120,borderRadius:'50%',background:t[0],color:'#fff',display:'grid',placeItems:'center',fontSize:56,fontWeight:700}} className="letter">{k.name[0]}</div>
          <div className="h2">{k.name}</div><div className="muted">Age {k.age}</div>
        </button>;})}
        <button style={{width:250,height:290,borderRadius:34,border:'3px dashed var(--line)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:12,color:'var(--ink-3)',fontWeight:600}}><span style={{width:80,height:80,borderRadius:'50%',background:'var(--cream-2)',display:'grid',placeItems:'center'}}><Icon n="plus" s={36}/></span>Add a learner</button>
      </>}
      {step===1 && fontOpts.map(([f,ff])=>{ const on=font===f; return <button key={f} onClick={()=>{sfx.tap();setFont(f);}} style={{width:280,padding:'30px 20px',borderRadius:34,background:on?'var(--leaf-l)':'var(--paper)',border:`3px solid ${on?'var(--leaf)':'var(--line)'}`,boxShadow:`0 7px 0 ${on?'var(--leaf-dd)':'var(--line)'}`}}>
        <div style={{fontFamily:ff,fontSize:80,fontWeight:700,lineHeight:1.1,letterSpacing:'.04em'}}>a b d</div>
        <div style={{fontFamily:ff,fontSize:26,marginTop:10,letterSpacing:'.06em'}}>big dog</div>
      </button>;})}
      {step===2 && goals.map(([g,t,s])=>{ const on=goal===g; return <button key={g} onClick={()=>{sfx.tap();setGoal(g);}} style={{width:270,padding:'32px 20px',borderRadius:34,background:on?'var(--sun-l)':'var(--paper)',border:`3px solid ${on?'var(--sun)':'var(--line)'}`,boxShadow:`0 7px 0 ${on?'var(--sun-d)':'var(--line)'}`,display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
        <div style={{fontSize:70,fontWeight:800,color:'var(--sun-d)',lineHeight:1}}>{g}</div><div className="h3">{t}</div><div className="muted">{s}</div>
      </button>;})}
    </div>
    <button className="btn" style={{alignSelf:'center',width:420}} onClick={()=>{ sfx.good(); if(step<2) setStep(step+1); else { setUser(u=>({...u,activeKid:kidId,role:'child'})); go('home'); } }}>{step<2?'Next':"Let's go!"}</button>
  </div>;
}

Object.assign(window,{ LoginScreen, SignupScreen, RoleScreen, KidSetupScreen });
