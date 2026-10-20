/* ============ Write: tracing canvas practice ============ */

const CW = 760, CH = 560;
function WriteScreen(){
  const { route, progress, setProgress } = useApp();
  const [letter,setLetter]=useState(route.letter||'A');
  const [cas,setCas]=useState('upper');
  const [mode,setMode]=useState('trace'); // trace | free
  const [color,setColor]=useState('#4E9A4A');
  const [brush,setBrush]=useState(28);
  const [result,setResult]=useState(null);
  const [lines,setLines]=useState(true);
  const L = getLetter(letter); const t=TINTS[L.tint];
  const glyph = cas==='upper'?L.l:L.l.toLowerCase();
  const guideRef=useRef(), inkRef=useRef(), maskRef=useRef(document.createElement('canvas'));
  const [fontReady,setFontReady]=useState(0);
  useEffect(()=>{ document.fonts && document.fonts.load('700 100px Andika').then(()=>setFontReady(1)); },[]);
  const drawing=useRef(false), last=useRef(null), strokes=useRef(0);

  // draw guide
  useEffect(()=>{
    const g=guideRef.current.getContext('2d'); g.clearRect(0,0,CW,CH);
    const fontSize = 440;
    const base = cas==='upper'? 440 : 440;
    g.font = `700 ${fontSize}px Andika`; g.textAlign='center'; g.textBaseline='alphabetic';
    // handwriting lines
    if(lines){
      const top=440-300, mid=440-200, bot=440;
      g.lineWidth=3; g.strokeStyle='#D9CEB6'; g.setLineDash([]);
      [top,bot].forEach(y=>{g.beginPath();g.moveTo(30,y);g.lineTo(CW-30,y);g.stroke();});
      g.setLineDash([14,14]); g.strokeStyle='#E5DAC4'; g.beginPath(); g.moveTo(30,mid); g.lineTo(CW-30,mid); g.stroke(); g.setLineDash([]);
    }
    if(mode==='trace'){
      g.fillStyle = 'rgba(200,190,170,.22)'; g.fillText(glyph, CW/2, base);
      g.setLineDash([3,16]); g.lineCap='round'; g.lineWidth=7; g.strokeStyle='#B9AC92'; g.strokeText(glyph, CW/2, base); g.setLineDash([]);
    }
    // mask
    const m=maskRef.current; m.width=CW; m.height=CH; const mc=m.getContext('2d'); mc.clearRect(0,0,CW,CH); mc.font=g.font; mc.textAlign='center'; mc.fillStyle='#000'; mc.fillText(glyph,CW/2,base);
    mc.lineWidth=36; mc.lineJoin='round'; mc.strokeStyle='#000'; mc.strokeText(glyph,CW/2,base);
  },[glyph,mode,lines,fontReady]);
  useEffect(()=>{ clear(); const tm=setTimeout(()=>speak(mode==='trace'?`Trace the letter ${L.l}. Start at the green dot.`:`Now write ${L.l} all by yourself!`,{id:'wp'}),300); return ()=>clearTimeout(tm); },[glyph,mode]);

  const pos = e=>{ const r=inkRef.current.getBoundingClientRect(); return {x:(e.clientX-r.left)*CW/r.width, y:(e.clientY-r.top)*CH/r.height}; };
  const down = e=>{ e.preventDefault(); drawing.current=true; last.current=pos(e); strokes.current++; setResult(null); dot(last.current); inkRef.current.setPointerCapture(e.pointerId); };
  const move = e=>{ if(!drawing.current) return; const p=pos(e); const c=inkRef.current.getContext('2d'); c.strokeStyle=color; c.lineWidth=brush; c.lineCap='round'; c.lineJoin='round'; c.beginPath(); c.moveTo(last.current.x,last.current.y); c.lineTo(p.x,p.y); c.stroke(); last.current=p; };
  const up = ()=>{ drawing.current=false; };
  const dot = p=>{ const c=inkRef.current.getContext('2d'); c.fillStyle=color; c.beginPath(); c.arc(p.x,p.y,brush/2,0,7); c.fill(); };
  const clear = ()=>{ const c=inkRef.current&&inkRef.current.getContext('2d'); c&&c.clearRect(0,0,CW,CH); strokes.current=0; setResult(null); };

  const check = ()=>{
    const ink=inkRef.current.getContext('2d').getImageData(0,0,CW,CH).data;
    const mask=maskRef.current.getContext('2d').getImageData(0,0,CW,CH).data;
    let maskN=0, covered=0, inkN=0, inside=0;
    for(let i=3;i<ink.length;i+=16){ const m=mask[i]>0, k=ink[i]>0; if(m) maskN++; if(k) inkN++; if(m&&k) covered++; if(k&&m) inside++; }
    if(inkN<50){ speak('Draw the letter first!'); return; }
    const coverage = covered/maskN, accuracy = inside/inkN;
    const score = Math.round(Math.min(1, coverage*1.35)*60 + accuracy*40);
    const stars = score>=80?3:score>=60?2:score>=40?1:0;
    setResult({score,stars,coverage,accuracy});
    if(stars>=2){ sfx.win(); speak(stars===3?'Wow! Beautiful writing!':'Nice work! Keep practicing.'); setProgress(p=>({...p,traced:{...p.traced,[L.l]:(p.traced[L.l]||0)+1},xp:p.xp+5*stars})); }
    else { sfx.bad(); speak(accuracy<.6?'Try to stay inside the dotted lines.':'Good try! Trace the whole letter.'); }
  };

  const colors=['#4E9A4A','#D0604F','#3F8CC4','#7E5FC2','#D9A21C'];
  // start dots (approx) for guide
  const startHint = cas==='upper' ? {x:CW/2-60,y:150} : {x:CW/2-20,y:250};

  return <div className="screen-enter" style={{position:'absolute',inset:0,background:'var(--cream)'}}>
    {result && result.stars>=2 && <Confetti count={90}/>}
    <div style={{position:'absolute',top:40,left:32,right:32,display:'flex',alignItems:'center',gap:16}}>
      <div><div style={{fontSize:14,fontWeight:700,letterSpacing:'.12em',color:'var(--ink-3)'}}>PRACTICE</div><div className="h2">Writing pad</div></div>
      <div style={{flex:1}}/>
      <div className="seg" style={{width:260}}><button className={mode==='trace'?'on':''} onClick={()=>setMode('trace')}>Trace</button><button className={mode==='free'?'on':''} onClick={()=>setMode('free')}>Free write</button></div>
      <div className="seg" style={{width:170}}><button className={cas==='upper'?'on':''} onClick={()=>setCas('upper')}><span className="letter" style={{fontSize:22}}>{L.l}</span></button><button className={cas==='lower'?'on':''} onClick={()=>setCas('lower')}><span className="letter" style={{fontSize:22}}>{L.l.toLowerCase()}</span></button></div>
      <TopStats/>
    </div>
    {/* letter rail */}
    <div className="scroll" style={{position:'absolute',left:32,top:130,bottom:120,width:118,overflowY:'auto',display:'flex',flexDirection:'column',gap:12,padding:'4px 4px 12px'}}>
      {LETTERS.map(x=>{ const on=x.l===letter; const tt=TINTS[x.tint]; const n=progress.traced[x.l]||0;
        return <button key={x.l} onClick={()=>{sfx.tap();setLetter(x.l);}} style={{flex:'none',height:88,borderRadius:24,background:on?tt[0]:'var(--paper)',border:`2.5px solid ${on?tt[0]:'var(--line)'}`,boxShadow:`0 5px 0 ${on?tt[1]:'var(--line)'}`,display:'flex',alignItems:'center',justifyContent:'center',gap:6,position:'relative'}}>
          <span className="letter" style={{fontSize:40,color:on?'#fff':'var(--ink)'}}>{x.l}{x.l.toLowerCase()}</span>
          {n>0 && <span style={{position:'absolute',top:6,right:8,minWidth:22,height:22,borderRadius:11,background:on?'rgba(255,255,255,.35)':'var(--leaf-l)',color:on?'#fff':'var(--leaf-dd)',fontSize:12,fontWeight:700,display:'grid',placeItems:'center',padding:'0 5px'}}>{n}</span>}
        </button>;})}
    </div>
    {/* canvas */}
    <div style={{position:'absolute',left:178,top:130,width:CW,height:CH,borderRadius:40,background:'var(--paper)',border:'3px solid var(--line)',boxShadow:'0 8px 0 var(--line)',overflow:'hidden',touchAction:'none'}}>
      <canvas ref={guideRef} width={CW} height={CH} style={{position:'absolute',inset:0}}/>
      {mode==='trace' && <div style={{position:'absolute',left:startHint.x-20,top:startHint.y-20,width:40,height:40,borderRadius:'50%',background:'var(--leaf)',border:'4px solid #fff',boxShadow:'0 0 0 3px var(--leaf)',animation:'pulse 1.4s infinite',pointerEvents:'none'}}/>}
      <canvas ref={inkRef} width={CW} height={CH} style={{position:'absolute',inset:0,cursor:'crosshair'}} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up}/>
      {mode==='free' && <div style={{position:'absolute',right:20,top:20,display:'flex',alignItems:'center',gap:10,padding:'8px 14px 8px 8px',borderRadius:18,background:t[2]}}>
        <span className="letter" style={{width:54,height:54,borderRadius:14,background:t[0],color:'#fff',display:'grid',placeItems:'center',fontSize:38}}>{glyph}</span><span style={{fontWeight:600,color:t[1]}}>Copy this</span></div>}
      {result && <div className="popin" style={{position:'absolute',left:'50%',bottom:24,transform:'translateX(-50%)',display:'flex',alignItems:'center',gap:16,padding:'14px 22px',borderRadius:24,background:result.stars>=2?'var(--leaf-l)':'var(--sun-l)',border:`2.5px solid ${result.stars>=2?'var(--leaf)':'var(--sun)'}`,whiteSpace:'nowrap'}}>
        <Stars n={result.stars} s={32}/><div style={{fontWeight:700,fontSize:'1.15em'}}>{result.stars===3?'Beautiful!':result.stars===2?'Nice work!':result.accuracy<.6?'Stay inside the dots':'Trace the whole letter'}</div>
      </div>}
    </div>
    {/* tools */}
    <div style={{position:'absolute',left:178+CW+28,right:32,top:130,height:CH,display:'flex',flexDirection:'column',gap:16}}>
      <div className="card" style={{padding:18,display:'flex',alignItems:'center',gap:14}}>
        <Pic emoji={L.pic} tint={L.tint} size={70} radius={20}/>
        <div style={{flex:1,minWidth:0}}><div className="letter" style={{fontSize:30,lineHeight:1,color:t[1],whiteSpace:'nowrap'}}>{L.l}{L.l.toLowerCase()}</div><div className="muted" style={{fontSize:'.95em'}}>{L.word}</div></div>
        <SpeakBtn id="wp" text={`${L.l}. ${L.l} is for ${L.word}`}/>
      </div>
      <div className="card" style={{padding:18}}>
        <div style={{fontSize:13,fontWeight:700,letterSpacing:'.12em',color:'var(--ink-3)',marginBottom:12}}>CRAYON</div>
        <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>{colors.map(c=><button key={c} onClick={()=>setColor(c)} style={{width:44,height:44,borderRadius:'50%',background:c,boxShadow:color===c?`0 0 0 4px var(--paper), 0 0 0 7px ${c}`:'none',transition:'.15s'}}/>)}</div>
        <div style={{fontSize:13,fontWeight:700,letterSpacing:'.12em',color:'var(--ink-3)',margin:'18px 0 10px'}}>SIZE</div>
        <div style={{display:'flex',gap:10,alignItems:'center'}}>{[18,28,40].map(b=><button key={b} onClick={()=>setBrush(b)} style={{flex:1,height:54,borderRadius:16,background:brush===b?'var(--leaf-l)':'var(--cream-2)',display:'grid',placeItems:'center'}}><span style={{width:b*.75,height:b*.75,borderRadius:'50%',background:color}}/></button>)}</div>
        <button onClick={()=>setLines(!lines)} style={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%',marginTop:16,fontWeight:600}}>Guide lines<span className={'toggle'+(lines?' on':'')}/></button>
      </div>
      <div style={{flex:1}}/>
      <div style={{display:'flex',gap:12}}>
        <button className="btn ghost" style={{flex:1,padding:0}} onClick={()=>{sfx.tap();clear();}} aria-label="Clear"><Icon n="eraser" s={28}/></button>
        <button className="btn ghost" style={{flex:1,padding:0}} onClick={()=>speak(`${L.l}. ${L.l} says ${L.snd}`,{id:'wp'})} aria-label="Hear"><Icon n="speaker" s={28}/></button>
      </div>
      {result && result.stars>=2
        ? <button className="btn" onClick={()=>{ const i=LETTERS.findIndex(x=>x.l===letter); if(cas==='upper') setCas('lower'); else { setCas('upper'); setLetter(LETTERS[(i+1)%26].l);} }}>Next<Icon n="next" s={24} w={3}/></button>
        : <button className="btn" onClick={check}><Icon n="check" s={26} w={3}/>Check</button>}
    </div>
    <TabBar/>
  </div>;
}

Object.assign(window,{ WriteScreen });
