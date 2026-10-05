(function(){
  'use strict';
  const config=window.CABRERA_INVENTORY_CONFIG||{};
  if(!config.projectId || !config.studioUrl)return;
  let url;
  try{url=new URL(config.studioUrl);if(url.protocol!=='https:' || url.username || url.password)return;}catch{return;}
  document.querySelector('#owner-status').textContent=config.editorReady ? 'Inventory editor connected' : 'Editor permission pending';
  document.querySelector('#connection-title').textContent=config.editorReady ? 'Ready to manage your listings' : 'Your editor is deployed';
  document.querySelector('#owner-connection-copy').textContent=config.editorReady ? 'Sign in to your Sanity account to manage vehicles. Only invited project members can save and publish changes.' : 'The website is connected to inventory. The standalone editor still needs authenticated access allowed in Sanity before it can save listings.';
  const link=document.querySelector('#owner-open');link.href=url.href;link.hidden=false;
})();
