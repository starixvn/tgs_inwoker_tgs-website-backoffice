const Second = 1000

export default {
  globalSetup: "./tests/init.js",
  timeout: 120 * Second,
  /*
  retries: 2,
  */
  use: {
    acceptDownloads: true,
    launchOptions: {
      slowMo: 10
    }
  }
}
