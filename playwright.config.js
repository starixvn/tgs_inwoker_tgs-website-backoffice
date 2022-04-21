const Second = 1000

export default {
  globalSetup: "./tests/init.js",
  timeout: 120 * Second,
  use: {
    acceptDownloads: true,
    launchOptions: {
      slowMo: 10
    }
  }
}
