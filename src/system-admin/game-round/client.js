import {
    urlWith,
    useGet,
    usePostData,
    usePutData,
    useDelete,
    usePostFormData
  } from "../../client"

  const API = "/api/RoundReport"

  export const useOpenGameRoundList = (searchParams) => {
    let url = searchParams ? urlWith(searchParams, `${API}`) : ""
    return useGet(url)
  }