const fs=require('fs'); const {JSDOM}=require('jsdom');
const html=fs.readFileSync(require('path').join(__dirname,'cost-board.html'),'utf8');
const calls=[]; const errs=[]; let mode='ok';
const keyA={hash:'hA',name:'Period 3',label:'sk-or-v1-abc...123',disabled:false,limit:5,limit_remaining:4.9,usage:0.1};
const keyB={hash:'hB',name:'No limit key',disabled:false,limit:null,limit_remaining:null,usage:2};
let usageA=0.1;
const dom=new JSDOM(html,{runScripts:'dangerously',url:'https://localhost/',pretendToBeVisual:true,
  beforeParse(w){
    w.addEventListener('error',e=>errs.push(e.message));
    w.fetch=async(url,opts)=>{ url=String(url); calls.push({url,auth:opts&&opts.headers&&opts.headers.Authorization});
      if(mode==='net') throw new TypeError('Failed to fetch');
      if(mode==='401') return {ok:false,status:401,json:async()=>({error:{message:'Invalid credentials',code:401}})};
      if(/\/keys\?offset=0$/.test(url)) return {ok:true,json:async()=>({data:[keyA,keyB]})};
      if(/\/keys\/hA$/.test(url)) return {ok:true,json:async()=>({data:{...keyA,usage:usageA,limit_remaining:5-usageA}})};
      if(/\/keys\/hB$/.test(url)) return {ok:true,json:async()=>(keyB)}; // unwrapped shape also accepted
      throw new Error('unexpected '+url); };
  }});
const w=dom.window, $=id=>w.document.getElementById(id), ev=s=>w.eval(s);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const ok=(c,m)=>{ console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1; };

(async()=>{
  await sleep(50);
  ok(errs.length===0,'page loads with no script errors '+errs.join('|'));
  ok(!$('setup').hidden && $('board').hidden,'starts on setup screen');
  ok($('mgmt').type==='password','management key input is masked');

  // empty key
  await ev('loadKeys()');
  ok(/Paste the management key/.test($('setupMsg').textContent) && calls.length===0,'empty key: message, no request');

  // bad key
  mode='401'; $('mgmt').value='sk-or-v1-bad'; await ev('loadKeys()');
  ok(/rejected the management key/.test($('setupMsg').textContent) && $('pick').hidden,'401: explains management key, no list');
  ok(w.localStorage.getItem('cb_mgmt')===null,'key not saved when Remember unticked');

  // network error
  mode='net'; await ev('loadKeys()');
  ok(/Could not reach openrouter.ai/.test($('setupMsg').textContent),'network error explained');

  // good key -> list
  mode='ok'; $('mgmt').value='sk-or-v1-good'; await ev('loadKeys()');
  const items=$('keyList').querySelectorAll('li');
  ok(items.length===2 && /Period 3/.test(items[0].textContent) && /limit \$5\.0000/.test(items[0].textContent),'keys listed with spend and limit');
  ok(calls[calls.length-1].auth==='Bearer sk-or-v1-good','management key sent as bearer token');
  ok(!w.document.body.textContent.includes('sk-or-v1-good'),'management key never rendered as text');

  // start board on key with limit
  items[0].click();
  ok($('setup').hidden && !$('board').hidden,'board shown after picking key');
  ok($('heroLabel').textContent==='Money left on this key' && $('heroValue').textContent==='$4.9000','hero shows remaining balance');
  ok($('bar').style.width==='98%','bar shows fraction remaining');
  ok($('tClass').textContent==='$0.0000','class spend starts at zero');
  ok(w.localStorage.getItem('cb_hash')==='hA','selected key remembered');

  // spend happens
  usageA=0.1031; await ev('poll()');
  ok($('tClass').textContent==='$0.0031' && $('tLast').textContent==='$0.0031','poll picks up new spend');
  ok($('flash').textContent==='+$0.0031' && $('flash').classList.contains('show'),'spend jump flashes');
  ok(/less than 1 cent \(0\.31¢\)/.test($('tLastSub').textContent),'plain-language cents');
  ok($('heroValue').textContent==='$4.8969','balance drops');
  usageA=0.2031; await ev('poll()');
  ok($('tClass').textContent==='$0.1031' && $('tLast').textContent==='$0.1000','class total accumulates, last = latest jump');
  ok(/about 10 cents/.test($('tLastSub').textContent),'cents wording above 1¢');

  // rate after a minute
  ev('state.startTime-=10*60000'); await ev('poll()');
  ok(/^\$0\.618[56]$/.test($('tRate').textContent),'hourly pace after 10 minutes');

  // transient network error keeps values, marks stale
  mode='net'; await ev('poll()');
  ok($('status').classList.contains('stale') && /retrying/.test($('status').textContent) && $('tClass').textContent==='$0.1031','network blip: stale, values kept');
  ok(ev('pollTimer')!==null,'keeps polling after network blip');
  mode='ok'; await ev('poll()');
  ok(!$('status').classList.contains('stale'),'recovers after blip');

  // auth failure while running stops polling
  mode='401'; await ev('poll()');
  ok(ev('pollTimer')===null && /rejected/.test($('status').textContent),'401 while running: stops and explains');

  // back to setup, pick no-limit key
  mode='ok'; await ev('stopBoard()'); await sleep(10);
  ok(!$('setup').hidden && /last used/.test($('keyList').querySelector('li').textContent),'back to list, last used marked');
  $('keyList').querySelectorAll('li')[1].click(); await ev('poll()');
  ok($('heroLabel').textContent==='Money this key has spent' && $('heroValue').textContent==='$2.0000' && $('barWrap').hidden,'no-limit key shows spend, no bar');

  // remember opt-in
  $('remember').checked=true; await ev('loadKeys()');
  ok(w.localStorage.getItem('cb_mgmt')==='sk-or-v1-good','Remember ticked: key saved');
  $('remember').checked=false; $('remember').dispatchEvent(new w.Event('change'));
  ok(w.localStorage.getItem('cb_mgmt')===null,'unticking Remember deletes saved key');

  // theme
  const t0=w.document.documentElement.dataset.theme; ev('toggleTheme()');
  ok(w.document.documentElement.dataset.theme!==t0,'theme toggles');

  ok(errs.length===0,'no script errors during run '+errs.join('|'));
  ev('clearInterval(pollTimer)'); w.close();
})();
