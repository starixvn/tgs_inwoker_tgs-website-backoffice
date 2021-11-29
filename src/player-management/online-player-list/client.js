import {
  urlWith,
  useGet,
  usePostData,
  usePutData,
  useDelete
} from "../../client"

let API = "/api/player"

export const useOnlinePlayerList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, API) : ""
  return useGet(url)
}
