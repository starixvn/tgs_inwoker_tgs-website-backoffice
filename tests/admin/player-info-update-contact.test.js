import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import numeral from "numeral"
import {
  gotoPlayerListPage,
  searchPlayer,
  openEditPlayerDialog,
  openViewPlayerDialog
} from "./player-list-page.js"
import { faker } from "@faker-js/faker"

const test = base.extend(Fixture)

test("update player contact", async ({
  page,
  platformCode,
  player,
  backofficeApi
}) => {
  await gotoPlayerListPage(page, platformCode)
  await searchPlayer(page, player)

  let updated = await editPlayerContact(page, player)
  let playerRecord = await backofficeApi.player.getPlayer(player.code)

  expect(playerRecord.phone).to.equals(updated.phone)
  expect(playerRecord.email).to.equals(updated.email)
})

const editPlayerContact = async (page, player) => {
  let dialogSelector = await openEditPlayerDialog(page)
  await page.click(`${dialogSelector} button#contact`)

  let contact = {
    phone: faker.phone.number(),
    email: faker.internet.email()
  }

  await page.fill(`${dialogSelector} input[name="phone"]`, contact.phone)
  await page.fill(`${dialogSelector} input[name="email"]`, contact.email)

  await Promise.all([
    page.waitForResponse((response) => {
      return response.url().includes(`/contact`) && response.status() === 200
    }),
    page.click(
      `${dialogSelector} [aria-labelledby="contact"] button[type="submit"]`
    )
  ])

  return contact
}
