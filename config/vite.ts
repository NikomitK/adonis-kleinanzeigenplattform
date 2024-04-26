import { defineConfig } from '@adonisjs/vite'

const viteBackendConfig = defineConfig({
  /**
   * The output of vite will be written inside this
   * directory. The path should be relative from
   * the application root.
   */
  buildDirectory: 'public/assets',

  /**
   * The path to the manifest file generated by the
   * "vite build" command.
   */
  manifestFile: 'public/assets/.vite/manifest.json',

  /**
   * Feel free to change the value of the "assetsUrl" to
   * point to a CDN in production.
   */
  assetsUrl: '/assets',

})

export default viteBackendConfig
