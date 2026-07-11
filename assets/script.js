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
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger, .gold-underline');
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
});
