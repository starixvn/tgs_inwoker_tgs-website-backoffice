import { chromium } from "playwright"
import { expect } from "chai"
import { StorageState } from "../auth"
import { host, headless } from "../env"
import { random } from "lodash"
import numeral from "numeral"
import { startOfDay, endOfTomorrow, format } from "date-fns"
import { lorem } from "faker"

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

    await gotoPlatformAnnouncementPage()
  })

  afterEach(async () => {
    await page.close()
  })

  after(async () => {
    await browser.close()
  })

  it("should able to add -> approve -> change status -> update -> reject announcement", async () => {
    //TODO
    // change announcement display order
    // reject announcement
    // reject tab
    let announcement = await addAnnouncement()

    let approve = "approve"
    await verifyAnnouncement(announcement, approve)

    await changeEffectiveAnnouncementStatus()

    await editEffectiveAnnouncement()
  })

  const toEffectiveTab = async (index = 0) => {
    await page.click(`button#Effective`)

    await Promise.all([
      page.waitForLoadState("networkidle"),
      page.waitForLoadState("domcontentloaded"),
      page.waitForSelector(`#announcement tbody`)
    ])
  }

  const changeEffectiveAnnouncementStatus = async (index = 0) => {
    await toEffectiveTab()

    let Status = ["Effective", "Invalid"]
    let status = await page.$eval(
      `[data-row-index="${index}"] [data-column-id="status"] button`,
      ({ dataset }) => dataset.status
    )

    expect(status).to.be.oneOf(Status)

    Status = Status.filter((value) => value != status)
    let [ExpectedStatus] = Status
    await page.click(
      `[data-row-index="${index}"] [data-column-id="status"] button`
    )

    await page.waitForLoadState("networkidle")
    await page.waitForLoadState("domcontentloaded")

    let toggledStatus = await page.$eval(
      `[data-row-index="${index}"] [data-column-id="status"] button`,
      ({ dataset }) => dataset.status
    )
    expect(toggledStatus).to.equal(ExpectedStatus)
  }

  const editEffectiveAnnouncement = async (index = 0) => {
    await toEffectiveTab()

    await page.click(
      `[data-row-index="${index}]" #edit-announcement-dialog-disclosure`
    )

    const NewAnnouncement = {
      subject: lorem.word(),
      content: lorem.sentence()
    }

    await page.fill(
      `#add-announcement-dialog textarea[name="content"]`,
      NewAnnouncement.content
    )

    await Promise.all([
      page.waitForResponse((response) => {
        return (
          response.url().endsWith("/api/announcement") &&
          response.status() === 200
        )
      }),
      page.click(`#add-announcement-dialog button[type="submit"]`)
    ])
  }

  const verifyAnnouncement = async (announcement, type = "approve") => {
    await page.click(`#verify-announcement-dialog-disclosure`)
    await page.waitForSelector(`#verify-announcement-dialog`)
    await page.waitForLoadState("networkidle")
    await page.waitForLoadState("domcontentloaded")

    let verifySubject = await page.$eval(
      `#verify-announcement-dialog input[name="subject"]`,
      ({ value }) => value
    )
    expect(verifySubject).to.equal(announcement.subject)

    let verifyStart = await page.$eval(
      `#verify-announcement-dialog #from-date-box input[type="text"]`,
      ({ value }) => value
    )
    expect(verifyStart).to.have.string(announcement.from)

    let verifyEnd = await page.$eval(
      `#verify-announcement-dialog #to-date-box input[type="text"]`,
      ({ value }) => value
    )
    expect(verifyEnd).to.have.string(announcement.to)

    let verifyContent = await page.$eval(
      `#verify-announcement-dialog textarea[name="content"]`,
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
      page.click(`#verify-announcement-dialog button[data-type="${type}"]`)
    ])

    await page.waitForLoadState("networkidle")
  }

  const addAnnouncement = async () => {
    await page.click(`#add-announcement-dialog-disclosure`)

    let from = startOfDay(new Date())
    let to = endOfTomorrow(new Date())
    const Announcement = {
      subject: lorem.word(),
      from: format(from, "yyyy/MM/dd"),
      to: format(to, "yyyy/MM/dd"),
      content: lorem.sentence()
    }

    await page.fill(
      `#add-announcement-dialog input[name="subject"]`,
      Announcement.subject
    )

    await fill(
      `#add-announcement-dialog #from-date-box input[type="text"]`,
      Announcement.from
    )
    await fill(
      `#add-announcement-dialog #to-date-box input[type="text"]`,
      Announcement.to
    )

    await page.fill(
      `#add-announcement-dialog textarea[name="content"]`,
      Announcement.content
    )

    await Promise.all([
      page.waitForResponse((response) => {
        return (
          response.url().endsWith("/api/announcement") &&
          response.status() === 200
        )
      }),
      page.click(`#add-announcement-dialog button[type="submit"]`)
    ])

    await page.waitForLoadState("networkidle")
    await page.waitForLoadState("domcontentloaded")

    await page.click(`buttonb#InVerify`)
    await page.waitForSelector("#announcement tbody")

    let FirstRowIndex = 0
    let subject = await page.$eval(
      `[data-row-index="${FirstRowIndex}"] [data-column-id="subject"]`,
      ({ textContent }) => textContent
    )
    expect(subject).to.equal(Announcement.subject)

    return Announcement
  }

  const selectPlatform = async () => {
    await page.waitForSelector(
      `#page-merchant-bar select[name="brandId"] option[value*="-"]:not(:first-child)`,
      {
        state: "attached"
      }
    )
    let option = await page.$eval(
      `#page-merchant-bar select[name="brandId"] option[value*="-"]:not(:first-child)`,
      (element) => element.value
    )
    await Promise.all([
      page.selectOption(`#page-merchant-bar select[name="brandId"]`, option)
    ])
  }

  const fill = async (selector, value) => {
    await page.click(selector)
    await page.fill(selector, value)
    await page.keyboard.press("Enter")
  }

  const gotoPlatformAnnouncementPage = async () => {
    let PlatformCreditSelector = `#sidebar a[href="/platform/announcement"]`
    await Promise.all([
      page.waitForNavigation(),
      page.click(PlatformCreditSelector),
      page.waitForLoadState("networkidle")
    ])
    await selectPlatform()
  }
})
