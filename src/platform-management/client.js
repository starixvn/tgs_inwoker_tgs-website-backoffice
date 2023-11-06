import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  usePostFormData
} from "../client"

//TODO: rm fake data
const PlayerBucketAPI = "/api/player/bucket"
export const usePlatformBucketList = (id) => {
  let url = id ? `${PlayerBucketAPI}/by-brand/${id}` : ""
  return useGet(url)

  /*
  let data = [
    {
      type: "Main"
    },
    {
      type: "LiveDealer"
    },
    {
      type: "Sports"
    },
    {
      type: "EGame"
    },
    {
      type: "CardGame"
    },
    {
      type: "VirtualSports"
    },
    {
      type: "Lottery"
    }
  ]

  return {
    data,
    error: undefined,
    isLoading: false,
    mutate: () => {},
    deleteCache: () => {}
  }
  */
}
