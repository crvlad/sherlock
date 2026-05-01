<template>
  <div class="directory">
    <div class="dir-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="dir-tab"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="dir-search">
      <input v-model="search" class="search-input" placeholder="Поиск..." />
    </div>

    <div class="dir-entries">
      <div v-for="entry in filteredEntries" :key="entry.id" class="dir-entry">
        <div class="dir-entry-header" @click="toggle(entry.id)">
          <div class="dir-entry-name">{{ entry.name }}</div>
          <div class="dir-entry-cat">{{ entry.category }}</div>
          <span class="dir-toggle">{{ expanded.has(entry.id) ? '▲' : '▼' }}</span>
        </div>
        <div v-if="expanded.has(entry.id)" class="dir-entry-body">
          {{ entry.entry }}
        </div>
      </div>
      <div v-if="filteredEntries.length === 0" class="no-results">
        Ничего не найдено.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  directory: { type: Object, required: true },
});

const tabs = [
  { key: 'persons', label: '👤 Персоны' },
  { key: 'places', label: '📍 Справки' },
];

const activeTab = ref('persons');
const search = ref('');
const expanded = ref(new Set());

const allEntries = computed(() =>
  activeTab.value === 'persons' ? props.directory.persons : props.directory.places
);

const filteredEntries = computed(() => {
  const q = search.value.toLowerCase();
  if (!q) return allEntries.value;
  return allEntries.value.filter(e =>
    e.name.toLowerCase().includes(q) ||
    e.entry.toLowerCase().includes(q) ||
    e.category.toLowerCase().includes(q)
  );
});

function toggle(id) {
  if (expanded.value.has(id)) {
    expanded.value.delete(id);
  } else {
    expanded.value.add(id);
  }
}
</script>

<style scoped>
.directory {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: 'Georgia', serif;
}

.dir-tabs {
  display: flex;
  gap: 4px;
  padding: 0.5rem 0.75rem 0;
  background: #0e0904;
  flex-shrink: 0;
}

.dir-tab {
  padding: 5px 14px;
  border: 1px solid #4a3018;
  background: #1a1008;
  color: #907050;
  border-radius: 4px 4px 0 0;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.8rem;
  border-bottom: none;
  transition: all 0.15s;
}

.dir-tab.active {
  background: #2a1c08;
  color: #f0d070;
  border-color: #8a5a20;
  border-bottom: 1px solid #2a1c08;
}

.dir-search {
  padding: 0.5rem 0.75rem;
  background: #1a1208;
  border-bottom: 1px solid #3a2810;
  flex-shrink: 0;
}

.search-input {
  width: 100%;
  padding: 5px 10px;
  background: #0e0a04;
  border: 1px solid #4a3018;
  border-radius: 4px;
  color: #e0c890;
  font-family: 'Georgia', serif;
  font-size: 0.82rem;
  outline: none;
  box-sizing: border-box;
}

.search-input:focus { border-color: #8a5a20; }
.search-input::placeholder { color: #604030; }

.dir-entries {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
}

.dir-entry {
  border: 1px solid #3a2810;
  border-radius: 4px;
  margin-bottom: 0.4rem;
  overflow: hidden;
}

.dir-entry-header {
  display: flex;
  align-items: center;
  padding: 0.55rem 0.75rem;
  background: #1e1408;
  cursor: pointer;
  gap: 0.5rem;
  transition: background 0.15s;
}

.dir-entry-header:hover { background: #2a1c0c; }

.dir-entry-name {
  font-weight: bold;
  color: #e8c870;
  font-size: 0.85rem;
  flex: 1;
}

.dir-entry-cat {
  font-size: 0.68rem;
  color: #6a4a20;
  background: #0e0a04;
  padding: 1px 7px;
  border-radius: 8px;
  border: 1px solid #3a2010;
  flex-shrink: 0;
}

.dir-toggle {
  color: #6a4a20;
  font-size: 0.65rem;
  margin-left: 4px;
}

.dir-entry-body {
  padding: 0.6rem 0.75rem;
  background: #120e04;
  font-size: 0.8rem;
  color: #b8946a;
  line-height: 1.6;
  white-space: pre-line;
  border-top: 1px solid #2a1a08;
}

.no-results {
  text-align: center;
  color: #604030;
  font-size: 0.85rem;
  padding: 2rem;
}
</style>
