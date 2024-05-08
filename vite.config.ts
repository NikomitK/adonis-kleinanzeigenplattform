import { defineConfig } from 'vite'
import adonisjs from '@adonisjs/vite/client'

export default defineConfig({
  build: {
    target: 'esnext'
  },
  plugins: [
    adonisjs({
      /**
       * Entrypoints of your application. Each entrypoint will
       * result in a separate bundle.
       */
      entrypoints: ['resources/js/app.js', 'resources/js/anzeige.js', 'resources/js/base.js', 'resources/js/chat.js', 'resources/js/login.js', 'resources/js/user.js'],

      /**
       * Paths to watch and reload the browser on file change
       */
      reload: ['resources/views/**/*.edge', 'resources/js/**/*.js'],
    }),
  ],
})
