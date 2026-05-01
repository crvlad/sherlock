<template>
  <div class="newspaper">
    <div class="paper-selector">
      <button
        v-for="paper in props.newspapers"
        :key="paper.id"
        class="paper-btn"
        :class="{ active: activePaper?.id === paper.id }"
        @click="activePaper = paper"
      >
        <div class="paper-name">{{ paper.title }}</div>
        <div class="paper-edition">{{ paper.edition }}</div>
      </button>
    </div>

    <div v-if="activePaper" class="paper-content">
      <div class="paper-masthead">
        <div class="masthead-title">{{ activePaper.title }}</div>
        <div class="masthead-info">{{ activePaper.date }} · {{ activePaper.edition }}</div>
        <div class="masthead-divider">❧ ✦ ❧</div>
      </div>

      <div v-for="(article, i) in activePaper.articles" :key="i" class="article">
        <h3 class="article-headline">{{ article.headline }}</h3>
        <div class="article-body">{{ article.text }}</div>
        <div v-if="i < activePaper.articles.length - 1" class="article-divider">— ✦ —</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  newspapers: { type: Array, required: true },
});

const activePaper = ref(props.newspapers[0] ?? null);

watch(
  () => props.newspapers,
  (nextPapers) => {
    activePaper.value = nextPapers[0] ?? null;
  }
);
</script>

<style scoped>
.newspaper {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: 'Georgia', serif;
}

.paper-selector {
  display: flex;
  gap: 6px;
  padding: 0.6rem 0.75rem;
  background: #0e0904;
  flex-shrink: 0;
  flex-wrap: wrap;
  border-bottom: 1px solid #3a2810;
}

.paper-btn {
  padding: 5px 12px;
  background: #1a1008;
  border: 1px solid #3a2010;
  border-radius: 4px;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s;
}

.paper-btn.active {
  background: #2a1c08;
  border-color: #8a5a20;
}

.paper-name {
  font-size: 0.8rem;
  font-weight: bold;
  color: #e8c870;
}

.paper-edition {
  font-size: 0.65rem;
  color: #7a5530;
  margin-top: 1px;
}

.paper-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.paper-masthead {
  text-align: center;
  padding-bottom: 0.75rem;
  margin-bottom: 1rem;
  border-bottom: 3px double #4a3010;
}

.masthead-title {
  font-size: 1.6rem;
  font-weight: bold;
  color: #f0d070;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  font-variant: small-caps;
}

.masthead-info {
  font-size: 0.72rem;
  color: #7a5530;
  margin-top: 2px;
  letter-spacing: 0.1em;
}

.masthead-divider {
  font-size: 0.9rem;
  color: #6a4a20;
  margin-top: 6px;
  letter-spacing: 0.5em;
}

.article {
  margin-bottom: 1.25rem;
}

.article-headline {
  font-size: 1rem;
  color: #e8c870;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #3a2010;
  padding-bottom: 4px;
  margin: 0 0 0.6rem;
}

.article-body {
  font-size: 0.82rem;
  color: #c0a070;
  line-height: 1.7;
  white-space: pre-line;
  text-align: justify;
}

.article-divider {
  text-align: center;
  color: #5a3a10;
  font-size: 0.8rem;
  margin: 0.75rem 0;
  letter-spacing: 0.5em;
}
</style>
