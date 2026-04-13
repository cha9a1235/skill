// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('bb-theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme === 'light' ? 'light' : '');

if (themeToggle) {
    // Set initial state
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    }

    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        if (current === 'light') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('bb-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('bb-theme', 'light');
        }
    });
}

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== MOBILE MENU (Slide Drawer) =====
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

function closeMenu() {
    if (navLinks) navLinks.classList.remove('active');
    if (menuToggle) menuToggle.classList.remove('active');
    if (navOverlay) navOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

function openMenu() {
    if (navLinks) navLinks.classList.add('active');
    if (menuToggle) menuToggle.classList.add('active');
    if (navOverlay) navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.contains('active') ? closeMenu() : openMenu();
    });
    if (navOverlay) navOverlay.addEventListener('click', closeMenu);
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll('.reveal, .reveal-right, .reveal-left, .reveal-scale');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// ===== CHANNEL TABS =====
const channelTabs = document.querySelectorAll('.channel-tab');
const channelGroups = document.querySelectorAll('.channel-group');

channelTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        channelTabs.forEach(t => t.classList.remove('active'));
        channelGroups.forEach(g => g.classList.remove('active'));
        tab.classList.add('active');
        const target = document.getElementById(tab.dataset.category);
        if (target) target.classList.add('active');
    });
});

// ===== CURRENCY CONVERTER =====
const currencyBtns = document.querySelectorAll('.currency-btn');
const priceEls = document.querySelectorAll('.price');
const currencySymbolEls = document.querySelectorAll('.currency-symbol');
const originalPriceEls = document.querySelectorAll('.original-price');
const originalCurrencyEls = document.querySelectorAll('.original-currency');

currencyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const currency = btn.dataset.currency;
        currencyBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Format number with Arabic-Eastern numerals
        function formatArabic(num) {
            const eastern = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
            return Number(num).toLocaleString('en').replace(/[0-9]/g, d => eastern[d]);
        }

        // Use Arabic numerals for AED/QAR, western for EUR
        const useArabicNums = (currency !== 'eur');

        // Update prices
        priceEls.forEach(el => {
            const val = el.dataset[currency];
            if (val) {
                el.textContent = useArabicNums ? formatArabic(val) : Number(val).toLocaleString('en');
            }
        });

        // Update currency symbols
        currencySymbolEls.forEach(el => {
            const sym = el.dataset[currency];
            if (sym) el.textContent = sym;
        });

        // Update original prices
        originalPriceEls.forEach(el => {
            const val = el.dataset[currency];
            if (val) {
                el.textContent = useArabicNums ? formatArabic(val) : Number(val).toLocaleString('en');
            }
        });

        originalCurrencyEls.forEach(el => {
            const sym = el.dataset[currency];
            if (sym) el.textContent = sym;
        });
    });
});

// ===== FAQ ACCORDION =====
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all
        faqItems.forEach(i => {
            i.classList.remove('active');
            i.querySelector('.faq-answer').style.maxHeight = '0';
        });

        // Open clicked (if wasn't active)
        if (!isActive) {
            item.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + 'px';
        }
    });
});

// ===== TRIAL FORM =====
const trialForm = document.getElementById('trialForm');
const trialSuccess = document.getElementById('trialSuccess');

if (trialForm) {
    trialForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = trialForm.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '⏳ جاري الإرسال...';
        submitBtn.disabled = true;

        const formData = new FormData(trialForm);

        try {
            // Send to Formspree (replace YOUR_FORM_ID with your actual Formspree form ID)
            const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                trialForm.style.display = 'none';
                document.querySelector('.trial-header').style.display = 'none';
                if (trialSuccess) trialSuccess.style.display = 'block';
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                throw new Error('Form submission failed');
            }
        } catch (err) {
            // Fallback: show success anyway (form data logged to console)
            console.log('Form data:', Object.fromEntries(formData.entries()));
            trialForm.style.display = 'none';
            document.querySelector('.trial-header').style.display = 'none';
            if (trialSuccess) trialSuccess.style.display = 'block';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

// ===== FLOATING PARTICLES =====
document.querySelectorAll('.floating-particles').forEach(particlesContainer => {
    function createParticle() {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDuration = (Math.random() * 6 + 5) + 's';
        p.style.animationDelay = Math.random() * 3 + 's';
        const size = Math.random() * 3 + 2;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        particlesContainer.appendChild(p);
        setTimeout(() => p.remove(), 12000);
    }

    // Continuous particles
    setInterval(createParticle, 500);
    // Initial burst
    for (let i = 0; i < 15; i++) {
        setTimeout(createParticle, i * 200);
    }
});

// ===== POPCORN RAIN EFFECT =====
const popcornContainer = document.getElementById('popcornRain');
if (popcornContainer) {
    const popcornEmojis = ['🍿', '🌽', '✨', '🍿', '🍿', '⭐'];

    function createPopcorn() {
        const kernel = document.createElement('span');
        kernel.className = 'popcorn-kernel';
        kernel.textContent = popcornEmojis[Math.floor(Math.random() * popcornEmojis.length)];
        kernel.style.left = Math.random() * 100 + '%';
        kernel.style.animationDuration = (Math.random() * 3 + 3) + 's';
        kernel.style.animationDelay = Math.random() * 0.5 + 's';
        kernel.style.fontSize = (Math.random() * 0.6 + 0.7) + 'rem';
        popcornContainer.appendChild(kernel);

        // Remove after animation
        setTimeout(() => kernel.remove(), 6500);
    }

    // Create popcorn continuously
    setInterval(createPopcorn, 400);
    // Initial burst
    for (let i = 0; i < 8; i++) {
        setTimeout(createPopcorn, i * 150);
    }
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// ===== TYPING EFFECT =====
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    const line1 = 'كل شي تبي تشوفه';
    const line2 = 'بمكان واحد.';
    heroTitle.innerHTML = '<span class="type-line" id="typeLine1"></span><br><span class="gradient-text type-line" id="typeLine2"></span>';
    const el1 = document.getElementById('typeLine1');
    const el2 = document.getElementById('typeLine2');

    function typeText(el, text, speed, callback) {
        let i = 0;
        el.textContent = '';
        const timer = setInterval(() => {
            el.textContent += text[i];
            i++;
            if (i >= text.length) {
                clearInterval(timer);
                if (callback) callback();
            }
        }, speed);
    }

    setTimeout(() => {
        typeText(el1, line1, 70, () => {
            setTimeout(() => typeText(el2, line2, 80), 300);
        });
    }, 1500); // Wait for loading screen
}


// ===== WORLD CUP 2026 COUNTDOWN =====
const wcDays = document.getElementById('wcDays');
const wcHours = document.getElementById('wcHours');
const wcMins = document.getElementById('wcMins');
const wcSecs = document.getElementById('wcSecs');

if (wcDays) {
    const wcDate = new Date('2026-06-11T00:00:00');
    function updateWC() {
        const diff = wcDate - new Date();
        if (diff <= 0) return;
        wcDays.textContent = String(Math.floor(diff / (1000*60*60*24))).padStart(2,'0');
        wcHours.textContent = String(Math.floor((diff/(1000*60*60))%24)).padStart(2,'0');
        wcMins.textContent = String(Math.floor((diff/(1000*60))%60)).padStart(2,'0');
        wcSecs.textContent = String(Math.floor((diff/1000)%60)).padStart(2,'0');
    }
    updateWC();
    setInterval(updateWC, 1000);
}

// ===== HERO LIVE COUNT =====
const heroLiveCount = document.getElementById('heroLiveCount');
if (heroLiveCount) {
    setInterval(() => {
        let count = parseInt(heroLiveCount.textContent.replace(/,/g, ''));
        count += Math.floor(Math.random() * 20) - 10;
        count = Math.max(3800, Math.min(5200, count));
        heroLiveCount.textContent = count.toLocaleString('en');
    }, 4000);
}

// ===== CTA URGENCY TIMER =====
const ctaHrs = document.getElementById('ctaHrs');
const ctaMins = document.getElementById('ctaMins');
const ctaSecs = document.getElementById('ctaSecs');
const spotsLeft = document.getElementById('spotsLeft');
const trialCount = document.getElementById('trialCount');

if (ctaHrs) {
    // Reuse the same countdown deadline
    let ctaDeadline = localStorage.getItem('bb-countdown');
    if (!ctaDeadline || new Date(ctaDeadline) < new Date()) {
        ctaDeadline = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
        localStorage.setItem('bb-countdown', ctaDeadline);
    }

    function updateCtaTimer() {
        const diff = new Date(ctaDeadline) - new Date();
        if (diff <= 0) return;
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / (1000 * 60)) % 60);
        const s = Math.floor((diff / 1000) % 60);
        ctaHrs.textContent = String(h).padStart(2, '0');
        ctaMins.textContent = String(m).padStart(2, '0');
        ctaSecs.textContent = String(s).padStart(2, '0');
    }

    updateCtaTimer();
    setInterval(updateCtaTimer, 1000);
}

// Fluctuate spots and trial count
if (spotsLeft) {
    setInterval(() => {
        const spots = Math.floor(Math.random() * 5) + 2; // 2-6
        spotsLeft.textContent = spots;
    }, 15000);
}

if (trialCount) {
    setInterval(() => {
        const count = Math.floor(Math.random() * 40) + 50; // 50-89
        trialCount.textContent = count;
    }, 8000);
}

// ===== LOADING SCREEN =====
const loadingScreen = document.getElementById('loadingScreen');
if (loadingScreen) {
    window.addEventListener('load', () => {
        setTimeout(() => loadingScreen.classList.add('hidden'), 1300);
    });
}

// ===== BACK TO TOP =====
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.scrollY > 600);
    });
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== LIVE VISITORS =====
const liveVisitors = document.getElementById('liveVisitors');
const visitorCount = document.getElementById('visitorCount');
if (liveVisitors) {
    // Show after 3 seconds
    setTimeout(() => liveVisitors.classList.add('visible'), 3000);

    // Fluctuate count randomly
    setInterval(() => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        let count = parseInt(visitorCount.textContent);
        count = Math.max(28, Math.min(89, count + change));
        visitorCount.textContent = count;
    }, 5000);
}

// ===== MOBILE STICKY CTA =====
const mobileCta = document.getElementById('mobileCta');
if (mobileCta) {
    window.addEventListener('scroll', () => {
        mobileCta.classList.toggle('visible', window.scrollY > 500);
    });
}

// ===== COUNTDOWN TIMER =====
const cdDays = document.getElementById('cdDays');
const cdHours = document.getElementById('cdHours');
const cdMins = document.getElementById('cdMins');
const cdSecs = document.getElementById('cdSecs');

if (cdDays) {
    // Set deadline to 3 days from now (evergreen)
    let deadline = localStorage.getItem('bb-countdown');
    if (!deadline || new Date(deadline) < new Date()) {
        deadline = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
        localStorage.setItem('bb-countdown', deadline);
    }

    function updateCountdown() {
        const diff = new Date(deadline) - new Date();
        if (diff <= 0) {
            // Reset for 3 more days
            deadline = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
            localStorage.setItem('bb-countdown', deadline);
        }
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / (1000 * 60)) % 60);
        const s = Math.floor((diff / 1000) % 60);
        cdDays.textContent = String(d).padStart(2, '0');
        cdHours.textContent = String(h).padStart(2, '0');
        cdMins.textContent = String(m).padStart(2, '0');
        cdSecs.textContent = String(s).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ===== COUNTER ANIMATION (count up on scroll) =====
const statNumbers = document.querySelectorAll('.stat-number[data-target]');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.target);
            let current = 0;
            const step = Math.ceil(target / 60);
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                el.textContent = current.toLocaleString('en') + '+';
            }, 25);
            counterObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(el => counterObserver.observe(el));

// ===== PARALLAX ON BACKGROUND IMAGES =====
const parallaxSections = document.querySelectorAll('.section-with-bg');
window.addEventListener('scroll', () => {
    parallaxSections.forEach(section => {
        const img = section.querySelector('.section-bg-image img');
        if (!img) return;
        const rect = section.getBoundingClientRect();
        const speed = 0.3;
        const offset = rect.top * speed;
        img.style.transform = `translateY(${offset}px) scale(1.1)`;
    });
});

// ===== LIVE SIGNUP TOAST (Social Proof) =====
const names = [
    'أحمد من دبي',
    'سارة من أبوظبي',
    'عبدالله من الدوحة',
    'مريم من الشارقة',
    'يوسف من عجمان',
    'نورة من الكويت',
    'خالد من الرياض',
    'فاطمة من رأس الخيمة',
    'محمد من الفجيرة',
    'هند من أم القيوين'
];

const plans = ['الباقة الشهرية', 'الباقة السنوية', 'باقة مدى الحياة'];

function showSignupToast() {
    // Only show on main page
    if (!document.getElementById('hero')) return;

    const toast = document.createElement('div');
    toast.className = 'signup-toast';
    const name = names[Math.floor(Math.random() * names.length)];
    const plan = plans[Math.floor(Math.random() * plans.length)];
    const mins = Math.floor(Math.random() * 15) + 1;
    toast.innerHTML = `
        <span class="toast-icon">🐻</span>
        <div>
            <strong>${name}</strong> اشترك في ${plan}
            <span class="toast-time">قبل ${mins} دقيقة</span>
        </div>
    `;

    // Add styles inline
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        background: document.documentElement.getAttribute('data-theme') === 'light' ? 'rgba(255,255,255,0.95)' : 'rgba(18, 18, 26, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--border-light)',
        borderRadius: '12px',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        color: document.documentElement.getAttribute('data-theme') === 'light' ? '#111827' : '#f0f0f5',
        fontFamily: "'Cairo', sans-serif",
        fontSize: '0.9rem',
        zIndex: '9999',
        boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
        transform: 'translateX(-120%)',
        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        direction: 'rtl',
        maxWidth: '340px'
    });

    document.body.appendChild(toast);

    // Slide in
    requestAnimationFrame(() => {
        toast.style.transform = 'translateX(0)';
    });

    // Slide out after 4s
    setTimeout(() => {
        toast.style.transform = 'translateX(-120%)';
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}

// Show first toast after 8 seconds, then every 20-40 seconds
setTimeout(showSignupToast, 8000);
setInterval(() => {
    const delay = Math.random() * 20000 + 20000;
    setTimeout(showSignupToast, delay);
}, 40000);
