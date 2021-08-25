import { chromium } from "playwright"
import { expect } from "chai"
import { StorageState } from "../auth"
import { host, headless } from "../env"
import { random } from "lodash"
import numeral from "numeral"
import { startOfDay, endOfTomorrow, format } from "date-fns"
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

    await gotoBannerPage()
  })

  afterEach(async () => {
    await page.close()
  })

  after(async () => {
    await browser.close()
  })

  it("should able to add -> approver -> change status -> update -> reject banner", async () => {
    let brandId = await platform.selectFirst({ page })
    let banner = await addBanner(brandId)

    await toInVerifyTab()
    let approve = "approve"
    await verifyBanner(brandId, banner, approve)

    await toggleStatus(brandId)
    await toggleStatus(brandId)

    await changeOrder(brandId)

    let updatedBanner = await editValidBanner(brandId, banner)
    //TODO:
    // reject banner
  })

  const editValidBanner = async (brandId, banner, index = 0) => {
    await toEffectiveTab()

    const EditBannerDialogSelector = "#edit-banner-dialog"
    await page.click(
      `[data-row-index="${index}"] ${EditBannerDialogSelector}-disclosure`
    )

    const NewBanner = {
      ...banner,
      title: lorem.word()
    }

    await page.fill(
      `${EditBannerDialogSelector} input[name="title"]`,
      NewBanner.title
    )

    await Promise.all([
      page.waitForResponse((response) => {
        let url = response.url()
        return (
          url.includes(`/api/banner/${brandId}`) && response.status() === 200
        )
      }),
      page.click(`${EditBannerDialogSelector} button[type="submit"]`)
    ])
    return NewBanner
  }

  const changeOrder = async (brandId, index = 0) => {
    await toEffectiveTab()

    let displayOrder = await page.$eval(
      `[data-row-id="${index}"] [data-column-id="displayOrder"] input[type="number"]`,
      ({ value }) => parseInt(value)
    )

    expect(displayOrder).to.be.above(0)

    let ExpectedOrder = displayOrder + 1
    await page.fill(
      `[data-row-id="${index}"] [data-column-id="displayOrder"] input[type="number"]`,
      `${ExpectedOrder}`
    )

    await Promise.all([
      page.waitForResponse((response) => {
        let url = response.url()
        return (
          url.includes(`/api/banner/${brandId}`) &&
          url.endsWith(`/${ExpectedOrder}`) &&
          response.status() === 200
        )
      }),
      page.keyboard.press("Enter")
    ])
  }

  const toggleStatus = async (brandId, index = 0) => {
    await toEffectiveTab()

    let Status = ["enable", "disable"]
    let status = await page.$eval(
      `[data-row-index="${index}"] [data-column-id="status"] button`,
      ({ dataset }) => dataset.status
    )

    expect(status).to.be.oneOf(Status)

    Status = Status.filter((value) => value != status)
    let [ExpectedStatus] = Status

    await Promise.all([
      page.waitForResponse((response) => {
        return (
          response.url().includes(`/${ExpectedStatus}/${brandId}`) &&
          response.status() === 200
        )
      }),
      page.click(`[data-row-index="${index}"] [data-column-id="status"] button`)
    ])

    await page.reload({ waitUntil: "networkidle" })
    await toEffectiveTab()

    let toggledStatus = await page.$eval(
      `[data-row-index="${index}"] [data-column-id="status"] button`,
      ({ dataset }) => dataset.status
    )
    expect(toggledStatus).to.equal(ExpectedStatus)
  }

  const verifyBanner = async (brandId, banner, type = "approve") => {
    const VerifyBannerDialogSelector = "#verify-banner-dialog"
    await page.click(`${VerifyBannerDialogSelector}-disclosure`)
    await page.waitForSelector(`${VerifyBannerDialogSelector}`)
    await page.waitForLoadState("networkidle")

    let title = await page.$eval(
      `${VerifyBannerDialogSelector} input[name="title"]`,
      ({ value }) => value
    )
    expect(title).to.equal(banner.title)

    let start = await page.$eval(
      `${VerifyBannerDialogSelector} #from-date-box input[type="text"]`,
      ({ value }) => value
    )
    expect(start).to.have.string(banner.beginTime)

    let end = await page.$eval(
      `${VerifyBannerDialogSelector}  #to-date-box input[type="text"]`,
      ({ value }) => value
    )
    expect(end).to.have.string(banner.endTime)

    await Promise.all([
      page.waitForResponse((response) => {
        return (
          response.url().includes(`/api/banner/${brandId}`) &&
          response.status() === 200
        )
      }),
      page.click(`${VerifyBannerDialogSelector} button[data-type="${type}"]`)
    ])

    await page.waitForLoadState("networkidle")
  }

  const addBanner = async (brandId = "") => {
    const AddBannerDialogSelector = "#add-banner-dialog"
    await page.click(`${AddBannerDialogSelector}-disclosure`)

    let from = startOfDay(new Date())
    let to = endOfTomorrow(new Date())

    //TODO: how to do file upload?
    let Banner = {
      title: lorem.word(),
      beginTime: format(from, "yyyy/MM/dd"),
      endTime: format(to, "yyyy/MM/dd")
    }

    await page.fill(
      `${AddBannerDialogSelector} input[name="title"]`,
      Banner.title
    )

    await fillDatePicker({
      page,
      selector: `${AddBannerDialogSelector} #from-date-box input[type="text"]`,
      value: Banner.beginTime
    })
    await fillDatePicker({
      page,
      selector: `${AddBannerDialogSelector} #to-date-box input[type="text"]`,
      value: Banner.endTime
    })

    await Promise.all([
      page.waitForResponse((response) => {
        return (
          response.url().endsWith(`/api/banner/${brandId}`) &&
          response.status() === 200
        )
      }),
      page.click(`${AddBannerDialogSelector} button[type="submit"]`)
    ])

    await toInVerifyTab()

    let FirstRowIndex = 0
    let title = await page.$eval(
      `[data-row-index="${FirstRowIndex}"] [data-column-id="title"]`,
      ({ textContent }) => textContent
    )
    expect(title).to.equal(Banner.title)

    return Banner
  }

  const toInVerifyTab = async () => {
    await page.click(`button#reviewing`)

    await Promise.all([
      page.waitForLoadState("networkidle"),
      page.waitForSelector(`#banner tbody`)
    ])
  }

  const toEffectiveTab = async () => {
    await page.click(`button#valid`)

    await Promise.all([
      page.waitForLoadState("networkidle"),
      page.waitForSelector(`#banner tbody`)
    ])
  }

  const toRejectedTab = async () => {
    await page.click(`button#rejected`)

    await Promise.all([
      page.waitForLoadState("networkidle"),
      page.waitForSelector(`#banner tbody`)
    ])
  }

  const gotoBannerPage = async () => {
    await goto({ page, value: "/platform/banner" })
  }
})
