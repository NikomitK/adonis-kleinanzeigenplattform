export default {
    site: 'localhost:3333',
    debug: false,
    scanner: {
        device: 'desktop',
        throttle: false
    },
    puppeteerClusterOptions: {
        // only run 1 worker at a time
        maxConcurrency: 6
    }
}