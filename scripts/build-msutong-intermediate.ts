import { readFileSync,writeFileSync } from 'node:fs';
import { pinyin } from 'pinyin-pro';
const root = process.cwd() + '/';
const rows: { id: number; bookSlug: string; lesson: number; hanzi: string; pinyin: string; meaning: string; category: string; meaningSource: string; sources: { kind: string; pdfPage: number; column: string; row: number }[] }[] = [];
for(let book=1;book<=4;book++){
 let page=0,column='',category='vocabulary',kind='index',ordinal=0;
 for(const line of readFileSync(root+`src/data/msutong/intermediate-reviewed/book${book}.tsv`,'utf8').trim().split('\n')){
  if(line.startsWith('@')){const h=line.slice(1).split(' ');page=Number(h[0]);column=h[1];category=h[2]??'vocabulary';kind=h[3]??'index';ordinal=0;continue;}
  const [hanzi,meaning,lesson,override]=line.split('|'); ordinal++;
  rows.push({id:300000+book*1000+rows.filter(r=>r.bookSlug===`quyen-${book}`).length,bookSlug:`quyen-${book}`,lesson:Number(lesson),hanzi,pinyin:override??pinyin(hanzi,{toneType:'symbol',nonZh:'consecutive'}),meaning,category,meaningSource:'editorial-vietnamese',sources:[{kind,pdfPage:page,column,row:ordinal}]});
 }
}
writeFileSync(root+'src/data/msutong/intermediate-vocabulary.json',JSON.stringify(rows,null,2)+'\n');
console.log(rows.length,[1,2,3,4].map(b=>rows.filter(r=>r.bookSlug===`quyen-${b}`).length));
