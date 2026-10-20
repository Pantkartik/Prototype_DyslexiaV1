/* ============ Parent dashboard ============ */

function ParentScreen(){
  const { go, user, setUser, kid, progress } = useApp();
  const [sec,setSec]=useState('overview');
  const [kidId,setKidId]=useState(kid.id);
  const k = user.kids.find(x=>x.id===kidId);
  const nav=[['overview','Overview','chart'],['letters','Letters','book'],['activity','Activity','clock'],['controls','Controls','gear']];
  return <div className="screen-enter" style={{position:'absolute',inset:0,display:'grid',gridTemplateColumns:'270px 1fr',background:'#F7F3EA'}}>
    {/* sidebar */}
    <div style={{background:'var(--paper)',borderRight:'2px solid var(--line)',padding:'46px 20px 24px',display:'flex',flexDirection:'column'}}>
      <div style={{display:'flex',alignItems:'center',gap:10,padding:'0 8px'}}>
        <div style={{width:40,height:40,borderRadius:12,background:'var(--leaf)',display:'grid',placeItems:'center',color:'#fff',fontWeight:800,fontSize:20,boxShadow:'0 3px 0 var(--leaf-dd)'}}>S</div>
        <div><div style={{fontWeight:800,fontSize:20,lineHeight:1.1,color:'var(--leaf-dd)'}}>Sproutly</div><div style={{fontSize:12,fontWeight:700,letterSpacing:'.12em',color:'var(--ink-3)'}}>PARENT</div></div>
      </div>
      <div style={{fontSize:12,fontWeight:700,letterSpacing:'.12em',color:'var(--ink-3)',margin:'30px 10px 10px'}}>LEARNERS</div>
      {user.kids.map(x=>{ const tt=TINTS[x.color]; const on=x.id===kidId; return <button key={x.id} onClick={()=>setKidId(x.id)} style={{display:'flex',alignItems:'center',gap:12,padding:10,borderRadius:16,background:on?tt[2]:'transparent',marginBottom:4}}>
        <span className="letter" style={{width:42,height:42,borderRadius:'50%',background:tt[0],color:'#fff',display:'grid',placeItems:'center',fontSize:22}}>{x.name[0]}</span>
        <div style={{textAlign:'left'}}><div style={{fontWeight:600}}>{x.name}</div><div className="muted" style={{fontSize:'.8em'}}>Age {x.age}</div></div></button>;})}
      <button style={{display:'flex',alignItems:'center',gap:12,padding:10,color:'var(--ink-3)',fontWeight:600}}><span style={{width:42,height:42,borderRadius:'50%',border:'2px dashed var(--line)',display:'grid',placeItems:'center'}}><Icon n="plus" s={20}/></span>Add learner</button>
      <div style={{fontSize:12,fontWeight:700,letterSpacing:'.12em',color:'var(--ink-3)',margin:'24px 10px 10px'}}>MENU</div>
      {nav.map(([id,l,ic])=><button key={id} onClick={()=>setSec(id)} style={{display:'flex',alignItems:'center',gap:12,height:52,padding:'0 14px',borderRadius:16,fontWeight:600,background:sec===id?'var(--cream-2)':'transparent',color:sec===id?'var(--ink)':'var(--ink-2)',marginBottom:2}}><Icon n={ic} s={22}/>{l}</button>)}
      <div style={{flex:1}}/>
      <button className="btn sm" onClick={()=>{ setUser(u=>({...u,role:'child',activeKid:kidId})); go('home'); }}><Icon n="swap" s={22}/>Switch to {k.name}</button>
    </div>
    {/* main */}
    <div className="scroll" style={{overflowY:'auto',padding:'44px 36px 40px'}}>
      <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:24}}>
        <div><div className="muted" style={{fontWeight:500}}>Hi {user.parent},</div><div className="h2">{sec==='overview'?`${k.name}'s week`:sec==='letters'?'Letter mastery':sec==='activity'?'Recent activity':'Controls & goals'}</div></div>
        <div style={{flex:1}}/>
        <div className="seg" style={{width:250}}><button>Day</button><button className="on">Week</button><button>Month</button></div>
        <button className="icon-btn"><Icon n="bell" s={24}/></button>
      </div>
      {sec==='overview' && <ParentOverview k={k} progress={progress} onSec={setSec}/>}
      {sec==='letters' && <ParentLetters progress={progress}/>}
      {sec==='activity' && <ParentActivity k={k}/>}
      {sec==='controls' && <ParentControls k={k}/>}
    </div>
  </div>;
}

const WEEK = [['Mon',12,10],['Tue',8,10],['Wed',15,10],['Thu',0,10],['Fri',11,10],['Sat',18,10],['Sun',9,10]];
function Kpi({ label, value, delta, c, ic }){
  const tt=TINTS[c];
  return <div className="card" style={{padding:20,borderRadius:24}}>
    <div style={{display:'flex',alignItems:'center',gap:10}}><span style={{width:40,height:40,borderRadius:12,background:tt[2],color:tt[1],display:'grid',placeItems:'center'}}><Icon n={ic} s={22}/></span><span className="muted" style={{fontWeight:600,fontSize:'.9em'}}>{label}</span></div>
    <div style={{fontSize:'2em',fontWeight:700,marginTop:10,lineHeight:1.1}}>{value}</div>
    {delta && <div style={{fontSize:'.85em',fontWeight:600,color:delta[0]==='+'?'var(--leaf-dd)':'var(--blush-d)',marginTop:2}}>{delta} vs last week</div>}
  </div>;
}
function ParentOverview({ k, progress, onSec }){
  const max = 20;
  const learned = Object.keys(progress.done).length;
  const mastery = [['b','d',62],['p','q',71],['m','w',88]];
  return <div style={{display:'flex',flexDirection:'column',gap:20}}>
    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}}>
      <Kpi label="Time learning" value="73 min" delta="+18%" c="leaf" ic="clock"/>
      <Kpi label="Letters learned" value={`${learned} / 26`} delta="+2" c="sky" ic="book"/>
      <Kpi label="Accuracy" value="84%" delta="+6%" c="sun" ic="target"/>
      <Kpi label="Day streak" value={`${progress.streak} days`} c="blush" ic="flame"/>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'1.5fr 1fr',gap:20}}>
      <div className="card" style={{padding:24,borderRadius:28}}>
        <div style={{display:'flex',alignItems:'center'}}><div className="h3" style={{flex:1}}>Minutes per day</div><span style={{display:'flex',alignItems:'center',gap:8,fontSize:'.85em',fontWeight:600,color:'var(--ink-2)'}}><span style={{width:18,borderTop:'3px dashed var(--blush)'}}/>Goal 10 min</span></div>
        <div style={{position:'relative',height:220,marginTop:20,display:'flex',alignItems:'flex-end',gap:18,padding:'0 6px'}}>
          <div style={{position:'absolute',left:0,right:0,bottom:`calc(${10/max*100}% + 28px)`,borderTop:'3px dashed var(--blush)',opacity:.6}}/>
          {WEEK.map(([d,v],i)=><div key={d} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:8,height:'100%',justifyContent:'flex-end'}}>
            <span style={{fontSize:'.85em',fontWeight:700,color:v?'var(--ink)':'var(--ink-3)'}}>{v||'–'}</span>
            <div style={{width:'100%',maxWidth:52,height:`calc(${v/max} * (100% - 56px))`,minHeight:6,borderRadius:14,background:v>=10?'var(--leaf)':v?'var(--sun)':'var(--cream-2)',boxShadow:'inset 0 -5px 0 rgba(0,0,0,.08)',animation:`rise .5s ${i*.05}s both`}}/>
            <span className="muted" style={{fontSize:'.85em',fontWeight:600}}>{d}</span>
          </div>)}
        </div>
      </div>
      <div className="card" style={{padding:24,borderRadius:28,display:'flex',flexDirection:'column'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}><Icon n="bulb" s={26} color="var(--sun-d)"/><div className="h3">Sprout's insight</div></div>
        <p style={{marginTop:12,fontSize:'1.05em',lineHeight:1.6}}>{k.name} sometimes mixes up <b className="letter" style={{fontSize:'1.2em'}}>b</b> and <b className="letter" style={{fontSize:'1.2em'}}>d</b>. That's very common! We'll add extra mirror-letter games this week.</p>
        <div style={{marginTop:14,display:'flex',flexDirection:'column',gap:12}}>
          {mastery.map(([a,b,v])=><div key={a} style={{display:'flex',alignItems:'center',gap:12}}>
            <span className="letter" style={{width:74,fontSize:'1.5em'}}>{a} · {b}</span><div style={{flex:1}}><Progress value={v/100} color={v<70?'var(--blush)':v<85?'var(--sun)':'var(--leaf)'} h={12}/></div><span style={{fontWeight:700,width:44,textAlign:'right'}}>{v}%</span></div>)}
        </div>
        <div style={{flex:1}}/>
        <button className="btn sm ghost" style={{marginTop:16}} onClick={()=>onSec('letters')}>See all letters</button>
      </div>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:20}}>
      <div className="card" style={{padding:22,borderRadius:28}}>
        <div className="h3">Skills</div>
        {[['Letter sounds',.82,'sky'],['Letter shapes',.74,'plum'],['Writing',.58,'leaf'],['Listening',.9,'sun']].map(([l,v,c])=><div key={l} style={{marginTop:14}}><div style={{display:'flex',justifyContent:'space-between',fontWeight:600,fontSize:'.95em',marginBottom:6}}><span>{l}</span><span className="muted">{Math.round(v*100)}%</span></div><Progress value={v} color={TINTS[c][0]} h={12}/></div>)}
      </div>
      <div className="card" style={{padding:22,borderRadius:28}}>
        <div className="h3">Checkpoints</div>
        {PATH.filter(p=>p.type==='checkpoint').slice(0,4).map((c,i)=>{ const done=progress.cps[c.id]; return <div key={c.id} style={{display:'flex',alignItems:'center',gap:12,marginTop:12}}>
          <span style={{width:44,height:44,borderRadius:14,background:done?'var(--sun)':'var(--cream-2)',color:done?'#fff':'var(--ink-3)',display:'grid',placeItems:'center'}}><Icon n={done?'shield':'lock'} s={22}/></span>
          <div style={{flex:1}}><div style={{fontWeight:600}}>Unit {c.unit}</div><div className="muted" style={{fontSize:'.85em'}}>{c.letters.join(' ')}</div></div>
          <span style={{fontWeight:700,fontSize:'.85em',color:done?'var(--leaf-dd)':i===0?'var(--sun-d)':'var(--ink-3)'}}>{done?'Passed':i===0?'Up next':'Locked'}</span></div>; })}
      </div>
      <div className="card" style={{padding:22,borderRadius:28,background:'var(--leaf-l)',borderColor:'#C5E2B6'}}>
        <div className="h3">Try at home</div>
        <p style={{marginTop:10,lineHeight:1.6}}>Play “I spy” with the <b>c</b> sound in the kitchen — cup, cake, carrot. Let {k.name} trace the letter on your palm.</p>
        <div style={{display:'flex',justifyContent:'flex-end',marginTop:6}}><Mascot size={110} bob={false}/></div>
      </div>
    </div>
  </div>;
}

function ParentLetters({ progress }){
  const pct = l => progress.done[l] ? [92,85,70][3-progress.done[l]]||60 : null;
  return <div style={{display:'flex',flexDirection:'column',gap:20}}>
    <div style={{display:'flex',gap:20,fontWeight:600,fontSize:'.9em'}}>{[['var(--leaf)','Mastered'],['var(--sun)','Practising'],['var(--blush)','Needs help'],['var(--cream-2)','Not started']].map(([c,l])=><span key={l} style={{display:'flex',alignItems:'center',gap:8}}><span style={{width:16,height:16,borderRadius:5,background:c}}/>{l}</span>)}</div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:14}}>
      {LETTERS.map(L=>{ const p=pct(L.l); const c = p==null?null:p>=85?'leaf':p>=70?'sun':'blush'; const tt=c&&TINTS[c];
        return <div key={L.l} className="card" style={{padding:'16px 10px 14px',borderRadius:22,textAlign:'center',background:tt?tt[2]:'var(--paper)',borderColor:tt?tt[0]:'var(--line)'}}>
          <div className="letter" style={{fontSize:40,lineHeight:1,color:tt?tt[1]:'var(--ink-3)'}}>{L.l}{L.l.toLowerCase()}</div>
          <div style={{fontWeight:700,marginTop:8,fontSize:'.9em',color:tt?tt[1]:'var(--ink-3)'}}>{p==null?'—':p+'%'}</div>
          <div className="muted" style={{fontSize:'.75em'}}>traced {progress.traced[L.l]||0}×</div>
        </div>; })}
    </div>
  </div>;
}

function ParentActivity({ k }){
  const items = [
    ['Today, 4:12 pm','Finished level C','3 stars · 0 mistakes','leaf','star'],
    ['Today, 4:05 pm','Traced C c','2 tries · Nice work','sky','pencil'],
    ['Today, 3:58 pm','Read “Ben the Busy Bee”','Answered the quiz correctly','sun','book'],
    ['Yesterday, 6:30 pm','Level B — retried twice','Mixed up b and d','blush','replay'],
    ['Yesterday, 6:22 pm','Finished level A','3 stars','leaf','star'],
    ['Sat, 10:15 am','Earned badge “First sprout”','','sun','shield'],
  ];
  return <div className="card" style={{padding:'8px 26px',borderRadius:28}}>
    {items.map(([when,t,d,c,ic],i)=>{ const tt=TINTS[c]; return <div key={i} style={{display:'flex',alignItems:'center',gap:16,padding:'18px 0',borderBottom:i<items.length-1?'2px solid var(--cream-2)':'none'}}>
      <span style={{width:52,height:52,borderRadius:16,background:tt[2],color:tt[1],display:'grid',placeItems:'center'}}><Icon n={ic} s={26}/></span>
      <div style={{flex:1}}><div style={{fontWeight:600,fontSize:'1.05em'}}>{t}</div>{d&&<div className="muted" style={{fontSize:'.9em'}}>{d}</div>}</div>
      <span className="muted" style={{fontSize:'.9em',fontWeight:500}}>{when}</span></div>; })}
  </div>;
}

function ParentControls({ k }){
  const [goal,setGoal]=useState(10); const [limit,setLimit]=useState(true); const [report,setReport]=useState(true); const [bed,setBed]=useState(false);
  const Row=({t,d,children})=><div style={{display:'flex',alignItems:'center',gap:16,padding:'18px 0',borderBottom:'2px solid var(--cream-2)'}}><div style={{flex:1}}><div style={{fontWeight:600}}>{t}</div><div className="muted" style={{fontSize:'.9em'}}>{d}</div></div>{children}</div>;
  return <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
    <div className="card" style={{padding:'20px 26px',borderRadius:28}}>
      <div className="h3">Goals for {k.name}</div>
      <Row t="Daily learning goal" d="Minutes per day"><div className="seg" style={{width:220}}>{[5,10,15].map(v=><button key={v} className={goal===v?'on':''} onClick={()=>setGoal(v)}>{v}</button>)}</div></Row>
      <Row t="Checkpoint pass mark" d="Correct answers needed out of 5"><span className="chip">4 / 5</span></Row>
      <Row t="Extra mirror-letter practice" d="More b/d, p/q games"><button className="toggle on"/></Row>
    </div>
    <div className="card" style={{padding:'20px 26px',borderRadius:28}}>
      <div className="h3">Screen time</div>
      <Row t="Daily time limit" d="Lock after 30 minutes"><button className={'toggle'+(limit?' on':'')} onClick={()=>setLimit(!limit)}/></Row>
      <Row t="Bedtime lock" d="No play after 8:00 pm"><button className={'toggle'+(bed?' on':'')} onClick={()=>setBed(!bed)}/></Row>
      <Row t="Weekly email report" d="Sent every Sunday"><button className={'toggle'+(report?' on':'')} onClick={()=>setReport(!report)}/></Row>
    </div>
  </div>;
}

Object.assign(window,{ ParentScreen });
