import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { prepareData } from '../scripts/prepare-data.mjs';
import { publishedCatalog } from '../scripts/deployment-paths.mjs';
import { siteFiles } from '../scripts/site-files.mjs';

test('snapshot config extracts stills by view/clip/frame, reuses images, and includes frame-specific predictions', () => {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'club-stills-'));
  const write=(file,value)=>{const target=path.join(root,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,typeof value==='string'?value:JSON.stringify(value));};
  try {
    write('materials/content.json',{page:{banner:{enabled:false}}});
    write('materials/data/vidoes/face-on/0000.MP4','fixture');
    for(const side of ['before','after']) write(`materials/data/poses/${side}/face-on/0000.json`,{joints:['golf_club_head'],pred:[[[10,20]],[[30,40]],[[50,60]]]});
    write('materials/data/snapshot.json',{'0000':{'1':{golf_club_head:{before:'Before',after:'After'}}}});
    const calls=[];
    const options={probe:()=>({width:100,height:200,times:[0,.03,.06]}),preview:(source,destination,frame)=>{calls.push({source,destination,frame});fs.writeFileSync(destination,'still');}};
    const first=prepareData(root,options);
    assert.ok(fs.existsSync(path.join(root,'materials/data/snapshots/face-on/0000/1.jpg')));
    assert.equal(calls.filter(c=>c.frame===1).length,1);
    assert.deepEqual(first.snapshots[0].after.pred,[[[30,40]]]);
    assert.ok(siteFiles(root,first).has('materials/data/snapshot.json'));
    assert.ok(publishedCatalog(first).snapshots[0].image.startsWith('media/'));
    calls.length=0;prepareData(root,options);assert.equal(calls.length,0);
    write('materials/data/snapshot.json',{'0000':{'2':{golf_club_head:{after:'Updated selection'}}}});
    const changed=prepareData(root,options);
    assert.ok(fs.existsSync(path.join(root,'materials/data/snapshots/face-on/0000/2.jpg')));
    assert.deepEqual(changed.snapshots[0].after.pred,[[[50,60]]]);
  } finally { fs.rmSync(root,{recursive:true,force:true}); }
});
