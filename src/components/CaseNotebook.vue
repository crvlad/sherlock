<template>
  <div class="notebook">
    <!-- Visited leads log -->
    <div v-if="visitedLeadsList.length === 0" class="empty-state">
      <div class="empty-icon">📓</div>
      <p>Дело только начинается.</p>
      <p class="hint">Посетите место преступления или Скотланд-Ярд, чтобы получить первые улики.</p>
    </div>

    <div v-else>
      <div v-for="lead in visitedLeadsList" :key="lead.id" class="lead-entry">
        <div class="entry-header">
          <span class="entry-icon">{{ lead.icon }}</span>
          <div class="entry-meta">
            <div class="entry-title">{{ lead.title }}</div>
            <div class="entry-location">{{ locationName(lead.locationId) }}</div>
          </div>
          <div class="entry-number">#{{ leadNumber(lead.id) }}</div>
        </div>
        <div class="entry-text">{{ lead.text }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  visitedLeads: { type: Set, required: true },
  leads: { type: Array, required: true },
  locations: { type: Array, required: true },
});

const visitedLeadIds = computed(() => [...props.visitedLeads]);

const visitedLeadsList = computed(() =>
  visitedLeadIds.value
    .map(id => props.leads.find(l => l.id === id))
    .filter(Boolean)
);

function locationName(id) {
  return props.locations.find(l => l.id === id)?.name ?? id;
}

function leadNumber(id) {
  return visitedLeadIds.value.indexOf(id) + 1;
}
</script>

<style scoped>
.notebook {
  padding: 1rem;
  height: 100%;
  overflow-y: auto;
  font-family: 'Georgia', serif;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #8a6a45;
}

.empty-icon {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
}

.empty-state p { margin: 0.25rem 0; font-size: 0.9rem; }
.hint { font-style: italic; font-size: 0.8rem !important; color: #a08060; }

.lead-entry {
  background: #1e1408;
  border: 1px solid #4a3018;
  border-left: 4px solid #8a5a20;
  border-radius: 0 6px 6px 0;
  padding: 0.85rem 1rem;
  margin-bottom: 1rem;
}

.entry-header {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  margin-bottom: 0.6rem;
}

.entry-icon { font-size: 1.2rem; flex-shrink: 0; padding-top: 2px; }

.entry-meta { flex: 1; }

.entry-title {
  font-weight: bold;
  color: #f0d070;
  font-size: 0.9rem;
}

.entry-location {
  font-size: 0.72rem;
  color: #907050;
  margin-top: 1px;
}

.entry-number {
  font-size: 0.72rem;
  color: #6a4a20;
  font-style: italic;
  flex-shrink: 0;
}

.entry-text {
  font-size: 0.82rem;
  color: #c8a878;
  line-height: 1.65;
  white-space: pre-line;
  border-top: 1px solid #3a2010;
  padding-top: 0.6rem;
}
</style>
