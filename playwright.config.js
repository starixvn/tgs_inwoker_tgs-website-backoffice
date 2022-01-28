const Second = 1000

export default {
  globalSetup: "./tests/init.js",
  timeout: 60 * Second,
  use: {
    acceptDownloads: true
  }
}
