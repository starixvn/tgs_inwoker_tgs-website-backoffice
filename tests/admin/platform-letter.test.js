import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { random } from "lodash-es"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import { fillLabel } from "../page/multi-select.js"
import faker from "@faker-js/faker"

const test = base.extend(Fixture)

test("view & reply inbox letter", async ({
  page,
  platform,
  player,
  operatorApi,
  platformToken
}) => {
  let letter = {
    subject: faker.lorem.word(),
    content: faker.lorem.words()
  }
  await Promise.all([
    operatorApi.player.sendLetter(platformToken, player.token, letter),
    page.goto("/platform/letter", {
      waitUntil: "networkidle"
    })
  ])

  await viewLetter({ page, platform, player, letter })

  await replyLetter({ page, platform, player, letter })
})

const viewLetter = async ({ page, platform, player, letter }) => {
  await selectPlatformByCode(page, platform.code)
  await fillLabel(page, "#player-select", player.username)

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/station-letter/${platform.id}`) &&
        response.status() === 200
      )
    }),
    page.click(`button[type="submit"]`)
  ])

  let sender = await page
    .locator(`table td[data-column-id="sender"]`)
    .textContent()
  expect(sender).equals(player.username)

  let ViewDialogSelector = "#view-letter-dialog"
  await openDialog(page, ViewDialogSelector)

  let subject = await page
    .locator(`${ViewDialogSelector} [data-type="subject"]`)
    .inputValue()
  expect(subject).equals(letter.subject)

  let content = await page
    .locator(`${ViewDialogSelector} [data-type="content"]`)
    .inputValue()
  expect(content).equals(letter.content)
  await page.click(".bb-ButtonClose")
}

const replyLetter = async ({ page, platform, player, letter }) => {
  let ReplyLetterDialogSelector = `#reply-letter-dialog`
  await openDialog(page, ReplyLetterDialogSelector)

  let content = faker.lorem.words()
  await page.fill(
    `${ReplyLetterDialogSelector} textarea[name="content"]`,
    content
  )

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/station-letter/${platform.id}`) &&
        response.status() === 200
      )
    }),
    page.click(`${ReplyLetterDialogSelector} button[type="submit"]`)
  ])
}
