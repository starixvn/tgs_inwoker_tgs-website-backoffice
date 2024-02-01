export const urlIncludes =
  (path = "", options) =>
  (response) => {
    path = path.toLowerCase()
    let url = response.url().toLowerCase()
    if (options?.debug) {
      console.log(url)
    }
    let isApi = url.includes(path)
    if (isApi && !response.ok()) {
      throw Error(`${url} failed`)
    }

    return isApi
  }
