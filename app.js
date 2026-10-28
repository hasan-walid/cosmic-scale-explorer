"use strict";

const AU_KM = 149597870.7;
const SUN_DIAMETER_KM = 1391900;
const EARTH_DIAMETER_KM = 12742;
const PLANETS = [
  {name:"Mercury",diameterKm:4866,au:0.387,modelCm:0.08,color:"#a9a6a2",gradient:"radial-gradient(circle at 30% 28%,#ddd8cf,#8b8987 57%,#55565e)",detail:"radial-gradient(circle at 70% 30%,#3334 0 4%,transparent 5%),radial-gradient(circle at 36% 65%,#3335 0 7%,transparent 8%)",fact:"The smallest planet is covered in craters, like our Moon."},
  {name:"Venus",diameterKm:12106,au:0.723,modelCm:0.21,color:"#dfb57e",gradient:"repeating-linear-gradient(165deg,#e4c797 0 22px,#c9936d 33px,#edcf9d 48px)",detail:"radial-gradient(circle at 35% 30%,#fff6,transparent 55%)",fact:"Its thick clouds trap heat, making Venus hotter than Mercury."},
  {name:"Earth",diameterKm:12742,au:1,modelCm:0.22,color:"#4f93bd",gradient:"radial-gradient(circle at 31% 27%,#80cfbd 0 7%,transparent 8%),radial-gradient(ellipse at 65% 60%,#5bb09a 0 18%,transparent 19%),radial-gradient(ellipse at 30% 70%,#407f6e 0 12%,transparent 13%),linear-gradient(135deg,#74b6d7,#225185)",detail:"repeating-linear-gradient(165deg,transparent 0 26px,#fff7 30px 36px,transparent 43px 65px)",fact:"Our ocean world is the only place we know of with life."},
  {name:"Mars",diameterKm:6760,au:1.524,modelCm:0.12,color:"#c36d51",gradient:"radial-gradient(circle at 32% 25%,#edaa78,#c35e48 55%,#7b3739)",detail:"radial-gradient(ellipse at 65% 65%,#512a2a88 0 11%,transparent 12%)",fact:"Mars has the tallest volcano known in the Solar System."},
  {name:"Jupiter",diameterKm:142984,au:5.203,modelCm:2.56,color:"#cba785",gradient:"repeating-linear-gradient(177deg,#e0c5a2 0 17px,#b7856d 21px 32px,#e9d4b4 38px 49px,#9d6c5e 52px 58px)",detail:"radial-gradient(ellipse at 68% 63%,#9c4d42 0 7%,transparent 8%)",fact:"Its Great Red Spot is a giant storm that has lasted for centuries."},
  {name:"Saturn",diameterKm:116438,au:9.537,modelCm:2.09,color:"#d1ba88",gradient:"repeating-linear-gradient(178deg,#ead5a2 0 22px,#caa677 26px 36px,#e4c99c 42px 59px)",detail:"radial-gradient(circle at 30% 25%,#fff5,transparent 60%)",fact:"Saturn's dazzling rings are made of countless pieces of ice and rock."},
  {name:"Uranus",diameterKm:46940,au:19.19,modelCm:0.84,color:"#92d8dd",gradient:"linear-gradient(145deg,#c3ebec,#7ccbd8 65%,#4e96b0)",detail:"linear-gradient(90deg,transparent,#fff4,transparent)",fact:"Uranus rotates on its side, rolling around the Sun."},
  {name:"Neptune",diameterKm:45432,au:30.07,modelCm:0.81,color:"#567fc9",gradient:"linear-gradient(145deg,#81a8e8,#3d6bb8 58%,#203e87)",detail:"radial-gradient(ellipse at 65% 56%,#1b3872a0 0 10%,transparent 11%)",fact:"Winds on Neptune can blow faster than the speed of sound."}
];

const $ = id => document.getElementById(id);
const formatLargeNumber = n => new Intl.NumberFormat("en-US",{maximumFractionDigits:0}).format(Math.round(n));
const formatStudentMillions = n => `${new Intl.NumberFormat("en-US",{maximumFractionDigits:2}).format(n/1000000)} million`;
const formatDecimal = (n,max=1) => new Intl.NumberFormat("en-US",{maximumFractionDigits:max}).format(n);
function normalizeStudentName(value){return String(value??"").trim().replace(/\s+/g," ").slice(0,40)}
function normalizeHeight(unit,cm,feet,inches){return unit==="ft" ? (Number(feet)*12+Number(inches))*0.0254 : Number(cm)/100}
function validateHeight(metres){return Number.isFinite(metres)&&metres>=0.5&&metres<=2.5}
function getStudentsAcrossDiameter(planet,heightMetres){return planet.diameterKm*1000/heightMetres}
function getHeightCubeVolumeComparison(planet,heightMetres){const diameterMetres=planet.diameterKm*1000;return (Math.PI/6)*diameterMetres**3/heightMetres**3}
function getPlanetDiameterRelativeToEarth(planet){return planet.diameterKm/EARTH_DIAMETER_KM}
function getScaledDistanceFromSun(planet,metresPerAU){return planet.au*metresPerAU}
function getScaledDistanceBetweenPlanets(planetIndex,metresPerAU){return getScaledDistanceFromSun(PLANETS[planetIndex],metresPerAU)-(planetIndex===0?0:getScaledDistanceFromSun(PLANETS[planetIndex-1],metresPerAU))}
function getScaledPlanetDiameter(diameterKm,metresPerAU){return diameterKm*metresPerAU/AU_KM}
function getMetresPerAUFromModelDiameter(diameterKm,modelDiameterMm){return modelDiameterMm*AU_KM/(diameterKm*1000)}
function getShrinkFactor(diameterKm,modelDiameterMm){return diameterKm*1000000/modelDiameterMm}
function getScaledHumanHeightNm(heightMetres,shrinkFactor=MODEL_SHRINK_FACTOR){return heightMetres/shrinkFactor*1000000000}
const SUN_MODEL_DIAMETER_MM=250;
const MODEL_SHRINK_FACTOR=getShrinkFactor(SUN_DIAMETER_KM,SUN_MODEL_DIAMETER_MM);
const WALK_METRES_PER_AU=getMetresPerAUFromModelDiameter(SUN_DIAMETER_KM,SUN_MODEL_DIAMETER_MM);
function getSizeBarPercent(planet){return 100*planet.diameterKm/PLANETS[4].diameterKm}
function getModelDiameterCm(planet,sunModelCm){const exact=planet.diameterKm/SUN_DIAMETER_KM*sunModelCm;return Math.floor(exact*100+1e-9)/100}
function getLinearAxisPosition(au,left,width,maxAU=PLANETS[7].au){return left+(au/maxAU)*width}
function formatWalkMetres(metres){return `${formatDecimal(metres,metres<1?2:1)} m`}
function formatModelCm(cm){return `${cm.toFixed(cm>=10?1:2)} cm`}
function generatePredictionChoices(correct){const rounded=Math.round(correct);const wrong1=Math.round(correct*0.12);const wrong2=Math.round(correct*8.5);return [wrong1,rounded,wrong2]}
const state={heightMetres:1.5,heightEntered:false,studentName:"",unit:"cm",planetIndex:2,activity:"size",sizeSunCm:SUN_MODEL_DIAMETER_MM/10,metresPerAU:WALK_METRES_PER_AU,zoom:1,sort:"order",prediction:false,answerHidden:false,predictionChoice:null,predictionRevealed:false,tourIndex:0,tourRevealed:false,tourGuess:null};
const prefersReducedMotion=()=>window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function savePrefs(){try{localStorage.setItem("cosmic-explorer",JSON.stringify({heightMetres:state.heightMetres,heightEntered:state.heightEntered,unit:state.unit,prediction:state.prediction}))}catch{}}
function loadPrefs(){try{const p=JSON.parse(localStorage.getItem("cosmic-explorer")||"{}");if(p.heightEntered===true&&validateHeight(p.heightMetres)){state.heightMetres=p.heightMetres;state.heightEntered=true}if(p.unit==="ft"||p.unit==="cm")state.unit=p.unit;state.prediction=!!p.prediction;}catch{}}
function planetStyle(planet){return `--planet-bg:${planet.gradient}`}
function dotMarkup(planet){return `<span class="planet-dot ${planet.name.toLowerCase()}" style="${planetStyle(planet)}" aria-hidden="true"></span>`}
function updateHeightDisplay(){const cm=state.heightMetres*100;$("student-height-label").textContent=`${formatDecimal(cm,1)} cm`;$("feature-height").textContent=`${formatDecimal(state.heightMetres,2)} m`}
function resetPrediction(){state.predictionChoice=null;state.predictionRevealed=false;state.answerHidden=state.prediction;}
function renderSolarSystemOverview(){const wrap=$("planet-selector");wrap.innerHTML=PLANETS.map((p,i)=>`<button type="button" class="planet-choice ${i===state.planetIndex?"active":""}" data-planet="${i}" aria-pressed="${i===state.planetIndex}">${dotMarkup(p)}<span>${p.name}</span></button>`).join("");wrap.querySelectorAll("button").forEach(button=>button.addEventListener("click",()=>selectPlanet(Number(button.dataset.planet))))}
function selectPlanet(index){state.planetIndex=(index+PLANETS.length)%PLANETS.length;resetPrediction();renderPlanetComparison();renderSolarSystemOverview()}
function renderPrediction(count,planet){const area=$("prediction-area");if(!state.prediction){area.innerHTML="";$("answer-area").hidden=state.answerHidden;return}const choices=generatePredictionChoices(count),heightLabel=state.heightEntered?"your height":"the example height";area.innerHTML=`<p><strong>Make a prediction:</strong> How many times does ${heightLabel} fit across ${planet.name}?</p><div class="prediction-choices">${choices.map((n,i)=>`<button type="button" class="prediction-choice ${state.predictionChoice===i?"selected":""}" data-choice="${i}" aria-pressed="${state.predictionChoice===i}">${formatStudentMillions(n)}</button>`).join("")}</div><button class="button primary" id="reveal-prediction" type="button">Reveal answer →</button>${state.predictionRevealed?`<p class="prediction-feedback">${state.predictionChoice===1?"Great estimate!":"A good guess! Planet sizes can surprise us."} The result is below.</p>`:""}`;area.querySelectorAll("[data-choice]").forEach(button=>button.addEventListener("click",()=>{state.predictionChoice=Number(button.dataset.choice);renderPrediction(count,planet)}));$("reveal-prediction").addEventListener("click",()=>{state.predictionRevealed=true;state.answerHidden=false;renderPrediction(count,planet);syncAnswerToggle()});$("answer-area").hidden=state.answerHidden&&!state.predictionRevealed}
function syncAnswerToggle(){$("answer-toggle").textContent=state.answerHidden?"Reveal answer":"Hide answer"}
function renderShrinkVisualization(){
  const planet=PLANETS[state.planetIndex];
  const shrinkFactor=getShrinkFactor(SUN_DIAMETER_KM,state.sizeSunCm*10);
  const modelCm=getModelDiameterCm(planet,state.sizeSunCm);
  const iconDiameter=Math.max(5,Math.min(145,110*getSizeBarPercent(planet)/100*state.sizeSunCm/25));
  $("shrink-title").textContent=`Shrink ${planet.name} for our model`;
  $("shrink-real-diameter").textContent=`${formatLargeNumber(planet.diameterKm)} km`;
  $("shrink-model-diameter").textContent=`≈ ${modelCm.toFixed(2)} cm`;
  $("activity-shrink-factor").textContent=formatLargeNumber(shrinkFactor);
  $("shrunken-height").textContent=`${formatDecimal(getScaledHumanHeightNm(state.heightMetres,shrinkFactor),2)} nanometres`;
  $("shrink-real-art").style.setProperty("--planet-bg",planet.gradient);
  $("shrink-model-art").style.setProperty("--planet-bg",planet.gradient);
  $("shrink-model-art").style.width=`${iconDiameter}px`;
  $("shrink-model-art").style.height=`${iconDiameter}px`;
  $("shrink-real-art").setAttribute("aria-label",`Illustration of real ${planet.name}; screen size is schematic`);
  $("shrink-model-art").setAttribute("aria-label",`Model globe of ${planet.name}, about ${modelCm.toFixed(2)} cm across`);
}
function renderPlanetComparison(){
  const p=PLANETS[state.planetIndex],count=getStudentsAcrossDiameter(p,state.heightMetres);
  $("planet-index").textContent=`PLANET ${String(state.planetIndex+1).padStart(2,"0")} / 08`;
  $("planet-name").textContent=p.name;
  $("planet-fact").textContent=p.fact;
  $("feature-diameter").textContent=`${formatLargeNumber(p.diameterKm)} km`;
  $("earth-ratio").textContent=`${formatDecimal(getPlanetDiameterRelativeToEarth(p),2)}×`;
  $("feature-planet").className=`feature-planet planet-${p.name.toLowerCase()}`;
  $("feature-planet").style.setProperty("--planet-bg",p.gradient);
  $("feature-planet").style.setProperty("--planet-detail",p.detail);
  $("feature-planet").setAttribute("aria-label",`Artistic illustration of ${p.name}; visual size is not to scale`);
  $("student-card-name").textContent=state.studentName||(state.heightEntered?"Your height":"Example height");
  $("result-title").textContent=`${p.name} compared with ${state.studentName||(state.heightEntered?"you":"an example student")}`;
  $("student-count").textContent=formatStudentMillions(count);
  $("count-context").textContent=state.heightEntered?"times your height":"times an example height";
  $("math-detail").textContent=`${formatLargeNumber(p.diameterKm)} km × 1,000 m/km ÷ ${formatDecimal(state.heightMetres,6)} m = ${formatStudentMillions(count)} student heights`;
  renderPrediction(count,p);updateHeightDisplay();renderShrinkVisualization();renderSizeComparison();syncAnswerToggle();
}
function renderSizeComparison(){
  const order=state.sort==="size"?[...PLANETS].sort((a,b)=>b.diameterKm-a.diameterKm):PLANETS;
  $("size-bars").innerHTML=order.map(planet=>`<div class="bar-row"><strong>${planet.name}</strong><div class="bar-track" role="img" aria-label="${planet.name} is ${formatLargeNumber(planet.diameterKm)} kilometres wide"><div class="bar-fill" style="width:${getSizeBarPercent(planet)}%;${planetStyle(planet)}"></div></div><small>${formatLargeNumber(planet.diameterKm)} km · ${formatStudentMillions(getStudentsAcrossDiameter(planet,state.heightMetres))} heights</small></div>`).join("");
}
function setActivity(activity){state.activity=activity;$("activity-size").hidden=activity!=="size";$("activity-walk").hidden=activity!=="walk";for(const id of ["size","walk"]){const tab=$(`tab-${id}`);tab.classList.toggle("active",id===activity);tab.setAttribute("aria-selected",id===activity)}window.scrollTo({top:$("main").offsetTop,behavior:prefersReducedMotion()?"auto":"smooth"})}
function setUnit(unit){state.unit=unit;$("cm-fields").hidden=unit!=="cm";$("ft-fields").hidden=unit!=="ft";document.querySelectorAll("[data-unit]").forEach(b=>{const active=b.dataset.unit===unit;b.classList.toggle("selected",active);b.setAttribute("aria-pressed",active)});savePrefs()}
function syncHeightInputs(){const cm=state.heightMetres*100;$("height-cm").value=Number(cm.toFixed(1));const totalInches=cm/2.54;const feet=Math.floor(totalInches/12);$("height-ft").value=feet;$("height-in").value=Number((totalInches-feet*12).toFixed(1))}
function applyHeight(){const feet=Number($("height-ft").value),inches=Number($("height-in").value);const validImperial=state.unit!=="ft"||(Number.isInteger(feet)&&feet>=1&&feet<=8&&Number.isFinite(inches)&&inches>=0&&inches<12&&$("height-ft").value!==""&&$("height-in").value!=="");const m=normalizeHeight(state.unit,$("height-cm").value,$("height-ft").value,$("height-in").value);if(!validImperial||!validateHeight(m)){$("height-error").textContent="Enter a height from 50 to 250 cm. For feet and inches, use 1–8 feet and 0–11.9 inches.";$("height-error").hidden=false;return false}state.heightMetres=m;state.heightEntered=true;state.studentName=normalizeStudentName($("student-name").value);$("student-name").value=state.studentName;$("height-error").hidden=true;syncHeightInputs();savePrefs();resetPrediction();renderPlanetComparison();renderAUExplanation();$("planet-feature").scrollIntoView({behavior:prefersReducedMotion()?"auto":"smooth",block:"start"});return true}
function renderDistanceAxis(){const width=Math.round(Math.max(1050,1050*state.zoom)),left=70,right=width-70,span=right-left,maxAU=PLANETS[7].au;const x=au=>getLinearAxisPosition(au,left,span,maxAU);let svg=`<rect width="${width}" height="270" fill="transparent"/><line x1="${left}" y1="175" x2="${right}" y2="175" stroke="#a9bad1" stroke-width="2"/>`;for(let au=0;au<=30;au+=5){const px=x(au);svg+=`<line x1="${px}" y1="169" x2="${px}" y2="183" stroke="#a9bad1"/><text x="${px}" y="209" text-anchor="middle" fill="#a9bad1" font-size="12">${au} AU</text>`}svg+=`<circle cx="${left}" cy="175" r="13" fill="#ffc06c"/><text x="${left}" y="151" text-anchor="middle" fill="#ffcf85" font-size="13" font-weight="bold">Sun</text>`;PLANETS.forEach((p,i)=>{const px=x(p.au),inner=i<4,labelX=inner?Math.max(112,px+58+i*31):px,labelY=inner?47+i*29:(i%2?110:78);svg+=`<g data-axis-planet="${i}" tabindex="0" role="button" aria-label="${p.name}, ${formatWalkMetres(getScaledDistanceFromSun(p,state.metresPerAU))} from the Sun"><line x1="${px}" y1="${175-(inner?0:12)}" x2="${labelX}" y2="${labelY+8}" stroke="#68809d" stroke-width="1"/><circle cx="${px}" cy="175" r="${i===state.tourIndex-1?9:6}" fill="${p.color}" stroke="#dce8f5" stroke-width="1.3"/><circle cx="${px}" cy="175" r="17" fill="transparent"/><text x="${labelX}" y="${labelY}" text-anchor="middle" fill="#f1f5f8" font-size="13" font-weight="bold">${p.name}</text><text x="${labelX}" y="${labelY+15}" text-anchor="middle" fill="#aabbd1" font-size="11">${formatWalkMetres(getScaledDistanceFromSun(p,state.metresPerAU))}</text></g>`});$("distance-svg").setAttribute("viewBox",`0 0 ${width} 270`);$("distance-svg").style.width=`${width}px`;$("distance-svg").innerHTML=svg;$("zoom-value").textContent=`${formatDecimal(state.zoom,2)}×`;$("distance-svg").querySelectorAll("[data-axis-planet]").forEach(g=>{const activate=()=>{state.tourIndex=Number(g.dataset.axisPlanet)+1;state.tourRevealed=false;state.tourGuess=null;renderTour();$("tour-title").scrollIntoView({behavior:prefersReducedMotion()?"auto":"smooth",block:"center"})};g.addEventListener("click",activate);g.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();activate()}})})}
function renderTour(){const i=state.tourIndex,p=PLANETS[i-1];let content;if(i===0){content=`<div class="tour-stop"><span class="planet-dot" style="--planet-bg:radial-gradient(circle at 30% 30%,#fff0a8,#f7aa4f,#c45e31)" aria-hidden="true"></span><div><small>STOP 0 OF 8</small><h4>Sun</h4></div></div><div class="tour-distance"><strong>Start here!</strong><span>Place your Sun marker. Its model diameter is ${formatModelCm(SUN_MODEL_DIAMETER_MM/10)}.</span></div><p>Ask the group: how far away will Mercury be?</p>`}else{const leg=getScaledDistanceBetweenPlanets(i-1,state.metresPerAU),from=i===1?"the Sun":PLANETS[i-2].name;content=`<div class="tour-stop">${dotMarkup(p)}<div><small>STOP ${i} OF 8</small><h4>${p.name}</h4></div></div><p>From ${from}, estimate how far you should walk to ${p.name}.</p>${!state.tourRevealed?`<div class="tour-predict"><label for="walk-guess">Your distance guess</label><div class="input-with-unit"><input id="walk-guess" type="number" min="0" step="0.1" inputmode="decimal"><span>m</span></div><button id="reveal-walk" class="button primary" type="button">Reveal distance</button> <button id="skip-walk" class="text-button" type="button">Skip prediction</button></div>`:`<div class="tour-distance"><strong>Walk ${formatWalkMetres(leg)}</strong><span>from ${from} · ${formatWalkMetres(getScaledDistanceFromSun(p,state.metresPerAU))} from the Sun</span></div><p class="tour-feedback">${state.tourGuess===null?"Now place the marker!":`Your guess was ${formatWalkMetres(state.tourGuess)} — ${formatWalkMetres(Math.abs(state.tourGuess-leg))} ${state.tourGuess>=leg?"farther":"shorter"} than the model distance.`}</p><p>${p.name}'s model globe is only <strong>${formatModelCm(p.modelCm)}</strong> across.</p>`}`}$('tour-content').innerHTML=content;$("tour-progress").textContent=`${i} / 8`;$("tour-prev").disabled=i===0;$("tour-next").disabled=i===8;if(i>0&&!state.tourRevealed){$("reveal-walk").addEventListener("click",()=>revealWalk(true));$("skip-walk").addEventListener("click",()=>revealWalk(false))}}
function revealWalk(useGuess){const input=$("walk-guess");if(useGuess&&input.value!==""){const n=Number(input.value);if(!Number.isFinite(n)||n<0){input.setCustomValidity("Enter a distance of zero or more metres.");input.reportValidity();return}state.tourGuess=n}else state.tourGuess=null;state.tourRevealed=true;renderTour()}
function renderWalkTable(){const rows=[{name:"Sun",distance:0,leg:null,diameter:SUN_DIAMETER_KM,color:"#f7b85d",modelCm:SUN_MODEL_DIAMETER_MM/10},...PLANETS.map((p,i)=>({name:p.name,distance:getScaledDistanceFromSun(p,state.metresPerAU),leg:getScaledDistanceBetweenPlanets(i,state.metresPerAU),diameter:p.diameterKm,color:p.color,modelCm:p.modelCm}))];$("walk-table").innerHTML=rows.map(r=>`<tr><td><span class="table-planet" style="--planet-bg:${r.color}"></span>${r.name}</td><td>${formatWalkMetres(r.distance)}</td><td>${r.leg===null?"Start":formatWalkMetres(r.leg)}</td><td>${formatModelCm(r.modelCm)}</td></tr>`).join("")}
function renderAUExplanation(){
  const modelEarthDistance=WALK_METRES_PER_AU;
  const heightCount=Math.round(modelEarthDistance/state.heightMetres);
  const heightCm=formatDecimal(state.heightMetres*100,1);
  const person=state.studentName?`${state.studentName}'s`:"your";
  $("model-au-distance").textContent=`${formatDecimal(modelEarthDistance,1)} m`;
  $("au-height-count").textContent=state.heightEntered?`At ${person} height (${heightCm} cm), 1 AU is about ${heightCount} heights.`:`At an example height of ${heightCm} cm, 1 AU is about ${heightCount} heights.`;
}
function renderModelScaleTable(){
  const bodies=[{name:"Sun",diameterKm:SUN_DIAMETER_KM,modelCm:SUN_MODEL_DIAMETER_MM/10},...PLANETS];
  $("model-scale-table").innerHTML=bodies.map(body=>`<tr><td>${body.name}</td><td>${formatLargeNumber(body.diameterKm*1000)}</td><td>${formatModelCm(body.modelCm)}</td></tr>`).join("");
}
function renderOutdoorWalk(){
  const metresPerAU=state.metresPerAU;
  $("shrink-factor").textContent=`${formatLargeNumber(MODEL_SHRINK_FACTOR)}×`;
  $("shrink-math").textContent=`${formatLargeNumber(SUN_DIAMETER_KM*1000)} m ÷ ${(SUN_MODEL_DIAMETER_MM/1000).toFixed(2)} m = ${formatLargeNumber(MODEL_SHRINK_FACTOR)}`;
  $("summary-neptune").textContent=formatDecimal(getScaledDistanceFromSun(PLANETS[7],metresPerAU),1);
  $("summary-sun").textContent=formatModelCm(SUN_MODEL_DIAMETER_MM/10);
  $("summary-earth").textContent=formatModelCm(PLANETS[2].modelCm);
  renderAUExplanation();renderModelScaleTable();renderDistanceAxis();renderTour();renderWalkTable();
}
function resetAll(){
  state.heightMetres=1.5;state.heightEntered=false;state.studentName="";state.unit="cm";state.planetIndex=2;
  state.sizeSunCm=SUN_MODEL_DIAMETER_MM/10;state.metresPerAU=WALK_METRES_PER_AU;state.zoom=1;state.sort="order";
  state.tourIndex=0;state.tourRevealed=false;state.tourGuess=null;
  $("student-name").value="";$("size-sun-diameter").value=state.sizeSunCm;$("axis-zoom").value=1;$("height-error").hidden=true;
  setUnit("cm");syncHeightInputs();resetPrediction();
  $("math-detail").hidden=true;$("math-toggle").setAttribute("aria-expanded","false");$("math-toggle").textContent="Show the math ↓";
  renderPlanetComparison();renderSolarSystemOverview();setSort("order");renderOutdoorWalk();setActivity("size");savePrefs();
}
function wireEvents(){
  document.querySelectorAll("[data-unit]").forEach(button=>button.addEventListener("click",()=>setUnit(button.dataset.unit)));
  $("height-form").addEventListener("submit",event=>{event.preventDefault();applyHeight()});
  $("reset-height").addEventListener("click",()=>{state.heightMetres=1.5;state.heightEntered=false;state.studentName="";$("student-name").value="";syncHeightInputs();resetPrediction();renderPlanetComparison();renderAUExplanation();savePrefs()});
  const modelSunInput=$("size-sun-diameter");
  modelSunInput.addEventListener("input",()=>{const value=Number(modelSunInput.value);if(modelSunInput.value!==""&&Number.isFinite(value)&&value>=10&&value<=100){state.sizeSunCm=value;renderShrinkVisualization()}});
  modelSunInput.addEventListener("change",()=>{const value=Number(modelSunInput.value);if(modelSunInput.value===""||!Number.isFinite(value)||value<10||value>100)modelSunInput.value=state.sizeSunCm});
  $("prev-planet").addEventListener("click",()=>selectPlanet(state.planetIndex-1));
  $("next-planet").addEventListener("click",()=>selectPlanet(state.planetIndex+1));
  $("tab-size").addEventListener("click",()=>setActivity("size"));
  $("tab-walk").addEventListener("click",()=>setActivity("walk"));
  $("go-walk").addEventListener("click",()=>setActivity("walk"));
  document.addEventListener("keydown",event=>{if(state.activity!=="size"||!["ArrowLeft","ArrowRight"].includes(event.key)||/INPUT|TEXTAREA|SELECT|BUTTON/.test(document.activeElement.tagName))return;event.preventDefault();selectPlanet(state.planetIndex+(event.key==="ArrowRight"?1:-1))});
  $("math-toggle").addEventListener("click",()=>{const open=$("math-detail").hidden;$("math-detail").hidden=!open;$("math-toggle").setAttribute("aria-expanded",open);$("math-toggle").textContent=open?"Hide the math ↑":"Show the math ↓"});
  $("sort-order").addEventListener("click",()=>setSort("order"));
  $("sort-size").addEventListener("click",()=>setSort("size"));
  $("axis-zoom").addEventListener("input",event=>{state.zoom=Number(event.target.value);renderDistanceAxis()});
  $("pan-left").addEventListener("click",()=>$("distance-scroll").scrollBy({left:-350,behavior:prefersReducedMotion()?"auto":"smooth"}));
  $("pan-right").addEventListener("click",()=>$("distance-scroll").scrollBy({left:350,behavior:prefersReducedMotion()?"auto":"smooth"}));
  $("tour-prev").addEventListener("click",()=>{state.tourIndex=Math.max(0,state.tourIndex-1);state.tourRevealed=false;state.tourGuess=null;renderTour();renderDistanceAxis()});
  $("tour-next").addEventListener("click",()=>{state.tourIndex=Math.min(8,state.tourIndex+1);state.tourRevealed=false;state.tourGuess=null;renderTour();renderDistanceAxis()});
  $("prediction-toggle").addEventListener("change",event=>{state.prediction=event.target.checked;resetPrediction();renderPlanetComparison();savePrefs()});
  $("answer-toggle").addEventListener("click",()=>{state.answerHidden=!state.answerHidden;$("answer-area").hidden=state.answerHidden;syncAnswerToggle()});
  $("facilitator-reset").addEventListener("click",resetAll);
  $("fullscreen-button").addEventListener("click",toggleFullscreen);
  $("facilitator-fullscreen").addEventListener("click",toggleFullscreen);
  document.addEventListener("fullscreenchange",()=>{$("fullscreen-button").setAttribute("aria-label",document.fullscreenElement?"Exit full-screen presentation mode":"Enter full-screen presentation mode")});
}
function setSort(sort){state.sort=sort;for(const id of ["order","size"]){const button=$(`sort-${id}`),active=id===sort;button.classList.toggle("selected",active);button.setAttribute("aria-pressed",active)}renderSizeComparison()}
function toggleFullscreen(){if(document.fullscreenElement)document.exitFullscreen?.();else document.documentElement.requestFullscreen?.()}
function init(){
  loadPrefs();wireEvents();syncHeightInputs();setUnit(state.unit);
  $("prediction-toggle").checked=state.prediction;resetPrediction();
  renderSolarSystemOverview();renderPlanetComparison();renderOutdoorWalk();
}
if(typeof document!=="undefined")document.addEventListener("DOMContentLoaded",init);
if(typeof module!=="undefined")module.exports={AU_KM,SUN_DIAMETER_KM,SUN_MODEL_DIAMETER_MM,PLANETS,normalizeStudentName,normalizeHeight,validateHeight,getStudentsAcrossDiameter,getHeightCubeVolumeComparison,getPlanetDiameterRelativeToEarth,getScaledDistanceFromSun,getScaledDistanceBetweenPlanets,getScaledPlanetDiameter,getMetresPerAUFromModelDiameter,getShrinkFactor,getScaledHumanHeightNm,getSizeBarPercent,getModelDiameterCm,getLinearAxisPosition,generatePredictionChoices,formatStudentMillions,formatLargeNumber,MODEL_SHRINK_FACTOR,WALK_METRES_PER_AU};
