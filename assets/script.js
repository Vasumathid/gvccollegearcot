document.addEventListener('DOMContentLoaded', () => {

  /* preloader */
  const pre = document.querySelector('.preloader');
  if(pre){
    window.addEventListener('load', () => setTimeout(()=>pre.classList.add('hide'), 300));
    setTimeout(()=>pre.classList.add('hide'), 1400); // fallback
  }

  /* mobile nav toggle */
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if(toggle && nav){
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      nav.classList.toggle('open');
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      toggle.classList.remove('open'); nav.classList.remove('open');
    }));
  }

  /* scroll reveal */
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger, .gold-underline, .stat-bar-row');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  /* animated counters */
  const counters = document.querySelectorAll('[data-count]');
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const dur = 1600;
      const start = performance.now();
      function step(now){
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = target < 20 && target % 1 !== 0 ? (target*eased).toFixed(1) : Math.floor(target*eased);
        el.textContent = val + suffix;
        if(p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      cio.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(el => cio.observe(el));

  /* sticky header state */
  const header = document.querySelector('.site-header');
  if(header){
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 40 ? '0 12px 30px -14px rgba(5,15,38,.5)' : 'none';
    });
  }

  /* back to top */
  const toTop = document.querySelector('.to-top');
  if(toTop){
    window.addEventListener('scroll', () => {
      toTop.classList.toggle('show', window.scrollY > 500);
    });
    toTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
  }

  /* accordion */
  document.querySelectorAll('.accordion-item').forEach(item => {
    const btn = item.querySelector('button');
    const panel = item.querySelector('.accordion-panel');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.accordion-item.open').forEach(o => {
        if(o !== item){ o.classList.remove('open'); o.querySelector('.accordion-panel').style.maxHeight = null; }
      });
      item.classList.toggle('open');
      panel.style.maxHeight = isOpen ? null : panel.scrollHeight + 'px';
    });
  });

  /* duplicate marquee content for seamless loop */
  document.querySelectorAll('.marquee-track').forEach(track => {
    track.innerHTML += track.innerHTML;
  });

  /* hero parallax on mouse move (desktop only) */
  const seal = document.querySelector('.seal-wrap');
  if(seal && window.matchMedia('(min-width:981px)').matches){
    document.querySelector('.hero')?.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 16;
      const y = (e.clientY / window.innerHeight - 0.5) * 16;
      seal.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  /* hero photo showcase carousel (homepage) */
  const showcase = document.querySelector('#heroShowcase');
  if(showcase){
    const slides = showcase.querySelectorAll('.hs-slide');
    if(slides.length > 1){
      let idx = 0;
      setInterval(() => {
        slides[idx].classList.remove('active');
        idx = (idx + 1) % slides.length;
        slides[idx].classList.add('active');
      }, 5000);
    }
  }

  /* hero full-bleed background carousel (homepage) */
  const heroBg = document.querySelector('#heroBgCarousel');
  if(heroBg){
    const bgSlides = heroBg.querySelectorAll('.hpb-slide');
    if(bgSlides.length > 1){
      let bgIdx = 0;
      setInterval(() => {
        bgSlides[bgIdx].classList.remove('active');
        bgIdx = (bgIdx + 1) % bgSlides.length;
        bgSlides[bgIdx].classList.add('active');
      }, 6000);
    }
  }

  /* contact form -> mailto fallback (static site, no backend) */
  const form = document.querySelector('#enquiry-form');
  if(form){
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('[name=name]').value;
      const email = form.querySelector('[name=email]').value;
      const subject = form.querySelector('[name=subject]')?.value || 'Website Enquiry';
      const message = form.querySelector('[name=message]').value;
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      window.location.href = `mailto:gvcbedcollege@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
    });
  }

  /* header notification bell dropdown */
  const bell = document.querySelector('#notifyBell');
  const panel = document.querySelector('#notifyPanel');
  if(bell && panel){
    bell.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = panel.classList.toggle('open');
      bell.setAttribute('aria-expanded', open);
      if(open) bell.querySelector('.notify-dot').style.display = 'none';
    });
    document.addEventListener('click', (e) => {
      if(!panel.contains(e.target) && e.target !== bell){
        panel.classList.remove('open');
        bell.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* live activity toast notifications - reassures visitors this is a live, official site */
  const toastMessages = [
    { icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>', title:'Admissions are open for the 2026&ndash;27 academic year', meta:'Admissions Office' },
    { icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>', title:'Rated 4.6 out of 5 from 218 verified Google reviews', meta:'Google Reviews' },
    { icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L7.9 9.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2z"/></svg>', title:'Admissions team available on 04172 - 237799', meta:'Talk To Us' },
    { icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 21h18M5 21V7l7-4 7 4v14"/></svg>', title:'TNTEU-affiliated B.Ed. programme, running since 2007', meta:'GVC Educational Trust' },
  ];
  const stack = document.querySelector('#toast-stack');
  if(stack && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    let shown = 0;
    const maxToasts = 3;
    const showToast = () => {
      if(shown >= maxToasts) return;
      const data = toastMessages[shown % toastMessages.length];
      const card = document.createElement('div');
      card.className = 'toast-card';
      card.innerHTML = `<div class="tc-icon">${data.icon}</div><div><div class="tc-title">${data.title}</div><div class="tc-meta">${data.meta}</div></div><div class="tc-close" role="button" aria-label="Dismiss">&times;</div>`;
      stack.appendChild(card);
      requestAnimationFrame(() => card.classList.add('show'));
      const remove = () => {
        card.classList.remove('show');
        setTimeout(() => card.remove(), 500);
      };
      card.querySelector('.tc-close').addEventListener('click', remove);
      setTimeout(remove, 7000);
      shown++;
    };
    setTimeout(showToast, 4000);
    const interval = setInterval(() => {
      showToast();
      if(shown >= maxToasts) clearInterval(interval);
    }, 15000);
  }
});
