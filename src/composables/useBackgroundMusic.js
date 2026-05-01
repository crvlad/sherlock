import { onUnmounted, ref } from 'vue';

const MUSIC_ENABLED_KEY = 'sherlock-music-enabled';
const MUSIC_VOLUME_KEY = 'sherlock-music-volume';

const musicSupported =
  typeof window !== 'undefined' &&
  typeof window.Audio !== 'undefined';

export function useBackgroundMusic(options = {}) {
  const tracks = Array.isArray(options.tracks) ? options.tracks.filter(Boolean) : [];
  const defaultVolume = clampVolume(options.defaultVolume ?? 0.02);

  const musicEnabled = ref(false);
  const musicVolume = ref(defaultVolume);

  let playlist = [];
  let currentTrack = '';
  let audio = null;

  if (musicSupported) {
    const storedEnabled = window.localStorage.getItem(MUSIC_ENABLED_KEY);
    const storedVolume = Number(window.localStorage.getItem(MUSIC_VOLUME_KEY));

    musicEnabled.value = storedEnabled === null ? true : storedEnabled === '1';
    musicVolume.value = Number.isFinite(storedVolume) ? clampVolume(storedVolume) : defaultVolume;

    audio = new Audio();
    audio.preload = 'auto';
    audio.loop = false;
    audio.volume = musicVolume.value;

    audio.addEventListener('ended', () => {
      if (!musicEnabled.value) return;
      void playNext();
    });

    const resumeOnInteraction = () => {
      if (!musicEnabled.value || !audio || !audio.paused) return;
      void playNext();
    };

    window.addEventListener('pointerdown', resumeOnInteraction, { passive: true });

    onUnmounted(() => {
      window.removeEventListener('pointerdown', resumeOnInteraction);
    });
  }

  function shuffleTracks() {
    playlist = tracks.slice();

    for (let i = playlist.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = playlist[i];
      playlist[i] = playlist[j];
      playlist[j] = temp;
    }

    if (playlist.length > 1 && playlist[0] === currentTrack) {
      const swapIndex = 1 + Math.floor(Math.random() * (playlist.length - 1));
      const temp = playlist[0];
      playlist[0] = playlist[swapIndex];
      playlist[swapIndex] = temp;
    }
  }

  function nextTrack() {
    if (!playlist.length) {
      shuffleTracks();
    }

    const next = playlist.shift() || '';
    currentTrack = next;
    return next;
  }

  async function playNext() {
    if (!musicSupported || !audio || !musicEnabled.value || !tracks.length) return;

    const track = nextTrack();
    if (!track) return;

    audio.src = track;

    try {
      await audio.play();
    } catch {
      // Autoplay may be blocked until explicit interaction.
    }
  }

  async function enableMusic() {
    if (!musicSupported || !tracks.length) return;
    musicEnabled.value = true;
    window.localStorage.setItem(MUSIC_ENABLED_KEY, '1');

    if (audio?.paused) {
      await playNext();
    }
  }

  function disableMusic() {
    if (!musicSupported || !audio) return;

    musicEnabled.value = false;
    window.localStorage.setItem(MUSIC_ENABLED_KEY, '0');
    audio.pause();
    audio.currentTime = 0;
  }

  async function toggleMusic() {
    if (musicEnabled.value) {
      disableMusic();
      return;
    }

    await enableMusic();
  }

  function setMusicVolume(value) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return;

    const clamped = clampVolume(parsed);
    musicVolume.value = clamped;

    if (audio) {
      audio.volume = clamped;
    }

    if (musicSupported) {
      window.localStorage.setItem(MUSIC_VOLUME_KEY, String(clamped));
    }
  }

  function setIntroVolume() {
    setMusicVolume(0.02);
  }

  async function playNextTrackNow() {
    if (!musicSupported || !musicEnabled.value) return;
    await playNext();
  }

  if (musicSupported && musicEnabled.value && tracks.length) {
    void playNext();
  }

  onUnmounted(() => {
    if (!audio) return;
    audio.pause();
    audio.src = '';
  });

  return {
    musicEnabled,
    musicSupported,
    musicVolume,
    setMusicVolume,
    setIntroVolume,
    toggleMusic,
    enableMusic,
    playNextTrackNow,
  };
}

function clampVolume(value) {
  return Math.min(1, Math.max(0, value));
}
