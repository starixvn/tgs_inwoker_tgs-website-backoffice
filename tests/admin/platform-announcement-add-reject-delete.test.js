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

test("add -> reject -> reject announcement", async ({ page }) => {
  let brandId = await gotoPlatformAnnouncementPage(page)
  let announcement = await addAnnouncement(page)
  await toInVerifyTab(page)
  await verifyAnnouncement(page, announcement, "reject")
  await toRejectedTab(page, brandId)
  await deleteAnnouncement(page)
})

const deleteAnnouncement = async (page) => {
  let Dialog = `#delete-announcement-dialog`
  await page.click(`${Dialog}-disclosure`)
  await page.waitForSelector(Dialog)

  let id = await page.inputValue(`${Dialog} input[name="id"]`)
  let ExpectedOrder = `/api/announcement/${id}/status/archived`

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

const toInVerifyTab = async (page) => {
  await page.click(`button#InVerify`)

  await Promise.all([
    page.waitForLoadState("networkidle"),
    page.waitForSelector(`#announcement tbody`)
  ])
}

const toRejectedTab = async (page) => {
  await page.click(`button#Rejected`)

  await Promise.all([
    page.waitForLoadState("networkidle"),
    page.waitForSelector(`#announcement tbody`)
  ])
}

const toEffectiveTab = async (page, brandId) => {
  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`brandId=${brandId}`) &&
        response.status() === 200
      )
    }),
    page.click(`button#Effective`)
  ])
  await page.waitForSelector(`#announcement tbody`)

  //TODO: is it possible to wait after ui updated?
  /*
  let HalfSecond = 500
  await page.waitForTimeout(HalfSecond)
  */
}

const changeEffectiveAnnouncementDisplayOrder = async (
  page,
  brandId,
  index = 0
) => {
  await toEffectiveTab(page, brandId)

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
      return (
        response.url().endsWith("/api/announcement/changeorders") &&
        response.status() === 200
      )
    }),
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/announcement?`) &&
        response.status() === 200
      )
    }),
    page.click(`#change-announcement-display-order-button`)
  ])

  await toEffectiveTab(page, brandId)

  await page.fill(
    `[data-row-index="${index}"] [data-column-id="displayOrder"] input[type="number"]`,
    `${ExpectedOrder}`
  )

  let order = await page.$eval(
    `[data-row-index="${index}"] [data-column-id="displayOrder"] input[type="number"]`,
    ({ value }) => parseInt(value)
  )
  expect(order).to.equal(ExpectedOrder)
}

const toggleChangeEffectiveAnnouncementStatus = async (
  page,
  brandId,
  announcement
) => {
  await toEffectiveTab(page, brandId)

  let Status = ["Effective", "Invalid"]
  let status = await page.$eval(
    `[data-row-id="${announcement.id}"] [data-column-id="status"] button`,
    ({ dataset }) => dataset.status
  )
  expect(status).to.be.oneOf(Status)

  Status = Status.filter((value) => value != status)
  let [ExpectedStatus] = Status

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().endsWith(`/status/${ExpectedStatus}`) &&
        response.status() === 200
      )
    }),
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/announcement?`) &&
        response.status() === 200
      )
    }),
    page.click(
      `[data-row-id="${announcement.id}"] [data-column-id="status"] button`
    )
  ])

  await toEffectiveTab(page, brandId)

  let StatusSelector = `#announcement [data-row-id="${announcement.id}"] [data-column-id="status"] button`
  await page.waitForSelector(StatusSelector)
  let toggledStatus = await page.$eval(
    StatusSelector,
    ({ dataset }) => dataset.status
  )
  expect(toggledStatus).to.equal(ExpectedStatus)
}

const editEffectiveAnnouncement = async (
  page,
  brandId,
  announcement,
  index = 0
) => {
  await toEffectiveTab(page, brandId)

  await page.click(
    `[data-row-index="${index}"] #edit-announcement-dialog-disclosure`
  )

  const NewAnnouncement = {
    ...announcement,
    subject: lorem.word(),
    content: lorem.sentence()
  }

  await page.fill(
    `#edit-announcement-dialog input[name="subject"]`,
    NewAnnouncement.subject
  )

  await page.fill(
    `#edit-announcement-dialog textarea[name="content"]`,
    NewAnnouncement.content
  )

  await page.click(`#edit-announcement-dialog button[type="submit"]`)
  await page.waitForLoadState("networkidle")
  return NewAnnouncement
}

const rejectAnnouncement = async (page, announcement) => {
  await toInVerifyTab(page)
  await verifyAnnouncement(page, announcement, "reject")

  await toRejectedTab(page)

  let SubjectSelector = `[data-column-id="subject"]`
  await page.waitForSelector(SubjectSelector)
  let subject = await page.textContent(SubjectSelector)
  expect(subject).to.equal(announcement.subject)
}

const verifyAnnouncement = async (page, announcement, type = "approve") => {
  let VerifyDialogSelector = `#verify-announcement-dialog`
  await openDialog(page, VerifyDialogSelector)

  let verifySubject = await page.$eval(
    `${VerifyDialogSelector} input[name="subject"]`,
    ({ value }) => value
  )
  expect(verifySubject).to.equal(announcement.subject)

  let verifyStart = await page.$eval(
    `${VerifyDialogSelector} #from-date-box input[type="text"]`,
    ({ value }) => value
  )
  expect(verifyStart).to.have.string(announcement.from)

  let verifyEnd = await page.$eval(
    `${VerifyDialogSelector} #to-date-box input[type="text"]`,
    ({ value }) => value
  )
  expect(verifyEnd).to.have.string(announcement.to)

  let verifyContent = await page.$eval(
    `${VerifyDialogSelector} textarea[name="content"]`,
    ({ value }) => value
  )
  expect(verifyContent).to.equal(announcement.content)

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes("/api/announcement") &&
        response.status() === 200
      )
    }),
    page.click(`${VerifyDialogSelector} button[data-type="${type}"]`)
  ])

  await page.waitForLoadState("networkidle")
}

const addAnnouncement = async (page) => {
  let AddDialogSelector = `#add-announcement-dialog`
  await openDialog(page, AddDialogSelector)

  let from = startOfDay(new Date())
  let to = endOfTomorrow(new Date())
  const Announcement = {
    subject: lorem.word(),
    from: format(from, "yyyy/MM/dd"),
    to: format(to, "yyyy/MM/dd"),
    content: lorem.sentence()
  }

  await page.fill(
    `${AddDialogSelector} input[name="subject"]`,
    Announcement.subject
  )

  await fillDatePicker({
    page,
    selector: `${AddDialogSelector} #from-date-box input[type="text"]`,
    value: Announcement.from
  })
  await fillDatePicker({
    page,
    selector: `${AddDialogSelector} #to-date-box input[type="text"]`,
    value: Announcement.to
  })

  await page.fill(
    `${AddDialogSelector} textarea[name="content"]`,
    Announcement.content
  )

  //TODO: is't possible to get announcement id from response?
  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().endsWith("/api/announcement") &&
        response.status() === 200
      )
    }),
    page.click(`${AddDialogSelector} button[type="submit"]`)
  ])

  await toInVerifyTab(page)

  let FirstRowIndex = 0
  let SubjectSelector = `[data-row-index="${FirstRowIndex}"] [data-column-id="subject"]`
  await page.waitForSelector(SubjectSelector)

  let subject = await page.$eval(
    SubjectSelector,
    ({ textContent }) => textContent
  )
  expect(subject).to.equal(Announcement.subject)

  let IdSelector = `[data-row-index="${FirstRowIndex}"]`
  let idLocator = page.locator(IdSelector)
  let id = await idLocator.getAttribute("data-row-id")
  Announcement.id = id
  return Announcement
}

const gotoPlatformAnnouncementPage = async (page) => {
  await page.goto("/platform/announcement", { waitUntil: "networkidle" })
  return await selectRandomPlatform(page)
}
