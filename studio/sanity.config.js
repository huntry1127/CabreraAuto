import {defineConfig} from 'sanity';
import {structureTool} from 'sanity/structure';
import vehicle from './schemaTypes/vehicle.js';
const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
if (!projectId) throw new Error('Set SANITY_STUDIO_PROJECT_ID in studio/.env.local to connect the owner’s Sanity project.');
export default defineConfig({
  name: 'cabrera-inventory', title: 'Cabrera · Vehicle inventory',
  projectId, dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [structureTool({structure: S => S.list().title('Vehicle inventory').items([
    S.listItem().title('All vehicles').child(S.documentTypeList('vehicle').title('All vehicles')),
    ...[['Available','available'],['Sold','sold'],['Hidden','hidden']].map(([label,status]) =>
      S.listItem().title(label).child(S.documentList().title(label).schemaType('vehicle').filter('_type == "vehicle" && status == $status').params({status})))
  ])})],
  schema: {types: [vehicle]}
});
