/* ============ Learn map — candy-style winding path ============ */

function pathStatus(progress){
  let foundCurrent=false;
  return PATH.map(n=>{
    const done = n.type==='letter' ? (progress.done[n.id]||0)>0 : !!progress.cps[n.id];
    if(done) return {...n,status:'done',stars:n.type==='letter'?progress.done[n.id]:3};
    if(!foundCurrent){ foundCurrent=true; return {...n,status:'current'}; }
    return {...n,status:'locked'};
  });
}

const NODE_GAP = 132;
function nodePos(i){ return { x: 210 + i*NODE_GAP + Math.floor(i/(UNIT_SIZE+1))*40, y: 410 + Math.sin(i*0.95+0.4)*150 }; }

function LearnScreen(){
  const { progress, go, showToast } = useApp();
  const nodes = useMemo(()=>pathStatus(progress),[progress]);
  const scRef = useRef();
  const [sel,setSel]=useState(null);
  const curIdx = nodes.findIndex(n=>n.status==='current');
  const width = nodePos(nodes.length-1).x + 300;
  useEffect(()=>{ const el=scRef.current; if(el){ const saved = sessionStorage.getItem('sp_mapx'); el.scrollLeft = saved!=null? +saved : Math.max(0,nodePos(curIdx).x-520); } },[]);
  const units = [];
  nodes.forEach((n,i)=>{ if(n.type==='checkpoint'){ const start = i - (n.letters.length); units.push({unit:n.unit, x0: nodePos(Math.max(0,start)).x - 110, x1: nodePos(i).x + 90}); } });
  const unitColors = ['#E3F1DA','#FCE6DE','#FDF0C9','#DDEEF9','#ECE4FA','#E3F1DA','#FCE6DE'];
  const curNode = nodes[curIdx];
  const curUnit = curNode ? Math.floor(PATH.indexOf(PATH.find(p=>p.id===curNode.id))/(UNIT_SIZE+1)) : 0;

  // path svg
  let d=''; nodes.forEach((n,i)=>{ const p=nodePos(i); if(i===0) d+=`M${p.x} ${p.y}`; else { const q=nodePos(i-1); const mx=(q.x+p.x)/2; d+=` C${mx} ${q.y} ${mx} ${p.y} ${p.x} ${p.y}`; } });
  let dDone=''; nodes.slice(0,curIdx+1).forEach((n,i)=>{ const p=nodePos(i); if(i===0) dDone+=`M${p.x} ${p.y}`; else { const q=nodePos(i-1); const mx=(q.x+p.x)/2; dDone+=` C${mx} ${q.y} ${mx} ${p.y} ${p.x} ${p.y}`; } });

  const tap = (n,i)=>{
    if(n.status==='locked'){ sfx.bad(); showToast(n.type==='checkpoint'?'Finish the letters before this checkpoint.':'Pass the checkpoint to unlock this letter.'); return; }
    sfx.tap(); setSel(sel===i?null:i);
    if(n.type==='letter') speak(`${n.id}. ${getLetter(n.id).word}`); else speak('Checkpoint test');
  };

  return <div className="screen-enter" style={{position:'absolute',inset:0,background:'#F6EFDF'}}>
    <div ref={scRef} className="scroll" onScroll={e=>sessionStorage.setItem('sp_mapx',e.target.scrollLeft)} style={{position:'absolute',inset:0,overflowX:'auto',overflowY:'hidden'}} onClick={()=>setSel(null)}>
      <div style={{position:'relative',width,height:834}}>
        {/* unit zones */}
        {units.map((u,k)=><div key={k} style={{position:'absolute',left:u.x0,width:u.x1-u.x0+20,top:0,bottom:0,background:unitColors[k%unitColors.length]}}>
          <div style={{position:'absolute',left:28,bottom:132,display:'flex',flexDirection:'column',gap:2}}>
            <span style={{fontSize:14,fontWeight:700,letterSpacing:'.12em',color:'var(--ink-3)'}}>UNIT {u.unit}</span>
            <span style={{fontSize:22,fontWeight:700,color:'var(--ink-2)'}}>{UNIT_NAMES[k]}</span>
          </div>
          {/* hills */}
          <svg style={{position:'absolute',left:0,bottom:0}} width={u.x1-u.x0+20} height="120" viewBox={`0 0 ${u.x1-u.x0+20} 120`} preserveAspectRatio="none"><path d={`M0 70 Q ${(u.x1-u.x0)/4} 20 ${(u.x1-u.x0)/2} 60 T ${u.x1-u.x0+20} 50 V120 H0Z`} fill="rgba(255,255,255,.45)"/></svg>
        </div>)}
        {/* decorative clouds / flora */}
        {Array.from({length:Math.floor(width/420)}).map((_,i)=><div key={i} style={{position:'absolute',left:i*420+120,top:i%2?150:200,width:110,height:40,borderRadius:40,background:'rgba(255,255,255,.7)'}}><div style={{position:'absolute',left:22,top:-20,width:56,height:56,borderRadius:'50%',background:'rgba(255,255,255,.7)'}}/></div>)}
        <svg style={{position:'absolute',inset:0}} width={width} height="834">
          <path d={d} fill="none" stroke="#E2D6BC" strokeWidth="30" strokeLinecap="round"/>
          <path d={d} fill="none" stroke="#fff" strokeWidth="6" strokeDasharray="2 22" strokeLinecap="round" opacity=".9"/>
          <path d={dDone} fill="none" stroke="var(--leaf)" strokeWidth="30" strokeLinecap="round"/>
          <path d={dDone} fill="none" stroke="#fff" strokeWidth="6" strokeDasharray="2 22" strokeLinecap="round" opacity=".7"/>
        </svg>
        {nodes.map((n,i)=><MapNode key={n.id} n={n} i={i} sel={sel===i} onTap={e=>{e.stopPropagation();tap(n,i);}} onStart={()=>{ sfx.good(); n.type==='letter'?go('lesson',{letter:n.id}):go('checkpoint',{id:n.id}); }}/>)}
        {curNode && <div style={{position:'absolute',left:nodePos(curIdx).x-210,top:nodePos(curIdx).y-170,pointerEvents:'none'}}><Mascot size={130}/></div>}
        <div style={{position:'absolute',left:nodePos(nodes.length-1).x+80,top:300,textAlign:'center'}}>
          <div style={{fontSize:90}}>🏆</div><div className="h3" style={{color:'var(--ink-2)'}}>Letter Champion</div>
        </div>
      </div>
    </div>
    {/* overlay header */}
    <div style={{position:'absolute',top:40,left:32,right:32,display:'flex',alignItems:'center',gap:16,pointerEvents:'none'}}>
      <div className="card" style={{pointerEvents:'auto',padding:'12px 22px 12px 14px',display:'flex',gap:14,alignItems:'center',boxShadow:'0 6px 0 var(--line)'}}>
        <div style={{width:52,height:52,borderRadius:16,background:'var(--leaf)',color:'#fff',display:'grid',placeItems:'center',fontWeight:800,fontSize:22}}>{curUnit+1}</div>
        <div><div style={{fontSize:13,fontWeight:700,letterSpacing:'.12em',color:'var(--ink-3)'}}>UNIT {curUnit+1} · ALPHABET</div><div className="h3">{UNIT_NAMES[curUnit]}</div></div>
        <div style={{width:160,marginLeft:12}}><Progress value={nodes.filter(n=>n.status==='done').length/nodes.length} h={14}/></div>
      </div>
      <div style={{flex:1}}/>
      <div style={{pointerEvents:'auto'}}><TopStats/></div>
    </div>
    <div style={{position:'absolute',right:32,bottom:30,display:'flex',gap:10,zIndex:61}}>
      <button className="icon-btn" onClick={()=>scRef.current.scrollBy({left:-600,behavior:'smooth'})}><Icon n="back" s={28} w={2.6}/></button>
      <button className="icon-btn" onClick={()=>scRef.current.scrollBy({left:600,behavior:'smooth'})}><Icon n="next" s={28} w={2.6}/></button>
    </div>
    <TabBar/>
  </div>;
}

function MapNode({ n, i, sel, onTap, onStart }){
  const p = nodePos(i);
  const isCP = n.type==='checkpoint';
  const L = !isCP && getLetter(n.id);
  const t = isCP ? TINTS.sun : TINTS[L.tint];
  const size = isCP ? 120 : 92;
  const locked = n.status==='locked', cur=n.status==='current', done=n.status==='done';
  const bg = locked ? '#E3DACA' : (done ? t[0] : t[0]);
  const sh = locked ? '#CBC0AA' : t[1];
  return <div style={{position:'absolute',left:p.x-size/2,top:p.y-size/2,width:size,height:size,zIndex:sel?30:2}}>
    {cur && <div style={{position:'absolute',inset:-14,borderRadius:'50%',border:'5px solid '+t[0],opacity:.35,animation:'pulse 1.6s infinite'}}/>}
    <button onClick={onTap} style={{width:size,height:size,borderRadius:isCP?36:'50%',background:bg,boxShadow:`0 9px 0 ${sh}, inset 0 -8px 0 rgba(0,0,0,.08)`,display:'grid',placeItems:'center',position:'relative',color:'#fff',transform:sel?'translateY(-4px) scale(1.04)':'none',transition:'.15s'}}>
      <span style={{position:'absolute',top:10,left:'22%',width:'34%',height:10,borderRadius:10,background:'rgba(255,255,255,.4)'}}/>
      {isCP ? (locked? <Icon n="lock" s={44} w={2.6} color="#B1A68F"/> : <Icon n="shield" s={58} w={2} fill="#fff" color={t[1]}/>)
        : <span className="letter" style={{fontSize:52,lineHeight:1,color:locked?'#B1A68F':'#fff',textShadow:locked?'none':'0 3px 0 rgba(0,0,0,.12)'}}>{n.id}</span>}
    </button>
    {done && !isCP && <div style={{position:'absolute',top:size+14,left:'50%',transform:'translateX(-50%)'}}><Stars n={n.stars} s={22}/></div>}
    {isCP && <div style={{position:'absolute',top:size+16,left:'50%',transform:'translateX(-50%)',whiteSpace:'nowrap',fontSize:14,fontWeight:700,letterSpacing:'.1em',color:locked?'var(--ink-3)':'var(--sun-d)'}}>CHECKPOINT</div>}
    {sel && <div className="popin" onClick={e=>e.stopPropagation()} style={{position:'absolute',left:size/2-160,top: p.y>420 ? -238 : size+50,width:320,background:'var(--paper)',border:'2.5px solid var(--line)',borderRadius:28,padding:20,boxShadow:'0 14px 30px rgba(70,60,30,.15)'}}>
      {isCP ? <>
        <div style={{display:'flex',gap:12,alignItems:'center'}}><div style={{fontSize:13,fontWeight:700,letterSpacing:'.12em',color:'var(--sun-d)'}}>CHECKPOINT {n.unit}</div></div>
        <div className="h3" style={{marginTop:4}}>Show what you know!</div>
        <div className="muted" style={{marginTop:4}}>Letters {n.letters.join(', ')} · 5 questions · pass 4 to unlock the next unit.</div>
      </> : <>
        <div style={{display:'flex',gap:14,alignItems:'center'}}>
          <Pic emoji={L.pic} tint={L.tint} size={64} radius={18}/>
          <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,letterSpacing:'.12em',color:'var(--ink-3)'}}>LEVEL {L.l}</div><div className="h3"><b style={{color:t[1]}}>{L.l}</b> is for {L.word}</div></div>
          <SpeakBtn text={`${L.l} is for ${L.word}`}/>
        </div>
      </>}
      <button className={'btn sm '+(isCP?'sun':'')} style={{width:'100%',marginTop:16}} onClick={onStart}>{done?'Play again':(isCP?'Start test':'Start')}</button>
    </div>}
  </div>;
}

Object.assign(window,{ LearnScreen, pathStatus });
