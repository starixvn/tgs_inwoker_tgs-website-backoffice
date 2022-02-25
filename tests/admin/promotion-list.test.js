import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { random } from "lodash-es"
import { startOfDay, endOfTomorrow, format, addWeeks } from "date-fns"
import { fillDatePicker } from "../fill.js"
import { selectRandomPlatform } from "../page/content.js"
import { optionValues } from "../page/select.js"
import { openDialog } from "../page/dialog.js"
import faker from "@faker-js/faker"

const test = base.extend(Fixture)
const { lorem } = faker

test("add and edit promotion", async ({ page }) => {
  let brandId = await gotoPromotionPage(page)
  let promotion = await addPromotion(page)

  await searchPromotion(page, promotion)

  let updatedPromotion = await editPromotion(page, brandId, promotion)

  await toggleStatus(page, brandId)

  await deletePromotion(page)
})

const searchPromotion = async (page, promotion) => {
  await page.fill(`input[name="name"]`, promotion.name)
  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/promotion?`) && response.status() === 200
      )
    }),
    page.click(`button[type="submit"]`)
  ])
}

const deletePromotion = async (page) => {
  let Dialog = `#delete-promotion-dialog`
  await openDialog(page, Dialog)

  let id = await page.inputValue(`${Dialog} input[name="id"]`)
  let ExpectedOrder = `/api/promotion/${id}/archived`

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().toLowerCase().endsWith(ExpectedOrder) &&
        response.status() === 200
      )
    }),
    page.click(`${Dialog} button[type="submit"]`)
  ])
}

const toggleStatus = async (page, brandId, index = 0) => {
  await page.waitForSelector(
    `#promotion [data-row-index="${index}"] [data-column-id="status"] input[name="status"]`
  )

  const PromotionStatus = ["Enabled", "Disabled"]
  let status = await page.$eval(
    `#promotion [data-row-index="${index}"] [data-column-id="status"] label`,
    ({ dataset }) => dataset.status
  )

  expect(status).to.be.oneOf(PromotionStatus)
  let Status = PromotionStatus.filter((value) => value != status)
  let [ExpectedStatus] = Status

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().endsWith(`/${ExpectedStatus}`) &&
        response.status() === 200
      )
    }),
    page.click(
      `#promotion [data-row-index="${index}"] [data-column-id="status"] label .bb-SwitchIcon`
    )
  ])

  await page.waitForSelector(
    `#promotion [data-row-index="${index}"] [data-column-id="status"]`
  )

  let toggledStatus = await page.$eval(
    `#promotion [data-row-index="${index}"] [data-column-id="status"] label`,
    ({ dataset }) => dataset.status
  )
  expect(toggledStatus).to.equal(ExpectedStatus)
}

let MinTotalAmountLimit = 10000000

const PromotionTypeGroupOptions = ["Deposit", "Turnover"]
const editPromotion = async (page, brandId, record) => {
  let EditDialogSelector = `#edit-promotion-dialog`
  await openDialog(page, EditDialogSelector)

  let promotionTypeGroup = await getPromotionTypeGroup(page)
  let otherPromotionTypeGroups = PromotionTypeGroupOptions.filter(
    (item) => item != promotionTypeGroup
  )

  let promotion = {
    ...record,
    promotionTypeGroup:
      PromotionTypeGroupOptions[random(0, otherPromotionTypeGroups.length - 1)],
    totalAmountLimit: random(MinTotalAmountLimit, MinTotalAmountLimit + 1000),
    bonusAmountLimit: random(0, 100)
  }

  await page.fill(
    `${EditDialogSelector} input[name="totalAmountLimit"]`,
    `${promotion.totalAmountLimit}`
  )

  await setPromotionTypeGroup(page, promotion.promotionTypeGroup)

  let PromotionTypeOptions = await getPromotionTypeOptions(page)
  let promotionType = await getPromotionType(page)
  let otherPromotionTypes = PromotionTypeOptions.filter(
    (item) => item != promotionType
  )
  promotion.promotionType =
    otherPromotionTypes.length > 0
      ? otherPromotionTypes[random(0, otherPromotionTypes.length - 1)]
      : PromotionTypeOptions[0]
  await setPromotionType(page, promotion.promotionType)

  let hasGameTypeOption = await isGameTypeSelectVisible(page)
  if (hasGameTypeOption) {
    //TODO: select other game type group

    let GameTypeOptions = await getGameTypeOptions(page)
    let gameType = await getGameType(page)
    let otherGameTypeOptions = GameTypeOptions.filter(
      (item) => item != gameType
    )

    promotion.gameType =
      otherGameTypeOptions.length > 0
        ? otherGameTypeOptions[random(0, otherGameTypeOptions.length - 1)]
        : GameTypeOptions[0]

    let [response] = await Promise.all([
      /* TODO: if game type doesn't change, won't trigger get api
      page.waitForResponse((response) => {
        let url = response.url()
        return (
          url.includes("/api/brandgameprovider") &&
          url.includes(`gameType=${promotion.gameType}`) &&
          response.status() === 200
        )
      }),
      */
      setGameType(page, promotion.gameType)
    ])

    /* TODO: select brand game providers?
    let brandGameProviders = await response.json()
    console.log("brandGameProviders", brandGameProviders)
    */
  }

  await page.fill(
    `${EditDialogSelector} input[name="bonusAmountLimit"]`,
    `${promotion.bonusAmountLimit}`
  )

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes("/api/promotion") && response.status() === 200
      )
    }),
    page.click(`#edit-promotion-dialog button[type="submit"]`)
  ])
  return promotion
}

const addPromotion = async (page) => {
  let DialogSelector = `#add-promotion-dialog`
  await openDialog(page, DialogSelector)

  let from = startOfDay(new Date())
  let to = addWeeks(new Date(), 2)
  let promotion = {
    name: `${lorem.word()}-${Date.now()}`,
    from: format(from, "yyyy/MM/dd"),
    to: format(to, "yyyy/MM/dd"),
    totalAmountLimit: 1000,
    percentage: 50,
    bonusAmountLimit: 100,
    turnoverMultiple: 2
  }

  await page.fill(`${DialogSelector} input[name="name"]`, promotion.name)

  await fillDatePicker({
    page,
    selector: `${DialogSelector} #promotion-period-box .react-datepicker-wrapper:first-child input`,
    value: promotion.from
  })
  await fillDatePicker({
    page,
    selector: `${DialogSelector} #promotion-period-box .react-datepicker-wrapper:not(:first-child) input`,
    value: promotion.to
  })

  await page.click(
    `${DialogSelector} #vipLevels input[type="checkbox"] + .bb-CheckboxIcon`
  )

  await selectPromotionType(page)
  await page.fill(
    `${DialogSelector} input[name="totalAmountLimit"]`,
    `${promotion.totalAmountLimit}`
  )

  const [desktopFileChooser] = await Promise.all([
    page.waitForEvent("filechooser"),
    page.click(`${DialogSelector} #desktopBanner`)
  ])

  await Promise.all([
    desktopFileChooser.setFiles("./tests/dummy.png"),
    page.waitForResponse((response) => {
      return (
        response.url().endsWith(`/api/fs/upload/promotion`) &&
        response.status() === 200
      )
    })
  ])

  const [mobileFileChooser] = await Promise.all([
    page.waitForEvent("filechooser"),
    page.click(`${DialogSelector} #mobileBanner`)
  ])

  await Promise.all([
    mobileFileChooser.setFiles("./tests/dummy.png"),
    page.waitForResponse((response) => {
      return (
        response.url().endsWith(`/api/fs/upload/promotion`) &&
        response.status() === 200
      )
    })
  ])

  await page.fill(
    `${DialogSelector} input[name="percentage"]`,
    `${promotion.percentage}`
  )
  await page.fill(
    `${DialogSelector} input[name="bonusAmountLimit"]`,
    `${promotion.bonusAmountLimit}`
  )
  await page.fill(
    `${DialogSelector} input[name="turnoverMultiple"]`,
    `${promotion.turnoverMultiple}`
  )

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().endsWith("/api/promotion") && response.status() === 200
      )
    }),
    page.click(`${DialogSelector} button[type="submit"]`)
  ])

  await page.waitForSelector(DialogSelector, { state: "detached" })
  return promotion
}

const PromotionTypeGroupSelectSelector = `select[name="promotionTypeGroup"]`
const getPromotionTypeGroupOptions = async (
  page,
  selectSelector = PromotionTypeGroupSelectSelector
) => {
  return optionValues(page, selectSelector)
}

const getPromotionTypeGroup = async (
  page,
  selectSelector = PromotionTypeGroupSelectSelector
) => {
  return optionValues(page, selectSelector)
}

const setPromotionTypeGroup = async (
  page,
  option = "",
  selectSelector = PromotionTypeGroupSelectSelector
) => {
  return page.selectOption(selectSelector, option)
}

const PromotionTypeSelectSelector = `select[name="promotionType"]`
const getPromotionTypeOptions = async (
  page,
  selectSelector = PromotionTypeSelectSelector
) => {
  return optionValues(page, selectSelector)
}

const getPromotionType = async (
  page,
  selectSelector = PromotionTypeSelectSelector
) => {
  return optionValues(page, selectSelector)
}

const setPromotionType = async (
  page,
  option,
  selectSelector = PromotionTypeSelectSelector
) => {
  return page.selectOption(selectSelector, option)
}

const GameTypeSelectSelector = `select[name="gameType"]`
const isGameTypeSelectVisible = async (page) => {
  return page.isVisible(GameTypeSelectSelector)
}

const getGameTypeOptions = async (
  page,
  selectSelector = GameTypeSelectSelector
) => {
  return optionValues(page, selectSelector)
}

const getGameType = async (page, selectSelector = GameTypeSelectSelector) => {
  return optionValues(page, selectSelector)
}

const setGameType = async (
  page,
  option,
  selectSelector = GameTypeSelectSelector
) => {
  return page.selectOption(selectSelector, option)
}

const gotoPromotionPage = async (page) => {
  await page.goto("/promotion/promotionlist", { waitUntil: "networkidle" })
  return await selectRandomPlatform(page)
}

const PromotionType = {
  DailyFirstDeposit: "DailyFirstDeposit"
}
const selectPromotionType = async (
  page,
  option = PromotionType.DailyFirstDeposit
) => {
  return page.selectOption(`select[name="promotionType"]`, option)
}
