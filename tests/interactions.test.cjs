const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const vm=require('node:vm');

// Lightweight DOM doubles test event wiring and state; they do not render layouts.
class Element {
  constructor(){this.handlers={};this.children=[];this.attrs={};this.value='';this.hidden=false;this.textContent='';this.open=false;const classes=new Set();this.classList={add:v=>classes.add(v),remove:v=>classes.delete(v),contains:v=>classes.has(v),toggle:v=>{if(classes.has(v)){classes.delete(v);return false;}classes.add(v);return true;}};}
  addEventListener(type,fn){(this.handlers[type]??=[]).push(fn);}
  emit(type,event={}){for(const fn of this.handlers[type]||[])fn({target:this,preventDefault(){},...event});}
  setAttribute(key,value){this.attrs[key]=value;}
  append(...nodes){this.children.push(...nodes);}
  replaceChildren(...nodes){this.children=nodes;}
  get options(){return this.children;}
  focus(){this.focused=true;}
  scrollIntoView(options){this.scrolled=options;}
  showModal(){this.open=true;}
  close(){this.open=false;this.emit('close');}
  getBoundingClientRect(){return {left:0,right:100,top:0,bottom:100};}
}
function run(file,window,document){vm.runInNewContext(readFileSync('dist/'+file,'utf8'),{window,document,URLSearchParams,Intl,Date,Number});}

test('appointment close is scoped correctly when vehicle dialog precedes it',()=>{
  const menu=new Element(),nav=new Element(),appointment=new Element(),vehicleClose=new Element(),appointmentClose=new Element(),trigger=new Element(),link=new Element(),body=new Element(),doc=new Element();
  nav.querySelectorAll=()=>[link];appointment.querySelector=()=>appointmentClose;
  const nodes={'.menu-toggle':menu,'#navigation':nav,'#year':new Element(),'#appointment-dialog':appointment,'.dialog-close':vehicleClose};
  doc.querySelector=s=>nodes[s];doc.querySelectorAll=()=>[trigger];doc.body=body;
  const media=new Element();run('script.js',{matchMedia:()=>media},doc);
  menu.emit('click');assert.equal(menu.attrs['aria-expanded'],'true');
  trigger.emit('click');assert.equal(appointment.open,true);assert.equal(nav.classList.contains('open'),false);
  appointmentClose.emit('click');assert.equal(appointment.open,false);assert.equal(body.classList.contains('dialog-open'),false);
  trigger.emit('click');vehicleClose.emit('click');assert.equal(appointment.open,true);
  appointmentClose.emit('click');menu.emit('click');link.emit('click');assert.equal(nav.classList.contains('open'),false);
  menu.emit('click');doc.emit('keydown',{key:'Escape'});assert.equal(nav.classList.contains('open'),false);assert.equal(menu.focused,true);
  menu.emit('click');media.emit('change');assert.equal(menu.attrs['aria-expanded'],'false');
});

function estimator(){
  const form=new Element();form.elements={};for(const name of ['year','make','model','service','laborRate','partsLow','partsHigh','hoursLow','hoursHigh'])form.elements[name]=new Element();
  form.reportValidity=()=>true;form.reset=()=>{for(const field of Object.values(form.elements))field.value='';};
  const ids=['estimate-result','estimate-placeholder','estimate-error','estimate-status','service-scope','estimate-total','estimate-vehicle','estimate-service','estimate-parts','estimate-labor','estimate-rate','estimate-scope','new-estimate'];
  const nodes=Object.fromEntries(ids.map(id=>['#'+id,new Element()]));nodes['#repair-estimate-form']=form;
  const document={querySelector:s=>nodes[s],createElement:()=>new Element()};
  const window={matchMedia:q=>({matches:q.includes('max-width')||q.includes('reduced-motion')})};
  run('estimator-config.js',window,document);run('estimator.js',window,document);return {form,nodes,window};
}
test('estimator calculates all service presets and rejects invalid ranges',()=>{
  const {window}=estimator();
  for(const service of window.CABRERA_ESTIMATOR_CONFIG.services){const x=window.CABRERA_CALCULATE_ESTIMATE({laborRate:120,partsLow:service.parts[0],partsHigh:service.parts[1],hoursLow:service.hours[0],hoursHigh:service.hours[1]});assert.equal(x.low,service.parts[0]+120*service.hours[0]);assert.equal(x.high,service.parts[1]+120*service.hours[1]);}
  for(const bad of [NaN,Infinity,-1])assert.throws(()=>window.CABRERA_CALCULATE_ESTIMATE({laborRate:bad,partsLow:0,partsHigh:1,hoursLow:0,hoursHigh:1}));
  assert.throws(()=>window.CABRERA_CALCULATE_ESTIMATE({laborRate:120,partsLow:100,partsHigh:50,hoursLow:1,hoursHigh:2}));
});
test('estimator submit, edit, validation and reset preserve correct state',()=>{
  const {form,nodes}=estimator();const fields=form.elements;
  fields.service.value='struts';fields.service.emit('change');fields.year.value='2008';fields.make.value='BMW';fields.model.value='535xi';
  for(const key of ['laborRate','partsLow','partsHigh','hoursLow','hoursHigh'])fields[key].value=String(fields[key].value);
  form.emit('submit');assert.equal(nodes['#estimate-result'].hidden,false);assert.equal(nodes['#estimate-total'].textContent,'$540 – $1,200');assert.equal(nodes['#estimate-vehicle'].textContent,'2008 BMW 535xi');assert.equal(nodes['#estimate-result'].scrolled.behavior,'auto');
  form.emit('input');assert.equal(nodes['#estimate-result'].hidden,true);
  fields.partsHigh.value='1';form.emit('submit');assert.equal(nodes['#estimate-error'].hidden,false);
  const assumptions={open:false};form.emit('invalid',{target:{closest:()=>assumptions}});assert.equal(assumptions.open,true);
  nodes['#new-estimate'].emit('click');assert.equal(nodes['#estimate-error'].hidden,true);assert.equal(fields.year.focused,true);assert.equal(form.scrolled.behavior,'auto');
});

test('vehicle filters combine search, body, price and sort without changing inventory',()=>{
  const window={};run('autos.js',window,{querySelector:()=>null});
  const cars=[{id:'a',year:2018,make:'Toyota',model:'Camry',body:'Sedan',price:12000,mileage:80000},{id:'b',year:2021,make:'Toyota',model:'RAV4',body:'SUV',price:19000,mileage:30000},{id:'c',year:2020,make:'Honda',model:'Accord',body:'Sedan',price:null,mileage:50000}];
  const select=filters=>window.CABRERA_FILTER_INVENTORY(cars,{budget:'',...filters}).map(v=>v.id).join(',');
  assert.equal(select({query:' TOYOTA ',body:'Sedan',budget:'15000'}),'a');assert.equal(select({sort:'newest'}),'b,c,a');assert.equal(select({sort:'price-low'}),'a,b,c');assert.equal(select({sort:'price-high'}),'b,a,c');assert.equal(select({sort:'mileage'}),'b,c,a');assert.equal(select({query:'no match'}),'');assert.equal(cars.map(v=>v.id).join(','),'a,b,c');
});

test('inventory deep link opens the requested car and photos switch correctly',async()=>{
  const ids=['vehicle-grid','inventory-filters','vehicle-body','vehicle-search','vehicle-budget','vehicle-sort','vehicle-dialog','vehicle-detail-content','inventory-count','inventory-empty','inventory-no-matches','reset-filters','inventory-load-state','inventory-retry'];
  const nodes=Object.fromEntries(ids.map(id=>['#'+id,new Element()]));nodes['.vehicle-dialog-close']=new Element();nodes['#inventory-filters'].reset=()=>{};
  const body=new Element();const document={querySelector:s=>nodes[s],createElement:()=>new Element(),body};
  const car={id:'latest',year:2020,make:'Toyota',model:'Camry',price:12500,mileage:72000,images:['https://cdn.sanity.io/one.jpg','https://cdn.sanity.io/two.jpg']};
  let fails=false;const window={location:{search:'?vehicle=latest'},CABRERA_INVENTORY_SOURCE:{load:async()=>{if(fails)throw Error('offline');return {vehicles:[car]};}}};
  run('autos.js',window,document);await new Promise(resolve=>setImmediate(resolve));
  assert.equal(nodes['#vehicle-dialog'].open,true);assert.equal(nodes['#inventory-count'].textContent,'1 vehicle listed');assert.equal(nodes['#vehicle-grid'].children.length,1);
  const [photo,thumbs]=nodes['#vehicle-detail-content'].children;thumbs.children[1].emit('click');assert.equal(photo.src,car.images[1]);
  nodes['.vehicle-dialog-close'].emit('click');assert.equal(nodes['#vehicle-dialog'].open,false);assert.equal(body.classList.contains('dialog-open'),false);
  nodes['#vehicle-search'].value='missing';nodes['#vehicle-search'].emit('input');assert.equal(nodes['#inventory-no-matches'].hidden,false);
  fails=true;nodes['#inventory-retry'].emit('click');await new Promise(resolve=>setImmediate(resolve));assert.equal(nodes['#inventory-retry'].hidden,false);assert.equal(nodes['#vehicle-grid'].children.length,0);
  fails=false;nodes['#vehicle-search'].value='';nodes['#inventory-retry'].emit('click');await new Promise(resolve=>setImmediate(resolve));assert.equal(nodes['#inventory-retry'].hidden,true);assert.equal(nodes['#vehicle-grid'].children.length,1);
});
