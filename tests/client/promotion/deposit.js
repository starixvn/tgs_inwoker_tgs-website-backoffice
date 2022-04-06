import { fetcher } from "../fetcher.js"
import { host } from "../host.js"
import { startOfDay, endOfTomorrow, formatISO, addWeeks } from "date-fns"
import faker from "@faker-js/faker"

const { lorem } = faker

const API = "api/promotion"
export const addFirstDeposit = async ({
  brandId,
  name = `${lorem.word()}-${Date.now()}`,
  subSubject = lorem.word(),
  from = formatISO(new Date()),
  to = formatISO(addWeeks(new Date(), 2)),
  vipLevels = [1],
  autoSentPlayerBonus = true,
  unlimited = true,
  promotionType = "FirstDeposit",
  percentage = 10,
  bonusAmountLimit = 100,
  turnoverMultiple = 10,
  desktopBanner = faker.image.imageUrl(),
  mobileBanner = faker.image.imageUrl(),
  ...restFormData
} = {}) => {
  if (!brandId) {
    throw "brandId is required field"
  }

  let formData = {
    name,
    gameProviderIds: [],
    autoSentPlayerBonus,
    localization: {},
    from,
    to,
    vipLevels,
    promotionType,
    unlimited,
    subSubject,
    desktopBanner,
    mobileBanner,
    percentage,
    bonusAmountLimit,
    turnoverMultiple,
    brandId
  }
  let response = await fetcher.post(`${host}/${API}`, {
    data: formData,
    failOnStatusCode: true
  })
  let result = await response.json()
  let id = await findPromotionId({ brandId, name: formData.name })

  return {
    ...formData,
    id
  }
}

const findPromotionId = async ({ brandId, name }) => {
  let url = `${host}/${API}?brandId=${brandId}&name=${name}&showAll=true`
  let response = await fetcher.get(url)
  let result = await response.json()
  return result.items[0].id
}
