import { onUnmounted, ref } from 'vue';

const VOICE_STORAGE_KEY = 'sherlock-preferred-voice-uri';
const RATE_STORAGE_KEY = 'sherlock-preferred-speech-rate';
const availableVoices = ref([]);
const preferredVoiceUri = ref('');
const preferredRate = ref(1);
let initialized = false;

export function useSpeech() {
  initializeVoiceState();

  const speaking = ref(false);
  const activeUtterance = ref(null);
  const speechSessionId = ref(0);
  const speechSupported =
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    'SpeechSynthesisUtterance' in window;

  function pickVoice(lang, voiceURI) {
    const voices = availableVoices.value;
    if (voiceURI) {
      const selected = voices.find(voice => voice.voiceURI === voiceURI);
      if (selected) return selected;
    }

    return (
      voices.find(voice => voice.lang?.toLowerCase().startsWith(lang.toLowerCase())) ||
      voices.find(voice => voice.lang?.toLowerCase().startsWith('ru')) ||
      null
    );
  }

  function stopSpeech() {
    if (!speechSupported) return;
    speechSessionId.value += 1;
    window.speechSynthesis.cancel();
    speaking.value = false;
    activeUtterance.value = null;
  }

  function playSpeech(text, options = {}) {
    if (!speechSupported) return;

    initializeVoiceState();

    const content = String(text || '').trim();
    if (!content) return;

    const chunks = chunkSpeechText(content);
    if (!chunks.length) return;

    const {
      lang = 'ru-RU',
      rate = preferredRate.value,
      pitch = 1,
      volume = 1,
      voiceURI = preferredVoiceUri.value,
    } = options;

    stopSpeech();

    const sessionId = speechSessionId.value;
    const voice = pickVoice(lang, voiceURI);

    const speakChunk = index => {
      if (speechSessionId.value !== sessionId) return;

      if (index >= chunks.length) {
        speaking.value = false;
        activeUtterance.value = null;
        return;
      }

      const utterance = new SpeechSynthesisUtterance(chunks[index]);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        utterance.lang = lang;
      }

      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;

      utterance.onend = () => {
        if (speechSessionId.value !== sessionId) return;
        activeUtterance.value = null;
        speakChunk(index + 1);
      };

      utterance.onerror = () => {
        if (speechSessionId.value !== sessionId) return;
        activeUtterance.value = null;
        speakChunk(index + 1);
      };

      activeUtterance.value = utterance;
      speaking.value = true;
      window.speechSynthesis.speak(utterance);
    };

    speakChunk(0);
  }

  function toggleSpeech(text, options = {}) {
    if (speaking.value) {
      stopSpeech();
      return;
    }
    playSpeech(text, options);
  }

  function setPreferredVoiceUri(voiceURI) {
    preferredVoiceUri.value = String(voiceURI || '');

    if (typeof window === 'undefined') return;

    if (preferredVoiceUri.value) {
      window.localStorage.setItem(VOICE_STORAGE_KEY, preferredVoiceUri.value);
    } else {
      window.localStorage.removeItem(VOICE_STORAGE_KEY);
    }
  }

  function setPreferredRate(rate) {
    const parsedRate = Number(rate);
    if (!Number.isFinite(parsedRate)) return;

    const clampedRate = Math.min(2, Math.max(0.5, parsedRate));
    preferredRate.value = clampedRate;

    if (typeof window === 'undefined') return;
    window.localStorage.setItem(RATE_STORAGE_KEY, String(clampedRate));
  }

  onUnmounted(() => {
    stopSpeech();
  });

  return {
    speechSupported,
    speaking,
    availableVoices,
    preferredVoiceUri,
    preferredRate,
    setPreferredVoiceUri,
    setPreferredRate,
    playSpeech,
    stopSpeech,
    toggleSpeech,
  };
}

function initializeVoiceState() {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) return;

  preferredVoiceUri.value = window.localStorage.getItem(VOICE_STORAGE_KEY) || '';
  const savedRate = Number(window.localStorage.getItem(RATE_STORAGE_KEY));
  if (Number.isFinite(savedRate)) {
    preferredRate.value = Math.min(2, Math.max(0.5, savedRate));
  }
  refreshVoiceList();

  const updateVoices = () => {
    refreshVoiceList();
  };

  window.speechSynthesis.addEventListener('voiceschanged', updateVoices);
}

function refreshVoiceList() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  availableVoices.value = window.speechSynthesis
    .getVoices()
    .slice()
    .sort((a, b) => a.lang.localeCompare(b.lang) || a.name.localeCompare(b.name));

  if (
    preferredVoiceUri.value &&
    !availableVoices.value.some(voice => voice.voiceURI === preferredVoiceUri.value)
  ) {
    preferredVoiceUri.value = '';
    window.localStorage.removeItem(VOICE_STORAGE_KEY);
  }

  if (preferredVoiceUri.value) {
    const selectedVoice = availableVoices.value.find(
      voice => voice.voiceURI === preferredVoiceUri.value
    );
    const isRussianVoice = selectedVoice?.lang?.toLowerCase().startsWith('ru');
    if (!isRussianVoice) {
      preferredVoiceUri.value = '';
      window.localStorage.removeItem(VOICE_STORAGE_KEY);
    }
  }
}

function chunkSpeechText(text, maxChunkLength = 220) {
  const normalized = String(text || '')
    .replace(/\r/g, ' ')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!normalized) return [];

  const rawParts = normalized.split(/(?<=[.!?…])\s+/);
  const chunks = [];
  let current = '';

  for (const part of rawParts) {
    if (!part) continue;

    if (!current) {
      if (part.length <= maxChunkLength) {
        current = part;
      } else {
        chunks.push(...splitLongChunk(part, maxChunkLength));
      }
      continue;
    }

    const candidate = `${current} ${part}`;
    if (candidate.length <= maxChunkLength) {
      current = candidate;
      continue;
    }

    chunks.push(current);
    if (part.length <= maxChunkLength) {
      current = part;
    } else {
      chunks.push(...splitLongChunk(part, maxChunkLength));
      current = '';
    }
  }

  if (current) chunks.push(current);
  return chunks;
}

function splitLongChunk(text, maxChunkLength) {
  const words = text.split(' ');
  const result = [];
  let current = '';

  for (const word of words) {
    if (!word) continue;
    const candidate = current ? `${current} ${word}` : word;

    if (candidate.length <= maxChunkLength) {
      current = candidate;
      continue;
    }

    if (current) result.push(current);
    current = word;
  }

  if (current) result.push(current);
  return result;
}
