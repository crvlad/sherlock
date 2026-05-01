<script setup>
import { ref, computed, watch } from 'vue';
import { CASE_FILES, getCaseById } from './data/cases/index.js';
import { AUDIO_TRACKS } from './data/audioTracks.js';
import { useSpeech } from './composables/useSpeech.js';
import { useBackgroundMusic } from './composables/useBackgroundMusic.js';
import GameMap from './components/GameMap.vue';
import CaseNotebook from './components/CaseNotebook.vue';
import DirectoryBook from './components/DirectoryBook.vue';
import NewspaperView from './components/NewspaperView.vue';
import LeadModal from './components/LeadModal.vue';
import AccusationScreen from './components/AccusationScreen.vue';

// ── Game state ──────────────────────────────────────────────
const phase = ref('intro'); // 'intro' | 'game' | 'accuse'
const activeTab = ref('map'); // 'map' | 'notebook' | 'directory' | 'newspaper'
const selectedCaseId = ref(CASE_FILES[0].id);
const visitedLeads = ref(new Set());
const visitedLocations = ref(new Set());
const activeLead = ref(null); // lead object shown in modal

const activeCase = computed(() => getCaseById(selectedCaseId.value));
const scenario = computed(() => activeCase.value.scenario);
const leads = computed(() => activeCase.value.leads);

const tabs = [
  { key: 'map',       label: '🗺 Карта' },
  { key: 'notebook',  label: '📓 Записная книжка' },
  { key: 'newspaper', label: '📰 Газеты' },
  { key: 'directory', label: '📚 Справочник' },
];

const leadsCount = computed(() => visitedLeads.value.size);
const {
  speechSupported: introSpeechSupported,
  speaking: introSpeaking,
  availableVoices,
  preferredVoiceUri,
  preferredRate,
  setPreferredVoiceUri,
  setPreferredRate,
  stopSpeech: stopIntroSpeech,
  toggleSpeech: toggleIntroSpeech,
} = useSpeech();
const russianVoices = computed(() =>
  availableVoices.value.filter(voice => voice.lang?.toLowerCase().startsWith('ru'))
);
const hasVoiceOptions = computed(() => russianVoices.value.length > 0);
const rateOptions = [
  { value: 0.75, label: '0.75x' },
  { value: 0.9, label: '0.9x' },
  { value: 1, label: '1x' },
  { value: 1.1, label: '1.1x' },
  { value: 1.2, label: '1.2x' },
  { value: 1.4, label: '1.4x' },
];
const {
  musicEnabled,
  musicSupported,
  musicVolume,
  setMusicVolume,
  toggleMusic,
  enableMusic,
  setIntroVolume,
  playNextTrackNow,
} = useBackgroundMusic({
  tracks: AUDIO_TRACKS,
  defaultVolume: 0.02,
});

watch(
  phase,
  newPhase => {
    if (newPhase === 'intro') {
      setIntroVolume();
      if (!musicEnabled.value) {
        enableMusic();
      }
    }
  },
  { immediate: true }
);

// ── Actions ─────────────────────────────────────────────────
function selectCase(caseId) {
  stopIntroSpeech();
  selectedCaseId.value = caseId;
  visitedLeads.value = new Set();
  visitedLocations.value = new Set();
  activeLead.value = null;
  activeTab.value = 'map';

  if (phase.value === 'intro') {
    playNextTrackNow();
  }
}

function startGame() {
  stopIntroSpeech();
  phase.value = 'game';
}

function investigateLead(lead) {
  activeLead.value = lead;
}

function closeLeadModal() {
  if (!activeLead.value) return;
  
  // Mark lead as visited
  const lead = activeLead.value;
  visitedLeads.value = new Set([...visitedLeads.value, lead.id]);
  visitedLocations.value = new Set([...visitedLocations.value, lead.locationId]);
  
  activeLead.value = null;
  // Switch to map to see new pulsing pins
  activeTab.value = 'map';
}

function reviewLead(lead) {
  activeLead.value = lead;
}

function restartGame() {
  stopIntroSpeech();
  phase.value = 'intro';
  visitedLeads.value = new Set();
  visitedLocations.value = new Set();
  activeLead.value = null;
  activeTab.value = 'map';
}

function updateVoice(event) {
  setPreferredVoiceUri(event.target.value);
  stopIntroSpeech();
}

function updateRate(event) {
  setPreferredRate(event.target.value);
  stopIntroSpeech();
}

function updateMusicVolume(event) {
  setMusicVolume(event.target.value);
}
</script>

<template>
  <div class="app-shell">

    <!-- ── INTRO SCREEN ─────────────────────────────────── -->
    <div v-if="phase === 'intro'" class="intro-screen">
      <div class="intro-card">
        <div class="intro-logo">🔍</div>
        <div class="intro-series">Шерлок Холмс: Детектив-консультант</div>
        <h1 class="intro-title">{{ scenario.title }}</h1>
        <p class="intro-sub">{{ scenario.subtitle }}</p>

        <div class="case-picker">
          <div class="case-picker-label">Выберите дело:</div>
          <div class="case-picker-list">
            <button
              v-for="caseFile in CASE_FILES"
              :key="caseFile.id"
              class="case-option"
              :class="{ active: selectedCaseId === caseFile.id }"
              @click="selectCase(caseFile.id)"
            >
              <div class="case-option-title">{{ caseFile.scenario.title }}</div>
              <div class="case-option-subtitle">{{ caseFile.scenario.subtitle }}</div>
            </button>
          </div>
        </div>

        <div class="intro-speech" v-if="introSpeechSupported">
          <div class="voice-controls" v-if="hasVoiceOptions">
            <label class="voice-label" for="voice-picker-intro">Голос озвучки:</label>
            <select
              id="voice-picker-intro"
              class="voice-select"
              :value="preferredVoiceUri"
              @change="updateVoice"
            >
              <option value="">Автовыбор (русский)</option>
              <option
                v-for="voice in russianVoices"
                :key="voice.voiceURI"
                :value="voice.voiceURI"
              >
                {{ voice.name }} ({{ voice.lang }})
              </option>
            </select>

            <label class="voice-label" for="rate-picker-intro">Скорость:</label>
            <select
              id="rate-picker-intro"
              class="voice-select rate-select"
              :value="String(preferredRate)"
              @change="updateRate"
            >
              <option
                v-for="option in rateOptions"
                :key="option.value"
                :value="String(option.value)"
              >
                {{ option.label }}
              </option>
            </select>
          </div>

          <button class="speech-btn" @click="toggleIntroSpeech(scenario.introduction)">
            {{ introSpeaking ? '⏹ Остановить озвучку' : '🔊 Озвучить вступление' }}
          </button>
        </div>

        <div class="intro-text">{{ scenario.introduction }}</div>
        <button class="start-btn" @click="startGame">
          Начать расследование →
        </button>
        <div class="intro-rules">
          <details>
            <summary>Правила игры</summary>
            <div class="rules-text">
              <p><strong>Цель:</strong> раскрыть дело, установив убийцу, мотив и метод преступления.</p>
              <p><strong>Карта:</strong> выбирайте места для посещения. Красные булавки — доступные улики, зелёные — уже изученные.</p>
              <p><strong>Улики:</strong> каждая улика открывает новые направления. Следуйте логике расследования.</p>
              <p><strong>Газеты:</strong> читайте газеты — они содержат ценные подсказки.</p>
              <p><strong>Справочник:</strong> ищите информацию о персонах и местах.</p>
              <p><strong>Обвинение:</strong> когда будете готовы — нажмите "Предъявить обвинение".</p>
              <p><strong>Счёт:</strong> Шерлок раскрыл бы это дело за <strong>{{ scenario.sherlockLeadCount }}</strong> улики. Чем меньше улик вы изучили — тем выше оценка (при правильном ответе).</p>
            </div>
          </details>
        </div>
      </div>
    </div>

    <!-- ── MAIN GAME ─────────────────────────────────────── -->
    <template v-else-if="phase === 'game'">
      <!-- Header -->
      <header class="game-header">
        <div class="header-left">
          <span class="header-logo">🔍</span>
          <div class="header-titles">
            <div class="header-case">{{ scenario.title }}</div>
            <div class="header-sub">Baker Street 221B · Лондон, 1895</div>
          </div>
        </div>
        <div class="header-right">
          <button
            v-if="musicSupported"
            class="music-toggle-btn"
            :class="{ active: musicEnabled }"
            :title="musicEnabled ? 'Выключить фоновую музыку' : 'Включить фоновую музыку'"
            @click="toggleMusic"
          >
            {{ musicEnabled ? '🎵' : '🔇' }}
          </button>

          <div v-if="musicSupported" class="music-volume-control">
            <label class="voice-label" for="music-volume-header">Музыка:</label>
            <input
              id="music-volume-header"
              class="music-volume"
              type="range"
              min="0"
              max="1"
              step="0.01"
              :value="String(musicVolume)"
              @input="updateMusicVolume"
            >
            <span class="music-volume-value">{{ Math.round(musicVolume * 100) }}%</span>
          </div>

          <div class="voice-controls compact" v-if="introSpeechSupported && hasVoiceOptions">
            <label class="voice-label" for="voice-picker-header">Голос:</label>
            <select
              id="voice-picker-header"
              class="voice-select"
              :value="preferredVoiceUri"
              @change="updateVoice"
            >
              <option value="">Авто</option>
              <option
                v-for="voice in russianVoices"
                :key="voice.voiceURI"
                :value="voice.voiceURI"
              >
                {{ voice.name }} ({{ voice.lang }})
              </option>
            </select>

            <label class="voice-label" for="rate-picker-header">Скорость:</label>
            <select
              id="rate-picker-header"
              class="voice-select rate-select"
              :value="String(preferredRate)"
              @change="updateRate"
            >
              <option
                v-for="option in rateOptions"
                :key="option.value"
                :value="String(option.value)"
              >
                {{ option.label }}
              </option>
            </select>
          </div>

          <div class="leads-badge" title="Изучено улик">
            🕵️ {{ leadsCount }} / {{ leads.length }}
          </div>
          <button class="accuse-header-btn" @click="phase = 'accuse'">
            ⚖️ Предъявить обвинение
          </button>
        </div>
      </header>

      <!-- Tab bar -->
      <nav class="tab-bar">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="tab-btn"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </nav>

      <!-- Tab content -->
      <main class="game-main">
        <GameMap
          v-show="activeTab === 'map'"
          :visitedLeads="visitedLeads"
          :visitedLocations="visitedLocations"
          :locations="activeCase.locations"
          :leads="activeCase.leads"
          :mapLabel="scenario.mapLabel || 'Лондон, 1895'"
          @investigate="investigateLead"
          @review-lead="reviewLead"
        />
        <CaseNotebook
          v-show="activeTab === 'notebook'"
          :visitedLeads="visitedLeads"
          :leads="activeCase.leads"
          :locations="activeCase.locations"
        />
        <NewspaperView
          v-show="activeTab === 'newspaper'"
          :newspapers="activeCase.newspapers"
        />
        <DirectoryBook
          v-show="activeTab === 'directory'"
          :directory="activeCase.directory"
        />
      </main>

      <!-- Lead modal -->
      <LeadModal
        v-if="activeLead"
        :lead="activeLead"
        :locations="activeCase.locations"
        @close="closeLeadModal"
      />
    </template>

    <!-- ── ACCUSATION ─────────────────────────────────────── -->
    <template v-else-if="phase === 'accuse'">
      <!-- Keep game visible behind accusation screen -->
      <header class="game-header">
        <div class="header-left">
          <span class="header-logo">🔍</span>
          <div class="header-titles">
            <div class="header-case">{{ scenario.title }}</div>
          </div>
        </div>
        <div class="header-right">
          <button
            v-if="musicSupported"
            class="music-toggle-btn"
            :class="{ active: musicEnabled }"
            :title="musicEnabled ? 'Выключить фоновую музыку' : 'Включить фоновую музыку'"
            @click="toggleMusic"
          >
            {{ musicEnabled ? '🎵' : '🔇' }}
          </button>

          <div v-if="musicSupported" class="music-volume-control">
            <label class="voice-label" for="music-volume-accuse">Музыка:</label>
            <input
              id="music-volume-accuse"
              class="music-volume"
              type="range"
              min="0"
              max="1"
              step="0.01"
              :value="String(musicVolume)"
              @input="updateMusicVolume"
            >
            <span class="music-volume-value">{{ Math.round(musicVolume * 100) }}%</span>
          </div>

          <div class="voice-controls compact" v-if="introSpeechSupported && hasVoiceOptions">
            <label class="voice-label" for="voice-picker-accuse">Голос:</label>
            <select
              id="voice-picker-accuse"
              class="voice-select"
              :value="preferredVoiceUri"
              @change="updateVoice"
            >
              <option value="">Авто</option>
              <option
                v-for="voice in russianVoices"
                :key="voice.voiceURI"
                :value="voice.voiceURI"
              >
                {{ voice.name }} ({{ voice.lang }})
              </option>
            </select>

            <label class="voice-label" for="rate-picker-accuse">Скорость:</label>
            <select
              id="rate-picker-accuse"
              class="voice-select rate-select"
              :value="String(preferredRate)"
              @change="updateRate"
            >
              <option
                v-for="option in rateOptions"
                :key="option.value"
                :value="String(option.value)"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>
      </header>
      <AccusationScreen
        :leadsCount="leadsCount"
        :scenario="scenario"
        :evaluateAccusation="activeCase.evaluateAccusation"
        @cancel="phase = 'game'"
        @restart="restartGame"
      />
    </template>
  </div>
</template>

<style>
/* ── Reset & globals ─────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
  height: 100%;
  background: #0a0704;
  color: #e0c890;
  font-family: 'Georgia', serif;
}

#app { height: 100%; }

::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: #0e0a04; }
::-webkit-scrollbar-thumb { background: #4a3018; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #6a4828; }
</style>

<style scoped>
.app-shell {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #0a0704;
  overflow: hidden;
}

/* ── Intro screen ─────────────────────────── */
.intro-screen {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  overflow-y: auto;
  background: radial-gradient(ellipse at 50% 30%, #1a1008 0%, #0a0704 70%);
}

.intro-card {
  max-width: 680px;
  width: 100%;
  text-align: center;
  padding: 2rem 1.5rem;
}

.intro-logo {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  filter: drop-shadow(0 0 20px rgba(240,208,112,0.3));
}

.intro-series {
  font-size: 0.75rem;
  color: #6a4a20;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin-bottom: 0.5rem;
}

.intro-title {
  font-size: 2rem;
  color: #f0d070;
  font-weight: bold;
  margin-bottom: 0.3rem;
  text-shadow: 0 0 30px rgba(240,208,112,0.3);
}

.intro-sub {
  font-style: italic;
  color: #8a6040;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.case-picker {
  margin-bottom: 1.25rem;
  text-align: left;
}

.case-picker-label {
  font-size: 0.75rem;
  color: #7a5530;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.45rem;
}

.case-picker-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.5rem;
}

.case-option {
  text-align: left;
  background: #100c05;
  border: 1px solid #3a2810;
  border-radius: 6px;
  padding: 0.6rem 0.75rem;
  color: #a07a50;
  cursor: pointer;
  transition: all 0.15s;
}

.case-option:hover {
  border-color: #8a5a20;
  background: #161005;
}

.case-option.active {
  border-color: #c07820;
  box-shadow: 0 0 0 1px rgba(192, 120, 32, 0.3);
  background: #1a1206;
}

.case-option-title {
  font-size: 0.84rem;
  color: #f0d070;
  font-weight: bold;
}

.case-option-subtitle {
  margin-top: 2px;
  font-size: 0.72rem;
  color: #7a5530;
}

.intro-text {
  background: #120e04;
  border: 1px solid #3a2810;
  border-radius: 6px;
  padding: 1.25rem 1.5rem;
  text-align: left;
  font-size: 0.88rem;
  color: #c0a070;
  line-height: 1.75;
  white-space: pre-line;
  margin-bottom: 1.5rem;
}

.intro-speech {
  margin-bottom: 0.6rem;
  text-align: left;
}

.speech-btn {
  background: #1a1208;
  color: #c8a870;
  border: 1px solid #4a3018;
  border-radius: 4px;
  padding: 6px 10px;
  font-family: 'Georgia', serif;
  font-size: 0.76rem;
  cursor: pointer;
  transition: all 0.15s;
}

.speech-btn:hover {
  border-color: #8a5a20;
  color: #f0d070;
  background: #221507;
}

.voice-controls {
  display: grid;
  grid-template-columns: auto minmax(170px, 1fr) auto minmax(90px, 120px);
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.voice-controls.compact {
  margin-bottom: 0;
  grid-template-columns: auto minmax(120px, 1fr) auto minmax(78px, 90px);
}

.voice-label {
  font-size: 0.72rem;
  color: #8a6040;
  white-space: nowrap;
}

.voice-select {
  width: 100%;
  min-width: 120px;
  background: #120e04;
  color: #d8b880;
  border: 1px solid #4a3018;
  border-radius: 4px;
  padding: 5px 8px;
  font-family: 'Georgia', serif;
  font-size: 0.74rem;
}

.rate-select {
  min-width: 78px;
}

.voice-select:focus {
  outline: none;
  border-color: #8a5a20;
}

.start-btn {
  background: #8a3a10;
  color: #f0d070;
  border: 2px solid #c05a20;
  padding: 12px 36px;
  font-family: 'Georgia', serif;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.05em;
  margin-bottom: 1.25rem;
}

.start-btn:hover {
  background: #a84a18;
  box-shadow: 0 0 20px rgba(200,90,32,0.4);
}

.intro-rules {
  text-align: left;
  font-size: 0.8rem;
}

.intro-rules summary {
  color: #6a4a20;
  cursor: pointer;
  padding: 4px 0;
  font-size: 0.8rem;
  list-style: none;
}

.intro-rules summary::-webkit-details-marker { display: none; }
.intro-rules summary::before { content: '▸ '; }
details[open] summary::before { content: '▾ '; }

.rules-text {
  padding: 0.75rem;
  background: #0e0a04;
  border: 1px solid #2a1808;
  border-radius: 4px;
  margin-top: 0.5rem;
}

.rules-text p {
  color: #907050;
  line-height: 1.6;
  margin-bottom: 0.4rem;
  font-size: 0.78rem;
}

.rules-text p:last-child { margin-bottom: 0; }

/* ── Game header ──────────────────────────── */
.game-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 1rem;
  background: #0e0904;
  border-bottom: 2px solid #3a2810;
  flex-shrink: 0;
  gap: 0.75rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.header-logo { font-size: 1.4rem; }

.header-case {
  font-size: 0.9rem;
  font-weight: bold;
  color: #f0d070;
}

.header-sub {
  font-size: 0.65rem;
  color: #6a4a20;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.music-toggle-btn {
  background: #1a1208;
  color: #d8b880;
  border: 1px solid #4a3018;
  border-radius: 4px;
  padding: 4px 8px;
  min-width: 38px;
  line-height: 1;
  cursor: pointer;
  transition: all 0.15s;
}

.music-toggle-btn:hover {
  border-color: #8a5a20;
  color: #f0d070;
  background: #241607;
}

.music-toggle-btn.active {
  border-color: #c07820;
  background: #2a1a08;
  color: #f0d070;
}

.music-volume-control {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.music-volume {
  width: 90px;
  accent-color: #b8742a;
}

.music-volume-value {
  font-size: 0.68rem;
  color: #8a6040;
  width: 34px;
  text-align: right;
}

.leads-badge {
  font-size: 0.75rem;
  color: #a07040;
  background: #1a1208;
  border: 1px solid #3a2810;
  padding: 3px 10px;
  border-radius: 12px;
}

.accuse-header-btn {
  background: #5a1a08;
  color: #f0c060;
  border: 1px solid #8a3010;
  padding: 5px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Georgia', serif;
  font-size: 0.78rem;
  transition: all 0.15s;
  white-space: nowrap;
}

.accuse-header-btn:hover { background: #7a2a10; }

/* ── Tab bar ──────────────────────────────── */
.tab-bar {
  display: flex;
  background: #0a0704;
  border-bottom: 1px solid #2a1a08;
  flex-shrink: 0;
}

.tab-btn {
  flex: 1;
  padding: 8px 4px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: #6a4a20;
  cursor: pointer;
  font-family: 'Georgia', serif;
  font-size: 0.78rem;
  transition: all 0.15s;
  white-space: nowrap;
}

.tab-btn:hover { color: #a07040; background: #110d04; }

.tab-btn.active {
  color: #f0d070;
  border-bottom-color: #c07820;
  background: #120e04;
}

/* ── Main content area ────────────────────── */
.game-main {
  flex: 1;
  overflow: hidden;
  position: relative;
  background: #120e04;
}

.game-main > * {
  position: absolute;
  inset: 0;
}
</style>

