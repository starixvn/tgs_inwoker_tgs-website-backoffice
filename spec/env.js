export const globalApi = () =>
  process.env.GLOBALAPI || "http://global-api.localhost/global-api"

export const operatorApi = () =>
  process.env.GLOBALAPI || "http://operator-api.localhost/api"

export const host = () => process.env.HOST || "http://backoffice.localhost"

//TODO: from process.env
export const headless = () => false

/*
export const pageLang = async (page) =>
  page.evaluate(() => window.localStorage.getItem("lang"))
*/
