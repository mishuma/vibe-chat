// Tests for: reading the key's remaining credit from OpenRouter (GET /api/v1/key) and using it for the spend bar and to stop sending.
// Run from the repo root: node test-credit.js   (needs: npm install --no-save jsdom@26)
const fs=require('fs'), path=require('path'); const {JSDOM}=require('jsdom');
const html=fs.readFileSync(path.join(__dirname,'vibe-chat.html'),'utf8');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let keyData={limit:5, limit_remaining:3, limit_reset:null, usage:2}, keyCalls=0, chatCalls=0, errs=[];
function sse(parts){ const enc=new TextEncoder(); let i=0; return {ok:true,body:{getReader:()=>({read:async()=>{ await sleep(20); return i<parts.length?{done:false,value:enc.encode(parts[i++])}:{done:true}; }})}}; }
const dom=new JSDOM(html,{runScripts:'dangerously',url:'https://localhost/',pretendToBeVisual:true,
  beforeParse(w){
    w.HTMLCanvasElement.prototype.getContext=()=>null;
    if(!w.TextDecoder) w.TextDecoder=TextDecoder;
    if(!w.TextEncoder) w.TextEncoder=TextEncoder;
    w.addEventListener('error',e=>errs.push(e.message));
    w.fetch=async(url,opts)=>{ url=String(url);
      if(url.endsWith('/models')) return {ok:true,json:async()=>({data:[]})};
      if(url.endsWith('/key')){ keyCalls++; return {ok:true,json:async()=>({data:{label:'Team A',...keyData}})}; }
      if(url.endsWith('/chat/completions')){ chatCalls++;
        return sse(['data: '+JSON.stringify({choices:[{delta:{content:'Hi.'}}]})+'\n',
          'data: '+JSON.stringify({choices:[],usage:{prompt_tokens:100,completion_tokens:20,cost:0.5}})+'\n','data: [DONE]\n']); }
      throw new Error('unexpected '+url); };
  }});
const w=dom.window, $=id=>w.document.getElementById(id), ev=n=>w.eval(n);
const ok=(c,m)=>{ console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1; };
const meter=()=>$('budgetLabel').textContent+' '+$('budgetText').textContent;
const fillPct=()=>parseFloat($('fill').style.width);
const setKeyBox=v=>{ $('key').value=v; $('key').dispatchEvent(new w.Event('change')); };
async function send(t){ $('input').value=t; await ev('sendMessage()'); await sleep(40); }

(async()=>{
  await sleep(100);
  ok(errs.length===0,'page loads with no script errors '+errs.join('|'));
  ok(/Budget spent/.test(meter()) && /No limit set/.test(meter()),'with no key, the bar shows the old budget text');

  setKeyBox('sk-or-a'); await sleep(30);
  ok(keyCalls===1 && /^Key credit: \$3\.00 left of \$5\.00$/.test(meter()),'entering a key reads its remaining credit');
  ok(Math.abs(fillPct()-40)<0.2,'the bar is filled to the share of the key already spent (40%)');

  // OpenRouter has not counted the reply yet: the app subtracts it locally
  await send('hello');
  ok(/\$2\.50 left of \$5\.00/.test(meter()),'after a $0.50 reply the bar shows $2.50 left even before OpenRouter catches up');
  ok(keyCalls>=2,'the credit is checked again after each reply');
  keyData={...keyData, limit_remaining:2.5}; ev('refreshKeyCredit()'); await sleep(20);
  ok(/\$2\.50 left of \$5\.00/.test(meter()),'when OpenRouter catches up, the reply is not counted twice');

  keyData={...keyData, limit_reset:'daily'}; ev('refreshKeyCredit()'); await sleep(20);
  ok(/\(resets daily\)/.test(meter()),'a limit that resets says when');
  keyData={...keyData, limit_remaining:5}; ev('refreshKeyCredit()'); await sleep(20);
  ok(/\$2\.50 left/.test(meter()),'a higher balance right after a reply is treated as OpenRouter not having caught up');
  ev('refreshKeyCredit(null, true)'); await sleep(20);
  ok(/\$5\.00 left of \$5\.00/.test(meter()),'the later, trusted check accepts it (for example after a daily reset)');

  // the student's own limit still works, and the stricter one wins
  $('budget').value='0.5'; $('budget').dispatchEvent(new w.Event('input'));
  ok(/Your limit: \$0\.5000 of \$0\.5000/.test(meter()) && $('send').disabled,'a lower limit of the student\'s own is shown and stops sending');
  const c0=chatCalls; await send('more');
  ok(chatCalls===c0 && /Spend limit reached/.test($('chat').textContent),'its own message says to raise the spend limit');
  $('budget').value=''; $('budget').dispatchEvent(new w.Event('input'));
  ok(!$('send').disabled,'removing it turns Send back on');

  // the key runs out
  keyData={limit:5, limit_remaining:0.3, limit_reset:null}; ev('refreshKeyCredit()'); await sleep(20);
  await send('one more');
  ok($('send').disabled && /no credit left/.test($('chat').textContent),'when the key runs out, Send turns off and the chat says to ask the teacher');
  ok(Math.abs(fillPct()-100)<0.2,'the bar is full');
  const c1=chatCalls; await send('again');
  ok(chatCalls===c1,'no paid request is made once the key is empty');
  ok(/ask your teacher/i.test($('send').title),'Send explains why it is off');
  $('input').value='שלום'; await ev('sendMessage()'); await sleep(20);
  ok(/לא נשארה יתרה/.test($('chat').textContent),'the same message in Hebrew');

  // a key with no limit falls back to the student's own limit
  keyData={limit:null, limit_remaining:null, usage:1};
  setKeyBox('sk-or-b'); await sleep(30);
  ok(/Budget spent/.test(meter()) && !$('send').disabled,'a key with no credit limit: the bar uses the Settings spend limit as before');

  // a different key never shows the old key's credit
  keyData={limit:10, limit_remaining:10};
  $('key').value='sk-or-c'; ev('updateMeter()');
  ok(/Budget spent/.test(meter()),'a newly typed key shows nothing until its own credit is read');

  // Test uses its answer for the bar too, with no second request
  const k0=keyCalls; await ev('testKey()'); await sleep(30);
  ok(keyCalls===k0+1 && /\$10\.00 left of \$10\.00/.test(meter()),'Test updates the bar from the same request');

  ok(errs.length===0,'no script errors at the end '+errs.join('|'));
  process.exit(process.exitCode||0);
})().catch(e=>{ console.error('ERR',e); process.exit(1); });
