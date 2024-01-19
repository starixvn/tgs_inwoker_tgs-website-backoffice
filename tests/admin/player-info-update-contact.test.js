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
import { urlIncludes } from "../page/response.js"

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

  //TODO: change to
  expect(playerRecord.phone).to.equals(updated.phone)
  expect(playerRecord.email).to.equals(updated.email)
})

//TODO: change other fields
const editPlayerContact = async (page, player) => {
  let dialogSelector = await openEditPlayerDialog(page)
  await page.click(`${dialogSelector} button#contact`)

  let contact = {
    phone: faker.phone.number(),
    email: faker.internet.email()
  }

  await page.fill(
    `${dialogSelector} input[name="properties.Phone"]`,
    contact.phone
  )
  await page.fill(
    `${dialogSelector} input[name="properties.Email"]`,
    contact.email
  )

  await Promise.all([
    page.waitForResponse(urlIncludes(`/contact`)),
    page.click(
      `${dialogSelector} [aria-labelledby="contact"] button[type="submit"]`
    )
  ])

  return contact
}
