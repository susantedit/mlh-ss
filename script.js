const slides=document.querySelectorAll('.slide'),slideNum=document.getElementById('slide-num'),bar=document.getElementById('progress');
let cur=0;
let isZoomOpen = false;
function updateDeck(){slides.forEach((s,i)=>s.classList.toggle('active',i===cur));slideNum.textContent=`${cur+1} / ${slides.length}`;bar.style.width=((cur+1)/slides.length*100)+'%';if(location.hash!=='#'+(cur+1))history.replaceState(null,'','#'+(cur+1))}
function go(n){
  stopVideos();
  cur=Math.max(0,Math.min(slides.length-1,n));
  updateDeck();
}
const nextBtn = document.getElementById('next-btn');
if (nextBtn) nextBtn.onclick = () => go(cur + 1);
const prevBtn = document.getElementById('prev-btn');
if (prevBtn) prevBtn.onclick = () => go(cur - 1);
addEventListener('keydown',e=>{
 if (isZoomOpen) {
   if (e.key === 'Escape') {
     if (typeof closeZoom === 'function') closeZoom();
   } else if (e.key === '+' || e.key === '=') {
     if (typeof zoomIn === 'function') zoomIn();
   } else if (e.key === '-' || e.key === '_') {
     if (typeof zoomOut === 'function') zoomOut();
   } else if (e.key === '0') {
     if (typeof resetZoom === 'function') resetZoom();
   }
   return;
 }
 if(['ArrowRight',' ','PageDown'].includes(e.key)){e.preventDefault();go(cur+1)}
 else if(['ArrowLeft','PageUp'].includes(e.key))go(cur-1);
 else if(e.key==='Home')go(0);else if(e.key==='End')go(slides.length-1);
 else if(e.key==='f'||e.key==='F'){document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>{})}
});
let touchStartX = null, touchStartY = null;
window.addEventListener('touchstart', e => {
  if (isZoomOpen) return;
  if (e.touches && e.touches[0]) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }
}, { passive: true });

window.addEventListener('touchend', e => {
  if (isZoomOpen) return;
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
        musicBtn.innerHTML = '<svg class="icon" viewBox="0 0 24 24" width="20" height="20"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>';
        musicBtn.classList.remove('muted');
      } else {
        bgMusic.pause();
        musicBtn.innerHTML = '<svg class="icon" viewBox="0 0 24 24" width="20" height="20"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>';
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
  // If running locally, point QR codes to the public GitHub Pages site so phones can scan
  const isLocal = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
  if (isLocal) {
    return 'https://susantedit.github.io/mlh-ss/' + rawUrl.replace(/^\//, '');
  }
  // Otherwise resolve relative to wherever this page is currently hosted
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

/* ============================================================
   Universal Photo Zoom & Pan Engine (Mobile & Desktop)
   ============================================================ */
let currentZoom = 1.0;
const MIN_ZOOM = 1.0;
const MAX_ZOOM = 4.5;
let panX = 0, panY = 0;
let isPanning = false;
let startPointerX = 0, startPointerY = 0;
let initialPanX = 0, initialPanY = 0;
let initialPinchDistance = 0;
let initialPinchZoom = 1.0;
let lastTapTime = 0;

const zoomModal = document.getElementById('photo-zoom-modal');
const zoomBackdrop = document.getElementById('zoom-backdrop');
const zoomStage = document.getElementById('zoom-stage');
const zoomImg = document.getElementById('zoom-img');
const zoomTitle = document.getElementById('zoom-title');
const zoomLevelText = document.getElementById('zoom-level');
const zoomInBtn = document.getElementById('zoom-in-btn');
const zoomOutBtn = document.getElementById('zoom-out-btn');
const zoomResetBtn = document.getElementById('zoom-reset-btn');
const zoomCloseBtn = document.getElementById('zoom-close-btn');

function applyTransform(withTransition = false) {
  if (!zoomImg) return;
  zoomImg.style.transition = withTransition ? 'transform 0.22s cubic-bezier(0.2, 0, 0.2, 1)' : 'none';
  zoomImg.style.transform = `translate3d(${panX}px, ${panY}px, 0) scale(${currentZoom})`;
  if (zoomLevelText) {
    zoomLevelText.textContent = `${Math.round(currentZoom * 100)}%`;
  }
  if (zoomStage) {
    if (currentZoom > 1.01) {
      zoomStage.classList.toggle('is-dragging', isPanning);
      zoomStage.style.cursor = isPanning ? 'grabbing' : 'grab';
    } else {
      zoomStage.classList.remove('is-dragging');
      zoomStage.style.cursor = 'default';
    }
  }
}

function clampPan() {
  if (!zoomImg || !zoomStage) return;
  if (currentZoom <= 1.0) {
    panX = 0;
    panY = 0;
    return;
  }
  const rect = zoomImg.getBoundingClientRect();
  const stageWidth = zoomStage.clientWidth;
  const stageHeight = zoomStage.clientHeight;
  const maxPanX = Math.max(0, (rect.width - stageWidth) / 2 + 80);
  const maxPanY = Math.max(0, (rect.height - stageHeight) / 2 + 80);
  panX = Math.max(-maxPanX, Math.min(maxPanX, panX));
  panY = Math.max(-maxPanY, Math.min(maxPanY, panY));
}

function setZoom(newZoom, resetPan = false, withTransition = true) {
  const clamped = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));
  currentZoom = clamped;
  if (resetPan || currentZoom <= 1.0) {
    panX = 0;
    panY = 0;
  } else {
    clampPan();
  }
  applyTransform(withTransition);
}

function zoomIn() {
  setZoom(currentZoom + (currentZoom < 2.0 ? 0.35 : 0.5), false, true);
}

function zoomOut() {
  setZoom(currentZoom - (currentZoom <= 2.0 ? 0.35 : 0.5), false, true);
}

function resetZoom() {
  setZoom(1.0, true, true);
}

function openZoom(imgElement) {
  if (!zoomModal || !zoomImg || !imgElement) return;
  const src = imgElement.currentSrc || imgElement.src;
  if (!src) return;

  const alt = imgElement.alt || imgElement.title || 'Photo View';
  zoomImg.src = src;
  zoomImg.alt = alt;
  if (zoomTitle) zoomTitle.textContent = alt.length > 36 ? alt.substring(0, 36) + '...' : alt;

  currentZoom = 1.0;
  panX = 0;
  panY = 0;
  applyTransform(false);

  zoomModal.style.display = 'flex';
  requestAnimationFrame(() => {
    zoomModal.classList.add('active');
    zoomModal.setAttribute('aria-hidden', 'false');
  });

  isZoomOpen = true;
  document.body.style.overflow = 'hidden';
}

function closeZoom() {
  if (!zoomModal || !isZoomOpen) return;
  zoomModal.classList.remove('active');
  zoomModal.setAttribute('aria-hidden', 'true');
  setTimeout(() => {
    if (!zoomModal.classList.contains('active')) {
      zoomModal.style.display = 'none';
      if (zoomImg) zoomImg.src = '';
    }
  }, 250);
  isZoomOpen = false;
  document.body.style.overflow = '';
}

// Button events
if (zoomInBtn) zoomInBtn.onclick = (e) => { e.stopPropagation(); zoomIn(); };
if (zoomOutBtn) zoomOutBtn.onclick = (e) => { e.stopPropagation(); zoomOut(); };
if (zoomResetBtn) zoomResetBtn.onclick = (e) => { e.stopPropagation(); resetZoom(); };
if (zoomCloseBtn) zoomCloseBtn.onclick = (e) => { e.stopPropagation(); closeZoom(); };
if (zoomBackdrop) zoomBackdrop.onclick = () => closeZoom();

// Mouse Wheel Zoom on stage
if (zoomStage) {
  zoomStage.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.25 : -0.25;
    setZoom(currentZoom + delta, false, false);
  }, { passive: false });

  // Mouse drag panning
  zoomStage.addEventListener('mousedown', (e) => {
    if (e.target === zoomBackdrop) return;
    if (currentZoom <= 1.0) return;
    isPanning = true;
    startPointerX = e.clientX;
    startPointerY = e.clientY;
    initialPanX = panX;
    initialPanY = panY;
    zoomStage.classList.add('is-dragging');
  });

  window.addEventListener('mousemove', (e) => {
    if (!isPanning || !isZoomOpen) return;
    const dx = e.clientX - startPointerX;
    const dy = e.clientY - startPointerY;
    panX = initialPanX + dx;
    panY = initialPanY + dy;
    clampPan();
    applyTransform(false);
  });

  window.addEventListener('mouseup', () => {
    if (isPanning) {
      isPanning = false;
      if (zoomStage) zoomStage.classList.remove('is-dragging');
    }
  });

  // Touch Interactions: Pinch-to-zoom & 1-finger Pan & Double-tap
  zoomStage.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      isPanning = false;
      const x1 = e.touches[0].clientX, y1 = e.touches[0].clientY;
      const x2 = e.touches[1].clientX, y2 = e.touches[1].clientY;
      initialPinchDistance = Math.hypot(x2 - x1, y2 - y1);
      initialPinchZoom = currentZoom;
    } else if (e.touches.length === 1) {
      const now = Date.now();
      if (now - lastTapTime < 300) {
        // Double tap toggles zoom
        if (currentZoom > 1.2) {
          resetZoom();
        } else {
          setZoom(2.2, false, true);
        }
        lastTapTime = 0;
        return;
      }
      lastTapTime = now;

      if (currentZoom > 1.01) {
        isPanning = true;
        startPointerX = e.touches[0].clientX;
        startPointerY = e.touches[0].clientY;
        initialPanX = panX;
        initialPanY = panY;
      }
    }
  }, { passive: false });

  zoomStage.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2 && initialPinchDistance > 0) {
      e.preventDefault();
      const x1 = e.touches[0].clientX, y1 = e.touches[0].clientY;
      const x2 = e.touches[1].clientX, y2 = e.touches[1].clientY;
      const dist = Math.hypot(x2 - x1, y2 - y1);
      const factor = dist / initialPinchDistance;
      setZoom(initialPinchZoom * factor, false, false);
    } else if (e.touches.length === 1 && isPanning) {
      e.preventDefault();
      const dx = e.touches[0].clientX - startPointerX;
      const dy = e.touches[0].clientY - startPointerY;
      panX = initialPanX + dx;
      panY = initialPanY + dy;
      clampPan();
      applyTransform(false);
    }
  }, { passive: false });

  zoomStage.addEventListener('touchend', (e) => {
    if (e.touches.length < 2) {
      initialPinchDistance = 0;
    }
    if (e.touches.length === 0) {
      isPanning = false;
    }
  }, { passive: true });
}

/* Toggle Meme Banter Dialogue */
window.toggleBanter = function(btn) {
  if (!btn) return;
  const content = btn.nextElementSibling;
  if (!content) return;
  const isOpen = content.classList.contains('open');
  if (isOpen) {
    content.classList.remove('open');
    btn.classList.remove('active');
    btn.setAttribute('aria-expanded', 'false');
  } else {
    content.classList.add('open');
    btn.classList.add('active');
    btn.setAttribute('aria-expanded', 'true');
  }
};

/* Audience Vote Interactive Handler (Slide 10) */
const audienceVotes = { nova: 0, rex: 0, vera: 0 };
window.castVote = function(character) {
  if (audienceVotes[character] === undefined) return;
  audienceVotes[character]++;
  const countEl = document.getElementById(`count-${character}`);
  if (countEl) countEl.textContent = audienceVotes[character];
  const btn = document.getElementById(`vote-btn-${character}`);
  if (btn) btn.classList.add('voted');
  const card = btn ? btn.closest('.vote-card') : null;
  if (card) card.classList.add('voted');
};

// Attach Zoom Trigger & Badges cleanly to All Slide Images
function initPhotoZoomables() {
  const candidateImages = document.querySelectorAll('.slide img:not(.badges-grid img)');

  candidateImages.forEach(img => {
    if (img.dataset.zoomEnabled) return;
    img.dataset.zoomEnabled = 'true';
    img.classList.add('zoomable-photo');
    img.title = img.title ? img.title + ' (Tap to zoom in)' : 'Tap to zoom in / out';

    // Click on photo directly opens zoom
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      openZoom(img);
    });

    const parent = img.parentElement;
    let container = parent;

    // Always ensure the image is cleanly enclosed in its own photo-zoom-container
    if (!parent || !parent.classList.contains('photo-zoom-container')) {
      container = document.createElement('div');
      container.className = 'photo-zoom-container';
      parent.insertBefore(container, img);
      container.appendChild(img);
    }

    // Add visible Zoom button attached directly to the bottom-right of the photo
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'photo-zoom-btn';
    btn.innerHTML = '<svg class="icon" viewBox="0 0 24 24" width="13" height="13"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg> Zoom';
    btn.title = 'Tap to zoom in/out';
    btn.setAttribute('aria-label', 'Zoom this photo');
    btn.onclick = (e) => {
      e.stopPropagation();
      openZoom(img);
    };

    container.appendChild(btn);
  });
}

// Initialize on DOM load and when slides update
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPhotoZoomables);
} else {
  initPhotoZoomables();
}

