import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  usePostFormData
} from "../client"

//TODO: rm fake data
export const usePlatformBucketList = (platformId) => {
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
}
