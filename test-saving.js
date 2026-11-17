// Tests for: the privacy setting sent to OpenRouter, the code card in the Files tab, and one save path
// (chosen folder, save dialog, or Downloads) for Save code, Save chat, Save memory, and Load memory.
// Run from the repo root: node test-saving.js   (needs: npm install --no-save jsdom@26)
const fs=require('fs'), os=require('os'), path=require('path'); const {execFileSync}=require('child_process'); const {JSDOM}=require('jsdom');
const html=fs.readFileSync(path.join(__dirname,'vibe-chat.html'),'utf8');
const F3='```';
let chunks=['Hi.'], errs=[], mode='ok';
const bodies=[];                      // every JSON body sent to /chat/completions, in order
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function sse(parts){ const enc=new TextEncoder(); let i=0; return {ok:true,body:{getReader:()=>({read:async()=>{ await sleep(30); return i<parts.length?{done:false,value:enc.encode(parts[i++])}:{done:true}; }})}}; }
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
        const b=JSON.parse(opts.body); bodies.push(b);
        if(mode==='privacy' && b.stream!==false) return {ok:false,status:404,json:async()=>({error:{message:'No endpoints found matching your data policy (Paid model training). Configure: https://openrouter.ai/settings/privacy'}})};
        if(b.stream===false){ await sleep(40); return {ok:true,json:async()=>({choices:[{message:{content:'## Goal\n- a game'}}],usage:{prompt_tokens:50,completion_tokens:10,cost:0.002}})}; }
        return sse([...chunks.map(c=>'data: '+JSON.stringify({choices:[{delta:{content:c}}]})+'\n'),
          'data: '+JSON.stringify({choices:[],usage:{prompt_tokens:100,completion_tokens:20,cost:0.01}})+'\n','data: [DONE]\n']);
      }
      throw new Error('unexpected '+url); };
  }});
const w=dom.window, $=id=>w.document.getElementById(id), ev=n=>w.eval(n);
const ok=(c,m)=>{ console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1; };
const chatText=()=>$('chat').textContent;
const cards=()=>[...$('filesList').querySelectorAll('.fcard')];
const click=el=>el.dispatchEvent(new w.MouseEvent('click',{bubbles:true}));
const domErr=name=>Object.assign(new Error(name),{name});
const blobBytes=b=>new Promise(r=>{ const fr=new w.FileReader(); fr.onload=()=>r(Buffer.from(fr.result)); fr.readAsArrayBuffer(b); });
async function say(text){ chunks=[text]; $('input').value='go'; await ev('sendMessage()'); await sleep(40); }
function folderMock(name){
  return {name, files:new Map(), async getFileHandle(n,o){ if(!this.files.has(n)){ if(!(o&&o.create)) throw domErr('NotFoundError'); this.files.set(n,''); }
    const files=this.files; return {name:n, async getFile(){ return new w.File([files.get(n)], n); }, async createWritable(){ return {async write(d){files.set(n,String(d));},async close(){}}; }}; }};
}

(async()=>{
  await sleep(100);
  ok(errs.length===0,'page loads with no script errors '+errs.join('|'));
  $('key').value='sk-or-x'; w.confirm=()=>true;
  const dl=[], names=[];
  w.URL.createObjectURL=b=>{dl.push(b);return 'blob:x';}; w.URL.revokeObjectURL=()=>{};
  w.HTMLAnchorElement.prototype.click=function(){names.push(this.download);};

  // ---------- audience and privacy ----------
  ok(/high school students/.test(ev('systemPrompt()')) && !/college/.test(ev('systemPrompt()')),'the system prompt describes high school students');
  await say(`Done.\n\n${F3}typescript\nconst a = 1;\n${F3}`);
  ok(bodies.length===1 && bodies[0].provider && bodies[0].provider.data_collection==='deny','a chat request asks for providers that do not keep or train on prompts');
  mode='privacy'; bodies.length=0; $('input').value='hello'; await ev('sendMessage()'); await sleep(40);
  ok(/data policy/.test(chatText()) && /keep or train/.test(chatText()) && /Choose another model/.test(chatText()),'no private provider: the student is told to choose another model');
  ok(bodies.length===1,'that error gets built-in advice, with no extra paid request');
  $('input').value='שלום'; await ev('sendMessage()'); await sleep(40);
  ok(/בחרו מודל אחר/.test(chatText()),'the same advice in Hebrew');
  mode='ok';

  // ---------- folder button in the top bar ----------
  ok($('pickFolder').closest('header') && $('folderChip').closest('header'),'Choose save folder is in the top bar');
  ok(!$('pickFolder').closest('#filesWrap'),'and no longer only in the Files tab');

  // ---------- code card ----------
  ev('renderNow()');
  let c=cards()[0];
  ok(c && c.dataset.code==='1' && c.dataset.name==='program.ts' && /Latest code|הקוד האחרון/.test(c.textContent) && /const a = 1;/.test(c.textContent),'the latest code is pinned at the top of the Files tab');
  ok(!c.querySelector('.fdiscard'),'the code card cannot be discarded');
  ok(!$('saveZip').disabled,'Save all as zip is available when there is only code');
  await say(`Here.\n\n${F3}file:notes.md\n# Notes\n${F3}`);
  ok(cards().length===2 && cards()[0].dataset.code==='1' && cards()[1].dataset.name==='notes.md','a reply with only a file keeps the code card first');

  // Save from the code card through the save dialog
  const picks=[], written=[]; let pickMode='ok';
  w.showSaveFilePicker=async o=>{ picks.push(o); if(pickMode==='abort') throw domErr('AbortError');
    return {name:o.suggestedName,createWritable:async()=>({write:async d=>{written.push(String(d));},close:async()=>{}})}; };
  click(cards()[0].querySelector('.fsave')); await sleep(20);
  ok(picks.length===1 && picks[0].suggestedName==='program.ts' && written[0]==='const a = 1;','the code card saves the code through the save dialog');
  ok(/Saved/.test(cards()[0].textContent),'the code card says Saved');
  await say(`Done.\n\n${F3}typescript\nconst a = 2;\n${F3}`);
  ok(!/Saved/.test(cards()[0].querySelector('.fstatus').textContent) && /const a = 2;/.test(cards()[0].textContent),'a new version of the code is shown and is not marked saved');

  // ---------- one folder for everything ----------
  const dir=folderMock('vibe-chat');
  w.showDirectoryPicker=async()=>dir; click($('pickFolder')); await sleep(20);
  ok(!$('folderChip').hidden && /Saving to: vibe-chat/.test($('folderChip').textContent) && /Saving to: vibe-chat/.test($('filesFolder').textContent),'the chosen folder shows in the top bar and the Files tab');
  picks.length=0;
  click(cards()[0].querySelector('.fsave')); await sleep(20);
  click($('saveCode')); await sleep(20);
  click(cards().find(x=>x.dataset.name==='notes.md').querySelector('.fsave')); await sleep(20);
  ok(dir.files.get('program.ts')==='const a = 2;' && dir.files.get('program (2).ts')==='const a = 2;' && dir.files.get('notes.md')==='# Notes' && picks.length===0,'code card, Save code and file cards all write into the same folder; nothing is overwritten');
  names.length=0; click($('saveChat')); await sleep(30);
  const chatName=[...dir.files.keys()].find(n=>/^conversation-.*\.md$/.test(n));
  ok(chatName && /### Student/.test(dir.files.get(chatName)) && names.length===0 && /in the vibe-chat folder/.test(chatText()),'Save chat writes into the folder and says where');

  // Save memory into the folder: progress label, then next steps
  bodies.length=0; const p=ev("document.getElementById('saveMem').click()"); await sleep(15);
  ok($('saveMem').textContent==='Saving memory…' && $('saveMem').disabled,'Save memory shows that it is working');
  await sleep(120);
  const memName=[...dir.files.keys()].find(n=>/^memory-.*\.md$/.test(n));
  ok(memName && /## Goal/.test(dir.files.get(memName)) && /## Latest code[\s\S]*const a = 2;/.test(dir.files.get(memName)),'Save memory writes the memory file into the folder');
  ok($('saveMem').textContent==='Save memory' && !$('saveMem').disabled,'the button returns to normal');
  ok(/in the vibe-chat folder/.test(chatText()) && /Reset conversation, then Load memory/.test(chatText()),'the notice says where it went and what to do next');
  ok(bodies[0].provider && bodies[0].provider.data_collection==='deny','the memory request uses the privacy setting too');
  const memSys=bodies[0].messages[0].content;
  ok(/Write every bullet in English/.test(memSys) && !/language the student used/.test(memSys) && !/\{\{LANGUAGE\}\}/.test(memSys),'the app tells the model to write the memory in English, instead of letting it guess');
  ok(/Write every bullet in Hebrew/.test(ev("memoryPrompt('he')")),'a Hebrew conversation gets a Hebrew memory');

  // Load memory opens in the save folder
  let openOpts=null; w.showOpenFilePicker=async o=>{ openOpts=o; return [await dir.getFileHandle(memName)]; };
  click($('reset')); await sleep(20);
  click($('loadMem')); await sleep(40);
  ok(openOpts && openOpts.startIn===dir,'Load memory opens the file picker in the save folder');
  ok(ev('memory') && !$('memChip').hidden && /a game/.test(ev('systemPrompt()')),'the chosen memory file is loaded');
  w.showOpenFilePicker=async()=>{ throw domErr('AbortError'); }; ev('setMemory(null)');
  click($('loadMem')); await sleep(20);
  ok(ev('memory')===null,'cancelling Load memory changes nothing');

  // zip contains the code
  await say(`Done.\n\n${F3}typescript\nconst z = 9;\n${F3}`);
  names.length=0; dl.length=0; click($('saveZip')); await sleep(30);
  const tmp=path.join(os.tmpdir(),'vibe-chat-save-test-'+process.pid+'.zip'); fs.writeFileSync(tmp, await blobBytes(dl[0]));
  try{ ok(execFileSync('unzip',['-p',tmp,'program.ts']).toString()==='const z = 9;','Save all as zip includes the latest code'); }
  catch(e){ ok(false,'unzip failed: '+(e.stderr||e.message)); }
  fs.rmSync(tmp,{force:true});

  // ---------- no folder: Save memory asks where first ----------
  click($('folderStop')); picks.length=0; pickMode='abort'; bodies.length=0;
  click($('saveMem')); await sleep(80);
  ok(picks.length===1 && bodies.length===0,'without a folder, Save memory opens the save dialog first; cancelling sends no paid request');
  pickMode='ok'; written.length=0;
  click($('saveMem')); await sleep(150);
  ok(picks.length===2 && /^memory-/.test(picks[1].suggestedName) && /## Goal/.test(written[0]) && bodies.length===1,'after choosing a place, the memory is made and written there');
  delete w.showSaveFilePicker; names.length=0;
  click($('saveChat')); await sleep(30);
  ok(/^conversation-/.test(names[0]) && /in your Downloads folder/.test(chatText()),'with no dialog, Save chat downloads and says so');

  ok(errs.length===0,'no script errors at the end '+errs.join('|'));
  process.exit(process.exitCode||0);
})().catch(e=>{ console.error('ERR',e); process.exit(1); });
