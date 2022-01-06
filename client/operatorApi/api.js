export const api = () => process.env.OPERATOR_API || "http://localhost:3003/api" //local k8s -> "http://operator-api.localhost/api" // dev -> "https://dev-op.rpgp.cc/api"
