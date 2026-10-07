/* ========================================================
   WEDDING INVITATION — "Dholki & Lights" Theme
   JavaScript — Interactivity, Countdown, Animations
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {
  /* --------------------------------------------------
     CONFIG — Edit these to customise your invitation
  -------------------------------------------------- */
  const CONFIG = {
    // Wedding date — Mehndi Night (first event)
    weddingDate: new Date('2026-11-05T17:00:00'),

    // Path to your audio file
    audioSrc: 'wedding_nasheed.mp3',

    // Fairy-light canvas settings — blush & champagne palette
    fairyLights: {
      count: 60,           // number of light bulbs
      stringCount: 5,      // number of draped strings
      colors: ['#e8a8b6', '#f5c6cb', '#c59b6d', '#fdf4ea', '#dfbe96'],
    },

    // Sparkle particles
    sparkleCount: 18,

    /* =======================================================
       DIRECT-TO-EMAIL RSVP SETTINGS (No backend needed!)
       Choose ONE of the two free options:
       - OPTION A: Web3Forms (Recommended)
         1. Go to https://web3forms.com
         2. Enter your email to receive a free Access Key instantly
         3. Paste your key below:
       - OPTION B: FormSubmit
         Put your email address directly in formSubmitEmail below
       ======================================================= */
    web3FormsKey: '',     // e.g. 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
    formSubmitEmail: '',  // e.g. 'youremail@gmail.com'
  };

  /* --------------------------------------------------
     MUSIC OVERLAY & PLAYER
  -------------------------------------------------- */
  const overlay      = document.getElementById('music-overlay');
  const btnPlayOverlay = document.getElementById('btn-play-overlay');
  const btnSkip      = document.getElementById('btn-skip');
  const fab          = document.getElementById('music-player-fab');
  const audio        = document.getElementById('bg-audio');

  // Set audio source
  if (audio) {
    audio.src = CONFIG.audioSrc;
  }

  function openRoyalDoors() {
    if (!overlay) return;

    // Start celebratory music immediately
    if (audio) {
      audio.play().catch(() => {});
      if (fab) {
        fab.classList.add('playing');
        fab.innerHTML = pauseIcon();
      }
    }

    // Trigger the 3D palace doors swing
    overlay.classList.add('door-opening');
    overlay.style.pointerEvents = 'none';

    // Complete transition and hide overlay right as doors finish swinging (4.0s majestic slow opening)
    setTimeout(() => {
      overlay.classList.add('hidden');
      overlay.style.display = 'none';
    }, 4000);
  }

  if (btnPlayOverlay) {
    btnPlayOverlay.addEventListener('click', openRoyalDoors);
  }

  if (btnSkip) {
    btnSkip.addEventListener('click', openRoyalDoors);
  }

  function toggleMusic() {
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
      if (fab) {
        fab.classList.add('playing');
        fab.innerHTML = pauseIcon();
      }
    } else {
      audio.pause();
      if (fab) {
        fab.classList.remove('playing');
        fab.innerHTML = playIcon();
      }
    }
  }

  if (fab) {
    fab.addEventListener('click', toggleMusic);
  }

  function playIcon() {
    return `<svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg>`;
  }
  function pauseIcon() {
    return `<svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
  }

  /* --------------------------------------------------
     COUNTDOWN TIMER
  -------------------------------------------------- */
  const daysEl   = document.getElementById('cd-days');
  const hoursEl  = document.getElementById('cd-hours');
  const minsEl   = document.getElementById('cd-mins');
  const secsEl   = document.getElementById('cd-secs');

  function updateCountdown() {
    const now  = new Date();
    const diff = CONFIG.weddingDate - now;

    if (diff <= 0) {
      daysEl.textContent  = '0';
      hoursEl.textContent = '0';
      minsEl.textContent  = '0';
      secsEl.textContent  = '0';
      return;
    }

    const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins  = Math.floor((diff / (1000 * 60)) % 60);
    const secs  = Math.floor((diff / 1000) % 60);

    daysEl.textContent  = days;
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent  = String(mins).padStart(2, '0');
    secsEl.textContent  = String(secs).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* --------------------------------------------------
     FAIRY LIGHTS — Canvas Animation
  -------------------------------------------------- */
  const canvas = document.getElementById('fairy-lights-canvas');
  const ctx    = canvas.getContext('2d');
  let lights   = [];

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    generateLights();
  }

  function generateLights() {
    lights = [];
    const { stringCount, colors } = CONFIG.fairyLights;
    const w = canvas.width;
    const h = canvas.height;

    for (let s = 0; s < stringCount; s++) {
      const y0     = 30 + (s * (h / (stringCount + 1)));
      const sag    = 30 + Math.random() * 40;
      const bulbs  = 8 + Math.floor(Math.random() * 6);
      const startX = -20;
      const endX   = w + 20;

      for (let i = 0; i <= bulbs; i++) {
        const t     = i / bulbs;
        const x     = startX + t * (endX - startX);
        const sagY  = Math.sin(t * Math.PI) * sag;
        const y     = y0 + sagY;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const phase = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 1.5;
        const baseR = 2.5 + Math.random() * 2;

        lights.push({ x, y, color, phase, speed, baseR, stringY: y0, sag });
      }
    }
  }

  let scrollY = 0;
  window.addEventListener('scroll', () => { scrollY = window.pageYOffset; }, { passive: true });

  function drawLights(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw wires
    const { stringCount } = CONFIG.fairyLights;
    const w = canvas.width;
    const h = canvas.height;

    ctx.strokeStyle = 'rgba(212, 168, 67, 0.12)';
    ctx.lineWidth = 1;
    for (let s = 0; s < stringCount; s++) {
      const y0  = 30 + (s * (h / (stringCount + 1)));
      const sag = 35;
      ctx.beginPath();
      ctx.moveTo(-20, y0);
      ctx.quadraticCurveTo(w / 2, y0 + sag, w + 20, y0);
      ctx.stroke();
    }

    // Parallax offset
    const parallaxFactor = 0.08;

    // Draw bulbs
    for (const light of lights) {
      const t = time * 0.001;
      const pulse    = 0.5 + 0.5 * Math.sin(t * light.speed + light.phase);
      const r        = light.baseR * (0.8 + 0.4 * pulse);
      const alpha    = 0.4 + 0.6 * pulse;
      const yOffset  = scrollY * parallaxFactor;

      ctx.save();

      // Glow
      const gradient = ctx.createRadialGradient(
        light.x, light.y - yOffset, 0,
        light.x, light.y - yOffset, r * 6
      );
      gradient.addColorStop(0, light.color + hexAlpha(alpha * 0.7));
      gradient.addColorStop(0.4, light.color + hexAlpha(alpha * 0.2));
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(light.x, light.y - yOffset, r * 6, 0, Math.PI * 2);
      ctx.fill();

      // Bulb
      ctx.fillStyle = light.color;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(light.x, light.y - yOffset, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    requestAnimationFrame(drawLights);
  }

  function hexAlpha(a) {
    const hex = Math.round(Math.min(1, Math.max(0, a)) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  requestAnimationFrame(drawLights);

  /* --------------------------------------------------
     FLOATING GOLD SPARKLES
  -------------------------------------------------- */
  function createSparkles() {
    const body = document.body;
    for (let i = 0; i < CONFIG.sparkleCount; i++) {
      const sparkle = document.createElement('div');
      sparkle.classList.add('sparkle');
      sparkle.style.left     = Math.random() * 100 + 'vw';
      sparkle.style.width    = (2 + Math.random() * 4) + 'px';
      sparkle.style.height   = sparkle.style.width;
      sparkle.style.animationDuration = (8 + Math.random() * 14) + 's';
      sparkle.style.animationDelay    = (Math.random() * 12) + 's';
      sparkle.style.opacity  = 0;
      body.appendChild(sparkle);
    }
  }
  createSparkles();

  /* --------------------------------------------------
     SCROLL REVEAL
  -------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');

  function checkReveal() {
    const trigger = window.innerHeight * 0.85;
    revealElements.forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top < trigger) {
        el.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', checkReveal, { passive: true });
  checkReveal();

  /* --------------------------------------------------
     STICKY NAV
  -------------------------------------------------- */
  const nav = document.querySelector('.site-nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 80);
    }, { passive: true });
  }

  /* --------------------------------------------------
     LIGHTBOX (Gallery)
  -------------------------------------------------- */
  const lightbox    = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const galleryItems = document.querySelectorAll('.gallery-item img');

  galleryItems.forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  /* --------------------------------------------------
     RSVP FORM — Direct to Email (No backend needed!)
  -------------------------------------------------- */
  const rsvpForm    = document.getElementById('rsvp-form');
  const rsvpSuccess = document.getElementById('rsvp-success');
  const submitBtn   = rsvpForm ? rsvpForm.querySelector('.btn-submit') : null;

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Collect form data
      const formData = new FormData(rsvpForm);
      const name    = formData.get('guest-name') || 'Guest';
      const message = formData.get('guest-message') || 'Warmest wishes and blessings for Hadia & Ali!';

      const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Send Your Wishes ✨';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending with love... 💌';
      }

      try {
        let sent = false;

        // 1. Try Web3Forms if Access Key is configured
        if (CONFIG.web3FormsKey && CONFIG.web3FormsKey.trim() !== '') {
          const res = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              access_key: CONFIG.web3FormsKey.trim(),
              subject: `✨ Wedding Wishes from ${name}`,
              from_name: name,
              'Guest Name': name,
              'Wishes & Blessings': message,
            })
          });
          const result = await res.json();
          if (result.success) sent = true;
        }
        // 2. Or try FormSubmit if email address is configured
        else if (CONFIG.formSubmitEmail && CONFIG.formSubmitEmail.trim() !== '') {
          const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(CONFIG.formSubmitEmail.trim())}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              _subject: `✨ Wedding Wishes from ${name}`,
              'Guest Name': name,
              'Wishes & Blessings': message,
            })
          });
          const result = await res.json();
          if (result.success || res.ok) sent = true;
        }
        else {
          // Demo / Preview mode (when key/email has not been set yet)
          console.log('📬 Wishes Received (Demo Mode):', { name, message });
          console.info('💡 To receive RSVP emails directly in your inbox, add your free Web3Forms key or email address to CONFIG in script.js!');
          // Small realistic delay
          await new Promise(resolve => setTimeout(resolve, 600));
          sent = true;
        }

        if (sent) {
          rsvpForm.style.display = 'none';
          rsvpSuccess.classList.add('active');
        } else {
          throw new Error('Form service response error');
        }
      } catch (err) {
        console.error('RSVP submission error:', err);
        alert('There was a slight connection issue. Please try submitting again or message the family directly! 🤍');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }
    });
  }

  /* --------------------------------------------------
     SMOOTH SCROLL for nav links
  -------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
