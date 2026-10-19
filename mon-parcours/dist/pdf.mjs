// A4 files are laid out in points. Font metrics and page breaks are shared by
// downloads and automated PDF checks; no browser print settings are involved.
export const PDF_LAYOUT={width:595.275590551,height:841.88976378,margin:51.0236220472,footerReserve:34};
const cleanText=value=>String(value??'').normalize('NFC').replace(/\r\n?/g,'\n').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,'').replace(/\t/g,'    ');
function nodeText(node){
 if(node.nodeType===3)return node.textContent;
 if(node.nodeType!==1||node.matches('.sr-only,[aria-hidden="true"]'))return '';
 if(node.tagName==='BR')return '\n';
 return Array.from(node.childNodes).map(nodeText).join('');
}
export function documentBlocksFromHTML(html,Parser=globalThis.DOMParser){
 if(!Parser)throw new Error('Le navigateur ne permet pas de préparer ce document.');
 const doc=new Parser().parseFromString(html,'text/html');
 const root=doc.querySelector('.print-document')||doc.body;
 if(!root)throw new Error('Document vide.');
 const title=cleanText(nodeText(root.querySelector('h1')||root)).trim();
 const blocks=[];
 function walk(node){
  if(node.nodeType!==1)return;
  const tag=node.tagName;
  if(node.matches('.print-cover,.print-page-number,img,script,style,.sr-only'))return;
  if(tag==='H1')return;
  if(['H2','H3'].includes(tag)){blocks.push({type:'heading',level:Number(tag[1]),text:cleanText(nodeText(node)).trim()});return;}
  if(tag==='TABLE'){
   for(const row of node.querySelectorAll('tr'))blocks.push({type:'row',cells:Array.from(row.children).filter(c=>['TD','TH'].includes(c.tagName)).map(c=>cleanText(nodeText(c)).trim())});
   return;
  }
  if(['P','LI','FOOTER'].includes(tag)){
   const prefix=tag==='LI'&&!/^[☑☐]/.test(nodeText(node).trim())?(node.parentElement.tagName==='OL'?String(Array.from(node.parentElement.children).indexOf(node)+1)+'. ':'• '):'';
   const text=cleanText(prefix+nodeText(node)).trim();
   const note=node.matches('.print-label,.print-note,.print-source,.print-date');
   if(text)blocks.push({type:note?'note':'paragraph',text});
   for(const link of node.querySelectorAll('a[href]')){
    const url=link.getAttribute('href');
    if(/^https:\/\//i.test(url))blocks.push({type:'link',text:url,url});
   }
   return;
  }
  for(const child of node.children)walk(child);
 }
 for(const child of root.children)walk(child);
 return {title:title||'Mon parcours',blocks};
}
export function wrapText(text,font,size,maxWidth){
 const lines=[];
 for(const paragraph of cleanText(text).split('\n')){
  if(!paragraph.trim()){lines.push('');continue;}
  let line='';
  for(const word of paragraph.trim().split(/\s+/)){
   const candidate=line?line+' '+word:word;
   if(font.widthOfTextAtSize(candidate,size)<=maxWidth){line=candidate;continue;}
   if(line){lines.push(line);line='';}
   if(font.widthOfTextAtSize(word,size)<=maxWidth){line=word;continue;}
   for(const char of word){
    if(line&&font.widthOfTextAtSize(line+char,size)>maxWidth){lines.push(line);line='';}
    line+=char;
   }
  }
  if(line)lines.push(line);
 }
 return lines.length?lines:[''];
}
export async function buildPDF(model,{PDFDocument,PDFString,rgb,fontkit,assets}){
 const pdf=await PDFDocument.create();pdf.registerFontkit(fontkit);
 pdf.setTitle(model.title);pdf.setAuthor('Lycée Ambroise Paré · Laval');pdf.setCreator('Mon parcours · Lycée Ambroise Paré');pdf.setLanguage('fr-FR');
 const regular=await pdf.embedFont(assets.regular,{subset:true});
 const bold=await pdf.embedFont(assets.bold,{subset:true});
 const logo=await pdf.embedJpg(Uint8Array.from(assets.logo));
 const {width:W,height:H,margin:M,footerReserve}=PDF_LAYOUT;
 const cw=W-M*2,bottom=M+footerReserve;
 const blue=rgb(18/255,51/255,84/255),red=rgb(189/255,18/255,55/255),ink=rgb(32/255,48/255,66/255),muted=rgb(82/255,96/255,113/255),line=rgb(.82,.86,.89),pale=rgb(.93,.95,.97);
 const charset=new Set(regular.getCharacterSet()),missing=new Set();
 const safe=value=>Array.from(cleanText(value)).map(c=>{if(c==='\n'||charset.has(c.codePointAt(0)))return c;missing.add(c.codePointAt(0));return '[U+'+c.codePointAt(0).toString(16).toUpperCase()+']';}).join('');
 let page,y;
 function newPage(first=false){
  page=pdf.addPage([W,H]);
  if(first){
   const lw=175,lh=lw*logo.height/logo.width;
   page.drawImage(logo,{x:M,y:H-M-lh,width:lw,height:lh});
   page.drawText('MON PARCOURS',{x:W-M-bold.widthOfTextAtSize('MON PARCOURS',9),y:H-M-14,font:bold,size:9,color:blue});
   const date='Édité le '+new Date().toLocaleDateString('fr-FR');
   page.drawText(date,{x:W-M-regular.widthOfTextAtSize(date,8),y:H-M-30,font:regular,size:8,color:muted});
   y=H-M-lh-28;
  }else{
   page.drawText('Mon parcours · Lycée Ambroise Paré',{x:M,y:H-M-9,font:bold,size:9,color:blue});
   page.drawLine({start:{x:M,y:H-M-20},end:{x:W-M,y:H-M-20},thickness:.6,color:line});
   y=H-M-43;
  }
 }
 function ensure(height){if(y-height<bottom)newPage();}
 function annotation(url,x,baseline,width,height){
  if(!/^https:\/\//i.test(url))return;
  const link=pdf.context.obj({Type:'Annot',Subtype:'Link',Rect:[x,baseline-3,x+width,baseline+height],Border:[0,0,0],A:{Type:'Action',S:'URI',URI:PDFString.of(url)}});
  page.node.addAnnot(pdf.context.register(link));
 }
 function paragraph(text,{font=regular,size=10.2,leading=15.2,color=ink,after=10,indent=0,url}={}){
  const lines=wrapText(safe(text),font,size,cw-indent);
  for(let i=0;i<lines.length;i++){
   // Keep at least two lines together at a page boundary where possible.
   ensure(leading*(i===0&&lines.length>1?2:1));
   if(i===lines.length-1&&lines.length>2&&y-leading<bottom){newPage();}
   if(lines[i])page.drawText(lines[i],{x:M+indent,y:y-size,font,size,color});
   if(url&&lines[i])annotation(url,M+indent,y-size,font.widthOfTextAtSize(lines[i],size),size);
   y-=leading;
  }
  y-=after;
 }
 newPage(true);
 paragraph(model.title,{font:bold,size:22,leading:29,color:blue,after:16});
 page.drawLine({start:{x:M,y:y+4},end:{x:W-M,y:y+4},thickness:1.5,color:red});y-=12;
 for(const block of model.blocks){
  if(block.type==='heading'){
   const size=block.level===2?13:10.2,leading=block.level===2?19:15;
   const lines=wrapText(safe(block.text),bold,size,cw-(block.level===2?16:0));
   ensure(lines.length*leading+44);y-=block.level===2?13:4;
   if(block.level===2){page.drawRectangle({x:M,y:y-lines.length*leading-5,width:cw,height:lines.length*leading+10,color:pale});page.drawRectangle({x:M,y:y-lines.length*leading-5,width:2.5,height:lines.length*leading+10,color:red});}
   paragraph(block.text,{font:bold,size,leading,color:blue,indent:block.level===2?10:0,after:block.level===2?13:3});
  }else if(block.type==='row'){
   const cells=block.cells.map(safe),n=cells.length;if(!n)continue;
   const widths=n===2?[cw*.63,cw*.37]:Array(n).fill(cw/n);
   const rows=cells.map((t,i)=>wrapText(t,i===0?bold:regular,9.3,widths[i]-18));
   const total=Math.max(...rows.map(r=>r.length));let index=0;
   while(index<total){
    ensure(39);
    const count=Math.min(total-index,Math.floor((y-bottom-14)/14));
    const height=count*14+14;let x=M;
    for(let c=0;c<n;c++){
     page.drawRectangle({x,y:y-height,width:widths[c],height,borderColor:line,borderWidth:.5,...(c===0?{color:pale}:{})});
     rows[c].slice(index,index+count).forEach((text,j)=>{if(text)page.drawText(text,{x:x+9,y:y-10-9.3-j*14,size:9.3,font:c===0?bold:regular,color:ink});});
     x+=widths[c];
    }
    y-=height;index+=count;
    if(index<total)newPage();
   }
   y-=4;
  }else if(block.type==='note')paragraph(block.text,{size:8.2,leading:12.2,color:muted,after:9});
  else if(block.type==='link')paragraph(block.text,{size:7.8,leading:11.5,color:blue,after:10,url:block.url});
  else paragraph(block.text);
 }
 if(missing.size)paragraph('Certains caractères non couverts par la police sont conservés sous la forme [U+code Unicode]. Le fichier projet JSON conserve le texte original.',{size:8.2,leading:12.2,color:muted});
 const pages=pdf.getPages();
 pages.forEach((p,i)=>{
  p.drawLine({start:{x:M,y:M+23},end:{x:W-M,y:M+23},thickness:.7,color:line});
  const owner='Propriété du Lycée Ambroise Paré · Laval';
  const count=String(i+1)+' / '+String(pages.length);
  p.drawText(owner,{x:M,y:M+8,font:regular,size:7.5,color:muted});
  p.drawText(count,{x:W-M-regular.widthOfTextAtSize(count,8),y:M+8,font:regular,size:8,color:blue});
 });
 return pdf.save();
}
let librariesPromise,assetsPromise;
function loadScript(src,key){return new Promise((resolve,reject)=>{if(globalThis[key]){resolve(globalThis[key]);return;}const s=document.createElement('script');s.src=new URL(src,import.meta.url).href;s.onload=()=>resolve(globalThis[key]);s.onerror=()=>{s.remove();reject(new Error('Les composants PDF n’ont pas pu être chargés.'));};document.head.append(s);});}
async function getAssets(){if(!assetsPromise)assetsPromise=Promise.all(['./assets/DejaVuSans.ttf','./assets/DejaVuSans-Bold.ttf','./assets/logo-horizontal.jpg'].map(async url=>{const response=await fetch(new URL(url,import.meta.url));if(!response.ok)throw new Error('Une ressource PDF est indisponible.');return new Uint8Array(await response.arrayBuffer());})).then(([regular,bold,logo])=>({regular,bold,logo})).catch(err=>{assetsPromise=null;throw err;});return assetsPromise;}
export async function exportPDF(html,filename){
 if(!librariesPromise)librariesPromise=Promise.all([loadScript('./vendor/pdf-lib.min.js','PDFLib'),loadScript('./vendor/fontkit.umd.min.js','fontkit')]).catch(err=>{librariesPromise=null;throw err;});
 const [[lib,fontkit],assets]=await Promise.all([librariesPromise,getAssets()]);
 const bytes=await buildPDF(documentBlocksFromHTML(html),{...lib,fontkit,assets});
 const url=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));
 const a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
 return bytes.length;
}
