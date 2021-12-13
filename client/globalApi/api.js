export const api = () =>
  process.env.GLOBAL_API || "http://global-api.localhost/global-api" //dev -> "https://global-api.rpgp.cc/global-api"
