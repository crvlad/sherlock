<template>
  <div class="accusation-screen">
    <div class="accusation-inner">
      <!-- Phase 1: answer form -->
      <template v-if="phase === 'form'">
        <div class="acc-header">
          <div class="acc-icon">⚖️</div>
          <h2>Предъявить обвинение</h2>
          <p class="acc-subtitle">
            Вы изучили <strong>{{ leadsCount }}</strong> улик(и).
            Шерлок раскрыл бы это дело за <strong>{{ sherlockCount }}</strong>.
          </p>
        </div>

        <div class="form-group">
          <label>Кто убийца?</label>
          <input v-model="form.killer" class="acc-input" placeholder="Имя подозреваемого..." />
        </div>

        <div class="form-group">
          <label>Мотив?</label>
          <input v-model="form.motive" class="acc-input" placeholder="Причина преступления..." />
        </div>

        <div class="form-group">
          <label>Метод убийства?</label>
          <input v-model="form.method" class="acc-input" placeholder="Как было совершено убийство..." />
        </div>

        <div class="acc-actions">
          <button class="cancel-btn" @click="handleCancel">← Продолжить расследование</button>
          <button
            class="accuse-btn"
            :disabled="!form.killer"
            @click="submitAccusation"
          >
            Предъявить обвинение →
          </button>
        </div>
      </template>

      <!-- Phase 2: result -->
      <template v-else>
        <div class="result-header">
          <div class="result-score-badge" :class="scoreClass">
            {{ score }}
          </div>
          <h2>{{ scoreTitle }}</h2>
          <p class="result-subtitle">очков из 100</p>
        </div>

        <div class="solution-block">
          <div class="solution-title">🔍 Решение дела</div>
          <div class="solution-grid">
            <div class="sol-row">
              <span class="sol-label">Убийца:</span>
              <span class="sol-value">{{ props.scenario.solution.killer }}</span>
            </div>
            <div class="sol-row">
              <span class="sol-label">Мотив:</span>
              <span class="sol-value">{{ props.scenario.solution.motive }}</span>
            </div>
            <div class="sol-row">
              <span class="sol-label">Метод:</span>
              <span class="sol-value">{{ props.scenario.solution.method }}</span>
            </div>
          </div>
        </div>

        <div class="explanation-block">
          <div class="explanation-title">Объяснение Холмса</div>
          <div class="explanation-speech" v-if="speechSupported">
            <button class="speech-btn" @click="toggleSpeech(props.scenario.solution.explanation)">
              {{ speaking ? '⏹ Остановить озвучку' : '🔊 Озвучить объяснение' }}
            </button>
          </div>
          <div class="explanation-text">{{ props.scenario.solution.explanation }}</div>
        </div>

        <button class="restart-btn" @click="handleRestart">
          Начать новое расследование
        </button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useSpeech } from '../composables/useSpeech.js';

const props = defineProps({
  leadsCount: { type: Number, required: true },
  scenario: { type: Object, required: true },
  evaluateAccusation: { type: Function, required: true },
});

const emit = defineEmits(['cancel', 'restart']);

const sherlockCount = computed(() => props.scenario.sherlockLeadCount);
const phase = ref('form');
const score = ref(0);
const isCorrect = ref(false);

const form = ref({ killer: '', motive: '', method: '' });
const {
  speechSupported,
  speaking,
  stopSpeech,
  toggleSpeech,
} = useSpeech();

function submitAccusation() {
  stopSpeech();
  const result = props.evaluateAccusation(form.value, props.leadsCount);
  isCorrect.value = result.isCorrect;
  score.value = result.score;
  phase.value = 'result';
}

function handleCancel() {
  stopSpeech();
  emit('cancel');
}

function handleRestart() {
  stopSpeech();
  emit('restart');
}

const scoreClass = computed(() => {
  if (score.value >= 80) return 'score-great';
  if (score.value >= 60) return 'score-good';
  if (score.value >= 40) return 'score-ok';
  return 'score-bad';
});

const scoreTitle = computed(() => {
  if (!isCorrect.value) return 'Увы — обвинение не подтвердилось';
  if (score.value >= 80) return 'Превосходно! Достойно самого Холмса';
  if (score.value >= 60) return 'Хорошая работа, детектив';
  if (score.value >= 40) return 'Неплохо, но Холмс справился бы быстрее';
  return 'Вы раскрыли дело, но с трудом';
});
</script>

<style scoped>
.accusation-screen {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  z-index: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  overflow-y: auto;
}

.accusation-inner {
  background: #120e04;
  border: 2px solid #8a5a20;
  border-radius: 8px;
  max-width: 580px;
  width: 100%;
  max-height: calc(100vh - 2rem);
  padding: 2rem;
  font-family: 'Georgia', serif;
  box-shadow: 0 20px 60px rgba(0,0,0,0.9);
  overflow-y: auto;
}

.acc-header, .result-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.acc-icon { font-size: 2rem; margin-bottom: 0.5rem; }

.acc-header h2, .result-header h2 {
  margin: 0 0 0.5rem;
  color: #f0d070;
  font-size: 1.25rem;
}

.acc-subtitle, .result-subtitle {
  font-size: 0.82rem;
  color: #907050;
  margin: 0;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-size: 0.8rem;
  color: #a07040;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.acc-input {
  width: 100%;
  padding: 8px 12px;
  background: #0e0a04;
  border: 1px solid #4a3018;
  border-radius: 4px;
  color: #e0c890;
  font-family: 'Georgia', serif;
  font-size: 0.88rem;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s;
}

.acc-input:focus { border-color: #8a5a20; }

.acc-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
}

.cancel-btn {
  background: none;
  border: 1px solid #4a3018;
  color: #906040;
  padding: 7px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Georgia', serif;
  font-size: 0.8rem;
  transition: all 0.15s;
}

.cancel-btn:hover { background: #1a1008; color: #c08050; }

.accuse-btn {
  background: #6a1a08;
  color: #f0d070;
  border: 1px solid #a03010;
  padding: 8px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Georgia', serif;
  font-size: 0.88rem;
  transition: all 0.15s;
}

.accuse-btn:hover:not(:disabled) { background: #8a2a10; }
.accuse-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* Result screen */
.result-score-badge {
  display: inline-block;
  font-size: 2.5rem;
  font-weight: bold;
  width: 80px;
  height: 80px;
  line-height: 80px;
  border-radius: 50%;
  text-align: center;
  margin-bottom: 0.75rem;
  border: 3px solid;
}

.score-great { background: #1a3a10; color: #8ade58; border-color: #4a9a20; }
.score-good  { background: #1a2a10; color: #a8ce78; border-color: #6a8a30; }
.score-ok    { background: #2a2010; color: #d4b860; border-color: #8a6a20; }
.score-bad   { background: #2a1010; color: #c85040; border-color: #7a2010; }

.solution-block {
  background: #0e0a04;
  border: 1px solid #4a3018;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.solution-title {
  font-size: 0.78rem;
  color: #906040;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.6rem;
}

.solution-grid { display: flex; flex-direction: column; gap: 0.4rem; }

.sol-row { display: flex; gap: 0.5rem; font-size: 0.85rem; }

.sol-label { color: #7a5530; flex-shrink: 0; width: 70px; }
.sol-value { color: #e0c070; }

.explanation-block {
  background: #0e0a04;
  border: 1px solid #3a2010;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1.25rem;
}

.explanation-title {
  font-size: 0.78rem;
  color: #906040;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.6rem;
}

.explanation-speech {
  margin-bottom: 0.65rem;
}

.speech-btn {
  background: #1a1208;
  color: #c8a870;
  border: 1px solid #4a3018;
  border-radius: 4px;
  padding: 6px 10px;
  font-family: 'Georgia', serif;
  font-size: 0.74rem;
  cursor: pointer;
  transition: all 0.15s;
}

.speech-btn:hover {
  border-color: #8a5a20;
  color: #f0d070;
  background: #221507;
}

.explanation-text {
  font-size: 0.8rem;
  color: #b08060;
  line-height: 1.7;
  white-space: pre-line;
}

.restart-btn {
  width: 100%;
  background: #3a2010;
  color: #f0d070;
  border: 1px solid #6a4020;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Georgia', serif;
  font-size: 0.9rem;
  transition: all 0.15s;
}

.restart-btn:hover { background: #4a2c14; }
</style>
