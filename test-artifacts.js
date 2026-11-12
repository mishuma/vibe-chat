// Tests for: prompt settings (code language, extra instructions), file artifacts (Files tab), saving, zip.
// Run from the repo root: node test-artifacts.js   (needs: npm install --no-save jsdom@26)
const fs=require('fs'), os=require('os'), path=require('path'); const {execFileSync}=require('child_process'); const {JSDOM}=require('jsdom');
const html=fs.readFileSync(path.join(__dirname,'vibe-chat.html'),'utf8');
const F3='```', F4='````';
let chunks=['Hi.'], errs=[];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function sse(parts){ const enc=new TextEncoder(); let i=0; return {ok:true,body:{getReader:()=>({read:async()=>{ await sleep(60); return i<parts.length?{done:false,value:enc.encode(parts[i++])}:{done:true}; }})}}; }
const dom=new JSDOM(html,{runScripts:'dangerously',url:'https://localhost/',pretendToBeVisual:true,
  beforeParse(w){
    w.HTMLCanvasElement.prototype.getContext=()=>null;
    if(!w.TextDecoder) w.TextDecoder=TextDecoder;
    if(!w.TextEncoder) w.TextEncoder=TextEncoder;
    if(!w.Blob.prototype.text) w.Blob.prototype.text=function(){ return new Promise(r=>{ const fr=new w.FileReader(); fr.onload=()=>r(fr.result); fr.readAsText(this); }); };
    w.addEventListener('error',e=>errs.push(e.message));
    w.fetch=async(url,opts)=>{ url=String(url);
      if(url.endsWith('/models')) return {ok:true,json:async()=>({data:[{id:'anthropic/claude-sonnet-5.5',context_length:1000000,pricing:{prompt:'0.000003',completion:'0.000015'},architecture:{input_modalities:['text','image']}}]})};
      if(url.endsWith('/chat/completions')){
        return sse([...chunks.map(c=>'data: '+JSON.stringify({choices:[{delta:{content:c}}]})+'\n'),
          'data: '+JSON.stringify({choices:[],usage:{prompt_tokens:100,completion_tokens:20,cost:0.01}})+'\n','data: [DONE]\n']);
      }
      throw new Error('unexpected '+url); };
  }});
const w=dom.window, $=id=>w.document.getElementById(id), ev=n=>w.eval(n);
const ok=(c,m)=>{ console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1; };
const chatText=()=>$('chat').textContent;
const cards=()=>[...$('filesList').querySelectorAll('.fcard')];
const card=n=>cards().find(c=>c.dataset.name===n);
const click=el=>el.dispatchEvent(new w.MouseEvent('click',{bubbles:true}));
const domErr=name=>Object.assign(new Error(name),{name});
const blobBytes=b=>new Promise(r=>{ const fr=new w.FileReader(); fr.onload=()=>r(Buffer.from(fr.result)); fr.readAsArrayBuffer(b); });
const half=s=>[s.slice(0,Math.floor(s.length/2)), s.slice(Math.floor(s.length/2))];
async function say(text){ chunks=half(text); $('input').value='go'; await ev('sendMessage()'); await sleep(40); }
const FILES_REPLY=`Here are your files.\n\n${F3}file:README.md\n# Title\nZEBRA-CONTENT\n${F3}\n\n${F3}file:data.csv\nname,score\nAna,90\n"Bo, Jr",85\n${F3}\n\n${F3}file:logo.svg\n<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><circle cx="20" cy="20" r="18" fill="teal"/></svg>\n${F3}\n\n${F4}file:page.html\n<h1>Hi</h1><script>alert(1)</script>\n${F4}\n\nAll set.`;

(async()=>{
  await sleep(100);
  ok(errs.length===0,'page loads with no script errors '+errs.join('|'));
  $('key').value='sk-or-x';
  const dl=[], names=[];
  w.URL.createObjectURL=b=>{dl.push(b);return 'blob:x';}; w.URL.revokeObjectURL=()=>{};
  w.HTMLAnchorElement.prototype.click=function(){names.push(this.download);};
  w.confirm=()=>true;

  // ---------- settings: prompt ----------
  let p=ev('systemPrompt()');
  ok(/write TypeScript/.test(p) && /tagged typescript/.test(p),'default prompt asks for TypeScript');
  ok(!/student_preferences/.test(p),'no preferences block by default');
  ok(/file:notes\.md/.test(p) && /four backticks/i.test(p) && /never say[^.]*saved/i.test(p),'prompt teaches the file format, four-backtick nesting, and that the app does the saving');
  const setLang=v=>{ $('codeLang').value=v; $('codeLang').dispatchEvent(new w.Event('change')); };
  ok(!!$('codeLang') && [...$('codeLang').options].map(o=>o.value).join()==='typescript,python,javascript,any','code language select has the four choices');
  setLang('python'); p=ev('systemPrompt()');
  ok(/write Python/.test(p) && /tagged python/.test(p) && !/write TypeScript/.test(p) && w.localStorage.getItem('or_lang')==='python','Python: prompt and saved setting');
  setLang('javascript'); p=ev('systemPrompt()');
  ok(/write JavaScript/.test(p) && /tagged javascript/.test(p),'JavaScript prompt');
  setLang('any'); p=ev('systemPrompt()');
  ok(/best fits the task/.test(p) && !/write TypeScript/.test(p),'"any" lets the model choose');
  setLang('python');
  $('extra').value='Always explain in one line'; $('extra').dispatchEvent(new w.Event('input')); p=ev('systemPrompt()');
  ok(p.includes('<student_preferences>\nAlways explain in one line\n</student_preferences>') && /takes priority/.test(p) && w.localStorage.getItem('or_extra')==='Always explain in one line','extra instructions go in a preferences block that takes priority');
  ok($('promptView').textContent===p,'prompt viewer shows the exact system prompt');
  $('extra').value=''; $('extra').dispatchEvent(new w.Event('input')); p=ev('systemPrompt()');
  ok(!/student_preferences/.test(p) && w.localStorage.getItem('or_extra')===null,'clearing the box removes the block and the saved key');
  ev('calibrated={tokens:1000,count:0}'); const before=ev('est(systemPrompt())'); setLang('typescript');
  ok(ev('calibrated.tokens')===Math.max(0,1000+ev('est(systemPrompt())')-before),'changing the prompt keeps the token count consistent');
  ev('calibrated=null');
  w.localStorage.setItem('or_lang','javascript'); w.localStorage.setItem('or_extra','Be brief'); ev('loadPrefs()');
  ok($('codeLang').value==='javascript' && $('extra').value==='Be brief' && /Be brief/.test(ev('systemPrompt()')),'saved settings are restored on load');
  setLang('typescript'); $('extra').value=''; $('extra').dispatchEvent(new w.Event('input'));

  // ---------- parsing ----------
  let parts=ev(`split(${JSON.stringify(`Here.\n\n${F4}file:a.md\n# T\n${F3}bash\nls\n${F3}\nend\n${F4}\nDone`)})`);
  ok(parts.length===3 && parts[1].t==='file' && parts[1].name==='a.md' && parts[1].v==='# T\n```bash\nls\n```\nend' && !parts[1].open && /Done/.test(parts[2].v),'split: four-backtick file block keeps inner fences');
  parts=ev(`split(${JSON.stringify(F3+'typescript\nconst a=1;\n'+F3)})`);
  ok(parts.length>=2 && parts[1].t==='code' && parts[1].lang==='typescript' && parts[1].v==='const a=1;','split: ordinary code block unchanged, language kept');
  parts=ev(`split(${JSON.stringify(F4+'file:a.md\nhello')})`);
  ok(parts[1].t==='file' && parts[1].open===true,'split: unfinished file block is open');
  const sf=n=>ev(`safeFileName(${JSON.stringify(n)})`);
  ok(sf('../../.ssh/evil.exe')==='evil.txt' && sf('a b.MD')==='a-b.md' && sf('notes')==='notes.txt' && sf('C:\\x\\r.csv')==='r.csv','safeFileName: no folders, allowlisted extensions');
  ok(sf('CON.txt')!=='CON.txt' && sf('..')==='file.txt' && sf('תוצאות.csv')==='תוצאות.csv','safeFileName: reserved names, empty names, Hebrew kept');

  // ---------- files tab ----------
  ok(!!$('tabFiles') && !!$('filesList') && $('filesBadge').hidden,'Files tab exists and the badge is hidden when empty');
  await say(FILES_REPLY);
  ok(names.length===0 && dl.length===0,'nothing is downloaded until the student presses Save');
  ok(cards().length===4 && ['README.md','data.csv','logo.svg','page.html'].every(n=>!!card(n)),'four file cards in the tray');
  ok(!$('filesBadge').hidden && $('filesBadge').textContent==='4','badge shows the count');
  ok(ev('latestCode()')==='' && !/ZEBRA-CONTENT/.test(chatText()) && !/```/.test(chatText()),'file blocks are not in the code window or the chat text');
  ok($('chat').querySelectorAll('.fchip').length===4 && /Here are your files/.test(chatText()) && /All set/.test(chatText()),'chat shows a chip per file and keeps the prose');
  ok($('tabFiles').getAttribute('aria-selected')==='true' && $('codeWrap').hidden && !$('filesWrap').hidden,'Files tab opens by itself when the reply has files but no code');
  click($('tabCode'));
  ok($('tabCode').getAttribute('aria-selected')==='true' && !$('codeWrap').hidden && $('filesWrap').hidden,'Code tab switches back');
  click($('chat').querySelector('.fchip'));
  ok($('tabFiles').getAttribute('aria-selected')==='true','clicking a chip opens the Files tab');
  const rows=card('data.csv').querySelectorAll('table tr');
  ok(rows.length===3 && rows[2].children[0].textContent==='Bo, Jr','CSV previews as a table (quoted comma kept)');
  const img=card('logo.svg').querySelector('img');
  ok(!!img && img.src.startsWith('data:image/svg+xml') && !card('logo.svg').querySelector('svg'),'SVG previews as an <img>, never inline');
  ok(/<script>alert\(1\)<\/script>/.test(card('page.html').textContent) && !card('page.html').querySelector('script,iframe'),'HTML is shown as text and never run');
  ok(/ZEBRA-CONTENT/.test(card('README.md').textContent),'markdown shown as text');

  // ---------- discard and restore ----------
  click(card('page.html').querySelector('.fdiscard'));
  ok(cards().length===3 && $('filesBadge').textContent==='3' && !$('restoreAll').hidden,'discard removes the card and offers restore');
  click($('restoreAll'));
  ok(cards().length===4 && $('restoreAll').hidden,'restore brings it back');
  click(card('README.md').querySelector('.fdiscard'));
  await say(`New version.\n\n${F3}file:README.md\n# Title v2\n${F3}`);
  ok(card('README.md') && /v2/.test(card('README.md').textContent) && cards().length===4,'a new version of a discarded file shows up again');

  // ---------- unfinished block ----------
  chunks=['Sure.\n\n'+F3+'file:notes.md\nhello','',]; chunks=['Sure.\n\n'+F3+'file:notes.md\nhello']; $('input').value='go';
  const pr=ev('sendMessage()'); await sleep(90); ev('renderNow()');
  const live=card('notes.md');
  ok(!!live && live.classList.contains('writing') && live.querySelector('.fsave').disabled,'while streaming, the file shows as writing and cannot be saved');
  await pr; await sleep(40);
  ok(!card('notes.md'),'an unfinished file is dropped when the reply ends');

  // ---------- saving: no picker (Firefox, Safari) ----------
  ok(ev("typeof window.showSaveFilePicker")==='undefined','(setup) no save picker in this browser');
  ev('renderNow()');
  click(card('README.md').querySelector('.fsave')); await sleep(20);
  ok(names.join()==='README.md' && (await dl[0].text())==='# Title v2' ,'without a picker, Save downloads the file');
  ok(/Downloaded/.test(card('README.md').textContent),'card says downloaded');

  // ---------- saving: picker ----------
  const picks=[], written=[]; let pickMode='ok';
  w.showSaveFilePicker=async o=>{ picks.push(o); if(pickMode==='abort') throw domErr('AbortError'); if(pickMode==='security') throw domErr('SecurityError');
    return {name:o.suggestedName,createWritable:async()=>({write:async d=>{written.push(String(d));},close:async()=>{}})}; };
  ev('renderNow()'); names.length=0;
  click(card('data.csv').querySelector('.fsave')); await sleep(20);
  ok(picks.length===1 && picks[0].suggestedName==='data.csv' && /Ana,90/.test(written[0]) && names.length===0,'with a picker, Save opens the native dialog and writes the file');
  ok(/Saved/.test(card('data.csv').textContent),'card says saved');
  pickMode='abort'; click(card('logo.svg').querySelector('.fsave')); await sleep(20);
  ok(names.length===0 && !/downloaded instead/i.test(chatText()),'cancelling the dialog is silent');
  pickMode='security'; click(card('logo.svg').querySelector('.fsave')); await sleep(20);
  ok(names.join()==='logo.svg' && /downloaded instead/i.test(chatText()),'blocked dialog falls back to a download with a notice');
  pickMode='ok';

  // ---------- saving: folder ----------
  const dir={name:'Class Notes',files:new Map(),async getFileHandle(n,o){ if(!this.files.has(n)){ if(!(o&&o.create)) throw domErr('NotFoundError'); this.files.set(n,''); }
    const files=this.files; return {name:n,async createWritable(){ return {async write(d){files.set(n,String(d));},async close(){}}; }}; }};
  let dirOpts=null; w.showDirectoryPicker=async o=>{ dirOpts=o; return dir; }; picks.length=0;
  ev('renderNow()'); ok(!$('folderHint').hidden && /inside/.test($('folderHint').textContent),'the folder hint is shown before a folder is chosen');
  click($('pickFolder')); await sleep(20);
  ok(dirOpts && dirOpts.startIn==='documents' && dirOpts.mode==='readwrite','the folder picker opens in Documents');
  ok($('folderHint').hidden,'the hint hides once a folder is chosen');
  ok(!$('folderChip').hidden && /Class Notes/.test($('folderChip').textContent),'folder chip shows the chosen folder');
  click(card('README.md').querySelector('.fsave')); await sleep(20);
  ok(dir.files.get('README.md')==='# Title v2' && picks.length===0,'with a folder, Save writes straight into it');
  click(card('README.md').querySelector('.fsave')); await sleep(20);
  ok(dir.files.get('README (2).md')==='# Title v2' && dir.files.get('README.md')==='# Title v2' && /README \(2\)\.md/.test(chatText()),'a taken name becomes "README (2).md" and is reported; nothing is overwritten');
  click($('folderStop'));
  ok($('folderChip').hidden,'stopping the folder removes the chip');
  w.showDirectoryPicker=async()=>{ throw domErr('SecurityError'); };
  click($('pickFolder')); await sleep(20);
  ok($('folderChip').hidden && /Downloads/.test(chatText()),'blocked folder: notice about Downloads, no chip');
  delete w.showDirectoryPicker;
  click($('pickFolder')); await sleep(20);
  ok($('folderChip').hidden && /Chrome or Edge/.test(chatText()),'no folder support: notice, no chip');

  // a folder that stops working is dropped, and the file is not silently downloaded
  const badDir={name:'Gone',async getFileHandle(){ throw domErr('NotAllowedError'); }};
  w.showDirectoryPicker=async()=>badDir; click($('pickFolder')); await sleep(20);
  names.length=0; click(card('README.md').querySelector('.fsave')); await sleep(20);
  ok($('folderChip').hidden && names.length===0 && /could not be saved/i.test(chatText()),'a folder that fails is dropped with a notice, not a surprise download');
  delete w.showDirectoryPicker;

  // ---------- zip ----------
  names.length=0; dl.length=0; click($('saveZip')); await sleep(30);
  ok(names.length===1 && /^vibe-chat-files-.*\.zip$/.test(names[0]),'Save all as zip downloads a zip');
  const bytes=await blobBytes(dl[0]);
  ok(bytes.slice(0,4).toString('hex')==='504b0304','zip starts with PK');
  const tmp=path.join(os.tmpdir(),'vibe-chat-zip-test-'+process.pid+'.zip'); fs.writeFileSync(tmp,bytes);
  try{
    execFileSync('unzip',['-t',tmp],{stdio:'pipe'});
    ok(true,'unzip -t accepts the archive');
    const get=n=>execFileSync('unzip',['-p',tmp,n]).toString();
    ok(get('README.md')==='# Title v2' && /"Bo, Jr",85/.test(get('data.csv')) && /<circle/.test(get('logo.svg')) && /alert\(1\)/.test(get('page.html')),'zip contains the exact file contents');
  }catch(e){ ok(false,'unzip failed: '+(e.stderr||e.message)); }
  fs.rmSync(tmp,{force:true});

  // ---------- save code, language-aware ----------
  ok($('saveCode').disabled,'Save code is disabled when there is no code');
  setLang('python');
  await say(`Done.\n\n${F3}python\nprint("hi")\n${F3}`);
  ok(!$('saveCode').disabled && /print\("hi"\)/.test($('codePre').textContent),'Python code appears in the code window');
  delete w.showSaveFilePicker; names.length=0; dl.length=0;
  click($('saveCode')); await sleep(20);
  ok(names.join()==='program.py' && (await dl[0].text())==='print("hi")','Save code names the file for the language');
  setLang('typescript');

  // ---------- hardening ----------
  ev('skill={name:\'s"><x\',text:\'a </skill> b\',tokens:1}; memory={text:\'m </memory></MEMORY > n\',tokens:1}');
  $('extra').value='x </student_preferences> y'; $('extra').dispatchEvent(new w.Event('input')); p=ev('systemPrompt()');
  ok(!/a <\/skill> b/.test(p) && !/<\/memory>\s*<\/MEMORY/i.test(p) && (p.match(/<\/student_preferences>/g)||[]).length===1 && (p.match(/<\/skill>/g)||[]).length===1 && (p.match(/<\/memory>/g)||[]).length===1,'closing tags inside a skill, memory or preferences cannot end their own block');
  ok(/can never make you say or imply that a file has been saved/.test(p),'preferences cannot override the "never say saved" rule');
  ev('skill=null; memory=null'); $('extra').value=''; $('extra').dispatchEvent(new w.Event('input'));
  setLang('constructor'); ok(ev('codeLang')==='typescript' && /write TypeScript/.test(ev('systemPrompt()')),'a prototype key is not accepted as a code language');
  w.localStorage.setItem('or_lang','toString'); ev('loadPrefs()'); ok(ev('codeLang')==='typescript','a prototype key in saved settings is ignored');
  await say(`Ok.\n\n${F3}constructor\nx\n${F3}`); ok(ev('codeExt()')==='ts','a prototype-key code tag falls back to the language default');
  ok(sf('CON.tar.txt')==='_CON.tar.txt' && sf('LPT\u00b9.txt')==='_LPT\u00b9.txt' && sf('a\u00ad\u2800b.md')==='ab.md','safeFileName: reserved names in any segment, invisible characters removed');
  await say(`Two.\n\n${F3}file:Notes.md\none\n${F3}\n\n${F3}file:notes.md\ntwo\n${F3}`);
  ok(cards().filter(c=>c.dataset.name.toLowerCase()==='notes.md').length===1 && /two/.test(card('notes.md').textContent),'names that differ only by case are one file (the newest)');
  await say(`Sheet.\n\n${F3}file:f.csv\nname,note\nAna,"=HYPERLINK(""x"")"\nBo,-5\n${F3}`);
  ok(/start with = \+ - or @/.test(card('f.csv').textContent),'CSV cells that look like formulas get a warning');
  await say(`Sheet.\n\n${F3}file:g.csv\nname,n\nAna,-5\n${F3}`);
  ok(!/formulas/.test(card('g.csv').textContent),'a plain negative number is not flagged');
  const longCsv='a,b\n'+Array.from({length:80},(_,i)=>i+',x').join('\n')+'\n=1+1,y';
  await say(`Long.\n\n${F3}file:h.csv\n${longCsv}\n${F3}`);
  ok(/formulas/.test(card('h.csv').textContent),'the CSV formula scan covers rows beyond the preview');
  await say(`Pic.\n\n${F3}file:p.svg\n<svg xmlns="http://www.w3.org/2000/svg"><script>1</script></svg>\n${F3}`);
  ok(/would run/.test(card('p.svg').textContent),'an SVG with script gets the specific warning');
  dl.length=0; click(card('data.csv').querySelector('.fsave')); await sleep(20);
  ok(dl.length===1 && (await blobBytes(dl[0])).slice(0,3).toString('hex')==='efbbbf','CSV saves start with a UTF-8 byte-order mark');
  dl.length=0; click(card('README.md').querySelector('.fsave')); await sleep(20);
  ok(dl.length===1 && (await blobBytes(dl[0])).slice(0,3).toString('hex')!=='efbbbf','other files do not');

  // ---------- code colors: tokenizer ----------
  const hl=(code,lang)=>JSON.parse(ev(`JSON.stringify(highlight(${JSON.stringify(code)},${JSON.stringify(lang)}))`));
  const joined=t=>t.map(x=>x[1]).join('');
  const kinds=t=>t.filter(x=>x[0]).map(x=>x[0]+':'+x[1]);
  const has=(t,...k)=>k.every(x=>kinds(t).includes(x));
  const TS_SRC='const n = 42; // count\nfunction greet(name: string) { return "hi " + name; }\nclass Box {}\nconst u = "http://x.test";';
  let t=hl(TS_SRC,'typescript');
  ok(joined(t)===TS_SRC,'tokenizer: the pieces always add up to the exact original text');
  ok(has(t,'kw:const','num:42','com:// count','kw:function','fn:greet','type:string','ctl:return','str:"hi "','type:Box','kw:class','str:"http://x.test"'),'TypeScript: keywords, numbers, comments, functions, types, strings; // inside a string is not a comment');
  ok(JSON.stringify(hl(TS_SRC,'js'))===JSON.stringify(hl(TS_SRC,'javascript')) && has(hl('let a = `x ${1}\ny`; /* b */','jsx'),'kw:let','com:/* b */'),'JavaScript aliases work; template strings and block comments');
  const PY_SRC='import os\n# say hi\ndef greet(name):\n    """Doc."""\n    return f"hi {name}" if name else None\nclass Pet: pass\nx = "a # b"';
  t=hl(PY_SRC,'python');
  ok(joined(t)===PY_SRC && has(t,'ctl:import','com:# say hi','kw:def','fn:greet','str:"""Doc."""','ctl:return','str:f"hi {name}"','kw:None','kw:class','type:Pet','str:"a # b"'),'Python: comments, docstrings, f-strings, functions, classes; # inside a string is not a comment');
  t=hl('const a = "abc\nconst b = 1','typescript');
  ok(joined(t)==='const a = "abc\nconst b = 1' && kinds(t).filter(x=>x==='kw:const').length===2,'an unfinished string ends at the line break, so streaming code does not paint the rest of the file');
  const MD_SRC='# Title\n\nSome **bold** and *it* and `code` and [a](http://x.test).\n- item\n> quote\n';
  t=hl(MD_SRC,'markdown');
  ok(joined(t)===MD_SRC && has(t,'mdh:# Title','mdb:**bold**','mdi:*it*','mdc:`code`','mdlink:[a](http://x.test)','mdl:- ','mdl:> '),'Markdown: headings, bold, italic, code, links, lists, quotes');
  ok(JSON.stringify(hl('echo hi','bash'))==='[["","echo hi"]]' && JSON.stringify(hl('x','')) ==='[["","x"]]','other languages stay plain');
  const RX='const re = /"/g; x = a / b; y = 1;';
  t=hl(RX,'js');
  ok(joined(t)===RX && has(t,'str:/"/g','kw:const','num:1') && !kinds(t).some(k=>k.startsWith('str:"')),'a regex containing a quote is not read as a string; a division slash is not a regex');
  t=hl('p.catch(e); Array.from(a); x.class = 1; import a from "b";','js');
  ok(has(t,'fn:catch','fn:from','ctl:import','ctl:from') && !kinds(t).includes('kw:class'),'property names such as .catch .from .class are not colored as keywords');
  const CONT='x = "a\\\nb"; y = 2;';
  t=hl(CONT,'js');
  ok(joined(t)===CONT && has(t,'str:"a\\\nb"','num:2'),'a backslash-newline continues a string');
  t=hl('café(1)','js');
  ok(has(t,'fn:café'),'accented and Hebrew letters stay inside one identifier');
  const MDW='- item\r\n> quote\r\n';
  t=hl(MDW,'markdown');
  ok(joined(t)===MDW && has(t,'mdl:- ','mdl:> ','mdq:quote\r'),'Markdown with Windows line endings is still colored');
  const BIG='a = 1\n'.repeat(30000);
  ok(JSON.stringify(hl(BIG,'python'))===JSON.stringify([['',BIG]]),'very large code is left plain so the page stays fast');

  // ---------- code colors: code window ----------
  setLang('typescript');
  await say(`Done.\n\n${F3}typescript\nconst a = 1; // hi\n${F3}`);
  let pre=$('codePre');
  ok(pre.textContent==='const a = 1; // hi' && ev('latestCode()')==='const a = 1; // hi','the code window shows exactly the code');
  ok(pre.querySelector('.tk-kw')?.textContent==='const' && pre.querySelector('.tk-com')?.textContent==='// hi' && pre.querySelector('.tk-num')?.textContent==='1','the code window is colored');
  delete w.showSaveFilePicker; names.length=0; dl.length=0; click($('saveCode')); await sleep(20);
  ok((await dl[0].text())==='const a = 1; // hi','Save code writes plain text, with no markup');
  const EVIL='<img src=x onerror=alert(1)><script>1</script> // c';
  await say(`Done.\n\n${F3}typescript\n${EVIL}\n${F3}`);
  ok($('codePre').textContent===EVIL && !$('codePre').querySelector('img,script'),'model text is never parsed as HTML in the code window');
  setLang('python');
  await say(`Done.\n\n${F3}\nx = 1 # c\n${F3}`);
  ok(!!$('codePre').querySelector('.tk-com'),'a code block with no language tag is colored using the Code language setting');
  await say(`Done.\n\n${F3}bash\necho hi # c\n${F3}`);
  ok($('codePre').textContent==='echo hi # c' && !$('codePre').querySelector('span'),'a block in another language is not colored as the wrong language');
  const HALF='a = 1\n'.repeat(6000);
  await say(`Done.\n\n${F3}typescript\n${HALF}${F3}\n\n${F3}typescript\n${HALF}${F3}`);
  ok(!$('codePre').querySelector('span') && $('codePre').textContent.length>60000,'many blocks together are capped as a whole: oversized responses stay plain');
  setLang('typescript');

  // ---------- code colors: themes ----------
  const root=w.document.documentElement;
  ok(!!$('codeTheme') && [...$('codeTheme').options].map(o=>o.value).join()==='dark-plus,light-plus,hc','theme select has Dark+, Light+ and High Contrast');
  ok(root.dataset.codetheme==='dark-plus' && w.localStorage.getItem('or_theme')===null,'default theme is Dark+ and nothing is stored for it');
  const setTheme=v=>{ $('codeTheme').value=v; $('codeTheme').dispatchEvent(new w.Event('change')); };
  setTheme('light-plus');
  ok(root.dataset.codetheme==='light-plus' && w.localStorage.getItem('or_theme')==='light-plus','choosing Light+ applies and remembers it');
  setTheme('dark-plus');
  ok(root.dataset.codetheme==='dark-plus' && w.localStorage.getItem('or_theme')===null,'choosing the default clears the stored key');
  ev("setCodeTheme('constructor')");
  ok(root.dataset.codetheme==='dark-plus','a prototype key is not accepted as a theme');
  w.localStorage.setItem('or_theme','hc'); ev('loadPrefs()');
  ok(root.dataset.codetheme==='hc' && $('codeTheme').value==='hc','a saved theme is restored on load');
  w.localStorage.setItem('or_theme','nope'); ev('loadPrefs()');
  ok(root.dataset.codetheme==='dark-plus','an unknown saved theme falls back to Dark+');
  const PALETTES={'dark-plus':['#1e1e1e','#6a9955','#ce9178','#b5cea8','#569cd6','#c586c0','#dcdcaa','#4ec9b0'],
    'light-plus':['#ffffff','#008000','#a31515','#098658','#0000ff','#af00db','#795e26','#267f99'],
    'hc':['#000000','#7ca668','#ce9178','#b5cea8','#569cd6','#c586c0','#dcdcaa','#4ec9b0']};
  for(const [id,vals] of Object.entries(PALETTES)){
    const m=html.match(new RegExp(':root\\[data-codetheme="'+id+'"\\]\\s*\\{([^}]*)\\}','i'));
    const get=k=>((m&&m[1].match(new RegExp('--c-'+k+':\\s*(#[0-9a-f]{6})','i')))||[])[1];
    ok(!!m && ['bg','com','str','num','kw','ctl','fn','type'].map(get).map(x=>x&&x.toLowerCase()).join()===vals.join(),'palette '+id+' matches the Visual Studio Code theme values');
  }

  // ---------- code comments setting ----------
  ok(!!$('commentsOn') && $('commentsOn').checked===true,'the comments setting exists and is on by default');
  p=ev('systemPrompt()');
  ok(/comment the code generously/i.test(p) && /\/\/ comment/.test(p) && !/# comment/.test(p),'TypeScript prompt asks for generous // comments');
  setLang('javascript'); ok(/\/\/ comment/.test(ev('systemPrompt()')),'JavaScript prompt asks for // comments');
  setLang('python'); p=ev('systemPrompt()');
  ok(/# comment/.test(p) && /docstring/.test(p) && !/\/\/ comment/.test(p),'Python prompt asks for # comments and docstrings');
  setLang('any'); ok(/that language's own comment syntax/.test(ev('systemPrompt()')),'"any" asks for the language\'s own comment syntax');
  setLang('typescript');
  ok($('promptView').textContent===ev('systemPrompt()') && /generously/.test($('promptView').textContent),'the prompt viewer shows the comments rule');
  ev('calibrated={tokens:1000,count:0}'); const cBefore=ev('est(systemPrompt())');
  const setComments=on=>{ $('commentsOn').checked=on; $('commentsOn').dispatchEvent(new w.Event('change')); };
  setComments(false); p=ev('systemPrompt()');
  ok(!/generously/.test(p) && w.localStorage.getItem('or_comments')==='0' && $('promptView').textContent===p,'turning it off removes the rule and remembers the choice');
  ok(ev('calibrated.tokens')===Math.max(0,1000+ev('est(systemPrompt())')-cBefore),'toggling comments keeps the token count consistent');
  ev('calibrated=null');
  w.localStorage.setItem('or_comments','0'); setComments(true); ev("localStorage.setItem('or_comments','0')"); ev('loadPrefs()');
  ok($('commentsOn').checked===false && !/generously/.test(ev('systemPrompt()')),'the off setting is restored on load');
  setComments(true);
  ok(w.localStorage.getItem('or_comments')===null && /generously/.test(ev('systemPrompt()')),'turning it back on clears the stored key');

  // ---------- code colors: Markdown file preview ----------
  await say(`Doc.\n\n${F3}file:colors.md\n# Head\nSome **bold** [x](javascript:alert(1))\n${F3}`);
  const mdCard=card('colors.md');
  ok(!!mdCard && mdCard.querySelector('.tk-mdh')?.textContent==='# Head' && mdCard.querySelector('.tk-mdb')?.textContent==='**bold**','a Markdown file preview is colored');
  ok(/\*\*bold\*\* \[x\]\(javascript:alert\(1\)\)/.test(mdCard.textContent) && !mdCard.querySelector('a,script,img'),'Markdown is colored as text, never rendered into links or HTML');
  click(mdCard.querySelector('.fsave')); await sleep(20);
  ok((await dl[dl.length-1].text())==='# Head\nSome **bold** [x](javascript:alert(1))','saving a Markdown file writes the plain text');

  // ---------- chat layout: sides follow the speaker, text direction follows the language ----------
  const lastRows=()=>{ const r=[...$('chat').querySelectorAll('.row')]; return {user:r.filter(x=>x.querySelector('.bubble.user')).pop(), bot:r.filter(x=>x.querySelector('.bubble.assistant')).pop()}; };
  const side=b=>{ const cs=w.getComputedStyle(b); return cs.marginLeft==='auto' && cs.marginRight!=='auto' ? 'right' : cs.marginRight==='auto' && cs.marginLeft!=='auto' ? 'left' : '?'; };
  async function exchange(userText, botText){ chunks=half(botText); $('input').value=userText; await ev('sendMessage()'); await sleep(40); }
  await exchange('How do I print?', 'שלום, הנה התשובה.');
  let rr=lastRows();
  ok(rr.user.dir==='ltr' && rr.bot.dir==='ltr','rows are always left-to-right, so a bubble\'s side never depends on its language');
  ok(side(rr.user.querySelector('.bubble'))==='left' && side(rr.bot.querySelector('.bubble'))==='right','English question on the left, Hebrew answer on the right');
  ok(rr.user.querySelector('.bubble').dir==='ltr' && rr.bot.querySelector('.bubble').dir==='rtl' && rr.bot.querySelector('.bubble p').dir==='auto','inside the bubbles, English flows left-to-right and Hebrew right-to-left');
  await exchange('איך מדפיסים?', 'Use print.');
  rr=lastRows();
  ok(side(rr.user.querySelector('.bubble'))==='left' && side(rr.bot.querySelector('.bubble'))==='right','Hebrew question stays on the left, English answer stays on the right');
  ok(rr.user.querySelector('.bubble').dir==='rtl' && rr.bot.querySelector('.bubble').dir==='ltr','and each bubble keeps its own text direction');
  w.document.documentElement.dir='rtl'; ev('renderNow()'); rr=lastRows();
  ok(side(rr.user.querySelector('.bubble'))==='left' && side(rr.bot.querySelector('.bubble'))==='right','sides stay put when the whole page is right-to-left');
  w.document.documentElement.dir='';
  $('input').value='go'; chunks=['x']; await ev('sendMessage()'); await sleep(40);
  ev("notes.push({kind:'error',text:'Something failed.',at:history.length})"); ev('renderNow()');
  const noteRow=[...$('chat').querySelectorAll('.row')].pop();
  ok(noteRow.dir==='ltr' && side(noteRow.querySelector('.bubble'))==='right','app notices sit on the chatbot side');
  ev('notes.length=0');

  // ---------- reset ----------
  $('reset').click(); await sleep(30);
  ok(cards().length===0 && $('filesBadge').hidden,'Reset empties the tray and hides the badge');
  ok(errs.length===0,'no script errors at the end '+errs.join('|'));
  process.exit(process.exitCode||0);
})();
