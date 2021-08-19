import { chromium } from "playwright"
import { expect } from "chai"
import { StorageState } from "../auth"
import { host, headless } from "../env"
import { random } from "lodash"
import numeral from "numeral"
import { startOfDay, endOfTomorrow, format } from "date-fns"
import { lorem } from "faker"
import clone from "clone-deep"

let browser
let context
let page

//FIXME: how to input text to html editor
describe.skip("Admin user", async () => {
  before(async () => {
    browser = await chromium.launch({ headless: headless() })
    context = await browser.newContext({ storageState: StorageState.Admin })
  })

  beforeEach(async () => {
    page = await context.newPage()

    await page.goto(host(), {
      waitUntil: "networkidle0"
    })

    await gotoPlatformStationLetterPage()
  })

  afterEach(async () => {
    await page.close()
  })

  after(async () => {
    await browser.close()
  })

  it("should able to add -> approve, add -> reject station letter", async () => {
    let stationLetter = await addStationLetter()
    await verifyStationLetter(stationLetter, "approve")

    stationLetter = await addStationLetter()
    await verifyStationLetter(stationLetter, "reject")
  })

  const toPublishedTab = async () => {
    await page.click(`button#Published`)

    await Promise.all([
      page.waitForLoadState("networkidle"),
      page.waitForSelector(`#station-letter tbody`)
    ])
  }

  const toRejectedTab = async () => {
    await page.click(`button#Rejected`)

    await Promise.all([
      page.waitForLoadState("networkidle"),
      page.waitForSelector(`##station-letter tbody`)
    ])
  }

  const verifyStationLetter = async (
    stationLetter,
    type = "approve",
    index = 0
  ) => {
    await page.click(`#verify-station-letter-dialog-disclosure`)
    await page.waitForSelector(`#verify-station-letter-dialog`)
    await page.waitForLoadState("networkidle")

    let verifySubject = await page.$eval(
      `#verify-announcement-dialog input[name="subject"]`,
      ({ value }) => value
    )
    expect(verifySubject).to.equal(stationLetter.subject)

    //TODO: verify editor content

    await Promise.all([
      page.waitForResponse((response) => {
        return (
          response.url().includes("/api/announcement") &&
          response.status() === 200
        )
      }),
      page.click(`#verify-station-letter-dialog button[data-type="${type}"]`)
    ])

    await page.waitForLoadState("networkidle")

    if (type == "approve") {
      await toPublishedTab()
    } else {
      await toRejectedTab()
    }

    await page.click(`#view-station-letter-dialog-disclosure`)
    await page.waitForSelector(
      `#view-station-letter-dialog input[name="subject"]`
    )
    let subject = await page.$eval(
      `#view-station-letter-dialog input[name="subject"]`,
      ({ value }) => value
    )
    expect(subject).to.equal(stationLetter.subject)
  }

  const addStationLetter = async () => {
    await page.click(`#add-station-letter-dialog-disclosure`)

    let letter = {
      subject: lorem.word(),
      content: lorem.sentence()
    }

    await page.fill(
      `#add-station-letter-dialog input[name="subject"]`,
      letter.subject
    )

    //TODO: how to input content
    await page.fill(`textarea[name="content"]`, letter.content, { force: true })

    await Promise.all([
      page.waitForResponse((response) => {
        return (
          response.url().endsWith("/api/stationletter") &&
          response.status() === 200
        )
      }),
      page.click(`#add-station-letter-dialog button[type="submit"]`)
    ])

    await page.waitForLoadState("networkidle")
    await page.waitForSelector(`#station-letter tbody`)
    return letter
  }

  const gotoPlatformStationLetterPage = async () => {
    let Menu = `#sidebar a[href="/platform/stationletter"]`
    await Promise.all([
      page.waitForNavigation(),
      page.click(Menu),
      page.waitForLoadState("networkidle")
    ])
    await selectPlatform()
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
})
