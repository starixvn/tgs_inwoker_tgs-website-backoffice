export const globalApi = () =>
  process.env.GLOBAL_API || "http://global-api.localhost/global-api"

export const operatorApi = () =>
  process.env.OPERATOR_API || "http://operator-api.localhost/api"

export const sboApi = () =>
  process.env.SBO_API || "http://sbo-api.localhost/api/sbo"

export const host = () => process.env.HOST || "http://backoffice.localhost"

//TODO: from process.env
export const headless = () => false

/*
export const pageLang = async (page) =>
  page.evaluate(() => window.localStorage.getItem("lang"))
*/
