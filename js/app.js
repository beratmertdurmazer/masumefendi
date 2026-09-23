/**
 * MASUM EFENDİ HİZMET EKOSİSTEMİ - İNTERAKTİF SUNUM MOTORU (V4 EDİTORYAL & GERÇEKÇİ SÜREÇ)
 */

document.addEventListener('DOMContentLoaded', () => {
  initPhoneSimulator();
  initPresentationDeck();
  initImpactSimulator();
  initScrollSpy();
  initThemeToggle();
  initHotkeys();
});

/* ==========================================================================
   1. TELEFON SİMÜLATÖRÜ KONTROLÜ
   ========================================================================== */
function initPhoneSimulator() {
  const pills = document.querySelectorAll('.phone-screen-pill');
  const views = document.querySelectorAll('.phone-content-view');

  window.switchPhoneView = function(viewId) {
    views.forEach(view => {
      if (view.id === viewId) {
        view.classList.add('active');
      } else {
        view.classList.remove('active');
      }
    });

    pills.forEach(pill => {
      const onclickAttr = pill.getAttribute('onclick') || '';
      if (onclickAttr.includes(viewId)) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });
  };
}

/* ==========================================================================
   2. 4 TEMEL SÜTUN SEKME DEĞİŞİMİ
   ========================================================================== */
window.switchPillar = function(colId, btnElement) {
  const allCols = document.querySelectorAll('.pillar-box');
  allCols.forEach(col => {
    col.style.display = 'none';
  });

  const target = document.getElementById(colId);
  if (target) {
    target.style.display = 'block';
  }

  const buttons = btnElement.parentElement.querySelectorAll('.phone-screen-pill');
  buttons.forEach(b => b.classList.remove('active'));
  btnElement.classList.add('active');
};

/* ==========================================================================
   3. SLAYT VE SUNUM GEZİNTİSİ
   ========================================================================== */
const SECTIONS = [
  'hero',
  'vizyon',
  'sutunlar',
  'calisma-modeli',
  'hizmet-kapsami',
  'etki-simulatoru',
  'kapanis'
];

let currentSlideIndex = 0;

function scrollToSection(targetId) {
  const el = document.getElementById(targetId);
  if (!el) return;
  const headerOffset = window.innerWidth <= 768 ? 68 : 80;
  const elementPosition = el.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  window.scrollTo({
    top: Math.max(0, offsetPosition),
    behavior: 'smooth'
  });
}

function initPresentationDeck() {
  const prevBtn = document.getElementById('deckPrevBtn');
  const nextBtn = document.getElementById('deckNextBtn');
  const infoEl = document.getElementById('deckSlideInfo');
  const fsBtn = document.getElementById('deckFullscreenBtn');

  function updateDeck(index) {
    if (index < 0) index = 0;
    if (index >= SECTIONS.length) index = SECTIONS.length - 1;
    currentSlideIndex = index;

    scrollToSection(SECTIONS[currentSlideIndex]);

    if (infoEl) {
      infoEl.textContent = `Bölüm ${currentSlideIndex + 1} / ${SECTIONS.length}`;
    }
  }

  if (prevBtn) prevBtn.addEventListener('click', () => updateDeck(currentSlideIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => updateDeck(currentSlideIndex + 1));
  if (fsBtn) fsBtn.addEventListener('click', toggleFullscreen);

  // Sayfa içi tüm çapa (#) linklerini de aynı akıllı offset ile kaydır
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const hash = this.getAttribute('href');
      if (hash && hash.length > 1) {
        const targetId = hash.substring(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          e.preventDefault();
          scrollToSection(targetId);
        }
      }
    });
  });
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.warn('Tam ekran isteği engellendi:', err);
    });
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
  }
}

/* ==========================================================================
   4. ETKİ VE BÜYÜME SİMÜLATÖRÜ
   ========================================================================== */
function initImpactSimulator() {
  const usersRange = document.getElementById('simUsersRange');
  const youthRange = document.getElementById('simYouthRange');
  const donationRange = document.getElementById('simDonationRange');

  const usersVal = document.getElementById('simUsersVal');
  const youthVal = document.getElementById('simYouthVal');
  const donationVal = document.getElementById('simDonationVal');

  const resDau = document.getElementById('resActiveDau');
  const resAnnualInfak = document.getElementById('resAnnualInfak');
  const resWells = document.getElementById('resWellsCount');
  const resYouthCount = document.getElementById('resYouthCount');

  function calculate() {
    const users = parseInt(usersRange.value, 10);
    const youthPercent = parseInt(youthRange.value, 10);
    const avgDonation = parseInt(donationRange.value, 10);

    usersVal.textContent = users.toLocaleString('tr-TR') + ' Kişi';
    youthVal.textContent = '%' + youthPercent;
    donationVal.textContent = '₺' + avgDonation;

    const dau = Math.round(users * 0.24);
    const youthTotal = Math.round(users * (youthPercent / 100));
    const activeDonors = users * 0.065;
    const monthlyDonation = activeDonors * avgDonation;
    const annualDonation = monthlyDonation * 12;
    const wellsCount = Math.floor(annualDonation / 65000);

    if (resDau) resDau.textContent = dau.toLocaleString('tr-TR');
    if (resAnnualInfak) resAnnualInfak.textContent = '₺' + formatCurrencyShort(annualDonation);
    if (resWells) resWells.textContent = wellsCount + ' Kuyu';
    if (resYouthCount) resYouthCount.textContent = youthTotal.toLocaleString('tr-TR');
  }

  function formatCurrencyShort(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + ' Milyon';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + ' Bin';
    }
    return num.toLocaleString('tr-TR');
  }

  if (usersRange && youthRange && donationRange) {
    usersRange.addEventListener('input', calculate);
    youthRange.addEventListener('input', calculate);
    donationRange.addEventListener('input', calculate);
    calculate();
  }
}

/* ==========================================================================
   5. SCROLL SPY
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const infoEl = document.getElementById('deckSlideInfo');

  window.addEventListener('scroll', () => {
    let current = '';
    const offset = window.innerWidth <= 768 ? 130 : 200;
    const scrollPos = window.scrollY + offset;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });

    const foundIdx = SECTIONS.indexOf(current);
    if (foundIdx !== -1) {
      currentSlideIndex = foundIdx;
      if (infoEl) {
        infoEl.textContent = `Bölüm ${currentSlideIndex + 1} / ${SECTIONS.length}`;
      }
    }
  });
}

/* ==========================================================================
   6. AYDINLIK / KOYU MOD GEÇİŞİ
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  if (!toggleBtn) return;

  function updateBtnUI(isLight) {
    toggleBtn.innerHTML = isLight
      ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg> <span>Koyu</span>`
      : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg> <span>Aydınlık</span>`;
    toggleBtn.title = isLight ? "Koyu Moda Geç" : "Aydınlık Moda Geç";
  }

  // Varsayılan açılış modu: Aydınlık Mod
  const savedTheme = localStorage.getItem('masum_theme');
  if (savedTheme === 'dark') {
    document.body.classList.remove('light-mode');
    updateBtnUI(false);
  } else {
    document.body.classList.add('light-mode');
    updateBtnUI(true);
  }

  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('masum_theme', isLight ? 'light' : 'dark');
    updateBtnUI(isLight);
  });
}

/* ==========================================================================
   7. KLAVYE KISAYOLLARI
   ========================================================================== */
function initHotkeys() {
  window.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      const nextBtn = document.getElementById('deckNextBtn');
      if (nextBtn) nextBtn.click();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      const prevBtn = document.getElementById('deckPrevBtn');
      if (prevBtn) prevBtn.click();
    } else if (e.key.toLowerCase() === 'f') {
      toggleFullscreen();
    }
  });

  window.toggleShortcutModal = function() {
    const modal = document.getElementById('shortcutModal');
    if (modal) modal.classList.toggle('active');
  };
}
