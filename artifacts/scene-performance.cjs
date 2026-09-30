const { chromium }=require('@playwright/test');
const fs=require('fs');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
 const report={};
 async function newPage(opts={}){
  const page=await browser.newPage({viewport:{width:1440,height:1000},...opts});
  page.messages=[]; page.on('console',m=>{if(['warning','error'].includes(m.type()))page.messages.push({type:m.type(),text:m.text()})}); page.on('pageerror',e=>page.messages.push({type:'pageerror',text:e.message}));
  await page.addInitScript(()=>{window.__glStats=[];for(const name of ['clear','drawArrays','drawElements','drawArraysInstanced','drawElementsInstanced']){const fn=WebGL2RenderingContext.prototype[name];WebGL2RenderingContext.prototype[name]=function(...args){let record=window.__glStats.find(r=>r.canvas===this.canvas);if(!record){record={canvas:this.canvas,draws:0,clears:0};window.__glStats.push(record)}record[name==='clear'?'clears':'draws']++;return fn.apply(this,args)}}});
  return page;
 }
 async function read(page){return page.evaluate(()=>window.__glStats.filter(r=>r.canvas.isConnected).map(r=>({scene:r.canvas.closest('.hero-scene')?'hero':'house',draws:r.draws,clears:r.clears,width:r.canvas.width,height:r.canvas.height})));}
 const page=await newPage();await page.goto('http://127.0.0.1:3001',{waitUntil:'networkidle'});await page.waitForTimeout(5000);const before=await read(page);await page.waitForTimeout(2500);report.desktop={before,after:await read(page),warnings:page.messages};
 await page.screenshot({path:'artifacts/scene-desktop-review.png'});
 await page.locator('.house-experience').scrollIntoViewIfNeeded();await page.waitForTimeout(1800);const hBefore=await read(page);await page.waitForTimeout(2500);report.house={before:hBefore,after:await read(page)};await page.locator('.house-experience').screenshot({path:'artifacts/scene-house-review.png'});
 await page.evaluate(()=>window.scrollTo({top:document.body.scrollHeight,behavior:'instant'}));await page.waitForTimeout(1500);const offBefore=await read(page);await page.waitForTimeout(1500);report.offscreen={before:offBefore,after:await read(page)};
 await page.evaluate(()=>{const canvas=document.querySelector('.hero-scene canvas');canvas.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext()});await page.waitForTimeout(800);report.contextLost=await page.evaluate(()=>({heroCanvas:!!document.querySelector('.hero-scene canvas'),heroFallback:!!document.querySelector('.hero-scene [role="img"] > svg')}));await page.close();
 const reduced=await newPage({reducedMotion:'reduce'});await reduced.goto('http://127.0.0.1:3001',{waitUntil:'networkidle'});await reduced.waitForTimeout(3500);const rBefore=await read(reduced);await reduced.waitForTimeout(1800);report.reducedMotion={before:rBefore,after:await read(reduced),warnings:reduced.messages};await reduced.close();
 const unsupported=await newPage();await unsupported.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type==='webgl2'||type==='webgl'?null:original.call(this,type,...args)}});await unsupported.goto('http://127.0.0.1:3001',{waitUntil:'networkidle'});await unsupported.waitForTimeout(1500);report.unsupported={...await unsupported.evaluate(()=>({canvasCount:document.querySelectorAll('canvas').length,heroSVG:!!document.querySelector('.hero-scene [role="img"] > svg'),houseSVG:!!document.querySelector('.house-canvas [role="img"] > svg')})),warnings:unsupported.messages};await unsupported.close();
 fs.writeFileSync('artifacts/scene-performance.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();
})();
