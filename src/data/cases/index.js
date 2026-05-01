import { FOGGY_HARBOR_CASE } from './foggyHarborCase.js';
import { EMERALD_CONSPIRACY_CASE } from './emeraldConspiracyCase.js';
import { PROFESSOR_SHADOW_CASE } from './professorShadowCase.js';
import { WATSONS_CLIENT_CASE } from './watsonsClientCase.js';

export const CASE_FILES = [FOGGY_HARBOR_CASE, EMERALD_CONSPIRACY_CASE, PROFESSOR_SHADOW_CASE, WATSONS_CLIENT_CASE];

export function getCaseById(caseId) {
  return CASE_FILES.find(item => item.id === caseId) || CASE_FILES[0];
}
