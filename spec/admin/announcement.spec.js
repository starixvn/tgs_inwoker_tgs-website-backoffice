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

describe.skip("Admin user", () => {
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
    //4. click valid tab
    //5. change record status
    //6. edit record
    //7. back to verify tab
    //8. open record and reject it
    //9. record go to reject tab
    let announcement = await addAnnouncement()

    let approve = "approve"
    await verifyAnnouncement(announcement, approve)
  })

  const editAnnouncement = async (index = 0) => {
    await page.click(`button#Effective`)

    await Promise.all([
      page.waitForLoadState("networkidle"),
      page.waitForLoadState("domcontentloaded"),
      page.waitForSelector(`#announcement tbody`)
    ])

    //TODO: open edit dialog
    // await page.click(``)
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

    //TODO: how to get correct index table?
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
