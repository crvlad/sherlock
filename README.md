# Sherlock Holmes: Detective Consultant

Интерактивная одиночная детективная игра на Vue 3 + Vite.
Игрок выбирает дело, исследует карту Лондона, собирает улики и предъявляет обвинение по трём пунктам: убийца, мотив, метод.

## Возможности

- Несколько полноценных дел с цепочками зависимых улик.
- Экран расследования с вкладками:
	- карта,
	- записная книжка,
	- газеты,
	- справочник.
- Финальный экран обвинения с оценкой качества расследования.
- Фоновая музыка с автопоиском MP3-треков.
- Озвучка текста через Web Speech API (русские голоса, выбор скорости, разбиение длинных текстов на чанки).

## Технологии

- Vue 3 (SFC, script setup, Composition API)
- Vite
- Нативные браузерные API:
	- HTMLAudioElement для музыки
	- Web Speech API для озвучки

## Быстрый старт

### Требования

- Node.js 18+
- npm

### Установка

```bash
npm install
```

### Запуск в разработке

```bash
npm run dev
```

### Production build

```bash
npm run build
```

### Предпросмотр production-сборки

```bash
npm run preview
```

Скрипты определены в [package.json](package.json).

## Доступные дела

Реестр дел находится в [src/data/cases/index.js](src/data/cases/index.js).

На текущий момент подключены:

- Туман над доками
- Изумрудный заговор
- Профессор и его тень
- Дело двойника Мориарти

## Архитектура

### Точка оркестрации

Основная логика приложения находится в [src/App.vue](src/App.vue):

- глобальное состояние игры,
- переключение фаз intro/game/accuse,
- выбор текущего дела,
- управление посещёнными уликами и локациями,
- интеграция модулей музыки и озвучки.

### Основные UI-компоненты

- [src/components/GameMap.vue](src/components/GameMap.vue)
- [src/components/CaseNotebook.vue](src/components/CaseNotebook.vue)
- [src/components/NewspaperView.vue](src/components/NewspaperView.vue)
- [src/components/DirectoryBook.vue](src/components/DirectoryBook.vue)
- [src/components/LeadModal.vue](src/components/LeadModal.vue)
- [src/components/AccusationScreen.vue](src/components/AccusationScreen.vue)

### Composables

- [src/composables/useBackgroundMusic.js](src/composables/useBackgroundMusic.js)
	- случайный плейлист,
	- сохранение состояния в localStorage,
	- громкость и переключение треков.
- [src/composables/useSpeech.js](src/composables/useSpeech.js)
	- выбор русского голоса,
	- настройка скорости,
	- устойчивое воспроизведение длинных текстов через chunking.

## Данные дела: контракт

Каждое дело в [src/data/cases](src/data/cases) должно экспортировать объект со структурой:

```js
export const SOME_CASE = {
	id: 'case-id',
	scenario: {
		id: 'case-id',
		title: 'Название',
		subtitle: 'Подзаголовок',
		introduction: 'Вступление',
		sherlockLeadCount: 10,
		mapLabel: 'Опционально',
		solution: {
			killer: 'Кто убийца',
			motive: 'Мотив',
			method: 'Метод',
			explanation: 'Подробное объяснение',
		},
	},
	locations: [
		{ id, name, district, x, y, description },
	],
	leads: [
		{ id, locationId, title, prerequisites: [], text, icon },
	],
	newspapers: [],
	directory: {
		persons: [],
		places: [],
	},
	evaluateAccusation(answers, leadsVisited) {
		return {
			isCorrect: true,
			score: 100,
			killerMatch: true,
			motiveMatch: true,
			methodMatch: true,
		};
	},
};
```

Важно:

- scenario.solution должен быть объектом, а не строкой.
- prerequisites должны ссылаться только на существующие lead.id.
- locationId в улике должен существовать в locations.

## Модель оценивания (для всех дел)

Общая модель находится в [src/data/score.js](src/data/score.js) и используется в каждом деле:

- Верный убийца: 80%
- Верный мотив: +10%
- Верный метод: +10%

Убийца масштабируется коэффициентом эффективности расследования:

```text
multiplier = min(1, sherlockLeadCount / visitedLeadsCount)
```

Итог:

```text
score = round((killerMatch ? 80 * multiplier : 0) + (motiveMatch ? 10 : 0) + (methodMatch ? 10 : 0))
```

Если убийца неверен, засчитывается 0 по блоку убийцы, но мотив и метод могут дать частичные баллы согласно формуле.

## Музыка и аудио

Треки автоматически собираются из папки [public/audio](public/audio).

Плагин в [vite.config.js](vite.config.js):

- сканирует MP3 в public/audio,
- генерирует [src/data/audioTracks.js](src/data/audioTracks.js),
- обновляет список при add/change/unlink в dev-режиме.

Чтобы добавить музыку:

1. Поместите mp3-файлы в public/audio.
2. Перезапустите dev-сервер при необходимости.
3. Убедитесь, что [src/data/audioTracks.js](src/data/audioTracks.js) обновился.

## Поток игры

1. Пользователь выбирает дело на intro-экране.
2. В фазе game исследует улики по карте и вкладкам.
3. В фазе accuse вводит убийцу, мотив, метод.
4. Получает итоговый счёт и объяснение.

## Рекомендации по разработке

- Делайте минимальные точечные изменения.
- После изменений запускайте:

```bash
npm run build
```

- Для изменений UI вручную проверяйте цепочку:
	- intro -> game -> accuse.

Агентские инструкции проекта: [AGENTS.md](AGENTS.md).

## Частые проблемы

- NaN в счёте: проверьте, что evaluateAccusation возвращает число в поле score.
- Пустой блок решения: проверьте, что scenario.solution содержит killer/motive/method/explanation.
- Улика не открывается: проверьте prerequisites и корректность id.
- Нет музыки: проверьте, что браузер разрешил autoplay после пользовательского действия.
- Голос не выбирается: проверьте доступность русских голосов в системе/браузере.
