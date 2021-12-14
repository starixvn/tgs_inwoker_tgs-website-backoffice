export const api = () =>
  process.env.OPERATOR_API || "http://operator-api.localhost/api" // dev -> "https://dev-op.rpgp.cc/api"
