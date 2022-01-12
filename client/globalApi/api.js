export const api = () =>
  process.env.GLOBAL_API || "http://localhost:3002/global-api" //local k8s -> "http://global-api.localhost/global-api" //dev -> "https://global-api.rpgp.cc/global-api"
