import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'node:fs'
import path from 'node:path'

const AUDIO_DIR = path.resolve(__dirname, 'public/audio')
const AUDIO_TRACKS_FILE = path.resolve(__dirname, 'src/data/audioTracks.js')

function generateAudioTracksFile() {
  const files = fs.existsSync(AUDIO_DIR) ? fs.readdirSync(AUDIO_DIR) : []

  const tracks = files
    .filter(file => /\.mp3$/i.test(file))
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true, sensitivity: 'base' }))
    .map(file => `/audio/${file}`)

  const content = `export const AUDIO_TRACKS = ${JSON.stringify(tracks, null, 2)}\n`

  if (fs.existsSync(AUDIO_TRACKS_FILE)) {
    const current = fs.readFileSync(AUDIO_TRACKS_FILE, 'utf8')
    if (current === content) return
  }

  fs.writeFileSync(AUDIO_TRACKS_FILE, content)
}

function audioTracksPlugin() {
  return {
    name: 'audio-tracks-plugin',
    buildStart() {
      generateAudioTracksFile()
    },
    configureServer(server) {
      generateAudioTracksFile()
      server.watcher.add(AUDIO_DIR)

      const isAudioFile = filePath =>
        filePath.startsWith(AUDIO_DIR) && /\.mp3$/i.test(filePath)

      const regenerate = filePath => {
        if (!isAudioFile(filePath)) return
        generateAudioTracksFile()
      }

      server.watcher.on('add', regenerate)
      server.watcher.on('unlink', regenerate)
      server.watcher.on('change', regenerate)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), audioTracksPlugin()],
})
