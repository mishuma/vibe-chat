const fs=require('fs'); const {JSDOM}=require('jsdom');
const html=fs.readFileSync(''+require('path').join(__dirname,'vibe-chat.html')+'','utf8');
const calls=[]; let chatMode='ok'; const errs=[];
function sse(parts){ const enc=new TextEncoder(); let i=0; return {ok:true,body:{getReader:()=>({read:async()=>{ await new Promise(r=>setTimeout(r,60)); return i<parts.length?{done:false,value:enc.encode(parts[i++])}:{done:true}; }})}}; }
const dom=new JSDOM(html,{runScripts:'dangerously',url:'https://localhost/',pretendToBeVisual:true,
  beforeParse(w){
    w.HTMLCanvasElement.prototype.getContext=()=>null;
    if(!w.TextDecoder) w.TextDecoder=TextDecoder;   // older jsdom versions do not expose it; real browsers do
    if(!w.Blob.prototype.text) w.Blob.prototype.text=function(){ return new Promise(r=>{ const fr=new w.FileReader(); fr.onload=()=>r(fr.result); fr.readAsText(this); }); };   // same: Blob.text() in older jsdom
    w.addEventListener('error',e=>errs.push(e.message));
    w.fetch=async(url,opts)=>{ url=String(url); calls.push({url,body:opts&&opts.body});
      if(url.endsWith('/models')) return {ok:true,json:async()=>({data:[{id:'anthropic/claude-sonnet-5.5',context_length:1000000,pricing:{prompt:'0.000003',completion:'0.000015'},architecture:{input_modalities:['text','image']}}]})};
      if(url.endsWith('/key')){ if(chatMode==='keybad') return {ok:false,status:401,json:async()=>({error:{message:'No auth credentials found'}})}; return {ok:true,json:async()=>({data:{label:'s1',limit_remaining:3}})}; }
      if(url.endsWith('/chat/completions')){
        const b=JSON.parse(opts.body);
        if(b.stream===false) return {ok:true,json:async()=>({choices:[{message:{content:chatMode==='advice-he'?'שגיאה בספק. נסו שוב.':'The provider failed. Try again.'}}],usage:{prompt_tokens:50,completion_tokens:10,cost:0.001}})};
        if(chatMode==='402') return {ok:false,status:402,json:async()=>({error:{message:'Insufficient credits'}})};
        if(chatMode==='502') return {ok:false,status:502,json:async()=>({error:{message:'Provider returned error'}})};
        if(chatMode==='net') throw new TypeError('Failed to fetch');
        if(chatMode==='code') return sse([
          'data: '+JSON.stringify({choices:[{delta:{content:'Done.\n\n```typescript\nconst a = 1;\n'}}]})+'\n',
          'data: '+JSON.stringify({choices:[{delta:{content:'const b = 2;\n```'}}]})+'\n',
          'data: '+JSON.stringify({choices:[],usage:{prompt_tokens:100,completion_tokens:20,cost:0.01}})+'\n','data: [DONE]\n']);
      }
      throw new Error('unexpected '+url); };
  }});
const w=dom.window, $=id=>w.document.getElementById(id), ev=n=>w.eval(n);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const ok=(c,m)=>{ console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1; };
const chatText=()=>$('chat').textContent;
(async()=>{
  await sleep(100);
  ok(errs.length===0,'page loads with no script errors '+errs.join('|'));
  ok(!$('warn') && !$('notice') && !$('skillNote'),'no error widgets outside the chat');
  $('key').value='sk-or-x';
  // 402 -> raw error + built-in advice, in the chat, input restored, no side request
  chatMode='402'; $('input').value='build a game'; let n0=calls.length; await ev('sendMessage()'); await sleep(20);
  ok(/OpenRouter error 402: Insufficient credits/.test(chatText()) && /no credit left/.test(chatText()),'402 reported in chat with English advice');
  ok(calls.length===n0+1 && $('input').value==='build a game' && ev('history.length')===0,'402: one request only, text restored, chat history clean');
  // Hebrew conversation -> Hebrew advice
  $('input').value='בנה לי משחק'; await ev('sendMessage()'); await sleep(20);
  ok(/אין יתרה/.test(chatText()),'Hebrew conversation gets Hebrew advice');
  const rows=[...$('chat').querySelectorAll('.row')]; ok(rows[rows.length-1].dir==='ltr' && rows[rows.length-1].querySelector('.bubble').dir==='rtl','Hebrew error bubble: row stays on the chatbot side, its text runs rtl');
  // network error
  chatMode='net'; $('input').value='hello'; await ev('sendMessage()'); await sleep(20);
  ok(/Network error/.test(chatText()) && /Could not reach OpenRouter/.test(chatText()),'network error + advice in chat');
  // unknown error -> model-written advice, counted in spend
  chatMode='502'; const spent0=ev('totals.cost'); $('input').value='hello'; n0=calls.length; await ev('sendMessage()'); await sleep(40);
  ok(/OpenRouter error 502: Provider returned error/.test(chatText()),'502 raw error in chat');
  ok(calls.length===n0+2 && /The provider failed/.test(chatText()),'unknown error: model asked for advice');
  ok(Math.abs(ev('totals.cost')-spent0-0.001)<1e-9,'advice call counted in session spend');
  // key test failure goes to chat, key text untouched
  chatMode='keybad'; await ev("testKey()"); await sleep(20);
  ok(/OpenRouter error 401: No auth credentials found/.test(chatText()) && $('key').value==='sk-or-x','key test error in chat; key box unchanged');
  chatMode='ok-key';
  // streaming code: button label + disabled while writing, restored after
  chatMode='code'; $('input').value='make it'; const p=ev('sendMessage()'); await sleep(90); ev('renderNow()');
  ok($('copyCode').textContent==='Generating code' && $('copyCode').disabled,'while code is partial: "Generating code" and disabled');
  await p; await sleep(30);
  ok($('copyCode').textContent==='Copy code' && !$('copyCode').disabled,'after completion: "Copy code" and enabled');
  console.log('PRE>',JSON.stringify($('codePre').textContent),'| hist>',JSON.stringify(ev('history[history.length-1].text')));
  ok(/const a = 1;\nconst b = 2;/.test($('codePre').textContent),'code buffer complete');
  // spend limit: block, no request, no clearing; raise -> works
  console.log('cost now',ev('totals.cost')); $('budget').value='0.001'; $('budget').dispatchEvent(new w.Event('input'));
  $('input').value='more'; n0=calls.length; const h=ev('history.length'); await ev('sendMessage()'); await sleep(30);
  console.log('dbg',calls.length-n0, ev('exhausted()'), ev('notes.map(n=>n.text.slice(0,30))'), ev('history.length'), h);
  ok(calls.length===n0 && /Spend limit reached/.test(chatText()) && ev('history.length')===h,'limit reached: message in chat, no request, chat kept');
  $('budget').value='5'; $('budget').dispatchEvent(new w.Event('input'));
  ok(!$('send').disabled && ev('history.length')===h,'limit raised: send enabled, chat kept');
  w.confirm=()=>true; const tot=ev('totals.cost'); $('reset').click();
  ok(ev('totals.cost')===tot && ev('notes.length')===0,'Reset clears chat and notices, keeps session totals');

  // ---- new: icons, save chat, save/load memory ----
  ok(!!$('send').querySelector('svg') && $('send').getAttribute('aria-label')==='Send' && !$('send').textContent.trim(),'Send is an icon with a label');
  ok(!!$('attach').querySelector('svg') && !$('attach').textContent.trim(),'Attach is an icon');
  const dl=[]; w.URL.createObjectURL=b=>{dl.push(b);return 'blob:x';}; w.URL.revokeObjectURL=()=>{};
  const names=[]; w.HTMLAnchorElement.prototype.click=function(){names.push(this.download);};
  $('saveChat').click(); await sleep(20);
  ok(names.length===0 && /Nothing to save/.test(chatText()),'save chat with no conversation says so');
  chatMode='code'; $('input').value='make it'; await ev('sendMessage()'); await sleep(400);
  $('saveChat').click(); await sleep(20);
  const chatFile=await new Promise(r=>{const fr=new w.FileReader();fr.onload=()=>r(fr.result);fr.readAsText(dl[dl.length-1]);});
  ok(/^conversation-.*\.md$/.test(names[0]) && /### Student\n\nmake it/.test(chatFile) && /const b = 2;/.test(chatFile),'save chat downloads markdown transcript');
  chatMode='mem'; const origFetch=w.fetch;
  w.fetch=async(u,o)=>{ if(String(u).endsWith('/chat/completions')&&JSON.parse(o.body).stream===false&&/memory file/.test(JSON.parse(o.body).messages[0].content)){ calls.push({url:String(u),body:o.body}); return {ok:true,json:async()=>({choices:[{message:{content:'## Goal\n- a game'}}],usage:{prompt_tokens:80,completion_tokens:20,cost:0.002}})}; } return origFetch(u,o); };
  const c0=ev('totals.cost'); $('saveMem').click(); await sleep(80);
  const memFile=await new Promise(r=>{const fr=new w.FileReader();fr.onload=()=>r(fr.result);fr.readAsText(dl[dl.length-1]);});
  ok(/^memory-.*\.md$/.test(names[names.length-1]) && /## Goal\n- a game/.test(memFile) && /## Latest code[\s\S]*const a = 1;/.test(memFile) && /^---\nname: memory-/.test(memFile),'save memory: summary plus verbatim latest code, with frontmatter');
  ok(Math.abs(ev('totals.cost')-c0-0.002)<1e-9 && !ev('busy'),'memory request is counted in spend, UI not left busy');
  // load into a new conversation
  w.confirm=()=>true; $('reset').click();
  const f=new w.File([memFile],'memory-test.md',{type:'text/markdown'});
  Object.defineProperty($('memFile'),'files',{value:[f],configurable:true}); $('memFile').dispatchEvent(new w.Event('change')); await sleep(40);
  ok(ev('memory')&&!$('memChip').hidden && /<memory>[\s\S]*a game[\s\S]*<\/memory>/.test(ev('systemPrompt()')),'loaded memory is in the system prompt and chip is shown');
  $('reset').click(); ok(ev('memory')===null && $('memChip').hidden,'Reset clears loaded memory');
  // save memory failure -> error in chat
  chatMode='code'; $('input').value='again'; await ev('sendMessage()'); await sleep(400);
  w.fetch=async(u,o)=>{ if(String(u).endsWith('/chat/completions')&&JSON.parse(o.body).stream===false&&/memory file/.test(JSON.parse(o.body).messages[0].content)) return {ok:false,status:402,json:async()=>({error:{message:'Insufficient credits'}})}; return origFetch(u,o); };
  const nn=names.length; $('saveMem').click(); await sleep(80);
  ok(names.length===nn && /OpenRouter error 402/.test(chatText()) && !ev('busy'),'save memory failure reported in chat, no file');
})().catch(e=>{console.error('ERR',e); process.exit(1);});
