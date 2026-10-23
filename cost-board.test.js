const fs=require('fs'); const {JSDOM}=require('jsdom');
const html=fs.readFileSync(require('path').join(__dirname,'cost-board.html'),'utf8');
const calls=[]; const errs=[]; let mode='ok';
const keyA={hash:'hA',name:'Period 3',label:'sk-or-v1-abc...123',disabled:false,limit:5,limit_remaining:4.9,usage:0.1};
const keyB={hash:'hB',name:'No limit key',disabled:false,limit:null,limit_remaining:null,usage:2};
const keyC={hash:'hC',name:'Class key',disabled:false,limit:2,limit_remaining:1.9,usage:0.1,workspace_id:'w2'};
let usageA=0.1, usageC=0.1;
// One workspace by default; later tests add a second workspace or make the workspace list fail.
let workspaces=[{id:'w1',name:'Default'}], wsFail=false;
// w3 is the cycling workspace: two live keys and one disabled key; w4 has only a disabled key.
const keyD={hash:'hD',name:'Maya',disabled:false,limit:1,usage:0.2,limit_remaining:0.8};
const keyE={hash:'hE',name:'Omar',disabled:false,limit:1,usage:0.3,limit_remaining:0.7};
const keyF={hash:'hF',name:'Old key',disabled:true,limit:1,usage:0,limit_remaining:1};
const keyG={hash:'hG',name:'Retired',disabled:true,limit:1,usage:0,limit_remaining:1};
const usage3={hD:0.2,hE:0.3};
const KEYS_BY_WS={w1:[keyA,keyB], w2:[keyC], w3:[keyD,keyE,keyF], w4:[keyG]};
const live=k=>k.hash==='hC'?{...k,usage:usageC,limit_remaining:2-usageC}
  : usage3[k.hash]!=null?{...k,usage:usage3[k.hash],limit_remaining:1-usage3[k.hash]}:k;
const dom=new JSDOM(html,{runScripts:'dangerously',url:'https://localhost/',pretendToBeVisual:true,
  beforeParse(w){
    w.addEventListener('error',e=>errs.push(e.message));
    w.fetch=async(url,opts)=>{ url=String(url); calls.push({url,auth:opts&&opts.headers&&opts.headers.Authorization});
      if(url.includes('frankfurter')) return mode==='ratefail' ? {ok:false,status:500,json:async()=>({})}
        : {ok:true,json:async()=>({amount:1,base:'USD',date:'2026-10-22',rates:{ILS:3.5}})};
      if(mode==='net') throw new TypeError('Failed to fetch');
      if(mode==='401') return {ok:false,status:401,json:async()=>({error:{message:'Invalid credentials',code:401}})};
      if(/\/workspaces\?limit=100&offset=0$/.test(url)) return wsFail ? {ok:false,status:500,json:async()=>({error:{message:'boom'}})}
        : {ok:true,json:async()=>({data:workspaces,total_count:workspaces.length})};
      const km=url.match(/\/keys\?(?:workspace_id=(\w+)&)?offset=0$/);
      if(km) return {ok:true,json:async()=>({data:(KEYS_BY_WS[km[1]||'w1']||[]).map(live)})};
      // Simulate the single-key endpoint not reaching a non-default workspace.
      if(/\/keys\/hC$/.test(url)) return {ok:false,status:404,json:async()=>({error:{message:'Not found'}})};
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

  // Hebrew UI (board currently shows the no-limit key, usage $2)
  const change=(id,v)=>{ $(id).value=v; $(id).dispatchEvent(new w.Event('change')); };
  change('langSel','he');
  const root=w.document.documentElement;
  ok(root.dir==='rtl' && root.lang==='he','Hebrew: page switches to rtl');
  ok($('loadBtn').textContent==='הצגת מפתחות' && $('heroLabel').textContent==='כסף שהמפתח הוציא','Hebrew: setup and board text translated live');
  ok(/^For instructors/.test(w.document.querySelector('details summary').textContent) && w.document.querySelector('details').dir==='ltr','instructor notes stay English, ltr');
  ok(w.localStorage.getItem('cb_lang')==='he','language remembered');

  // Shekels: picking ILS fetches the ECB rate and converts
  change('curSel','ILS'); await sleep(10);
  ok(ev('ilsPerUsd')===3.5 && /3\.5000/.test($('rateNote').textContent) && /2026-10-22/.test($('rateNote').textContent),'ILS: ECB rate fetched and shown on board');
  ok(/₪/.test($('heroValue').textContent) && /7\.0000/.test($('heroValue').textContent),'hero converted to shekels (2 USD x 3.5)');
  ok(/^בערך/.test($('heroPlain').textContent),'Hebrew plain-language amount');
  ok(/פחות מאגורה אחת \(0\.35 אגורות\)/.test(ev('plain(0.001)')),'agorot wording for tiny amounts');

  // Hand-typed rate overrides; nonsense rate rejected
  change('rate','4');
  ok(ev('rateSrc')==='manual' && /8\.0000/.test($('heroValue').textContent) && /ידנית/.test($('rateNote').textContent),'typed rate applies and is labelled as manual');
  change('rate','3600');
  ok($('rateMsg').className==='err' && ev('ilsPerUsd')===4,'out-of-range rate rejected, previous kept');

  // Rate fetch failure keeps the current rate
  mode='ratefail'; await ev('fetchRate()');
  ok($('rateMsg').className==='err' && ev('ilsPerUsd')===4,'rate fetch failure: error shown, rate kept');
  mode='ok';

  // No rate at all blocks starting in shekels
  ev('stopBoard()'); await sleep(10); ev('ilsPerUsd=null');
  $('keyList').querySelector('li').click();
  ok($('board').hidden && /שער חליפין/.test($('setupMsg').textContent),'ILS without a rate: board does not start, Hebrew message');
  ev('ilsPerUsd=4');
  ok(/₪/.test($('keyList').querySelector('.meta').textContent),'key list amounts in shekels');

  // Shortcuts use physical keys, so a Hebrew layout works
  $('keyList').querySelector('li').click();
  const th=root.dataset.theme;
  w.document.dispatchEvent(new w.KeyboardEvent('keydown',{key:'א',code:'KeyT'}));
  ok(root.dataset.theme!==th,'T shortcut works with Hebrew layout (e.code)');

  // Back to English + dollars
  change('langSel','en'); change('curSel','USD');
  ok(root.dir==='ltr' && $('heroValue').textContent==='$4.9000' && $('rateNote').textContent==='','English + USD restored');

  // Board language button and L shortcut switch language without resetting the class count
  const start0=ev('state.startTime');
  // (rate is 4 ILS/USD, typed by hand earlier; board is in English + USD)
  $('langBtn').click();
  ok(root.dir==='rtl' && $('langSel').value==='he' && $('langBtn').textContent==='English · $' && $('heroLabel').textContent==='כסף שנשאר במפתח','board button switches to Hebrew');
  ok($('curSel').value==='ILS' && /₪/.test($('heroValue').textContent) && /19\.6000/.test($('heroValue').textContent),'board button also switches to shekels (4.90 USD x 4)');
  ok(ev('state.startTime')===start0 && $('tClass').textContent.includes(ev('money(cur().lastUsage-cur().startUsage)')),'class count kept across language switch');
  w.document.dispatchEvent(new w.KeyboardEvent('keydown',{key:'ך',code:'KeyL'}));
  ok(root.dir==='ltr' && $('langBtn').textContent==='עברית · ₪' && w.localStorage.getItem('cb_lang')==='en','L shortcut (Hebrew layout) switches back to English');
  ok($('curSel').value==='USD' && $('heroValue').textContent==='$4.9000' && $('rateNote').textContent==='','L shortcut also switches back to dollars');

  // Switching to shekels with no rate available: dollars stay, and the board says why
  ev('ilsPerUsd=null'); mode='ratefail';
  $('langBtn').click(); await sleep(10);
  ok(/\$/.test($('heroValue').textContent) && $('rateNote').textContent==='אין עדיין שער חליפין, ולכן הסכומים מוצגים בדולרים','no rate: dollars shown with Hebrew explanation');
  mode='ok'; ev('ilsPerUsd=4'); $('langBtn').click();

  // Multiple workspaces: keys from every workspace, grouped under headings
  workspaces=[{id:'w1',name:'Default'},{id:'w2',name:'Class workspace'}];
  ev('stopBoard()'); await sleep(20);
  const heads=[...$('keyList').querySelectorAll('li.ws')].map(h=>h.textContent);
  ok(heads.length===2 && heads[1]==='Workspace: Class workspace','keys grouped by workspace');
  ok(calls.some(c=>/\/keys\?workspace_id=w2&offset=0$/.test(c.url)),'non-default workspace queried with workspace_id');
  $('keyList').querySelector('li[data-hash="hC"]').click();
  ok($('keyName').textContent==='Class key' && $('wsLine').textContent==='Class workspace','board shows key name large and workspace on top line');
  usageC=0.5; await ev('poll()');
  ok(ev('state.viaList')===true && $('tClass').textContent==='$0.4000' && !$('status').classList.contains('stale'),'single-key 404 falls back to workspace list and keeps updating');

  // Workspace listing fails: still show default workspace keys, no headings
  wsFail=true; ev('stopBoard()'); await sleep(20);
  ok($('keyList').querySelectorAll('li[data-hash]').length===2 && !$('keyList').querySelector('li.ws'),'workspace list failure falls back to default workspace');
  wsFail=false;

  // Cycle mode
  workspaces=[{id:'w1',name:'Default'},{id:'w2',name:'Class workspace'},{id:'w3',name:'Cycle room'},{id:'w4',name:'Empty room'}];
  await ev('loadKeys()');
  ok($('cycleWsSel').options.length===4 && !$('cycleWsWrap').hidden,'cycle: one choice per workspace');
  change('cycleWsSel','w4'); $('cycleBtn').click();
  ok($('board').hidden && /no enabled keys/.test($('setupMsg').textContent),'cycle: workspace with only disabled keys is refused');
  $('includeAll').checked=false; // these cycle tests cover keys only; Entire Class is tested below
  change('cycleWsSel','w3'); change('dwellSel','15'); $('cycleBtn').click();
  ok(!$('board').hidden && $('keyName').textContent==='Maya' && $('wsLine').textContent==='Cycle room · key 1 of 2','cycle: starts on first enabled key, shows position');
  ok(!$('pauseBtn').hidden && ev('state.dwell')===15 && w.localStorage.getItem('cb_dwell')==='15','cycle: pause button shown, delay applied and remembered');
  ok(ev('state.hashes').join()==='hD,hE','cycle: disabled keys skipped');

  // Off-screen key spends: tracked, no flash on the key being shown
  const n0=calls.length; usage3.hE=0.35; await ev('poll()');
  ok(calls.slice(n0).length===1 && /\/keys\?workspace_id=w3&offset=0$/.test(calls[calls.length-1].url),'cycle: one workspace list request per poll');
  ok($('tClass').textContent==='$0.0000' && $('flash').textContent==='','cycle: off-screen spend does not change the key on screen');
  ev('stepKey(1)');
  ok($('keyName').textContent==='Omar' && $('tClass').textContent==='$0.0500' && $('tLast').textContent==='$0.0500','cycle: next key shows its own class total');

  // Automatic advance, pause, Space, arrows
  ev('state.dwell=0.05; restartCycle()'); await sleep(90);
  ok(ev('state.idx')===0,'cycle: advances automatically after the delay');
  ev('togglePause()'); const idxP=ev('state.idx'); await sleep(150);
  ok(ev('state.idx')===idxP && ev('cycleTimer')===null && /paused/.test($('wsLine').textContent) && $('pauseBtn').textContent==='Resume','cycle: pause holds the current key');
  ev('state.dwell=1000');
  w.document.dispatchEvent(new w.KeyboardEvent('keydown',{key:' ',code:'Space'}));
  ok(!ev('state.paused') && ev('cycleTimer')!==null,'Space resumes cycling');
  w.document.dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowRight',code:'ArrowRight'}));
  ok(ev('state.idx')===(idxP+1)%2,'→ shows the next key in English');
  change('langSel','he');
  w.document.dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowLeft',code:'ArrowLeft'}));
  ok(ev('state.idx')===idxP && /מפתח \d מתוך 2/.test($('wsLine').textContent),'← shows the next key in Hebrew; position translated');
  change('langSel','en');

  // Leaving cycle mode stops its timer; single mode hides the pause button
  ev('stopBoard()'); await sleep(20);
  ok(ev('cycleTimer')===null,'stopping the board stops cycling');
  $('keyList').querySelector('li[data-hash="hD"]').click();
  ok($('pauseBtn').hidden && ev('state.mode')==='single' && $('keyName').textContent==='Maya','single mode: pause button hidden, key name shown');
  w.document.dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowRight',code:'ArrowRight'}));
  ok($('keyName').textContent==='Maya','arrows do nothing in single mode');

  // Delay choices start at 1 second; no timer bar under the key name
  ok([...$('dwellSel').options].map(o=>o.value).join()==='1,2,3,5,10,15,30,60' && $('dwellSel').options[0].textContent==='1 second','delay choices start at 1 second');
  ok(!w.document.getElementById('cycleBar') && !w.document.getElementById('cycleWrap'),'no timer bar under the key name');

  // Entire Class in the cycle: first, and adds up every enabled key (hD 0.20/0.80 left, hE 0.35/0.65 left)
  ev('stopBoard()'); await sleep(20);
  $('includeAll').checked=true;
  change('cycleWsSel','w3'); change('dwellSel','1'); $('cycleBtn').click();
  ok(ev('state.hashes').join()==='__all__,hD,hE' && $('keyName').textContent==='Entire Class' && /key 1 of 3/.test($('wsLine').textContent),'Entire Class is first in the cycle');
  ok($('heroLabel').textContent==='Money left for the entire class' && $('heroValue').textContent==='$1.4500','Entire Class: money left is the sum of key balances');
  ok(w.localStorage.getItem('cb_include_all')==='1' && ev('state.dwell')===1,'Entire Class choice and 1-second delay applied');
  ev('togglePause()'); // hold on Entire Class
  usage3.hD=0.25; await ev('poll()'); await sleep(5);
  usage3.hE=0.37; await ev('poll()');
  ok($('tClass').textContent==='$0.0700','Entire Class: class total adds every key');
  ok($('flash').textContent==='+$0.0200' && $('tLast').textContent==='$0.0200' && /· Omar$/.test($('tLastSub').textContent),'Entire Class: flashes any key\'s spend and names who spent last');
  change('langSel','he');
  ok($('keyName').textContent==='כל הכיתה' && $('heroLabel').textContent==='כסף שנשאר לכל הכיתה','Entire Class: Hebrew name and label');
  change('langSel','en');

  // Entire Class only, in a workspace where one key has no limit: shows total spent, no rotation
  ev('stopBoard()'); await sleep(20);
  change('cycleWsSel','w1'); $('allBtn').click();
  ok(ev('state.hashes').join()==='__all__' && ev('cycleTimer')===null && $('pauseBtn').hidden && $('wsLine').textContent==='Default','Entire Class only: no rotation, no pause button, no position');
  ok($('heroLabel').textContent==='Money the entire class has spent' && $('heroValue').textContent==='$2.1000' && /not every key has a spending limit/.test($('heroPlain').textContent),'Entire Class with an unlimited key shows total spent');
  w.document.dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowRight',code:'ArrowRight'}));
  ok($('keyName').textContent==='Entire Class','arrows do nothing with Entire Class only');
  ev('stopBoard()'); await sleep(20);

  ok(errs.length===0,'no script errors during run '+errs.join('|'));
  ev('clearInterval(pollTimer)'); w.close();
})();
