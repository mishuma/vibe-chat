// Voice typing checks with a fake browser SpeechRecognition (real dictation must be tried on a real Windows and Mac laptop).
const fs=require('fs'), path=require('path'); const {JSDOM}=require('jsdom');
const html=fs.readFileSync(path.join(__dirname,'vibe-chat.html'),'utf8');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const ok=(c,m)=>{ console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1; };
function page({sr=true,devices=[{kind:'audioinput'}],startError=null}={}){
  const made=[];
  const dom=new JSDOM(html,{runScripts:'dangerously',url:'https://localhost/',pretendToBeVisual:true,beforeParse(w){
    w.HTMLCanvasElement.prototype.getContext=()=>null;
    w.fetch=async()=>({ok:false,status:500,json:async()=>({})});
    Object.defineProperty(w.navigator,'mediaDevices',{value:{enumerateDevices:async()=>devices},configurable:true});
    if(sr) w.webkitSpeechRecognition=class{ constructor(){ made.push(this); } start(){ if(startError) throw new Error(startError); this.onstart&&this.onstart(); } stop(){ this.onend&&this.onend(); } };
  }});
  return {w:dom.window, $:id=>dom.window.document.getElementById(id), made, chat:()=>dom.window.document.getElementById('chat').textContent};
}
const res=(...parts)=>parts.map(([t,f])=>Object.assign([{transcript:t}],{isFinal:f}));
(async()=>{
  let p=page(); await sleep(60);
  ok(p.$('mic') && p.$('mic').compareDocumentPosition(p.$('attach')) & 4,'mic button exists and sits before (left of) Attach');
  ok(p.$('mic').getAttribute('aria-label')==='Voice typing' && p.$('micLang').textContent==='EN','mic has a label; language starts at EN');
  p.$('input').value='hello'; p.$('mic').click(); await sleep(30);
  const r=p.made[0];
  ok(r && r.lang==='en-US' && r.continuous && r.interimResults && p.$('mic').classList.contains('on'),'click starts English recognition and shows listening state');
  r.onresult({results:res(['build a game',true],[' with a cat',false])}); 
  ok(p.$('input').value==='hello build a game with a cat','interim and final words appear after existing text');
  r.onresult({results:res(['build a game',true],['with a cat',true])});
  ok(p.$('input').value==='hello build a game with a cat','final result replaces interim without duplicating');
  p.$('mic').click(); await sleep(10);
  ok(!p.$('mic').classList.contains('on') && p.$('input').value.includes('cat'),'second click stops and keeps the text');
  ok(/sends your voice/.test(p.chat()),'privacy notice shown on first use');
  p.$('mic').click(); await sleep(30); p.made[1].onend&&0; p.$('mic').click(); await sleep(10);
  ok((p.chat().match(/sends your voice/g)||[]).length===1,'privacy notice shown only once');
  // Hebrew
  p.$('micLang').click(); ok(p.$('micLang').textContent==='HE','language button switches to HE');
  p.$('input').value=''; p.$('mic').click(); await sleep(30);
  const h=p.made[p.made.length-1]; ok(h.lang==='he-IL','Hebrew recognition uses he-IL');
  h.onresult({results:res(['בנה לי משחק',true])}); ok(p.$('input').value==='בנה לי משחק','Hebrew text inserted');
  h.onerror({error:'not-allowed'}); await sleep(30);
  ok(/חסומה/.test(p.chat()),'error shown in Hebrew when dictation language is Hebrew');
  p.$('mic').click&&0;
  // errors in English
  p=page(); await sleep(60); p.$('mic').click(); await sleep(30);
  p.made[0].onerror({error:'audio-capture'}); await sleep(30);
  ok(/No microphone was found/.test(p.chat()),'audio-capture -> no microphone message');
  p.made[0].onerror({error:'network'}); await sleep(30); ok(/speech service could not be reached/.test(p.chat()),'network -> service unreachable message');
  p.made[0].onerror({error:'weird-thing'}); await sleep(30); ok(/Speech error: weird-thing/.test(p.chat()),'unknown error shows raw code');
  // no microphone device
  p=page({devices:[{kind:'videoinput'}]}); await sleep(60); p.$('mic').click(); await sleep(30);
  ok(p.made.length===0 && /No microphone was found/.test(p.chat()),'no audio input device: message, recognition not started');
  // no support
  p=page({sr:false}); await sleep(60); p.$('mic').click(); await sleep(30);
  ok(/not available in this browser/.test(p.chat()),'no SpeechRecognition: message in chat');
  // start() throws
  p=page({startError:'already started'}); await sleep(60); p.$('mic').click(); await sleep(30);
  ok(/Speech error: already started/.test(p.chat()) && !p.$('mic').classList.contains('on'),'start() failure reported, button not stuck on');
  // busy disables
  p=page(); await sleep(60); p.$('mic').click(); await sleep(30); p.w.eval('setBusy(true)'); 
  ok(p.$('mic').disabled && p.$('micLang').disabled && !p.$('mic').classList.contains('on'),'sending/busy stops dictation and disables the buttons');
  p.made[0].onresult&&p.made[0].onresult({results:res(['late words',true])});
  ok(!/late words/.test(p.$('input').value),'words arriving after send are ignored');
})().catch(e=>{console.error('ERR',e);process.exit(1);});
