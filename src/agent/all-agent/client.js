import {
  urlWith,
  useGet,
  usePostData,
  usePut,
  usePutData,
  useDelete
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
  validBetConditionModel: [],
  allAgentGameType: "" 
}
*/
export const useUpdateAllAgentValidBetCondition = (
  brandId,
  gameType,
  formData
) => {
  let url =
    brandId && gameType && formData
      ? `${API}/${brandId}/${gameType}/validBet`
      : ""
  return usePutData(url, formData)
}

export const useAllAgentWinLossCondition = (brandId, gameType) => {
  let url = brandId && gameType ? `${API}/${brandId}/${gameType}/winLoss` : ""
  return useGet(url)
}

/*
formData: {
  winLossConditionModel: [],
  allAgentGameType: "" 
}
*/
export const useUpdateAllAgentWinLossCondition = (
  brandId,
  gameType,
  formData
) => {
  let url =
    brandId && gameType && formData
      ? `${API}/${brandId}/${gameType}/winLoss`
      : ""
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
  let url = formData?.brandId ? `${API}/switch` : ""
  return usePutData(url, formData)
}
