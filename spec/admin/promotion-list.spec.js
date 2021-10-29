import { chromium } from "playwright"
import { expect } from "chai"
import { StorageState } from "../auth"
import { host, headless } from "../env"
import { random } from "lodash"
import numeral from "numeral"
import { startOfDay, endOfTomorrow, format, addWeeks } from "date-fns"
import { lorem } from "faker"
import clone from "clone-deep"
import { fillDatePicker } from "../fill"
import { goto } from "../sidebar"
import platform from "../platform"

let browser
let context
let page

describe("Admin user", () => {
  before(async () => {
    browser = await chromium.launch({ headless: headless() })
    context = await browser.newContext({ storageState: StorageState.Admin })
  })

  beforeEach(async () => {
    page = await context.newPage()

    await page.goto(host(), {
      waitUntil: "networkidle0"
    })

    await gotoPromotionPage()
  })

  afterEach(async () => {
    await page.close()
  })

  after(async () => {
    await browser.close()
  })

  it("should able to add and edit promotion", async () => {
    let promotion = await addPromotion()

    let updatedPromotion = await editPromotion(promotion)
    await toggleStatus()
    await toggleStatus()

    await toggleStatus() //Note. only disabled status could get deleted
    await deletePromotion()
  })

  const deletePromotion = async () => {
    let Dialog = `#delete-promotion-dialog`
    await page.click(`${Dialog}-disclosure`)
    await page.waitForSelector(Dialog)

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

  const toggleStatus = async (index = 0) => {
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

    await page.reload({ waitUntil: "networkidle" })
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
  const editPromotion = async () => {
    let EditDialogSelector = `#edit-promotion-dialog`
    await page.click(`${EditDialogSelector}-disclosure`)
    await page.waitForSelector(EditDialogSelector)
    await page.waitForLoadState()

    let PromotionTypeGroupOptions = await getPromotionTypeGroupOptions()
    let promotionTypeGroup = await getPromotionTypeGroup()
    let otherPromotionTypeGroups = PromotionTypeGroupOptions.filter(
      (item) => item != promotionTypeGroup
    )

    let promotion = {
      name: `${lorem.word()}-${Date.now()}`,
      promotionTypeGroup:
        PromotionTypeGroupOptions[
          random(0, otherPromotionTypeGroups.length - 1)
        ],
      totalAmountLimit: random(MinTotalAmountLimit, MinTotalAmountLimit + 1000),
      bonusAmountLimit: random(0, 100)
    }
    await page.fill(`${EditDialogSelector} input[name="name"]`, promotion.name)
    await page.fill(
      `${EditDialogSelector} input[name="totalAmountLimit"]`,
      `${promotion.totalAmountLimit}`
    )

    await setPromotionTypeGroup(promotion.promotionTypeGroup)

    let PromotionTypeOptions = await getPromotionTypeOptions()
    let promotionType = await getPromotionType()
    let otherPromotionTypes = PromotionTypeOptions.filter(
      (item) => item != promotionType
    )
    promotion.promotionType =
      otherPromotionTypes.length > 0
        ? otherPromotionTypes[random(0, otherPromotionTypes.length - 1)]
        : PromotionTypeOptions[0]
    await setPromotionType(promotion.promotionType)

    let hasGameTypeOption = await isGameTypeSelectVisible()
    if (hasGameTypeOption) {
      //TODO: select other game type group

      let GameTypeOptions = await getGameTypeOptions()
      let gameType = await getGameType()
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
        setGameType(promotion.gameType)
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
    await page.waitForLoadState("networkidle")
    await page.waitForLoadState("domcontentloaded")
    return promotion
  }

  const addPromotion = async () => {
    let DialogSelector = `#add-promotion-dialog`
    await page.click(`${DialogSelector}-disclosure`)

    let from = startOfDay(new Date())
    let to = addWeeks(new Date(), 1)
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

    await selectPromotionType()
    await page.fill(
      `${DialogSelector} input[name="totalAmountLimit"]`,
      `${promotion.totalAmountLimit}`
    )

    const [desktopFileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      page.click(`${DialogSelector} #desktopBanner`)
    ])
    await desktopFileChooser.setFiles("./spec/dummy.png")
    await page.waitForResponse((response) => {
      return (
        response.url().endsWith(`/api/fs/upload/promotion`) &&
        response.status() === 200
      )
    })

    const [mobileFileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      page.click(`${DialogSelector} #mobileBanner`)
    ])
    await mobileFileChooser.setFiles("./spec/dummy.png")
    await page.waitForResponse((response) => {
      return (
        response.url().endsWith(`/api/fs/upload/promotion`) &&
        response.status() === 200
      )
    })

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
    selectSelector = PromotionTypeGroupSelectSelector
  ) => {
    let Selector = `${selectSelector} option:not(:first-child)`
    await page.waitForSelector(Selector, { state: "attached" })
    return page.$$eval(Selector, (options) => options.map(({ value }) => value))
  }

  const getPromotionTypeGroup = async (
    selectSelector = PromotionTypeGroupSelectSelector
  ) => {
    return page.$eval(selectSelector, ({ value }) => value)
  }

  const setPromotionTypeGroup = async (
    option = "",
    selectSelector = PromotionTypeGroupSelectSelector
  ) => {
    return page.selectOption(selectSelector, option)
  }

  const PromotionTypeSelectSelector = `select[name="promotionType"]`
  const getPromotionTypeOptions = async (
    selectSelector = PromotionTypeSelectSelector
  ) => {
    let Selector = `${selectSelector} option:not(:first-child)`
    await page.waitForSelector(Selector, { state: "attached" })
    return page.$$eval(Selector, (options) => options.map(({ value }) => value))
  }

  const getPromotionType = async (
    selectSelector = PromotionTypeSelectSelector
  ) => {
    return page.$eval(selectSelector, ({ value }) => value)
  }

  const setPromotionType = async (
    option,
    selectSelector = PromotionTypeSelectSelector
  ) => {
    return page.selectOption(selectSelector, option)
  }

  const GameTypeSelectSelector = `select[name="gameType"]`
  const isGameTypeSelectVisible = async () => {
    return page.isVisible(GameTypeSelectSelector)
  }

  const getGameTypeOptions = async (
    selectSelector = GameTypeSelectSelector
  ) => {
    let Selector = `${selectSelector} option:not(:first-child)`
    return page.$$eval(Selector, (options) => options.map(({ value }) => value))
  }

  const getGameType = async (selectSelector = GameTypeSelectSelector) => {
    return page.$eval(selectSelector, ({ value }) => value)
  }

  const setGameType = async (
    option,
    selectSelector = GameTypeSelectSelector
  ) => {
    return page.selectOption(selectSelector, option)
  }

  const gotoPromotionPage = async () => {
    await goto({ page, value: "/promotion/promotionlist" })
    await platform.selectFirst({ page })
  }

  const PromotionType = {
    DailyFirstDeposit: "DailyFirstDeposit"
  }
  const selectPromotionType = async (
    option = PromotionType.DailyFirstDeposit
  ) => {
    return page.selectOption(`select[name="promotionType"]`, option)
  }
})
