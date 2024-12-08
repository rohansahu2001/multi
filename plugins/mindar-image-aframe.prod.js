(()=>{const{Controller:t,UI:e}=window.MINDAR.IMAGE;AFRAME.registerSystem("mindar-image-system",{container:null,video:null,processingImage:!1,init:function(){this.anchorEntities=[]},tick:function(){},setup:function({imageTargetSrc:t,maxTrack:i,showStats:s,uiLoading:a,uiScanning:n,uiError:o,missTolerance:r,warmupTolerance:h,interpolationFactor:d}){this.imageTargetSrc=t,this.maxTrack=i,this.interpolationFactor=d,this.missTolerance=r,this.warmupTolerance=h,this.showStats=s,this.ui=new e({uiLoading:a,uiScanning:n,uiError:o})},registerAnchor:function(t,e){this.anchorEntities.push({el:t,targetIndex:e})},start:function(){this.container=this.el.sceneEl.parentNode,this.showStats&&(this.mainStats=new Stats,this.mainStats.showPanel(0),this.mainStats.domElement.style.cssText="position:absolute;top:0px;left:0px;z-index:999",this.container.appendChild(this.mainStats.domElement)),this.ui.showLoading(),this._startVideo()},switchTarget:function(t){this.controller.interestedTargetIndex=t},stop:function(){this.pause(),this.video.srcObject.getTracks().forEach((function(t){t.stop()})),this.video.remove()},pause:function(t=!1){t||this.video.pause(),this.controller.stopProcessVideo()},unpause:function(){this.video.play(),this.controller.processVideo(this.video)},_startVideo:function(){if(this.video=document.createElement("video"),this.video.setAttribute("autoplay",""),this.video.setAttribute("muted",""),this.video.setAttribute("playsinline",""),this.video.style.position="absolute",this.video.style.top="0px",this.video.style.left="0px",this.video.style.zIndex="-2",this.container.appendChild(this.video),!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)return this.el.emit("arError",{error:"VIDEO_FAIL"}),void this.ui.showCompatibility();navigator.mediaDevices.getUserMedia({audio:!1,video:{facingMode:"environment"}}).then((t=>{this.video.addEventListener("loadedmetadata",(()=>{this.video.setAttribute("width",this.video.videoWidth),this.video.setAttribute("height",this.video.videoHeight),this._startAR()})),this.video.srcObject=t})).catch((t=>{console.log("getUserMedia error",t),this.el.emit("arError",{error:"VIDEO_FAIL"})}))},_startAR:async function(){const e=this.video;this.container,this.controller=new t({inputWidth:e.videoWidth,inputHeight:e.videoHeight,maxTrack:this.maxTrack,interpolationFactor:this.interpolationFactor,missTolerance:this.missTolerance,warmupTolerance:this.warmupTolerance,onUpdate:t=>{if("processDone"===t.type)this.mainStats&&this.mainStats.update();else if("updateMatrix"===t.type){const{targetIndex:e,worldMatrix:i}=t;for(let t=0;t<this.anchorEntities.length;t++)this.anchorEntities[t].targetIndex===e&&(this.anchorEntities[t].el.updateWorldMatrix(i),i&&this.ui.hideScanning())}}}),this._resize(),window.addEventListener("resize",this._resize.bind(this));const{dimensions:i}=await this.controller.addImageTargets(this.imageTargetSrc);for(let t=0;t<this.anchorEntities.length;t++){const{el:e,targetIndex:s}=this.anchorEntities[t];s<i.length&&e.setupMarker(i[s])}await this.controller.dummyRun(this.video),this.el.emit("arReady"),this.ui.hideLoading(),this.ui.showScanning(),this.controller.processVideo(this.video)},_resize:function(){const t=this.video,e=this.container;let i,s;const a=t.videoWidth/t.videoHeight;a>e.clientWidth/e.clientHeight?(s=e.clientHeight,i=s*a):(i=e.clientWidth,s=i/a);const n=this.controller.getProjectionMatrix(),o=2*Math.atan(1/n[5]/s*e.clientHeight)*180/Math.PI,r=n[14]/(n[10]-1),h=n[14]/(n[10]+1),d=(n[5],n[0],e.clientWidth/e.clientHeight),l=e.getElementsByTagName("a-camera")[0].getObject3D("camera");l.fov=o,l.aspect=d,l.near=r,l.far=h,l.updateProjectionMatrix(),this.video.style.top=-(s-e.clientHeight)/2+"px",this.video.style.left=-(i-e.clientWidth)/2+"px",this.video.style.width=i+"px",this.video.style.height=s+"px"}}),AFRAME.registerComponent("mindar-image",{dependencies:["mindar-image-system"],schema:{imageTargetSrc:{type:"string"},maxTrack:{type:"int",default:1},interpolationFactor:{type:"int",default:-1},missTolerance:{type:"int",default:-1},warmupTolerance:{type:"int",default:-1},showStats:{type:"boolean",default:!1},autoStart:{type:"boolean",default:!0},uiLoading:{type:"string",default:"yes"},uiScanning:{type:"string",default:"yes"},uiError:{type:"string",default:"yes"}},init:function(){const t=this.el.sceneEl.systems["mindar-image-system"];t.setup({imageTargetSrc:this.data.imageTargetSrc,maxTrack:this.data.maxTrack,interpolationFactor:-1===this.data.interpolationFactor?null:this.data.interpolationFactor,missTolerance:-1===this.data.missTolerance?null:this.data.missTolerance,warmupTolerance:-1===this.data.warmupTolerance?null:this.data.warmupTolerance,showStats:this.data.showStats,uiLoading:this.data.uiLoading,uiScanning:this.data.uiScanning,uiError:this.data.uiError}),this.data.autoStart&&this.el.sceneEl.addEventListener("renderstart",(()=>{t.start()}))}}),AFRAME.registerComponent("mindar-image-target",{dependencies:["mindar-image-system"],schema:{targetIndex:{type:"number"}},postMatrix:null,init:function(){this.el.sceneEl.systems["mindar-image-system"].registerAnchor(this,this.data.targetIndex);const t=this.el.object3D;t.visible=!1,t.matrixAutoUpdate=!1},setupMarker([t,e]){const i=new AFRAME.THREE.Vector3,s=new AFRAME.THREE.Quaternion,a=new AFRAME.THREE.Vector3;i.x=t/2,i.y=t/2+(e-t)/2,a.x=t,a.y=t,a.z=t,this.postMatrix=new AFRAME.THREE.Matrix4,this.postMatrix.compose(i,s,a)},updateWorldMatrix(t){if(this.el.object3D.visible||null===t?this.el.object3D.visible&&null===t&&this.el.emit("targetLost"):this.el.emit("targetFound"),this.el.object3D.visible=null!==t,null!==t){var e=new AFRAME.THREE.Matrix4;e.elements=t,e.multiply(this.postMatrix),this.el.object3D.matrix=e}}})})();