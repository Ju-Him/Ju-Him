// ===== PARTICLES =====
var canvas = document.getElementById("particles");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth; canvas.height = window.innerHeight;
window.addEventListener("resize", function(){ canvas.width=window.innerWidth; canvas.height=window.innerHeight; });
var PSYMBOLS = ["\u2726","\u2318","\u9f8d","\u795e","\u9b3c","\u4f8d","\u273f","\u262f","\u2727","\u26a1"];
var particles = [];
function Particle(){ var s=this; s.reset=function(init){ s.x=Math.random()*canvas.width; s.y=init?Math.random()*canvas.height:canvas.height+20; s.size=Math.random()*14+8; s.speedY=-(Math.random()*0.4+0.1); s.speedX=(Math.random()-0.5)*0.3; s.opacity=Math.random()*0.25+0.05; s.symbol=PSYMBOLS[Math.floor(Math.random()*PSYMBOLS.length)]; s.rotation=Math.random()*Math.PI*2; s.rotSpeed=(Math.random()-0.5)*0.01; s.color=Math.random()>0.5?"rgba(201,168,76,"+s.opacity+")":"rgba(139,26,26,"+s.opacity+")"; }; s.update=function(){ s.y+=s.speedY; s.x+=s.speedX; s.rotation+=s.rotSpeed; if(s.y<-30)s.reset(false); }; s.draw=function(){ ctx.save(); ctx.translate(s.x,s.y); ctx.rotate(s.rotation); ctx.font=s.size+"px serif"; ctx.fillStyle=s.color; ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText(s.symbol,0,0); ctx.restore(); }; s.reset(true); }
for(var i=0;i<120;i++) particles.push(new Particle());
function animateParticles(){ ctx.clearRect(0,0,canvas.width,canvas.height); for(var j=0;j<particles.length;j++){particles[j].update();particles[j].draw();} requestAnimationFrame(animateParticles); }
animateParticles();

// ===== NAV =====
var navToggle = document.getElementById("navToggle");
var navLinks = document.getElementById("navLinks");
if(navToggle){ navToggle.addEventListener("click", function(){ navLinks.classList.toggle("open"); }); }

// ===== CURSOR =====
var cur = document.createElement("div");
cur.style.cssText = "position:fixed;width:20px;height:20px;border-radius:50%;background:radial-gradient(circle,rgba(201,168,76,0.6),transparent 70%);pointer-events:none;z-index:9999;transform:translate(-50%,-50%);mix-blend-mode:screen;";
document.body.appendChild(cur);
document.addEventListener("mousemove", function(e){ cur.style.left=e.clientX+"px"; cur.style.top=e.clientY+"px"; });

// ===== SCROLL REVEAL =====
var obs = new IntersectionObserver(function(entries){ entries.forEach(function(e){ if(e.isIntersecting){e.target.classList.add("revealed");obs.unobserve(e.target);} }); }, {threshold:0.08});
function revealEl(el){ el.classList.add("hidden-init"); obs.observe(el); }

// ===== TICKER =====
var tickerTrack = document.getElementById("tickerTrack");
if(tickerTrack && typeof FACTS !== "undefined"){
  var tickerContent = "";
  FACTS.forEach(function(f){ tickerContent += "<span class='tick-item'>&#10022; "+f+"</span>"; });
  tickerTrack.innerHTML = tickerContent + tickerContent;
}

// ===== BUILD CATALOG =====
var catalogGrid = document.getElementById("catalogGrid");
if(catalogGrid && typeof STORIES !== "undefined"){
  STORIES.forEach(function(s){
    var card = document.createElement("div");
    card.className = "catalog-card";
    card.setAttribute("data-category", s.category);
    card.innerHTML = '<div class="card-badge">'+s.badge+'</div><div class="card-symbol">'+s.symbol+'</div><h3>'+s.title+'</h3><p>'+s.short+'</p><button class="read-btn" onclick="openStory(\''+s.id+'\')">Read Story</button>';
    catalogGrid.appendChild(card);
    revealEl(card);
  });
}

// ===== BUILD GODS =====
var godsGrid = document.getElementById("godsGrid");
if(godsGrid && typeof GODS !== "undefined"){
  GODS.forEach(function(g){
    var card = document.createElement("div");
    card.className = "god-card";
    card.setAttribute("data-pantheon", g.pantheon);
    card.innerHTML = '<div class="god-symbol">'+g.symbol+'</div><h3>'+g.name+'</h3><p class="god-role">'+g.role+'</p><p class="god-desc">'+g.desc+'</p><span class="god-badge">'+g.pantheon.charAt(0).toUpperCase()+g.pantheon.slice(1)+'</span>';
    godsGrid.appendChild(card);
    revealEl(card);
  });
}

// ===== BUILD COMICS =====
var comicsGrid = document.getElementById("comicsGrid");
if(comicsGrid && typeof COMICS !== "undefined"){
  COMICS.forEach(function(c){
    var card = document.createElement("div");
    card.className = "comic-card";
    card.innerHTML = '<div class="comic-cover" style="background:linear-gradient(to bottom,'+c.color+',rgba(5,5,8,0.95)),url(\''+c.img+'\') center/cover no-repeat;"><div class="comic-symbol-overlay">'+c.symbol+'</div><div class="comic-label-overlay"><span>'+c.title+'</span></div><div class="comic-overlay"><button class="read-btn" onclick="openComic(\''+c.id+'\')">Read Now</button></div></div><div class="comic-info"><h3>'+c.title+'</h3><p class="comic-meta">'+c.meta+'</p><p>'+c.desc+'</p></div>';
    comicsGrid.appendChild(card);
    revealEl(card);
  });
}

// ===== CATALOG FILTER =====
document.querySelectorAll(".tag[data-filter]").forEach(function(tag){
  tag.addEventListener("click", function(){
    document.querySelectorAll(".tag[data-filter]").forEach(function(t){t.classList.remove("active");});
    tag.classList.add("active");
    var filter = tag.getAttribute("data-filter");
    document.querySelectorAll(".catalog-card").forEach(function(card){
      card.style.display = (filter==="all"||card.getAttribute("data-category")===filter)?"flex":"none";
    });
  });
});

// ===== GODS FILTER =====
document.querySelectorAll(".tag[data-gfilter]").forEach(function(tag){
  tag.addEventListener("click", function(){
    document.querySelectorAll(".tag[data-gfilter]").forEach(function(t){t.classList.remove("active");});
    tag.classList.add("active");
    var filter = tag.getAttribute("data-gfilter");
    document.querySelectorAll(".god-card").forEach(function(card){
      card.style.display = (filter==="all"||card.getAttribute("data-pantheon")===filter)?"flex":"none";
    });
  });
});

// ===== SEARCH =====
var searchInput = document.getElementById("searchInput");
if(searchInput){
  searchInput.addEventListener("input", function(){
    var val = this.value.toLowerCase();
    document.querySelectorAll(".catalog-card").forEach(function(card){
      card.style.display = card.innerText.toLowerCase().includes(val)?"flex":"none";
    });
  });
}

// ===== MODAL =====
function openStory(id){
  var s = null;
  if(typeof STORIES !== "undefined"){ for(var i=0;i<STORIES.length;i++){ if(STORIES[i].id===id){s=STORIES[i];break;} } }
  if(!s) return;
  document.getElementById("modalTitle").textContent = s.title;
  document.getElementById("modalBadge").textContent = s.badge;
  document.getElementById("modalBody").innerHTML = s.text;
  document.getElementById("storyModal").classList.add("open");
  document.body.style.overflow = "hidden";
}

function openComic(id){
  var c = null;
  if(typeof COMICS !== "undefined"){ for(var i=0;i<COMICS.length;i++){ if(COMICS[i].id===id){c=COMICS[i];break;} } }
  document.getElementById("modalTitle").textContent = c ? c.title : "Comic";
  document.getElementById("modalBadge").textContent = "Ju-Him Comics";
  document.getElementById("modalBody").innerHTML = "<p>This comic is coming soon to the Ju-Him library. New chapters are being written in the Ancient Realm.</p><p><em>The story is being written. Your patience is honored.</em></p>";
  document.getElementById("storyModal").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal(){
  document.getElementById("storyModal").classList.remove("open");
  document.body.style.overflow = "";
}

var modal = document.getElementById("storyModal");
if(modal){ modal.addEventListener("click", function(e){ if(e.target===this) closeModal(); }); }

// ===== RUNE SHIMMER =====
setInterval(function(){
  document.querySelectorAll(".rune-line").forEach(function(l){ l.style.opacity=(Math.random()*0.4+0.4).toFixed(2); });
}, 2000);

// ===== REVEAL STATIC ELEMENTS =====
document.querySelectorAll(".scroll-card,.pillar,.wisdom-card,.tl-item,.blessing,.big-quote,.genre-card").forEach(function(el){ revealEl(el); });