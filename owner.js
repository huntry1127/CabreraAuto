(function(){
  'use strict';
  const config=window.CABRERA_INVENTORY_CONFIG||{};
  if(!config.projectId || !config.studioUrl)return;
  let url;
  try{url=new URL(config.studioUrl);if(url.protocol!=='https:' || url.username || url.password)return;}catch{return;}
  document.querySelector('#owner-status').textContent='Inventory editor connected';
  document.querySelector('#connection-title').textContent='Ready to manage your listings';
  document.querySelector('#owner-connection-copy').textContent='Sign in to your Sanity account to manage vehicles. Only invited project members can save and publish changes.';
  const link=document.querySelector('#owner-open');link.href=url.href;link.hidden=false;
})();
