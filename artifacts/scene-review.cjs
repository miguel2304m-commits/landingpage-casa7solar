const { chromium } = require('@playwright/test');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--use-angle=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const messages=[], failures=[], requests=[];
 page.on('console',msg=>messages.push({type:msg.type(),text:msg.text()}));
 page.on('pageerror',error=>messages.push({type:'pageerror',text:error.message}));
 page.on('requestfailed',r=>failures.push({url:r.url(),failure:r.failure()}));
 page.on('response',r=>{if(r.url().includes('_next'))requests.push({status:r.status(),url:r.url()})});
 await page.addInitScript(()=>{
   window.__draws=0;
   for(const name of ['drawArrays','drawElements','drawArraysInstanced','drawElementsInstanced']){
     const fn=WebGL2RenderingContext.prototype[name];
     WebGL2RenderingContext.prototype[name]=function(...args){window.__draws++;return fn.apply(this,args)};
   }
 });
 await page.goto('http://127.0.0.1:3001',{waitUntil:'networkidle',timeout:90000});
 await page.waitForTimeout(12000);
 console.log(JSON.stringify({messages,failures,requests,info:await page.evaluate(()=>({canvases:document.querySelectorAll('canvas').length,draws:window.__draws,hero:document.querySelector('.hero-scene').innerHTML.slice(0,1500),states:document.readyState,scriptCount:document.scripts.length}))},null,2));
 await browser.close();
})();

