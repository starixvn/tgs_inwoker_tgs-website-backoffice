import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { startOfDay, endOfTomorrow, format } from "date-fns"
import { fillDatePicker } from "../fill.js"
import { selectRandomPlatform } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import faker from "@faker-js/faker"

const test = base.extend(Fixture)
const { lorem } = faker

test("add -> approver -> change status -> update -> reject banner", async ({
  page
}) => {
  await gotoBannerPage(page)

  let brandId = await selectRandomPlatform(page)
  let banner = await addBanner(page, brandId)

  await toInVerifyTab(page)
  await verifyBanner(page, brandId, banner, "approve")

  await toggleStatus(page, brandId)
  // await toggleStatus(page, brandId)

  await changeOrder(page, brandId)

  await editValidBanner(page, brandId, banner)
  await toEffectiveTab(page)
  await deleteBanner(page)

  banner = await addBanner(page, brandId)
  await verifyBanner(page, brandId, banner, "reject")
  await toRejectedTab(page)
  await deleteBanner(page)
})

const deleteBanner = async (page) => {
  let Dialog = `#delete-banner-dialog`
  await openDialog(page, Dialog)

  let id = await page.inputValue(`${Dialog} input[name="id"]`)
  let ExpectedOrder = `/api/banner/archive/${id}`

  await Promise.all([
    page.waitForResponse((response) => {
      return response.url().endsWith(ExpectedOrder) && response.status() === 200
    }),
    page.click(`${Dialog} button[type="submit"]`)
  ])
}

const editValidBanner = async (page, brandId, banner) => {
  await toEffectiveTab(page)

  const EditBannerDialogSelector = "#edit-banner-dialog"
  await openDialog(page, EditBannerDialogSelector)

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
      return url.includes(`/api/banner/${brandId}`) && response.status() === 200
    }),
    page.click(`${EditBannerDialogSelector} button[type="submit"]`)
  ])
  return NewBanner
}

const changeOrder = async (page, brandId, index = 0) => {
  await toEffectiveTab(page)

  let displayOrder = await page.$eval(
    `[data-row-index="${index}"] [data-column-id="displayOrder"] input[type="number"]`,
    ({ value }) => parseInt(value)
  )

  expect(displayOrder).to.be.above(0)

  let ExpectedOrder = displayOrder + 1
  await page.fill(
    `[data-row-index="${index}"] [data-column-id="displayOrder"] input[type="number"]`,
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

const toggleStatus = async (page, brandId, index = 0) => {
  await toEffectiveTab(page)

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
  await toEffectiveTab(page)

  let toggledStatus = await page.$eval(
    `[data-row-index="${index}"] [data-column-id="status"] button`,
    ({ dataset }) => dataset.status
  )
  expect(toggledStatus).to.equal(ExpectedStatus)
}

const verifyBanner = async (page, brandId, banner, type = "approve") => {
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

const addBanner = async (page, brandId = "") => {
  const AddBannerDialogSelector = "#add-banner-dialog"
  await page.click(`${AddBannerDialogSelector}-disclosure`)

  let from = startOfDay(new Date())
  let to = endOfTomorrow(new Date())

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

  await toInVerifyTab(page)

  return Banner
}

const toInVerifyTab = async (page) => {
  await page.click(`button#reviewing`)

  //TODO: wait for get api and table selector
  await Promise.all([
    page.waitForLoadState("networkidle"),
    page.waitForSelector(`#banner tbody`)
  ])
}

const toEffectiveTab = async (page) => {
  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/banner/valid/`) &&
        response.status() === 200
      )
    }),
    page.click(`button#valid`)
  ])
  await page.waitForSelector(`#banner tbody`)
}

const toRejectedTab = async (page) => {
  await page.click(`button#rejected`)

  await Promise.all([
    page.waitForLoadState("networkidle"),
    page.waitForSelector(`#banner tbody`)
  ])
}

const gotoBannerPage = async (page) => {
  await page.goto("/platform/banner", { waitUntil: "networkidle" })
}
