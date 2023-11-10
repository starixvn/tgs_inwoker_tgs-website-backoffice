import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  useDelete,
  usePatchData
} from "../../client"

let API = "/api/BrandAllAgent"

export const useAllAgentSetting = (brandId) => {
  let url = brandId ? `${API}/${brandId}` : ""
  return useGet(url)
}

export const useAllAgentValidBetCondition = (brandId, gameType) => {
  let url = brandId && gameType ? `${API}/${brandId}/${gameType}/validBet` : ""
  return useGet(url)
}

/*
formData: {
  brandId: "",
  validBetConditionModel: [],
  allAgentGameType: "" 
}
*/
export const useUpdateAllAgentValidBetCondition = (formData) => {
  let url = formData?.brandId ? `${API}/validBet` : ""
  return usePutData(url, formData)
}

export const useAllAgentWinLossCondition = (brandId, gameType) => {
  let url = brandId && gameType ? `${API}/${brandId}/${gameType}/winLoss` : ""
  return useGet(url)
}

/*
formData: {
  brandId: "",
  winLossConditionModel: [],
  allAgentGameType: "" 
}
*/
export const useUpdateAllAgentWinLossCondition = (formData) => {
  let url = formData?.brandId ? `${API}/winLoss` : ""
  return usePutData(url, formData)
}

/*
formData: { 
  brandId, "",
  switch: true | false 
}
*/
export const useUpdateAllAgentSwitch = (formData) => {
  let url = formData?.brandId ? `${API}/switch` : ""
  return usePutData(url, formData)
}

/*
formData: {
  brandId: ""
  switch: true | false,
  hasValidBet: true | false,
  hasWinLoss: true | false,
  allAgentGameType: ""
}
*/
export const useUpdateAllAgentGameTypeSwitch = (formData) => {
  let url = formData?.brandId ? `${API}/gameType` : ""
  return usePutData(url, formData)
}

export const useUpdateAllAgentSettlementCycle = (data) => {
  let url = data?.brandId ? `${API}/settlement-interval` : ""
  return usePatchData(url, data)
}
