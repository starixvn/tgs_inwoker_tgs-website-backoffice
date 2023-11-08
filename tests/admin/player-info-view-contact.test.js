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

test("view player contact", async ({
  page,
  platformCode,
  player,
  backofficeApi
}) => {
  await gotoPlayerListPage(page, platformCode)
  await searchPlayer(page, player)

  let contact = {
    phone: faker.phone.number(),
    email: faker.internet.email()
  }
  await backofficeApi.player.updateContact(player.code, contact)
  await viewPlayerContact(page, contact, player)
})

const viewPlayerContact = async (page, contact, player) => {
  let dialogSelector = await openViewPlayerDialog(page, player)
  await page.click(`${dialogSelector} button#contact`)

  let phoneLocator = page.locator(`${dialogSelector} [data-field="phone"]`)
  let phone = await phoneLocator.textContent()
  expect(phone).to.equals(contact.phone)

  let emailLocator = page.locator(`${dialogSelector} [data-field="email"]`)
  let email = await emailLocator.textContent()
  expect(email).to.equals(contact.email)
}
