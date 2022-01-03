import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { goto } from "../sidebar.js"
import { selectRandomPlatform } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import faker from "faker"

const test = base.extend(Fixture)
const { lorem } = faker

test("add -> approve, add -> reject station letter", async ({ page }) => {
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
}

const toRejectedTab = async (page) => {
  await page.click(`button#Rejected`)
}

const verifyStationLetter = async (
  page,
  stationLetter,
  type = "approve",
  index = 0
) => {
  await toVerifyTab(page)
  let DialogSelector = `#verify-station-letter-dialog`
  await openDialog(page, DialogSelector)

  let verifySubject = await page.inputValue(
    `${DialogSelector} input[name="subject"]`
  )
  expect(verifySubject).to.equal(stationLetter.subject)

  //TODO: input remark
  let EditorFrameSelector = `${DialogSelector} .tox-edit-area iframe`
  await page.waitForSelector(EditorFrameSelector)
  let contentEditor = page.frameLocator(EditorFrameSelector).locator("#tinymce")
  //TODO: verify editor content?
  let content = await contentEditor.textContent()

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes("/api/stationletter") &&
        response.status() === 200
      )
    }),
    page.click(`${DialogSelector} button[data-type="${type}"]`)
  ])

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
  let DialogSelector = "#add-station-letter-dialog"
  await openDialog(page, DialogSelector)

  let letter = {
    subject: lorem.word(),
    content: lorem.sentence()
  }

  await page.fill(
    `#add-station-letter-dialog input[name="subject"]`,
    letter.subject
  )

  let EditorFrameSelector = `${DialogSelector} .tox-edit-area iframe`
  await page.waitForSelector(EditorFrameSelector)

  let contentEditor = page.frameLocator(EditorFrameSelector).locator("#tinymce")
  await contentEditor.fill(letter.content)

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
