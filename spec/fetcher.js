import got from "got"

export const fetcher = async (...args) => {
    let response = await got(...args)
   try {
    let result = JSON.parse(response.body)
    return response.statusCode >= 400 ? Promise.reject(result) : result 
   } catch (error) {
    console.error(error)
    return Promise.reject(error)
   }
}

export default fetcher
