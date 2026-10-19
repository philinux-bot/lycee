import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {buildPDF} from '../dist/pdf.mjs';
test('Les deux bibliothèques livrées au navigateur créent un PDF sans service externe',async()=>{
 const box={Uint8Array,ArrayBuffer,DataView,Uint16Array,Uint32Array,Int8Array,Int16Array,Int32Array,Float32Array,Float64Array,setTimeout,clearTimeout,console};box.window=box;box.self=box;
 vm.createContext(box);
 vm.runInContext(fs.readFileSync(new URL('../dist/vendor/pdf-lib.min.js',import.meta.url),'utf8'),box);
 vm.runInContext(fs.readFileSync(new URL('../dist/vendor/fontkit.umd.min.js',import.meta.url),'utf8'),box);
 assert(box.PDFLib?.PDFDocument);assert(box.fontkit?.create);
 const assets={regular:fs.readFileSync(new URL('../dist/assets/DejaVuSans.ttf',import.meta.url)),bold:fs.readFileSync(new URL('../dist/assets/DejaVuSans-Bold.ttf',import.meta.url)),logo:fs.readFileSync(new URL('../dist/assets/logo-horizontal.jpg',import.meta.url))};
 box.assets=assets;
 const helper=fs.readFileSync(new URL('../dist/pdf.mjs',import.meta.url),'utf8').replaceAll('export ','').replaceAll('import.meta.url',JSON.stringify('https://example.invalid/pdf.mjs'));
 vm.runInContext(helper,box);
 const bytes=await vm.runInContext("buildPDF({title:'Vérification des composants livrés',blocks:[{type:'paragraph',text:'Élève, cœur, œuvre, € et français : les caractères restent lisibles.'}]},{...PDFLib,fontkit,assets})",box);

 assert(bytes.length>10000);assert.equal((await box.PDFLib.PDFDocument.load(bytes)).getPageCount(),1);
});
