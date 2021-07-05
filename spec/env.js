export const host = () => process.env.HOST || "http://backoffice.localhost"

//TODO: from process.env
export const headless = () => false

/*
export const pageLang = async (page) =>
  page.evaluate(() => window.localStorage.getItem("lang"))
*/
