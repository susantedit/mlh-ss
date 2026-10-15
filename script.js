const slides=document.querySelectorAll('.slide'),slideNum=document.getElementById('slide-num'),bar=document.getElementById('progress');
let cur=0;
function updateDeck(){slides.forEach((s,i)=>s.classList.toggle('active',i===cur));slideNum.textContent=`${cur+1} / ${slides.length}`;bar.style.width=((cur+1)/slides.length*100)+'%';if(location.hash!=='#'+(cur+1))history.replaceState(null,'','#'+(cur+1))}
function go(n){
  stopVideos();
  cur=Math.max(0,Math.min(slides.length-1,n));
  updateDeck();
}
document.getElementById('next-btn').onclick=()=>go(cur+1);
document.getElementById('prev-btn').onclick=()=>go(cur-1);
addEventListener('keydown',e=>{
 if(['ArrowRight',' ','PageDown'].includes(e.key)){e.preventDefault();go(cur+1)}
 else if(['ArrowLeft','PageUp'].includes(e.key))go(cur-1);
 else if(e.key==='Home')go(0);else if(e.key==='End')go(slides.length-1);
 else if(e.key==='f'||e.key==='F'){document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>{})}
});
let touchStartX = null, touchStartY = null;
window.addEventListener('touchstart', e => {
  if (e.touches && e.touches[0]) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }
}, { passive: true });

window.addEventListener('touchend', e => {
  if (touchStartX === null || touchStartY === null) return;
  if (e.changedTouches && e.changedTouches[0]) {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy) * 1.1) {
      go(cur + (dx < 0 ? 1 : -1));
    }
  }
  touchStartX = null;
  touchStartY = null;
}, { passive: true });
const h=parseInt(location.hash.slice(1));if(h)cur=Math.max(0,Math.min(slides.length-1,h-1));
updateDeck();

/* Floating background: code + Nepali/Hindi/English chatter + memes */
const canvas=document.getElementById('bg-canvas'),ctx=canvas.getContext('2d');
let width=canvas.width=innerWidth,height=canvas.height=innerHeight;
addEventListener('resize',()=>{width=canvas.width=innerWidth;height=canvas.height=innerHeight});
const code=['<div>','</div>','new THREE.Scene()','function init()','phase = "BATTLE"','alliance.lock()','npc.decide()','betray()','if (aiDown) fallback()','requestAnimationFrame()','display: flex;','git push --force','console.log("bro")','npm install hope','while(alive){ fight() }','// TODO: fix later','404: sleep not found','git commit -m "lets go"','#hacktoberfest'];
const chat=[
  "Kaa chhaal rahe daya 😭",
  "Nepal ma basera international problems.",
  "Bro thinks he's the main character 💀",
  "Yo ta personal attack bhayo.",
  "Mummy le phone herxu bhannu bhayo 💀",
  "When bro says paisa ma tirxu.",
  "Average +2 student before board exams.",
  "Kathmandu ko traffic vs my patience.",
  "POV: Crush online cha, reply chai chaina.",
  "Ghar ma single child, bahira comedian.",
  "“Moye Moye” — failed expectations.",
  "Jaldi Wahan Se Hato",
  "Oh Bhai, Maro Mujhe Maro",
  "Control Uday Control",
  "Ye Dukh Kaahe Khatam Nahi Hota",
  "Thukra Ke Mera Pyaar fir kavi na dhkoge",
  "wah bate wah",
  "kya dekh rahe ho Daya?",
  "ki hal chha?",
  "k xa bro?",
  "ke garne ta",
  "aba ta bhayo",
  "ekdam mast",
  "bhai kya kar raha hai tu",
  "Daya, darwaza tod do",
  "sahi ho bro",
  "bug hai ya feature?",
  "chiya khanu paryo"
];
const words=code.concat(chat);
/* ALL memes loaded cleanly and non-conflicting */
const memeSources = [
  '1.png', '2.png', '3.png', '4.png', '6.png',
  'meme-pro.jpg', 'meme-study.jpg', 'meme-end.jpg', 'image.png'
];
const memeImages = memeSources.map(s => { const img = new Image(); img.src = s; return { src: s, img }; });
const rnd = (a, b) => a + Math.random() * (b - a);

// Dedicated non-overlapping meme particles (guaranteed 1 for each meme)
const memeParticles = memeImages.map((m, idx) => {
  const angle = (idx / memeImages.length) * Math.PI * 2;
  const radiusX = width * 0.42;
  const radiusY = height * 0.42;
  return {
    img: m.img,
    name: m.src,
    x: width / 2 + Math.cos(angle) * radiusX,
    y: height / 2 + Math.sin(angle) * radiusY,
    speedX: rnd(0.25, 0.5) * (Math.cos(angle) >= 0 ? 1 : -1),
    speedY: rnd(0.2, 0.4) * (Math.sin(angle) >= 0 ? 1 : -1),
    mw: rnd(110, 150),
    rot: rnd(-0.2, 0.2),
    vr: rnd(-0.0015, 0.0015),
    ph: rnd(0, Math.PI * 2)
  };
});

// Non-conflicting text tracks (lanes) so texts never collide with each other
const textParticles = [];
const numLanes = 16;
for (let i = 0; i < words.length; i++) {
  const lane = i % numLanes;
  const laneY = (height / (numLanes + 1)) * (lane + 1);
  textParticles.push({
    text: words[i],
    x: rnd(0, width * 1.5) - width * 0.25,
    y: laneY + rnd(-10, 10),
    speedX: rnd(0.35, 0.7) * (lane % 2 === 0 ? 1 : -1),
    fontSize: Math.floor(rnd(15, 20)),
    opacity: rnd(0.85, 1.0)
  });
}

// Background circles
const circleParticles = [];
for (let i = 0; i < 18; i++) {
  circleParticles.push({
    x: rnd(0, width),
    y: rnd(0, height),
    radius: rnd(4, 8),
    speedX: rnd(-0.25, 0.25),
    speedY: rnd(-0.2, 0.2),
    opacity: rnd(0.25, 0.45)
  });
}

function animate(t) {
  ctx.clearRect(0, 0, width, height);

  // 1. Circles
  for (const c of circleParticles) {
    ctx.fillStyle = `rgba(232,88,45,${c.opacity})`;
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
    ctx.fill();
    c.x += c.speedX; c.y += c.speedY;
    if (c.x < 0) c.x = width; if (c.x > width) c.x = 0;
    if (c.y < 0) c.y = height; if (c.y > height) c.y = 0;
  }

  // 2. Memes: Rendered with distinct shadow, border, and clear visibility
  for (const p of memeParticles) {
    if (p.img.complete && p.img.naturalWidth) {
      const w = p.mw;
      const hh = w * p.img.naturalHeight / p.img.naturalWidth;
      ctx.save();
      ctx.globalAlpha = 0.55; // Clear, visible background presence
      ctx.translate(p.x, p.y + Math.sin(t / 950 + p.ph) * 10);
      ctx.rotate(p.rot);
      // Clean border & shadow for meme visibility
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 8;
      ctx.strokeStyle = '#e8b93c';
      ctx.lineWidth = 3;
      ctx.strokeRect(-w / 2, -hh / 2, w, hh);
      ctx.drawImage(p.img, -w / 2, -hh / 2, w, hh);
      ctx.restore();
      p.rot += p.vr;
    }
    p.x += p.speedX; p.y += p.speedY;
    // Bounce gently within viewing area so all memes stay visible
    if (p.x < 40 || p.x > width - 40) p.speedX *= -1;
    if (p.y < 40 || p.y > height - 40) p.speedY *= -1;
  }

  // 3. Texts: Clean, non-conflicting lanes
  for (const p of textParticles) {
    const chatty = chat.includes(p.text);
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.9)';
    ctx.shadowBlur = 6;
    ctx.fillStyle = chatty ? `rgba(255,248,225,${p.opacity})` : `rgba(245,190,60,${p.opacity})`;
    ctx.font = `bold ${p.fontSize}px ${chatty ? "'Trebuchet MS',sans-serif" : "'Courier New',monospace"}`;
    ctx.fillText(p.text, p.x, p.y);
    ctx.restore();

    p.x += p.speedX;
    if (p.speedX > 0 && p.x > width + 300) p.x = -300;
    if (p.speedX < 0 && p.x < -300) p.x = width + 300;
  }

  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

/* Interactive Verdict (Am I going to win?) */
const btnJudgeYes = document.getElementById('btn-judge-yes');
const btnJudgeNo = document.getElementById('btn-judge-no');
const btnAudYes = document.getElementById('btn-aud-yes');
const btnAudNo = document.getElementById('btn-aud-no');

const resJudgeYes = document.getElementById('res-judge-yes');
const resJudgeNo = document.getElementById('res-judge-no');
const resAudYes = document.getElementById('res-aud-yes');
const resAudNo = document.getElementById('res-aud-no');

const vidJudge = document.getElementById('vid-judge-no');
const vidAud = document.getElementById('vid-aud-no');

// High volume & Web Audio Gain boost
let audioCtx = null;
function boostAudio(video) {
  if (!video) return;
  video.volume = 1.0;
  video.muted = false;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    if (!video.__boosted) {
      const src = audioCtx.createMediaElementSource(video);
      const gain = audioCtx.createGain();
      gain.gain.value = 2.5; // High volume boost (250%)
      src.connect(gain);
      gain.connect(audioCtx.destination);
      video.__boosted = true;
    }
  } catch (e) {
    video.volume = 1.0;
  }
}

[vidJudge, vidAud].forEach(v => {
  if (v) {
    v.volume = 1.0;
    v.muted = false;
  }
});

function stopVideos() {
  if (vidJudge) {
    vidJudge.pause();
    vidJudge.currentTime = 0;
  }
  if (vidAud) {
    vidAud.pause();
    vidAud.currentTime = 0;
  }
  if (musicEnabled && bgMusic && bgMusic.paused) {
    bgMusic.play().catch(() => {});
  }
}

/* Background Music (Mozart - Eine kleine Nachtmusik) */
const bgMusic = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');
let musicEnabled = true;

if (bgMusic) {
  bgMusic.volume = 0.12; // gentle, low background volume
  bgMusic.loop = true;

  const startBgMusic = () => {
    if (musicEnabled && bgMusic.paused && (!vidJudge || vidJudge.paused) && (!vidAud || vidAud.paused)) {
      bgMusic.play().catch(() => {});
    }
  };
  ['click', 'keydown', 'touchstart'].forEach(evt => {
    window.addEventListener(evt, startBgMusic, { once: true });
  });

  if (musicBtn) {
    musicBtn.onclick = () => {
      musicEnabled = !musicEnabled;
      if (musicEnabled) {
        if ((!vidJudge || vidJudge.paused) && (!vidAud || vidAud.paused)) {
          bgMusic.play().catch(() => {});
        }
        musicBtn.textContent = '🎵';
        musicBtn.classList.remove('muted');
      } else {
        bgMusic.pause();
        musicBtn.textContent = '🔇';
        musicBtn.classList.add('muted');
      }
    };
  }
}

// When any meme video plays, stop background music; resume when video stops/ends
[vidJudge, vidAud].forEach(v => {
  if (v) {
    v.addEventListener('play', () => {
      if (bgMusic) bgMusic.pause();
    });
    v.addEventListener('pause', () => {
      if (musicEnabled && bgMusic && (!vidJudge || vidJudge.paused) && (!vidAud || vidAud.paused)) {
        bgMusic.play().catch(() => {});
      }
    });
    v.addEventListener('ended', () => {
      if (musicEnabled && bgMusic) {
        bgMusic.play().catch(() => {});
      }
    });
  }
});

function showVerdict(activeBtn, activeRes, playVid) {
  const winPlaceholder = document.getElementById('win-placeholder');
  if (winPlaceholder) winPlaceholder.style.display = 'none';
  [btnJudgeYes, btnJudgeNo, btnAudYes, btnAudNo].forEach(b => b && b.classList.remove('active'));
  [resJudgeYes, resJudgeNo, resAudYes, resAudNo].forEach(r => { if (r) r.style.display = 'none'; });

  if (activeBtn) activeBtn.classList.add('active');
  if (activeRes) activeRes.style.display = 'flex';

  if (playVid) {
    if (vidJudge && vidJudge !== playVid) { vidJudge.pause(); vidJudge.currentTime = 0; }
    if (vidAud && vidAud !== playVid) { vidAud.pause(); vidAud.currentTime = 0; }
    if (bgMusic) bgMusic.pause(); // Stop background music immediately
    boostAudio(playVid);
    playVid.currentTime = 0;
    playVid.play().catch(() => {});
  } else {
    stopVideos();
  }
}

if (btnJudgeYes) btnJudgeYes.onclick = () => showVerdict(btnJudgeYes, resJudgeYes, null);
if (btnJudgeNo) btnJudgeNo.onclick = () => showVerdict(btnJudgeNo, resJudgeNo, vidJudge);
if (btnAudYes) btnAudYes.onclick = () => showVerdict(btnAudYes, resAudYes, null);
if (btnAudNo) btnAudNo.onclick = () => showVerdict(btnAudNo, resAudNo, vidAud);

/* QR Code switcher for internship slide */
const qrTabs = document.querySelectorAll('.qr-tab');
const qrImg = document.getElementById('qr-image');
const qrDesc = document.getElementById('qr-desc');

function resolveQrTarget(rawUrl) {
  if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://') || rawUrl.startsWith('mailto:')) {
    return rawUrl;
  }
  // Convert relative file (links.html) to absolute live URL on current origin/path
  const base = window.location.href.split('?')[0].split('#')[0];
  return new URL(rawUrl, base).href;
}

function updateQrDisplay(tab) {
  if (!tab || !qrImg) return;
  qrTabs.forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  const rawUrl = tab.getAttribute('data-url');
  const title = tab.getAttribute('data-title');
  const fullUrl = resolveQrTarget(rawUrl);
  const encoded = encodeURIComponent(fullUrl);
  qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encoded}&margin=4`;
  if (qrDesc) qrDesc.innerHTML = `Scanning opens: <b>${title}</b>`;
}

if (qrTabs && qrImg) {
  qrTabs.forEach(tab => {
    tab.addEventListener('click', () => updateQrDisplay(tab));
  });
  const initialTab = document.querySelector('.qr-tab.active') || qrTabs[0];
  if (initialTab) updateQrDisplay(initialTab);
}
