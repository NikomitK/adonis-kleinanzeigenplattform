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
      entrypoints: ['resources/js/app.js', 'resources/js/anzeige.js', 'resources/css/anzeige.css', 'resources/js/base.js', 'resources/css/base.css', 'resources/js/chat.js', 'resources/css/chat.css', 'resources/js/login.js', 'resources/css/login.css', 'resources/js/user.js', 'resources/css/user.css'],

      /**
       * Paths to watch and reload the browser on file change
       */
      reload: ['resources/views/**/*.edge', 'resources/js/**/*.js'],
    }),
  ],
})
