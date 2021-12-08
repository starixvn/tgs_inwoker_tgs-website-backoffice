module.exports = {
  extension: ["js"],
  package: "./package.json",
  reporter: "list",
  timeout: 50000, //or false: disable timeout
  require: "./.mocharc.fixtures.js"
}
