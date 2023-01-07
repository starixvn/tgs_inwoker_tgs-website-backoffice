import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  useDelete
} from "../../client"
import {
  useSystemSetting,
  useSystemSettingValue
} from "../../system-admin/setting/client"

let API = "/api/promotion"

export const usePromotionList = (searchParams) => {
  let url = searchParams ? urlWith(searchParams, API) : ""
  return useGet(url)
}

/*
export const usePromotion = (id) => {
  let url = id ? urlWith(searchParams, `${API}/${id}`) : ""
  return useGet(url)
}
*/

export const usePromotionRule = (id) => {
  let url = id ? `${API}/rule/${id}` : ""
  return useGet(url)
}

export const useAddPromotion = (data) => {
  return usePostData(API, data)
}

export const useUpdatePromotion = (id, data) => {
  let url = id ? `${API}/${id}` : ""
  return usePutData(url, data)
}

export const useChangePromotionStatus = (id, status) => {
  let url = id && status ? `${API}/${id}/${status}` : ""

  return usePut(url)
}

export const useDeletePromotion = (id) => {
  return useChangePromotionStatus(id, "Archived")
}

export const useChangePromotionOrders = (data) => {
  let url = `${API}/changeorders`
  return usePutData(url, data)
}

export const useChangeLogList = (searchParams) => {
  //TODO: return fake data?
  return {
    isLoading: false,
    data: [
      {
        eventId: "01855bd3-60b3-0000-0001-07e620dd98d5",
        promotionId: "01855bd3-60b5-0000-0001-07e620dd98d5",
        action: "CreateMainInfo",
        createdOn: "2022-12-29T03:00:57.757886+00:00",
        modifier: "test1"
      },
      {
        eventId: "01855c0b-ed06-0000-0001-07e620dd98d5",
        promotionId: "01855bd3-60b5-0000-0001-07e620dd98d5",
        action: "UpdateContent",
        createdOn: "2022-12-29T04:02:43.619763+00:00",
        modifier: "test2"
      },
      {
        eventId: "01855c47-abfa-0000-0001-07e620dd98d5",
        promotionId: "01855bd3-60b5-0000-0001-07e620dd98d5",
        action: "UpdateRule",
        createdOn: "2022-12-29T05:07:59.09943+00:00",
        modifier: "test003"
      },
      {
        eventId: "01855c4a-b9e6-0000-0001-07e620dd98d5",
        promotionId: "01855bd3-60b5-0000-0001-07e620dd98d5",
        action: "ChangeStatus",
        createdOn: "2022-12-29T05:11:19.271328+00:00",
        modifier: "test123"
      },
      {
        eventId: "01855c50-2ce2-0000-0001-07e620dd98d5",
        promotionId: "01855bd3-60b5-0000-0001-07e620dd98d5",
        action: "ChangeStatus",
        createdOn: "2022-12-29T05:17:16.386605+00:00",
        modifier: "test234"
      },
      {
        eventId: "01855c52-df73-0000-0001-07e620dd98d5",
        promotionId: "01855bd3-60b5-0000-0001-07e620dd98d5",
        action: "ChangeStatus",
        createdOn: "2022-12-29T05:20:13.17191+00:00",
        modifier: "test231"
      }
    ]
  }

  let url = searchParams?.promotionId
    ? urlWith(searchParams, `${API}/history/${searchParams?.promotionId}`)
    : ""
  return useGet(url)
}

export const useChangeLogDetail = (eventId) => {
  //TODO: rm fake data
  return {
    isLoading: false,
    data: {
      eventId: "01855c0b-ed06-0000-0001-07e620dd98d5",
      promotionId: "01855bd3-60b5-0000-0001-07e620dd98d5",
      action: "UpdateContent",
      changeSets: [
        {
          op: "add",
          path: "/content",
          value: "<p>充值送測試内容</p>"
        },
        {
          op: "add",
          path: "/localization",
          value: "{}"
        },
        {
          op: "add",
          path: "/subSubject",
          value: "充值送"
        },
        {
          op: "add",
          path: "/updatedByUsername",
          value: "test2"
        },
        {
          op: "replace",
          path: "/updatedOn",
          value: "2022-12-29T04:02:43.5906766Z"
        },
        {
          op: "replace",
          path: "/snapshotEventId",
          value: "01855c0b-ed06-0000-0001-07e620dd98d5"
        }
      ],
      createdOn: "2022-12-29T04:02:43.619763+00:00",
      modifier: "test2"
    }
  }
  //TODO: return fake data?
}
