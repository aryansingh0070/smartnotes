/* ==========================================
   SMARTNOTES — NUCLEAR JS (NO CUSTOM CURSOR)
   Designed by 24BCE0403
   ========================================== */

// ============ PRELOADER ============
window.addEventListener('load', function() {
  setTimeout(function() {
    var p = document.getElementById('preloader');
    if (p) p.classList.add('hidden');
  }, 2200);
});

// ============ NAVBAR SCROLL + PROGRESS ============
window.addEventListener('scroll', function() {
  var nav = document.getElementById('mainNav');
  var topBtn = document.getElementById('backToTop');
  var scrollProg = document.getElementById('scrollProgress');

  if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
  if (topBtn) topBtn.classList.toggle('show', window.scrollY > 400);

  if (scrollProg) {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProg.style.width = percent + '%';
  }
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============ DARK MODE ============
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  var btn = document.getElementById('themeBtn');
  if (btn) {
    if (document.body.classList.contains('dark-mode')) {
      btn.innerHTML = '<i class="fas fa-sun"></i>';
      localStorage.setItem('smartnotes-theme', 'dark');
    } else {
      btn.innerHTML = '<i class="fas fa-moon"></i>';
      localStorage.setItem('smartnotes-theme', 'light');
    }
  }
}

window.addEventListener('DOMContentLoaded', function() {
  if (localStorage.getItem('smartnotes-theme') === 'dark') {
    document.body.classList.add('dark-mode');
    var btn = document.getElementById('themeBtn');
    if (btn) btn.innerHTML = '<i class="fas fa-sun"></i>';
  }
  startCounters();
  initMeshGradient();
  initDragDrop();
  typeWriter();
  initTilt();
  initScrollReveal();
  updateResultsCount();
});

// ============ TYPEWRITER ============
function typeWriter() {
  var el = document.getElementById('typewriter');
  if (!el) return;
  var words = ['Study Notes', 'Exam Prep', 'Learning', 'Knowledge', 'Success'];
  var wordIndex = 0, charIndex = 0, isDeleting = false, speed = 100;

  function type() {
    var word = words[wordIndex];
    if (isDeleting) { el.textContent = word.substring(0, charIndex - 1); charIndex--; speed = 40; }
    else { el.textContent = word.substring(0, charIndex + 1); charIndex++; speed = 100; }
    if (!isDeleting && charIndex === word.length) { speed = 2500; isDeleting = true; }
    else if (isDeleting && charIndex === 0) { isDeleting = false; wordIndex = (wordIndex + 1) % words.length; speed = 300; }
    setTimeout(type, speed);
  }
  type();
}

// ============ SEARCH ============
function searchNotes() {
  var input = document.getElementById('search').value.toLowerCase();
  var cards = document.getElementsByClassName('note-wrapper');
  var found = 0;
  for (var i = 0; i < cards.length; i++) {
    var text = cards[i].innerText.toLowerCase();
    if (text.includes(input)) { cards[i].style.display = ''; cards[i].style.animation = 'fadeInUp 0.4s ease'; found++; }
    else { cards[i].style.display = 'none'; }
  }
  var noRes = document.getElementById('no-results');
  if (noRes) noRes.style.display = found ? 'none' : 'block';
  updateResultsCount(found);
}

// ============ FILTER ============
function filterNotes(category) {
  var cards = document.getElementsByClassName('note-wrapper');
  var buttons = document.getElementsByClassName('filter-chip');
  for (var b = 0; b < buttons.length; b++) buttons[b].classList.remove('active');
  if (event && event.target) { var target = event.target.closest('.filter-chip'); if (target) target.classList.add('active'); }
  var found = 0;
  for (var i = 0; i < cards.length; i++) {
    if (category === 'all' || cards[i].dataset.category === category) { cards[i].style.display = ''; cards[i].style.animation = 'fadeInUp 0.4s ease'; found++; }
    else { cards[i].style.display = 'none'; }
  }
  var noRes = document.getElementById('no-results');
  if (noRes) noRes.style.display = found ? 'none' : 'block';
  updateResultsCount(found);
  var search = document.getElementById('search');
  if (search) search.value = '';
}

function updateResultsCount(count) {
  var el = document.getElementById('resultsCount');
  if (!el) return;
  if (count === undefined) {
    var cards = document.getElementsByClassName('note-wrapper');
    count = 0;
    for (var i = 0; i < cards.length; i++) { if (cards[i].style.display !== 'none') count++; }
  }
  el.textContent = 'Showing ' + count + ' note' + (count !== 1 ? 's' : '');
}

// ============ DOWNLOAD ============
function downloadNote(btn) {
  btn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Downloading...';
  btn.classList.add('downloading'); btn.disabled = true;
  setTimeout(function() {
    btn.innerHTML = '<i class="fas fa-check-circle me-1"></i>Done!';
    btn.classList.remove('downloading'); btn.classList.add('downloaded');
    setTimeout(function() { btn.innerHTML = '<i class="fas fa-download me-1"></i>Download'; btn.classList.remove('downloaded'); btn.disabled = false; }, 2500);
  }, 2000);
}

// ============ FORM VALIDATION ============
function validateForm() {
  var name = document.getElementById('name');
  var email = document.getElementById('email');
  if (!name.value.trim()) { shakeEl(name); return false; }
  if (!email.value.trim() || !email.value.includes('@') || !email.value.includes('.')) { shakeEl(email); return false; }
  var modal = document.getElementById('successModal');
  if (modal) modal.classList.add('active');
  name.value = ''; email.value = '';
  return false;
}

function shakeEl(el) {
  el.style.animation = 'shake 0.5s'; el.style.borderColor = '#ef4444'; el.focus();
  setTimeout(function() { el.style.animation = ''; el.style.borderColor = ''; }, 600);
}

function closeModal() {
  var modal = document.getElementById('successModal');
  if (modal) modal.classList.remove('active');
}

// ============ COUNTERS ============
function startCounters() {
  var counters = document.querySelectorAll('.counter');
  counters.forEach(function(counter) {
    var target = parseInt(counter.getAttribute('data-target'));
    if (!target) return;
    var current = 0, increment = Math.ceil(target / 80);
    var timer = setInterval(function() {
      current += increment;
      if (current >= target) { counter.textContent = target.toLocaleString() + '+'; clearInterval(timer); }
      else { counter.textContent = current.toLocaleString(); }
    }, 25);
  });
}

// ============ PARTICLE MESH ============
function initMeshGradient() {
  var canvas = document.getElementById('meshGradient');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  var particles = [];
  for (var i = 0; i < 50; i++) {
    particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, size: Math.random() * 2 + 0.5, opacity: Math.random() * 0.3 + 0.1 });
  }
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(function(p, i) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(124,58,237,' + p.opacity + ')'; ctx.fill();
      for (var j = i + 1; j < particles.length; j++) {
        var dx = p.x - particles[j].x, dy = p.y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(particles[j].x, particles[j].y); ctx.strokeStyle = 'rgba(124,58,237,' + (0.05 - dist / 2800) + ')'; ctx.lineWidth = 0.5; ctx.stroke(); }
      }
    });
    requestAnimationFrame(animate);
  }
  animate();
  window.addEventListener('resize', function() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });
}

// ============ DRAG & DROP ============
function initDragDrop() {
  var zone = document.getElementById('dropZone');
  if (!zone) return;
  ['dragenter', 'dragover'].forEach(function(ev) { zone.addEventListener(ev, function(e) { e.preventDefault(); zone.classList.add('drag-over'); }); });
  ['dragleave', 'drop'].forEach(function(ev) { zone.addEventListener(ev, function(e) { e.preventDefault(); zone.classList.remove('drag-over'); }); });
  zone.addEventListener('drop', function(e) { var files = e.dataTransfer.files; if (files.length > 0) showFile(files[0].name); });
  zone.addEventListener('click', function() { var fi = document.getElementById('fileInput'); if (fi) fi.click(); });
  var fileInput = document.getElementById('fileInput');
  if (fileInput) { fileInput.addEventListener('change', function() { if (this.files.length > 0) showFile(this.files[0].name); }); }
}

function showFile(name) {
  var content = document.getElementById('dropContent');
  if (content) { content.innerHTML = '<div class="drop-ultra-icon" style="background:linear-gradient(135deg,rgba(16,185,129,0.1),rgba(16,185,129,0.05));"><i class="fas fa-check-circle" style="color:#10b981;font-size:2rem;"></i></div><h5 class="mt-2">File Selected!</h5><p class="small text-muted mb-0">' + name + '</p>'; }
}

// ============ 3D TILT ============
function initTilt() {
  var cards = document.querySelectorAll('[data-tilt]');
  cards.forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left, y = e.clientY - rect.top;
      var cx = rect.width / 2, cy = rect.height / 2;
      card.style.transform = 'perspective(1000px) rotateX(' + ((y - cy) / 18) + 'deg) rotateY(' + ((cx - x) / 18) + 'deg) scale(1.02)';
    });
    card.addEventListener('mouseleave', function() { card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)'; });
  });
}

// ============ SCROLL REVEAL ============
function initScrollReveal() {
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) { if (entry.isIntersecting) { entry.target.style.opacity = '1'; entry.target.style.transform = 'translateY(0)'; } });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  var elements = document.querySelectorAll('.premium-card, .review-card-ultra, .note-ultra, .process-item, .carousel-card, .lb-item, .faq-item, .bento-item');
  elements.forEach(function(el) { el.style.opacity = '0'; el.style.transform = 'translateY(40px)'; el.style.transition = 'all 0.7s cubic-bezier(0.23,1,0.32,1)'; observer.observe(el); });
}

// ============ COMMAND PALETTE ============
function openCommandPalette() {
  var palette = document.getElementById('commandPalette');
  if (palette) { palette.classList.add('active'); setTimeout(function() { var input = document.getElementById('commandInput'); if (input) { input.value = ''; input.focus(); } }, 100); }
}
function closeCommandPalette() { var palette = document.getElementById('commandPalette'); if (palette) palette.classList.remove('active'); }
function filterCommands() { var input = document.getElementById('commandInput').value.toLowerCase(); var items = document.querySelectorAll('.command-item'); items.forEach(function(item) { item.style.display = item.innerText.toLowerCase().includes(input) ? 'flex' : 'none'; }); }
function goTo(url) { closeCommandPalette(); window.location.href = url; }
document.addEventListener('click', function(e) { var palette = document.getElementById('commandPalette'); if (palette && e.target === palette) closeCommandPalette(); });

// ============ KEYBOARD SHORTCUTS ============
document.addEventListener('keydown', function(e) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); var palette = document.getElementById('commandPalette'); if (palette) { palette.classList.contains('active') ? closeCommandPalette() : openCommandPalette(); } var search = document.getElementById('search'); if (search && !palette) search.focus(); }
  if (e.key === 'Escape') { closeCommandPalette(); var np = document.getElementById('notifPanel'); if (np) np.classList.remove('active'); var fm = document.getElementById('fabMenu'); var fb = document.getElementById('fabBtn'); if (fm && fm.classList.contains('active')) { fm.classList.remove('active'); if (fb) fb.classList.remove('active'); } }
  if ((e.metaKey || e.ctrlKey) && e.key === 'd') { e.preventDefault(); toggleDarkMode(); }
  if ((e.metaKey || e.ctrlKey) && e.key === 'ArrowUp') { e.preventDefault(); scrollToTop(); }
});

// ============ NOTIFICATIONS ============
function toggleNotifPanel() { var panel = document.getElementById('notifPanel'); if (panel) panel.classList.toggle('active'); }
function clearNotifs() { var list = document.querySelector('.notif-list'); if (list) { list.innerHTML = '<div style="text-align:center;padding:45px;color:rgba(255,255,255,0.3);"><i class="fas fa-bell-slash" style="font-size:2rem;margin-bottom:12px;display:block;"></i><p style="margin:0;">No notifications</p></div>'; } var badge = document.querySelector('.notif-badge'); if (badge) badge.style.display = 'none'; }
document.addEventListener('click', function(e) { var panel = document.getElementById('notifPanel'); var btn = document.getElementById('notifBtn'); if (panel && btn && !panel.contains(e.target) && !btn.contains(e.target)) { panel.classList.remove('active'); } });

// ============ TOAST ============
function closeToast(id) { var toast = document.getElementById(id); if (toast) { toast.style.animation = 'slideOutRight 0.3s ease forwards'; setTimeout(function() { toast.style.display = 'none'; }, 300); } }
function showToast(title, message) { var container = document.getElementById('toastContainer'); if (!container) return; var toast = document.createElement('div'); toast.className = 'custom-toast'; toast.innerHTML = '<div class="toast-icon"><i class="fas fa-bell"></i></div><div class="toast-body"><strong>' + title + '</strong><p>' + message + '</p></div><button class="toast-close" onclick="this.parentElement.remove()">×</button>'; container.appendChild(toast); setTimeout(function() { toast.style.animation = 'slideOutRight 0.3s ease forwards'; setTimeout(function() { toast.remove(); }, 300); }, 4000); }
setTimeout(function() { var toast = document.getElementById('welcomeToast'); if (toast) { setTimeout(function() { toast.style.animation = 'slideOutRight 0.3s ease forwards'; setTimeout(function() { toast.style.display = 'none'; }, 300); }, 5000); } }, 2500);

// ============ FAQ ============
function toggleFaq(item) { var isActive = item.classList.contains('active'); document.querySelectorAll('.faq-item').forEach(function(faq) { faq.classList.remove('active'); }); if (!isActive) item.classList.add('active'); }

// ============ CAROUSEL ============
function scrollCarousel(dir) { var track = document.getElementById('carouselTrack'); if (track) track.scrollBy({ left: dir * 270, behavior: 'smooth' }); }

// ============ FAB ============
function toggleFab() { var btn = document.getElementById('fabBtn'); var menu = document.getElementById('fabMenu'); if (btn && menu) { btn.classList.toggle('active'); menu.classList.toggle('active'); } }

// ============ NEWSLETTER ============
function subscribeNewsletter() { var email = document.getElementById('newsletterEmail'); if (!email || !email.value.includes('@')) { if (email) { email.style.animation = 'shake 0.5s'; setTimeout(function() { email.style.animation = ''; }, 600); } return; } showToast('Subscribed! 🎉', 'Updates sent to ' + email.value); email.value = ''; }

// ============ SMOOTH ANCHORS ============
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) { anchor.addEventListener('click', function(e) { var target = document.querySelector(this.getAttribute('href')); if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); } }); });