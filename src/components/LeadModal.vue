<template>
  <teleport to="body">
    <div class="modal-backdrop" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <span class="modal-icon">{{ lead.icon }}</span>
          <div class="modal-title-block">
            <h2>{{ lead.title }}</h2>
            <span class="modal-location">📍 {{ locationName }}</span>
          </div>
          <button class="modal-close" @click="closeModal">✕</button>
        </div>

        <div class="modal-body">
          <div class="modal-speech" v-if="speechSupported">
            <button class="speech-btn" @click="toggleSpeech(lead.text)">
              {{ speaking ? '⏹ Остановить озвучку' : '🔊 Озвучить улику' }}
            </button>
          </div>
          <div class="lead-text">{{ lead.text }}</div>
        </div>

        <div class="modal-footer">
          <div class="footer-note">
            Новые направления для расследования могут появиться на карте.
          </div>
          <button class="done-btn" @click="closeModal">Вернуться к карте</button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { computed } from 'vue';
import { useSpeech } from '../composables/useSpeech.js';

const props = defineProps({
  lead: { type: Object, required: true },
  locations: { type: Array, required: true },
});

const emit = defineEmits(['close']);

const {
  speechSupported,
  speaking,
  stopSpeech,
  toggleSpeech,
} = useSpeech();

const locationName = computed(() =>
  props.locations.find(l => l.id === props.lead.locationId)?.name ?? props.lead.locationId
);

function closeModal() {
  stopSpeech();
  emit('close');
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.75);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal {
  background: #120e04;
  border: 2px solid #8a5a20;
  border-radius: 8px;
  max-width: 640px;
  width: 100%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0,0,0,0.8);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: #1a1208;
  border-bottom: 1px solid #3a2810;
  flex-shrink: 0;
}

.modal-icon { font-size: 1.8rem; flex-shrink: 0; }

.modal-title-block { flex: 1; }

.modal-title-block h2 {
  margin: 0;
  font-family: 'Georgia', serif;
  font-size: 1.05rem;
  color: #f0d070;
}

.modal-location {
  font-size: 0.72rem;
  color: #7a5530;
  font-family: 'Georgia', serif;
}

.modal-close {
  background: none;
  border: none;
  color: #6a4a20;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0 4px;
  flex-shrink: 0;
}

.modal-close:hover { color: #f0c060; }

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem;
}

.lead-text {
  font-family: 'Georgia', serif;
  font-size: 0.88rem;
  color: #c8a870;
  line-height: 1.75;
  white-space: pre-line;
}

.modal-speech {
  margin-bottom: 0.7rem;
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

.modal-footer {
  padding: 0.85rem 1.25rem;
  background: #0e0a04;
  border-top: 1px solid #3a2810;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
  flex-wrap: wrap;
}

.footer-note {
  flex: 1;
  font-size: 0.72rem;
  color: #5a3a18;
  font-family: 'Georgia', serif;
  font-style: italic;
}

.done-btn {
  background: #6a3810;
  color: #f0d070;
  border: 1px solid #a05a20;
  padding: 7px 18px;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Georgia', serif;
  font-size: 0.82rem;
  transition: all 0.15s;
  white-space: nowrap;
}

.done-btn:hover { background: #8a4a18; }
</style>
