// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initMobileMenu();
    initLocomotive();
    initGSAP();
    initCounters();
    initGalleryFilter();
    initPricingCalculator();
    initBooking();
    initTestimonials();
    initContactForm();
    initBackToTop();
    initHeroSlideshow();
    
    // Cek apakah di halaman booking, ambil data dari localStorage
    if (window.location.pathname.includes('booking.html')) {
        loadBookingData();
    }
});

// ==================== LOCOMOTIVE SCROLL ====================
let locoScroll = null;
function initLocomotive() {
    const scrollEl = document.querySelector('[data-scroll-container]');
    if (!scrollEl) return;

    locoScroll = new LocomotiveScroll({
        el: scrollEl,
        smooth: true,
        multiplier: 0.8,
        lerp: 0.05,
        smartphone: { smooth: true },
        tablet: { smooth: true }
    });

    // Update GSAP ScrollTrigger
    locoScroll.on('scroll', ScrollTrigger.update);

    ScrollTrigger.scrollerProxy('[data-scroll-container]', {
        scrollTop(value) {
            return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
            return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        },
        pinType: document.querySelector('[data-scroll-container]').style.transform ? 'transform' : 'fixed'
    });

    ScrollTrigger.addEventListener('refresh', () => locoScroll.update());
    ScrollTrigger.refresh();
}

// ==================== DARK MODE TOGGLE ====================
function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
        document.body.classList.add('dark-mode');
        toggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    toggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        toggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        if (locoScroll) setTimeout(() => locoScroll.update(), 100);
    });
}

// ==================== MOBILE MENU ====================
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}

// ==================== GSAP ANIMATIONS ====================
function initGSAP() {
    gsap.registerPlugin(ScrollTrigger);

    // Hero image parallax
    gsap.to('.hero-image', {
        scrollTrigger: {
            trigger: '.hero',
            scroller: '[data-scroll-container]',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        },
        y: 50,
        scale: 1.2
    });

    // Animasi zoom pada hero background
    gsap.to('.hero-background', {
        scrollTrigger: {
            trigger: '.hero',
            scroller: '[data-scroll-container]',
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
        },
        scale: 1.3,
        ease: 'none'
    });

    // Preview cards stagger
    gsap.from('.preview-card', {
        scrollTrigger: {
            trigger: '.preview-grid',
            scroller: '[data-scroll-container]',
            start: 'top 80%',
            end: 'bottom 60%',
            scrub: 1
        },
        opacity: 0,
        y: 50,
        scale: 0.9,
        stagger: 0.2
    });

    // Package cards
    gsap.utils.toArray('.package-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                scroller: '[data-scroll-container]',
                start: 'top 80%',
                end: 'bottom 60%',
                scrub: 1
            },
            opacity: 0,
            y: 50,
            delay: i * 0.1
        });
    });
}

// ==================== COUNTER ANIMATION ====================
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.dataset.target;
                let count = 0;
                
                // Tentukan step agar animasi selesai dalam ~30 frame (≈0.5 detik)
                const step = Math.ceil(target / 50); 
                
                const update = () => {
                    counter.innerText = count;
                    if (count < target) {
                        count = Math.min(count + step, target);
                        requestAnimationFrame(update);
                    }
                };
                update();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

// ==================== GALLERY FILTER ====================
function initGalleryFilter() {
    const galleryGrid = document.getElementById('galleryGrid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (!galleryGrid || !filterBtns.length) return;

    const images = [
        { cat: 'wedding', src: 'https://images.pexels.com/photos/2292970/pexels-photo-2292970.jpeg', title: 'Wedding' },
        { cat: 'wedding', src: 'https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg', title: 'Wedding' },
        { cat: 'wedding', src: 'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg', title: 'Wedding' },
        { cat: 'graduation', src: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg', title: 'Graduation' },
        { cat: 'graduation', src: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg', title: 'Graduation' },
        { cat: 'graduation', src: 'https://images.pexels.com/photos/3748221/pexels-photo-3748221.jpeg', title: 'Graduation' },
        { cat: 'family', src: 'https://images.pexels.com/photos/3759658/pexels-photo-3759658.jpeg', title: 'Family' },
        { cat: 'family', src: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg', title: 'Family' },
        { cat: 'family', src: 'https://images.pexels.com/photos/3791664/pexels-photo-3791664.jpeg', title: 'Family' },
        { cat: 'product', src: 'https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg', title: 'Product' },
        { cat: 'product', src: 'https://images.pexels.com/photos/3768918/pexels-photo-3768918.jpeg', title: 'Product' },
        { cat: 'product', src: 'https://images.pexels.com/photos/4202325/pexels-photo-4202325.jpeg', title: 'Product' },
    ];

    function render(cat = 'all') {
        galleryGrid.innerHTML = '';
        const filtered = cat === 'all' ? images : images.filter(img => img.cat === cat);
        filtered.forEach(img => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.innerHTML = `
                <img src="${img.src}" alt="${img.title}" loading="lazy">
                <div class="gallery-overlay"><h3>${img.title}</h3></div>
            `;
            galleryGrid.appendChild(item);
        });
    }

    render('all');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            render(btn.dataset.filter);
        });
    });
}

// ==================== PRICING CALCULATOR (DENGAN LOCALSTORAGE) ====================
function initPricingCalculator() {
    const pkgSelect = document.getElementById('packageSelect');
    const extraDur = document.getElementById('extraDuration');
    const extra4R = document.getElementById('extraPhoto4R');
    const extraA4 = document.getElementById('extraPhotoA4');
    const frame4R = document.getElementById('frame4R');
    const frameA4 = document.getElementById('frameA4');
    const totalEl = document.getElementById('totalPrice');
    if (!pkgSelect || !totalEl) return;

    const prices = {
        cemara: 250000,
        rame: 289000,
        wisudah: 250000,
        sekampoeng: 350000
    };
    const addons = {
        extraDuration: 25000,
        extraPhoto4R: 15000,
        extraPhotoA4: 35000,
        frame4R: 25000,
        frameA4: 60000
    };

    function updateTotal() {
        let total = prices[pkgSelect.value];
        total += (parseInt(extraDur.value) || 0) * addons.extraDuration;
        total += (parseInt(extra4R.value) || 0) * addons.extraPhoto4R;
        total += (parseInt(extraA4.value) || 0) * addons.extraPhotoA4;
        total += (parseInt(frame4R.value) || 0) * addons.frame4R;
        total += (parseInt(frameA4.value) || 0) * addons.frameA4;
        totalEl.innerText = 'Rp ' + total.toLocaleString('id-ID');
    }

    [pkgSelect, extraDur, extra4R, extraA4, frame4R, frameA4].forEach(el => {
        if (el) el.addEventListener('input', updateTotal);
    });
    updateTotal();
}

// ==================== FUNGSI MENYIMPAN DATA KE LOCALSTORAGE ====================
function saveBookingData() {
    const pkgSelect = document.getElementById('packageSelect');
    const extraDur = document.getElementById('extraDuration');
    const extra4R = document.getElementById('extraPhoto4R');
    const extraA4 = document.getElementById('extraPhotoA4');
    const frame4R = document.getElementById('frame4R');
    const frameA4 = document.getElementById('frameA4');
    const totalEl = document.getElementById('totalPrice');
    
    if (!pkgSelect || !totalEl) return;
    
    // Ambil nama paket yang dipilih
    const selectedOption = pkgSelect.options[pkgSelect.selectedIndex];
    const packageName = selectedOption ? selectedOption.text : pkgSelect.value;
    
    const bookingData = {
        package: pkgSelect.value,
        packageName: packageName,
        extraDuration: extraDur ? extraDur.value : '0',
        extraPhoto4R: extra4R ? extra4R.value : '0',
        extraPhotoA4: extraA4 ? extraA4.value : '0',
        frame4R: frame4R ? frame4R.value : '0',
        frameA4: frameA4 ? frameA4.value : '0',
        totalPrice: totalEl.innerText
    };
    
    localStorage.setItem('bookingData', JSON.stringify(bookingData));
}

// ==================== FUNGSI MEMUAT DATA DARI LOCALSTORAGE DI HALAMAN BOOKING ====================
function loadBookingData() {
    const savedData = localStorage.getItem('bookingData');
    if (!savedData) return;
    
    try {
        const data = JSON.parse(savedData);
        
        // Set nilai di form booking jika elemennya ada
        const packageSelect = document.getElementById('packageSelect');
        if (packageSelect && data.package) {
            packageSelect.value = data.package;
        }
        
        // Buat elemen ringkasan booking
        const bookingSummary = document.createElement('div');
        bookingSummary.className = 'booking-summary';
        bookingSummary.innerHTML = `
            <h4>Ringkasan Pemesanan</h4>
            <p><strong>Paket:</strong> ${data.packageName || data.package}</p>
            <p><strong>Durasi Tambahan:</strong> ${data.extraDuration || 0} x 10 menit</p>
            <p><strong>Extra Foto 4R:</strong> ${data.extraPhoto4R || 0}</p>
            <p><strong>Extra Foto A4:</strong> ${data.extraPhotoA4 || 0}</p>
            <p><strong>Frame 4R:</strong> ${data.frame4R || 0}</p>
            <p><strong>Frame A4:</strong> ${data.frameA4 || 0}</p>
            <p><strong>Total Harga:</strong> ${data.totalPrice || 'Rp 0'}</p>
        `;
        
        // Sisipkan ringkasan di atas form booking
        const bookingFormWrapper = document.querySelector('.booking-form-wrapper');
        if (bookingFormWrapper) {
            bookingFormWrapper.insertBefore(bookingSummary, bookingFormWrapper.firstChild);
        }
    } catch (e) {
        console.error('Error loading booking data:', e);
    }
}

// ==================== BOOKING (DENGAN FITUR MENGHAPUS LOCALSTORAGE) ====================
function initBooking() {
    const calendarInput = document.getElementById('calendar');
    const timeSlots = document.querySelectorAll('.time-slot');
    const bookingForm = document.getElementById('bookingForm');
    if (!calendarInput || !bookingForm) return;

    if (typeof flatpickr !== 'undefined') {
        flatpickr(calendarInput, {
            minDate: 'today',
            maxDate: new Date().fp_incr(60),
            dateFormat: 'd M Y',
            disable: [date => date.getDay() === 0]
        });
    }

    let selectedTime = '';
    timeSlots.forEach(slot => {
        slot.addEventListener('click', () => {
            timeSlots.forEach(s => s.classList.remove('selected'));
            slot.classList.add('selected');
            selectedTime = slot.dataset.time;
        });
    });

    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name')?.value;
        const email = document.getElementById('email')?.value;
        const packageSelect = document.getElementById('packageSelect')?.value;
        const people = document.getElementById('people')?.value;
        const notes = document.getElementById('notes')?.value;
        const date = calendarInput.value;

        if (!date) { alert('Pilih tanggal'); return; }
        if (!selectedTime) { alert('Pilih jam'); return; }

        const phone = '081977460540';
        const message = `Halo Prototype Studio, saya ${name} ingin booking:
Tanggal: ${date}
Jam: ${selectedTime}
Paket: ${packageSelect}
Jumlah orang: ${people}
Catatan: ${notes || '-'}
Email: ${email}`;
        
        // Buka WhatsApp
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
        
        // Hapus data booking dari localStorage setelah sukses kirim
        localStorage.removeItem('bookingData');
    });
}

// ==================== TESTIMONIALS ====================
function initTestimonials() {
    const grid = document.getElementById('testimonialGrid');
    if (!grid) return;

    const testimonials = [
        { name: 'Sarah Wijaya', role: 'Wedding', text: 'Hasil fotonya luar biasa! Profesional, ramah, dan tepat waktu.', rating: 5, avatar: '👰', img: 'https://images.pexels.com/photos/2292970/pexels-photo-2292970.jpeg' },
        { name: 'Budi Santoso', role: 'Graduation', text: 'Momen wisuda saya diabadikan dengan sangat baik. Kualitas foto premium.', rating: 5, avatar: '🎓', img: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg' },
        { name: 'Dewi Lestari', role: 'Family', text: 'Sesi foto keluarga jadi menyenangkan. Hasilnya natural dan hangat.', rating: 5, avatar: '👨‍👩‍👧', img: 'https://images.pexels.com/photos/3759658/pexels-photo-3759658.jpeg' },
        { name: 'Ahmad Fauzi', role: 'Product', text: 'Fotografi produk untuk online shop saya jadi lebih profesional.', rating: 4, avatar: '📦', img: 'https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg' },
        { name: 'Rina Melati', role: 'Graduation', text: 'Paket Wis-udah worth it banget!', rating: 5, avatar: '🎓', img: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg' },
        { name: 'Hendra Gunawan', role: 'Wedding', text: 'Dari prewed sampai akad, semua momen keambil dengan sempurna.', rating: 5, avatar: '🤵', img: 'https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg' }
    ];

    testimonials.forEach(t => {
        const card = document.createElement('div');
        card.className = 'testimonial-card';
        let stars = '';
        for (let i = 0; i < 5; i++) stars += i < t.rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
        card.innerHTML = `
            <div class="testimonial-image"><img src="${t.img}" alt="${t.name}" loading="lazy" style="width:100%; height:150px; object-fit:cover; border-radius:10px;"></div>
            <div class="testimonial-rating">${stars}</div>
            <p class="testimonial-text">"${t.text}"</p>
            <p class="testimonial-author">${t.name}</p>
            <p class="testimonial-role">${t.role}</p>
        `;
        grid.appendChild(card);
    });
}

// ==================== CONTACT FORM ====================
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('contactName')?.value;
        const email = document.getElementById('contactEmail')?.value;
        const message = document.getElementById('contactMessage')?.value;
        const phone = '081977460540';
        const text = `Halo Prototype Studio, saya ${name} (${email}). Pesan: ${message}`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
    });
}

// ==================== BACK TO TOP ====================
function initBackToTop() {
    const btn = document.createElement('div');
    btn.className = 'back-to-top';
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) btn.classList.add('active');
        else btn.classList.remove('active');
    });

    btn.addEventListener('click', () => {
        if (locoScroll) locoScroll.scrollTo(0);
        else window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ==================== HERO SLIDESHOW ====================
function initHeroSlideshow() {
    const slides = document.querySelectorAll('.hero-bg-image');
    if (!slides.length) return;

    let current = 0;
    const intervalTime = 15000; // 15 detik

    setInterval(() => {
        slides[current].classList.remove('active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('active');
    }, intervalTime);
}

// ==================== GLOBAL FUNCTIONS ====================
window.selectPackage = function(pkg) {
    const sel = document.getElementById('packageSelect');
    if (sel) {
        sel.value = pkg;
        sel.dispatchEvent(new Event('input'));
        const calc = document.querySelector('.calculator-section');
        if (calc && locoScroll) locoScroll.scrollTo(calc);
    }
};

// ==================== PROCEED TO BOOKING (DENGAN MENYIMPAN DATA) ====================
window.proceedToBooking = function() {
    saveBookingData(); // Simpan data ke localStorage
    window.location.href = 'booking.html';
};