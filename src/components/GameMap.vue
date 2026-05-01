<template>
  <div class="map-container">
    <div class="map-inner" ref="mapRef">
      <div class="map-atmosphere">
        <div class="fog-layer fog-a"></div>
        <div class="fog-layer fog-b"></div>
        <div class="paper-noise"></div>
      </div>

      <!-- Thames river SVG decoration -->
      <svg class="map-svg" viewBox="-25 -20 150 120" preserveAspectRatio="none">
        <defs>
          <pattern id="gridDots" width="4" height="4" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.3" fill="#b89f7a" opacity="0.35" />
          </pattern>
          <linearGradient id="thamesGlow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#376f96" stop-opacity="0.9" />
            <stop offset="50%" stop-color="#4f94be" stop-opacity="0.8" />
            <stop offset="100%" stop-color="#376f96" stop-opacity="0.9" />
          </linearGradient>
          <linearGradient id="thamesFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#4f94be" stop-opacity="0.55" />
            <stop offset="100%" stop-color="#2a5e7e" stop-opacity="0.35" />
          </linearGradient>
        </defs>

        <rect x="-25" y="-20" width="150" height="120" fill="url(#gridDots)" opacity="0.15"/>

        <!-- Thames river filled band -->
        <path d="M-25,64 Q-12,60 4,62 Q20,64 36,68 Q52,72 68,69 Q84,66 100,70 Q112,73 125,71 L125,100 L-25,100 Z"
          fill="url(#thamesFill)" opacity="0.6"/>
        <path d="M-25,64 Q-12,60 4,62 Q20,64 36,68 Q52,72 68,69 Q84,66 100,70 Q112,73 125,71"
          fill="none" stroke="url(#thamesGlow)" stroke-width="4" opacity="0.7"/>
        <path d="M-25,64 Q-12,60 4,62 Q20,64 36,68 Q52,72 68,69 Q84,66 100,70 Q112,73 125,71"
          fill="none" stroke="#d0edf7" stroke-width="1" opacity="0.4"/>

        <!-- Rail lines -->
        <path d="M-25,22 Q-8,30 12,28 Q34,26 56,30 Q78,34 98,32 Q112,30 125,33" fill="none" stroke="#8f3d29" stroke-width="0.6" stroke-dasharray="1.4 1.2" opacity="0.7"/>
        <path d="M-25,6 Q-6,12 14,18 Q36,24 58,22 Q84,20 125,10" fill="none" stroke="#8f3d29" stroke-width="0.5" stroke-dasharray="1 1.5" opacity="0.6"/>

        <!-- Major roads (arterial) -->
        <path d="M-25,48 Q-5,45 18,47 Q42,50 66,47 Q90,44 125,48" fill="none" stroke="#a8906a" stroke-width="0.9" opacity="0.65"/>
        <path d="M50,0 Q49,18 51,35 Q52,48 50,60" fill="none" stroke="#a8906a" stroke-width="0.9" opacity="0.6"/>
        <path d="M-25,34 Q0,30 26,34 Q52,38 78,33 Q102,29 125,34" fill="none" stroke="#b09070" stroke-width="0.7" opacity="0.55"/>

        <!-- Secondary streets -->
        <path d="M25,0 Q24,12 26,28 Q27,40 25,58" fill="none" stroke="#c0a882" stroke-width="0.45" opacity="0.48"/>
        <path d="M72,4 Q71,18 73,30 Q74,42 72,58" fill="none" stroke="#c0a882" stroke-width="0.45" opacity="0.45"/>
        <path d="M-25,16 Q2,13 30,16 Q58,19 90,14 Q108,12 125,15" fill="none" stroke="#c0a882" stroke-width="0.4" opacity="0.4"/>
        <path d="M-25,56 Q0,52 28,55 Q56,58 86,54 Q108,51 125,54" fill="none" stroke="#b8a078" stroke-width="0.45" opacity="0.45"/>
        <!-- Cross streets -->
        <path d="M38,15 Q37,28 39,46 Q40,52 38,58" fill="none" stroke="#c0a882" stroke-width="0.4" opacity="0.42"/>
        <path d="M86,10 Q85,22 87,36 Q88,48 86,58" fill="none" stroke="#c0a882" stroke-width="0.4" opacity="0.38"/>
        <!-- Diagonal route -->
        <path d="M5,55 Q18,48 30,40 Q42,33 56,27 Q68,22 80,16" fill="none" stroke="#b09070" stroke-width="0.5" opacity="0.4"/>

        <!-- Additional avenues and streets for wider city footprint -->
        <path d="M-18,22 Q2,18 28,22 Q52,26 78,20 Q102,14 124,18" fill="none" stroke="#b69a72" stroke-width="0.45" opacity="0.4"/>
        <path d="M-22,44 Q4,42 34,45 Q60,48 88,43 Q110,40 128,42" fill="none" stroke="#b3956e" stroke-width="0.45" opacity="0.38"/>
        <path d="M-16,66 Q8,62 34,66 Q58,70 84,64 Q106,60 126,62" fill="none" stroke="#b0926a" stroke-width="0.42" opacity="0.34"/>
        <path d="M2,-18 Q1,2 3,26 Q5,48 3,74" fill="none" stroke="#c1a984" stroke-width="0.4" opacity="0.35"/>
        <path d="M34,-20 Q33,2 35,28 Q37,50 35,76" fill="none" stroke="#c1a984" stroke-width="0.4" opacity="0.35"/>
        <path d="M98,-20 Q97,3 99,30 Q101,52 99,78" fill="none" stroke="#c1a984" stroke-width="0.38" opacity="0.32"/>
        <path d="M118,-20 Q117,6 119,30 Q121,52 119,76" fill="none" stroke="#c1a984" stroke-width="0.36" opacity="0.3"/>

        <!-- Park areas -->
        <ellipse cx="22" cy="42" rx="6" ry="4" fill="#5a8a4a" opacity="0.28"/>
        <ellipse cx="30" cy="18" rx="5" ry="5" fill="#5a8a4a" opacity="0.22"/>
        <ellipse cx="62" cy="14" rx="4.5" ry="3" fill="#5a8a4a" opacity="0.2"/>
        <ellipse cx="92" cy="20" rx="7" ry="4.2" fill="#5a8a4a" opacity="0.2"/>
        <ellipse cx="8" cy="56" rx="6" ry="3.6" fill="#5a8a4a" opacity="0.18"/>
        <ellipse cx="112" cy="52" rx="5.6" ry="3.2" fill="#5a8a4a" opacity="0.18"/>
        <!-- Park tree dots -->
        <circle cx="20" cy="41" r="0.8" fill="#4a7a3a" opacity="0.45"/>
        <circle cx="23" cy="43" r="0.7" fill="#4a7a3a" opacity="0.4"/>
        <circle cx="25" cy="40" r="0.8" fill="#4a7a3a" opacity="0.4"/>
        <circle cx="29" cy="17" r="0.7" fill="#4a7a3a" opacity="0.38"/>
        <circle cx="31" cy="20" r="0.8" fill="#4a7a3a" opacity="0.35"/>
        <circle cx="90" cy="19" r="0.8" fill="#4a7a3a" opacity="0.34"/>
        <circle cx="94" cy="21" r="0.7" fill="#4a7a3a" opacity="0.32"/>
        <circle cx="110" cy="51" r="0.75" fill="#4a7a3a" opacity="0.3"/>
        <circle cx="114" cy="53" r="0.7" fill="#4a7a3a" opacity="0.28"/>

        <!-- Building blocks — cluster 1 (north-west) -->
        <rect x="5"  y="7"  width="3.5" height="2.5" fill="#b09068" opacity="0.38" rx="0.2"/>
        <rect x="9.5" y="7.5" width="2.5" height="2"   fill="#b09068" opacity="0.34" rx="0.2"/>
        <rect x="5.5" y="11" width="2"   height="3"   fill="#b09068" opacity="0.36" rx="0.2"/>
        <rect x="8.5" y="10.5" width="3" height="2.5" fill="#a88860" opacity="0.32" rx="0.2"/>
        <rect x="13" y="8"  width="2.5" height="2"   fill="#b09068" opacity="0.3"  rx="0.2"/>

        <!-- Building blocks — cluster 2 (north, near rail) -->
        <rect x="42" y="6"  width="4"   height="2.5" fill="#b09068" opacity="0.35" rx="0.2"/>
        <rect x="47" y="6.5" width="2.5" height="3"  fill="#a88860" opacity="0.32" rx="0.2"/>
        <rect x="43" y="10" width="3"   height="2"   fill="#b09068" opacity="0.3"  rx="0.2"/>
        <rect x="53" y="7"  width="3.5" height="2"   fill="#b09068" opacity="0.33" rx="0.2"/>

        <!-- Building blocks — cluster 3 (north-east) -->
        <rect x="76" y="5"  width="3"   height="2.5" fill="#b09068" opacity="0.36" rx="0.2"/>
        <rect x="80" y="5.5" width="2.5" height="2"  fill="#a88860" opacity="0.32" rx="0.2"/>
        <rect x="84" y="6"  width="4"   height="2.5" fill="#b09068" opacity="0.34" rx="0.2"/>
        <rect x="77" y="9"  width="2"   height="2.5" fill="#b09068" opacity="0.3"  rx="0.2"/>
        <rect x="88" y="5"  width="3"   height="3"   fill="#b09068" opacity="0.32" rx="0.2"/>
        <rect x="92" y="6"  width="2.5" height="2"   fill="#a88860" opacity="0.3"  rx="0.2"/>

        <!-- Building blocks — cluster 4 (centre-west, between roads) -->
        <rect x="4"  y="35" width="3"   height="2.5" fill="#b09068" opacity="0.36" rx="0.2"/>
        <rect x="8"  y="34.5" width="2.5" height="3" fill="#a88860" opacity="0.32" rx="0.2"/>
        <rect x="4"  y="39" width="4"   height="2.5" fill="#b09068" opacity="0.34" rx="0.2"/>
        <rect x="13" y="35" width="3"   height="2"   fill="#b09068" opacity="0.3"  rx="0.2"/>

        <!-- Building blocks — cluster 5 (centre, dense district) -->
        <rect x="54" y="34" width="4"   height="3"   fill="#b09068" opacity="0.38" rx="0.2"/>
        <rect x="59" y="33.5" width="3" height="2.5" fill="#a88860" opacity="0.34" rx="0.2"/>
        <rect x="63" y="34" width="2.5" height="3"   fill="#b09068" opacity="0.32" rx="0.2"/>
        <rect x="55" y="38" width="3"   height="2"   fill="#b09068" opacity="0.3"  rx="0.2"/>
        <rect x="59" y="37.5" width="4" height="2.5" fill="#a88860" opacity="0.3"  rx="0.2"/>

        <!-- Building blocks — cluster 6 (east side) -->
        <rect x="76" y="34" width="3.5" height="2.5" fill="#b09068" opacity="0.36" rx="0.2"/>
        <rect x="80.5" y="34" width="2.5" height="3" fill="#a88860" opacity="0.32" rx="0.2"/>
        <rect x="85" y="33.5" width="3" height="2.5" fill="#b09068" opacity="0.34" rx="0.2"/>
        <rect x="77" y="37.5" width="4" height="2"   fill="#b09068" opacity="0.3"  rx="0.2"/>
        <rect x="89" y="34" width="2"   height="3"   fill="#a88860" opacity="0.3"  rx="0.2"/>
        <rect x="92" y="34" width="3"   height="2.5" fill="#b09068" opacity="0.28" rx="0.2"/>

        <!-- Building blocks — cluster 7 (south of centre, near river) -->
        <rect x="34" y="48" width="3"   height="2.5" fill="#b09068" opacity="0.34" rx="0.2"/>
        <rect x="38" y="47.5" width="2.5" height="3" fill="#a88860" opacity="0.3"  rx="0.2"/>
        <rect x="42" y="48" width="3.5" height="2"   fill="#b09068" opacity="0.32" rx="0.2"/>
        <rect x="56" y="47" width="3"   height="2.5" fill="#b09068" opacity="0.34" rx="0.2"/>
        <rect x="60" y="47.5" width="2" height="3"   fill="#a88860" opacity="0.3"  rx="0.2"/>
        <rect x="63" y="47" width="3.5" height="2"   fill="#b09068" opacity="0.3"  rx="0.2"/>

        <!-- Building blocks — cluster 8 (outer west) -->
        <rect x="-10" y="16" width="3.5" height="2.4" fill="#b09068" opacity="0.34" rx="0.2"/>
        <rect x="-5.5" y="16.5" width="2.8" height="2.8" fill="#a88860" opacity="0.31" rx="0.2"/>
        <rect x="-9" y="20" width="4" height="2.2" fill="#b09068" opacity="0.31" rx="0.2"/>
        <rect x="-4" y="20.2" width="3.2" height="2" fill="#a88860" opacity="0.29" rx="0.2"/>

        <!-- Building blocks — cluster 9 (outer north-east) -->
        <rect x="104" y="-4" width="3.3" height="2.3" fill="#b09068" opacity="0.33" rx="0.2"/>
        <rect x="108" y="-3.6" width="2.6" height="2.6" fill="#a88860" opacity="0.3" rx="0.2"/>
        <rect x="112" y="-3.2" width="3.6" height="2.2" fill="#b09068" opacity="0.3" rx="0.2"/>
        <rect x="106" y="0.2" width="2.8" height="2" fill="#b09068" opacity="0.28" rx="0.2"/>

        <!-- Building blocks — cluster 10 (outer south-east) -->
        <rect x="102" y="56" width="3.4" height="2.4" fill="#b09068" opacity="0.32" rx="0.2"/>
        <rect x="106" y="55.7" width="2.7" height="2.7" fill="#a88860" opacity="0.3" rx="0.2"/>
        <rect x="110" y="56.1" width="3.2" height="2.2" fill="#b09068" opacity="0.29" rx="0.2"/>
        <rect x="105" y="59.1" width="4" height="2" fill="#b09068" opacity="0.28" rx="0.2"/>

        <!-- Additional labels for expanded districts -->
        <text x="104" y="17" fill="#7b5a33" font-size="1.9" opacity="0.45" style="font-family: Georgia, serif; font-style: italic;">Regent's Rd</text>
        <text x="-12" y="61" fill="#7b5a33" font-size="1.8" opacity="0.42" style="font-family: Georgia, serif; font-style: italic;">Fulham Lane</text>
        <text x="86" y="54" fill="#4a6f38" font-size="1.7" opacity="0.5" style="font-family: Georgia, serif; font-style: italic;">Hyde Park</text>

        <!-- Bridges over Thames (north-south connectors) -->
        <rect x="30" y="62" width="2.2" height="16" fill="#9a7a4a" opacity="0.8" rx="0.2"/>
        <rect x="82" y="63" width="2.4" height="15" fill="#9a7a4a" opacity="0.8" rx="0.2"/>
        <line x1="29.8" y1="64" x2="32.4" y2="64" stroke="#c7a678" stroke-width="0.5" opacity="0.62"/>
        <line x1="81.8" y1="65" x2="84.6" y2="65" stroke="#c7a678" stroke-width="0.5" opacity="0.62"/>

        <!-- South bank roads and streets -->
        <path d="M-25,78 Q0,75 28,78 Q56,81 86,77 Q108,74 125,77" fill="none" stroke="#b09070" stroke-width="0.6" opacity="0.45"/>
        <path d="M-25,88 Q2,85 32,88 Q62,91 94,86 Q112,83 125,85" fill="none" stroke="#ae8d67" stroke-width="0.55" opacity="0.4"/>
        <path d="M-20,98 Q10,95 40,98 Q72,101 102,96 Q115,94 125,95" fill="none" stroke="#ac8a63" stroke-width="0.52" opacity="0.36"/>
        <path d="M8,72 Q7,84 9,98" fill="none" stroke="#bca27c" stroke-width="0.4" opacity="0.38"/>
        <path d="M32,72 Q31,84 33,100" fill="none" stroke="#bca27c" stroke-width="0.4" opacity="0.36"/>
        <path d="M58,72 Q57,86 59,101" fill="none" stroke="#bca27c" stroke-width="0.4" opacity="0.36"/>
        <path d="M84,72 Q83,86 85,101" fill="none" stroke="#bca27c" stroke-width="0.38" opacity="0.34"/>
        <path d="M108,72 Q107,85 109,99" fill="none" stroke="#bca27c" stroke-width="0.36" opacity="0.32"/>

        <!-- South bank parks -->
        <ellipse cx="20" cy="90" rx="7" ry="4.2" fill="#5a8a4a" opacity="0.2"/>
        <ellipse cx="52" cy="86" rx="6.2" ry="3.8" fill="#5a8a4a" opacity="0.2"/>
        <ellipse cx="90" cy="92" rx="7.5" ry="4.4" fill="#5a8a4a" opacity="0.22"/>
        <circle cx="18" cy="89" r="0.75" fill="#4a7a3a" opacity="0.32"/>
        <circle cx="22" cy="91" r="0.7" fill="#4a7a3a" opacity="0.3"/>
        <circle cx="50" cy="85.5" r="0.72" fill="#4a7a3a" opacity="0.3"/>
        <circle cx="54" cy="87.2" r="0.68" fill="#4a7a3a" opacity="0.28"/>
        <circle cx="88" cy="91" r="0.78" fill="#4a7a3a" opacity="0.34"/>
        <circle cx="93" cy="93" r="0.72" fill="#4a7a3a" opacity="0.3"/>

        <!-- South bank building clusters -->
        <rect x="-2" y="82" width="3.8" height="2.5" fill="#b09068" opacity="0.33" rx="0.2"/>
        <rect x="2.8" y="81.5" width="2.9" height="2.9" fill="#a88860" opacity="0.31" rx="0.2"/>
        <rect x="8" y="82.2" width="3.4" height="2.3" fill="#b09068" opacity="0.3" rx="0.2"/>
        <rect x="1" y="85.9" width="3.2" height="2.1" fill="#b09068" opacity="0.28" rx="0.2"/>

        <rect x="30" y="80.8" width="3.2" height="2.3" fill="#b09068" opacity="0.33" rx="0.2"/>
        <rect x="34.3" y="80.4" width="2.5" height="2.7" fill="#a88860" opacity="0.31" rx="0.2"/>
        <rect x="38.4" y="81" width="3" height="2.2" fill="#b09068" opacity="0.3" rx="0.2"/>
        <rect x="32" y="84.3" width="4.1" height="2.1" fill="#b09068" opacity="0.28" rx="0.2"/>

        <rect x="64" y="86" width="3.7" height="2.4" fill="#b09068" opacity="0.34" rx="0.2"/>
        <rect x="68.8" y="85.6" width="2.9" height="2.6" fill="#a88860" opacity="0.31" rx="0.2"/>
        <rect x="73.2" y="86.2" width="3.2" height="2.2" fill="#b09068" opacity="0.3" rx="0.2"/>
        <rect x="66" y="89.5" width="3.9" height="2" fill="#b09068" opacity="0.28" rx="0.2"/>

        <rect x="96" y="80.5" width="3.9" height="2.5" fill="#b09068" opacity="0.33" rx="0.2"/>
        <rect x="100.8" y="80.9" width="2.7" height="2.7" fill="#a88860" opacity="0.3" rx="0.2"/>
        <rect x="105" y="80.4" width="3.1" height="2.3" fill="#b09068" opacity="0.29" rx="0.2"/>
        <rect x="98" y="84.2" width="4.3" height="2.1" fill="#b09068" opacity="0.27" rx="0.2"/>

        <text x="16" y="96" fill="#4a6f38" font-size="1.5" opacity="0.46" style="font-family: Georgia, serif; font-style: italic;">Battersea Green</text>
        <text x="84" y="99" fill="#4a6f38" font-size="1.45" opacity="0.44" style="font-family: Georgia, serif; font-style: italic;">Kennington Park</text>

        <!-- Landmark outlines (larger prominent buildings) -->
        <rect x="47" y="43" width="5"   height="4"   fill="none" stroke="#8f6a3a" stroke-width="0.4" opacity="0.55" rx="0.3"/>
        <rect x="20" y="28" width="4"   height="3.5" fill="none" stroke="#8f6a3a" stroke-width="0.4" opacity="0.5"  rx="0.3"/>
        <rect x="78" y="22" width="4.5" height="3.5" fill="none" stroke="#8f6a3a" stroke-width="0.35" opacity="0.45" rx="0.3"/>

        <text x="82" y="67" fill="#2f5972" font-size="2.2" opacity="0.65" style="font-family: Georgia, serif; font-style: italic;">Thames</text>
      </svg>

      <div class="map-compass" aria-hidden="true">
        <div class="compass-rose">✦</div>
        <div class="compass-n">N</div>
      </div>

      <div class="map-legend" aria-hidden="true">
        <div class="legend-title">Городская сводка</div>
        <div class="legend-row">
          <span class="legend-dot dot-available"></span>
          <span>Новые зацепки: {{ availableLocations.size }}</span>
        </div>
        <div class="legend-row">
          <span class="legend-dot dot-visited"></span>
          <span>Проверено точек: {{ props.visitedLocations.size }}</span>
        </div>
        <div class="legend-row">
          <span class="legend-dot dot-locked"></span>
          <span>Закрытые адреса: {{ lockedCount }}</span>
        </div>
      </div>

      <!-- Location pins -->
      <div
        v-for="loc in props.locations"
        :key="loc.id"
        class="location-pin"
        :class="{
          'visited': visitedLocations.has(loc.id),
          'available': availableLocations.has(loc.id),
          'locked': !availableLocations.has(loc.id) && !visitedLocations.has(loc.id),
          'selected': selectedLocation?.id === loc.id,
        }"
        :style="{ left: projectX(loc.x) + '%', top: projectY(loc.y) + '%' }"
        @click="selectLocation(loc)"
      >
        <div class="pin-aura"></div>
        <div class="pin-marker">
          <span v-if="visitedLocations.has(loc.id)">✓</span>
          <span v-else-if="availableLocations.has(loc.id)">!</span>
          <span v-else>·</span>
        </div>
        <div class="pin-label">{{ loc.name }}</div>
      </div>

      <!-- Map title label -->
      <div class="map-title-label">{{ props.mapLabel }}</div>
      <div class="district-chips">
        <span v-for="district in districts" :key="district" class="district-chip">{{ district }}</span>
      </div>
    </div>

    <!-- Location detail panel -->
    <transition name="slide-up">
      <div v-if="selectedLocation" class="location-panel">
        <div class="location-panel-header">
          <div>
            <h3>{{ selectedLocation.name }}</h3>
            <span class="district-badge">{{ selectedLocation.district }}</span>
          </div>
          <button class="close-btn" @click="selectedLocation = null">✕</button>
        </div>
        <p class="location-desc">{{ selectedLocation.description }}</p>

        <!-- Available leads at this location -->
        <div v-if="leadsAtLocation(selectedLocation.id).length > 0">
          <div
            v-for="lead in leadsAtLocation(selectedLocation.id)"
            :key="lead.id"
            class="lead-item"
            :class="{ 'lead-visited': visitedLeads.has(lead.id) }"
          >
            <div class="lead-header">
              <span class="lead-icon">{{ lead.icon }}</span>
              <span class="lead-title">{{ lead.title }}</span>
              <span v-if="visitedLeads.has(lead.id)" class="visited-badge">Изучено</span>
            </div>
            <button
              v-if="!visitedLeads.has(lead.id)"
              class="investigate-btn"
              @click="$emit('investigate', lead)"
            >
              Расследовать
            </button>
            <button
              v-else
              class="review-btn"
              @click="$emit('review-lead', lead)"
            >
              Перечитать
            </button>
          </div>
        </div>
        <div v-else class="no-leads">
          <p>Здесь пока нечего расследовать.</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  visitedLeads: { type: Set, required: true },
  visitedLocations: { type: Set, required: true },
  locations: { type: Array, required: true },
  leads: { type: Array, required: true },
  mapLabel: { type: String, default: 'Лондон, 1895' },
});

const emit = defineEmits(['investigate', 'review-lead']);

const selectedLocation = ref(null);
const CITY_SCALE = 0.72;
const CITY_CENTER_X = 50;
const CITY_CENTER_Y = 50;

// A location is "available" if it has leads with met prerequisites
const availableLocations = computed(() => {
  const set = new Set();
  props.leads.forEach(lead => {
    const prereqsMet = lead.prerequisites.every(p => props.visitedLeads.has(p));
    if (prereqsMet && !props.visitedLeads.has(lead.id)) {
      set.add(lead.locationId);
    }
  });
  return set;
});

const districts = computed(() => {
  const unique = new Set(props.locations.map((loc) => loc.district).filter(Boolean));
  return Array.from(unique).slice(0, 7);
});

const lockedCount = computed(() => {
  return props.locations.filter((loc) => {
    return !props.visitedLocations.has(loc.id) && !availableLocations.value.has(loc.id);
  }).length;
});

function leadsAtLocation(locationId) {
  return props.leads.filter(lead => {
    if (lead.locationId !== locationId) return false;
    const prereqsMet = lead.prerequisites.every(p => props.visitedLeads.has(p));
    return prereqsMet;
  });
}

function selectLocation(loc) {
  selectedLocation.value = selectedLocation.value?.id === loc.id ? null : loc;
}

function projectX(x) {
  return CITY_CENTER_X + (x - CITY_CENTER_X) * CITY_SCALE;
}

function projectY(y) {
  return CITY_CENTER_Y + (y - CITY_CENTER_Y) * CITY_SCALE;
}
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% -20%, #2a1d0d 0%, #100b04 58%, #070401 100%);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.map-inner {
  position: relative;
  flex: 1;
  background:
    radial-gradient(ellipse at 18% 12%, rgba(255,236,190,0.35) 0%, transparent 56%),
    radial-gradient(ellipse at 72% 80%, rgba(72,132,178,0.12) 0%, transparent 58%),
    linear-gradient(154deg, #f6edd8 0%, #e8d5b8 42%, #dcc6a6 100%);
  border: 2px solid #ba9768;
  border-radius: 10px;
  box-shadow:
    inset 0 0 0 1px rgba(255, 230, 182, 0.45),
    inset 0 0 80px rgba(82, 52, 20, 0.26),
    0 24px 50px rgba(0, 0, 0, 0.38);
  overflow: hidden;
  min-height: 400px;
}

.map-atmosphere {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.fog-layer {
  position: absolute;
  border-radius: 999px;
  filter: blur(16px);
  opacity: 0.4;
}

.fog-a {
  width: 52%;
  height: 34%;
  top: -8%;
  left: 12%;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.46), rgba(255, 255, 255, 0));
  animation: drift-a 12s linear infinite alternate;
}

.fog-b {
  width: 48%;
  height: 28%;
  bottom: -6%;
  right: 8%;
  background: radial-gradient(circle at center, rgba(209, 231, 246, 0.32), rgba(209, 231, 246, 0));
  animation: drift-b 14s linear infinite alternate;
}

.paper-noise {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(rgba(78, 48, 16, 0.08) 0.55px, transparent 0.55px),
    radial-gradient(rgba(78, 48, 16, 0.05) 0.55px, transparent 0.55px);
  background-size: 4px 4px, 6px 6px;
  background-position: 0 0, 3px 3px;
  mix-blend-mode: multiply;
  opacity: 0.48;
}

.map-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

.map-compass {
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 4;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 1px solid rgba(128, 85, 40, 0.7);
  background: radial-gradient(circle at 50% 40%, rgba(255, 235, 192, 0.7), rgba(226, 194, 144, 0.55));
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(61, 32, 10, 0.22);
}

.compass-rose {
  font-size: 1rem;
  color: #7f5125;
}

.compass-n {
  position: absolute;
  top: 2px;
  font-size: 0.62rem;
  color: #6e441f;
  letter-spacing: 0.16em;
}

.map-legend {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 4;
  min-width: 168px;
  background: rgba(28, 18, 8, 0.78);
  border: 1px solid rgba(140, 94, 42, 0.62);
  border-radius: 8px;
  padding: 8px 10px;
  backdrop-filter: blur(2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.24);
}

.legend-title {
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #d1ad71;
  margin-bottom: 6px;
}

.legend-row {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 0.7rem;
  color: #d8bc8f;
  margin-bottom: 4px;
}

.legend-row:last-child {
  margin-bottom: 0;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.dot-available {
  background: #d86b41;
  box-shadow: 0 0 8px rgba(216, 107, 65, 0.7);
}

.dot-visited {
  background: #76b15f;
  box-shadow: 0 0 8px rgba(118, 177, 95, 0.55);
}

.dot-locked {
  background: #a48a66;
}

.map-title-label {
  position: absolute;
  bottom: 16px;
  right: 16px;
  font-family: 'Georgia', serif;
  font-style: italic;
  font-size: 0.78rem;
  color: #7a522d;
  opacity: 0.85;
  z-index: 4;
}

.district-chips {
  position: absolute;
  left: 14px;
  bottom: 12px;
  z-index: 4;
  display: flex;
  gap: 6px;
  max-width: calc(100% - 140px);
  overflow-x: auto;
  padding-bottom: 4px;
}

.district-chip {
  font-size: 0.64rem;
  color: #6e451f;
  background: rgba(240, 214, 170, 0.8);
  border: 1px solid rgba(152, 112, 67, 0.58);
  border-radius: 999px;
  padding: 2px 8px;
  white-space: nowrap;
  letter-spacing: 0.03em;
}

.location-pin {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}

.pin-aura {
  position: absolute;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(210, 163, 91, 0.35) 0%, rgba(210, 163, 91, 0) 70%);
  transform: translateY(-4px);
  opacity: 0;
  transition: opacity 0.25s ease;
}

.pin-marker {
  width: 30px;
  height: 30px;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.66rem;
  font-weight: bold;
  border: 1px solid rgba(0,0,0,0.22);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  box-shadow: 3px 3px 8px rgba(0,0,0,0.25);
}

.pin-marker span {
  transform: rotate(45deg);
}

.location-pin.visited .pin-marker {
  background: linear-gradient(145deg, #88c673 0%, #5f9a4d 100%);
  color: white;
  border-color: #4a7a3a;
}

.location-pin.available .pin-marker {
  background: linear-gradient(145deg, #e06c3f 0%, #bc4124 100%);
  color: white;
  border-color: #9a2a10;
  animation: pulse-pin 1.8s ease-in-out infinite;
}

.location-pin.locked .pin-marker {
  background: linear-gradient(145deg, #b19a77 0%, #9b855f 100%);
  color: #d0b890;
  border-color: #806850;
}

.location-pin.available .pin-aura,
.location-pin.selected .pin-aura,
.location-pin:hover .pin-aura {
  opacity: 1;
}

.location-pin:hover .pin-marker {
  transform: rotate(-45deg) scale(1.12);
}

.location-pin.selected .pin-marker {
  transform: rotate(-45deg) scale(1.3);
  box-shadow: 0 0 12px rgba(200,74,42,0.6);
}

@keyframes pulse-pin {
  0%, 100% { box-shadow: 2px 2px 6px rgba(0,0,0,0.25); }
  50% { box-shadow: 2px 2px 12px rgba(200,74,42,0.7); }
}

.pin-label {
  font-size: 0.62rem;
  font-family: 'Georgia', serif;
  color: #3d2a12;
  background: rgba(248,241,229,0.92);
  padding: 2px 6px;
  border-radius: 3px;
  white-space: nowrap;
  border: 1px solid #c3a06b;
  pointer-events: none;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Location detail panel */
.location-panel {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 30;
  background: #1a1208ee;
  color: #e8d4a8;
  padding: 1rem 1.25rem;
  border-top: 2px solid #8a6a35;
  max-height: 55%;
  overflow-y: auto;
  backdrop-filter: blur(4px);
}

.location-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.location-panel-header h3 {
  margin: 0;
  font-family: 'Georgia', serif;
  font-size: 1.05rem;
  color: #f0d890;
}

.district-badge {
  font-size: 0.7rem;
  background: #3a2808;
  border: 1px solid #6a4820;
  color: #c8a060;
  padding: 1px 8px;
  border-radius: 10px;
}

.close-btn {
  background: none;
  border: none;
  color: #a08050;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0 4px;
}

.close-btn:hover { color: #f0c060; }

.location-desc {
  font-size: 0.82rem;
  color: #b0946a;
  margin: 0 0 0.75rem;
  line-height: 1.5;
}

.lead-item {
  background: #2a1c08;
  border: 1px solid #4a3018;
  border-radius: 6px;
  padding: 0.6rem 0.8rem;
  margin-bottom: 0.5rem;
}

.lead-item.lead-visited {
  border-color: #3a5028;
  background: #1a2510;
}

.lead-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
}

.lead-icon { font-size: 1rem; }

.lead-title {
  font-size: 0.85rem;
  font-weight: bold;
  color: #e8c870;
  flex: 1;
}

.visited-badge {
  font-size: 0.65rem;
  background: #2a4a18;
  color: #8aba68;
  padding: 1px 6px;
  border-radius: 8px;
  border: 1px solid #4a7a28;
}

.investigate-btn, .review-btn {
  font-size: 0.78rem;
  padding: 4px 14px;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  font-family: 'Georgia', serif;
  transition: all 0.15s;
}

.investigate-btn {
  background: #8a3a10;
  color: #f0d4a0;
  border: 1px solid #c05a20;
}

.investigate-btn:hover { background: #a84a18; }

.review-btn {
  background: #2a3a18;
  color: #a0c070;
  border: 1px solid #4a6a28;
}

.review-btn:hover { background: #3a4a20; }

.no-leads {
  font-size: 0.8rem;
  color: #806040;
  text-align: center;
  padding: 0.5rem;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

@keyframes drift-a {
  from { transform: translateX(-2%) translateY(0); }
  to { transform: translateX(3%) translateY(2%); }
}

@keyframes drift-b {
  from { transform: translateX(1%) translateY(0); }
  to { transform: translateX(-3%) translateY(-2%); }
}

@media (max-width: 860px) {
  .map-legend {
    top: 8px;
    left: 8px;
    padding: 6px 8px;
    min-width: 150px;
  }

  .map-compass {
    width: 44px;
    height: 44px;
    top: 8px;
    right: 8px;
  }

  .pin-label {
    max-width: 90px;
  }

  .district-chips {
    max-width: calc(100% - 110px);
  }
}
</style>
