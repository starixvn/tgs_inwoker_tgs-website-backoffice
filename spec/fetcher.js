import got from "got"

export const fetcher = async (...args) => got(...args).json()

export default fetcher
