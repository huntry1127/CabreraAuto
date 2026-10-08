const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync,existsSync}=require('node:fs');
const vm=require('node:vm');
const path=existsSync('dist/latest-car.js')?'dist/latest-car.js':'latest-car.js';
const window={};
vm.runInNewContext(readFileSync(path,'utf8'),{window,document:{querySelector:()=>null}});
const select=window.CABRERA_SELECT_LATEST;
test('latest car uses creation date even when an older listing was recently edited',()=>{
 const older={id:'older',status:'available',createdAt:'2026-10-01',updatedAt:'2026-10-08'};
 const newer={id:'newer',status:'available',createdAt:'2026-10-07',updatedAt:'2026-10-07'};
 assert.equal(select([older,newer]).id,'newer');
});
test('sold, hidden and draft records cannot become the featured car',()=>{
 const car={id:'available',status:'available',createdAt:'2026-10-01'};
 assert.equal(select([{...car,id:'sold',status:'sold',createdAt:'2026-10-08'},{...car,id:'hidden',status:'hidden'},{...car,id:'drafts.new'},car]).id,'available');
 assert.equal(select([]),null);
});
