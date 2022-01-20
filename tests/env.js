//TODO: use client/operatorApi instead, remove the following
export const operatorApi = () =>
  process.env.OPERATOR_API || "http://localhost:3003/api" //local ingress -> "http://operator-api.localhost/api" // dev -> "https://dev-op.rpgp.cc/api"

//TODO: use client/sboApi instead, remove the following
/*
export const sboApi = () =>
  process.env.SBO_API || "http://localhost:3004/api/sbo" //"http://sbo-api.localhost/api/sbo"
*/

export const host = () => process.env.HOST || "http://localhost:3000" //ingress -> "http://backoffice.localhost" //dev -> "http://dev-bo.rpgp.cc"
