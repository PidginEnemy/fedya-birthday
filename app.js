const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.remove('pending');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(element => {
    element.classList.add('pending');
    observer.observe(element);
  });
}
let celebrationTimer;
document.querySelector('#celebrate').addEventListener('click', () => {
  document.querySelector('#celebration-status').textContent = 'С днем рождения, Федя! Ура!';
  const container = document.querySelector('#confetti');
  container.replaceChildren();
  clearTimeout(celebrationTimer);
  if (reducedMotion.matches) return;
  for (let i = 0; i < 65; i++) {
    const piece = document.createElement('i');
    piece.className = 'confetto';
    piece.style.setProperty('--c', ['#ff6900', '#ffb27d', '#252525', '#ffc82d'][i % 4]);
    piece.style.setProperty('--left', `${Math.random() * 100}%`);
    piece.style.setProperty('--drift', `${Math.random() * 200 - 100}px`);
    piece.style.setProperty('--duration', `${2 + Math.random() * 1.6}s`);
    piece.style.setProperty('--delay', `${Math.random() * 0.5}s`);
    container.append(piece);
  }
  celebrationTimer = setTimeout(() => container.replaceChildren(), 4200);
});

const music = document.querySelector('#birthday-music');
const musicButton = document.querySelector('#music-toggle');
const musicStatus = document.querySelector('#music-status');
const musicHint = document.querySelector('#music-hint');
music.volume = 0.3;
function updateMusicButton() {
  const playing = !music.paused;
  if (playing) musicHint.hidden = true;
  const label = playing ? 'Выключить музыку' : 'Включить музыку';
  musicButton.setAttribute('aria-pressed', String(playing));
  musicButton.setAttribute('aria-label', label);
  musicButton.title = label;
}
music.addEventListener('play', updateMusicButton);
music.addEventListener('pause', updateMusicButton);
let autoStartPending = true;
function stopAutoStart() {
  autoStartPending = false;
  document.removeEventListener('click', tryAutoStart);
  document.removeEventListener('keydown', tryAutoStart);
}
async function playMusic() {
  await music.play();
  stopAutoStart();
  musicStatus.textContent = '';
}
function tryAutoStart(event) {
  if (!autoStartPending || event?.target.closest('#music-toggle')) return;
  // Browsers can require a visitor gesture before playing audible media.
  playMusic().catch(() => { musicHint.hidden = !music.paused; });
}
document.addEventListener('click', tryAutoStart);
document.addEventListener('keydown', tryAutoStart);
tryAutoStart();
musicButton.addEventListener('click', async () => {
  stopAutoStart();
  if (!music.paused) {
    music.pause();
    return;
  }
  musicButton.disabled = true;
  try {
    await playMusic();
  } catch {
    musicHint.hidden = false;
    musicStatus.textContent = 'Музыка не запустилась. Нажми кнопку музыки ещё раз.';
    musicButton.title = musicStatus.textContent;
  } finally {
    musicButton.disabled = false;
  }
});
