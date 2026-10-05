import {defineType, defineField, defineArrayMember} from 'sanity';
export default defineType({
  name: 'vehicle', title: 'Vehicle', type: 'document',
  groups: [
    {name:'listing',title:'Listing',default:true},
    {name:'photos',title:'Photos'},
    {name:'details',title:'Details'}
  ],
  initialValue: {status:'hidden',features:[]},
  fields: [
    defineField({name:'status',title:'Availability',type:'string',group:'listing',description:'Available appears on the website after Publish. Sold and Hidden stay off the public page. Unpublished drafts are never listed.',options:{list:[{title:'Available',value:'available'},{title:'Sold',value:'sold'},{title:'Hidden',value:'hidden'}],layout:'radio'},validation:R=>R.required()}),
    defineField({name:'year',title:'Year',type:'number',group:'listing',validation:R=>R.required().integer().min(1900).max(new Date().getFullYear()+2)}),
    defineField({name:'make',title:'Make',type:'string',group:'listing',validation:R=>R.required().max(60)}),
    defineField({name:'model',title:'Model',type:'string',group:'listing',validation:R=>R.required().max(100)}),
    defineField({name:'trim',title:'Trim / edition',type:'string',group:'listing',validation:R=>R.max(100)}),
    defineField({name:'price',title:'Asking price ($)',type:'number',group:'listing',description:'Leave blank to show “Call for price.”',validation:R=>R.min(0).precision(2)}),
    defineField({name:'mileage',title:'Mileage',type:'number',group:'listing',validation:R=>R.required().integer().min(0)}),
    defineField({name:'description',title:'Description',type:'text',rows:5,group:'listing',description:'Describe condition, recent maintenance, and what a buyer should know. Only include verified details.',validation:R=>R.max(4000)}),
    defineField({name:'photos',title:'Vehicle photos',type:'array',group:'photos',description:'Upload from your phone. Drag to reorder; the first photo is the cover. Include only photos you may publish. Photos stored here can be publicly accessed.',of:[defineArrayMember({type:'image',options:{hotspot:true},fields:[defineField({name:'alt',title:'Photo description',type:'string',description:'For example: front three-quarter view.'})]})],validation:R=>R.max(20).custom((photos,context)=>context.document?.status==='available' && !photos?.length ? 'Add at least one photo before listing a vehicle as Available.' : true)}),
    defineField({name:'body',title:'Body type',type:'string',group:'details',options:{list:['Sedan','SUV','Truck','Coupe','Hatchback','Wagon','Van','Convertible','Other']}}),
    defineField({name:'transmission',title:'Transmission',type:'string',group:'details',options:{list:['Automatic','Manual','CVT','Other']}}),
    defineField({name:'fuel',title:'Fuel',type:'string',group:'details',options:{list:['Gasoline','Diesel','Hybrid','Plug-in hybrid','Electric','Other']}}),
    defineField({name:'exterior',title:'Exterior color',type:'string',group:'details',validation:R=>R.max(80)}),
    defineField({name:'features',title:'Features',type:'array',group:'details',of:[defineArrayMember({type:'string'})],validation:R=>R.max(30)})
  ],
  orderings:[{title:'Recently updated',name:'updated',by:[{field:'_updatedAt',direction:'desc'}]}],
  preview:{select:{year:'year',make:'make',model:'model',status:'status',price:'price',media:'photos.0'},prepare({year,make,model,status,price,media}){return {title:[year,make,model].filter(Boolean).join(' ')||'New vehicle',subtitle:[status||'Hidden',typeof price==='number'?new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(price):'Call for price'].join(' · '),media};}}
});
