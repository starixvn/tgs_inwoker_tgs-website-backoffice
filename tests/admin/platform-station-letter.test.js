import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { goto } from "../sidebar.js"
import { selectRandomPlatform } from "../page/content.js"
import faker from "faker"

const test = base.extend(Fixture)
const { lorem } = faker

test("add -> approve, add -> reject station letter", async ({
  page,
  adminUser
}) => {
  let brandId = await gotoPlatformStationLetterPage(page)
  let stationLetter = await addStationLetter(page)
  await verifyStationLetter(page, stationLetter, "approve")

  stationLetter = await addStationLetter(page)
  await verifyStationLetter(page, stationLetter, "reject")
})

const toVerifyTab = async (page) => {
  await page.click(`button#InVerify`)

  await Promise.all([page.waitForSelector(`#station-letter tbody`)])
}

const toPublishedTab = async (page) => {
  await page.click(`button#Published`)

  await Promise.all([
    page.waitForLoadState("networkidle"),
    page.waitForSelector(`#station-letter tbody`)
  ])
}

const toRejectedTab = async (page) => {
  await page.click(`button#Rejected`)

  await Promise.all([
    page.waitForLoadState("networkidle"),
    page.waitForSelector(`#station-letter tbody`)
  ])
}

const verifyStationLetter = async (
  page,
  stationLetter,
  type = "approve",
  index = 0
) => {
  await toVerifyTab(page)
  await page.click(`#verify-station-letter-dialog-disclosure`)
  await page.waitForSelector(`#verify-station-letter-dialog`)
  await page.waitForLoadState("networkidle")

  let verifySubject = await page.$eval(
    `#verify-station-letter-dialog input[name="subject"]`,
    ({ value }) => value
  )
  expect(verifySubject).to.equal(stationLetter.subject)

  //TODO: input remark
  //TODO: verify editor content?
  let [frame] = page.mainFrame().childFrames()
  let content = await frame.$eval(`#tinymce`, ({ textContent }) => textContent)

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes("/api/stationletter") &&
        response.status() === 200
      )
    }),
    page.click(`#verify-station-letter-dialog button[data-type="${type}"]`)
  ])

  await page.waitForLoadState("networkidle")

  if (type == "approve") {
    await toPublishedTab(page)
  } else {
    await toRejectedTab(page)
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
  await page.click(".bb-ButtonClose")
}

const addStationLetter = async (page) => {
  await page.click(`#add-station-letter-dialog-disclosure`)

  let letter = {
    subject: lorem.word(),
    content: lorem.sentence()
  }

  await page.fill(
    `#add-station-letter-dialog input[name="subject"]`,
    letter.subject
  )

  let mainFrame = page.mainFrame()
  let [frame] = mainFrame.childFrames()
  await frame.fill(`#tinymce`, letter.content)

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().endsWith("/api/stationletter") &&
        response.status() === 200
      )
    }),
    page.click(`#add-station-letter-dialog button[type="submit"]`)
  ])

  // await page.waitForLoadState("networkidle")
  await page.waitForSelector(`#station-letter tbody`)
  return letter
}

const gotoPlatformStationLetterPage = async (page) => {
  await goto({ page, value: "/platform/stationletter" })
  await selectRandomPlatform(page)
}
