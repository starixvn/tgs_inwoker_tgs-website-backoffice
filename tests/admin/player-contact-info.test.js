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
import faker from "@faker-js/faker"

const test = base.extend(Fixture)

test("edit and view player contact info", async ({
  page,
  platformCode,
  player
}) => {
  await gotoPlayerListPage(page, platformCode)
  await searchPlayer(page, player)

  let contact = await editPlayerContact(page, player)
  await viewPlayerContact(page, contact, player)
})

const editPlayerContact = async (page, player) => {
  let dialogSelector = await openEditPlayerDialog(page)
  await page.click(`${dialogSelector} button#contact`)

  let contact = {
    phone: faker.phone.phoneNumber(),
    email: faker.internet.email()
  }

  await page.fill(`${dialogSelector} input[name="phone"]`, contact.phone)
  await page.fill(`${dialogSelector} input[name="email"]`, contact.email)

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/player/${player.code}/contact`) &&
        response.status() === 200
      )
    }),
    page.click(
      `${dialogSelector} [aria-labelledby="contact"] button[type="submit"]`
    )
  ])

  return contact
}

const viewPlayerContact = async (page, contact, player) => {
  let [, dialogSelector] = await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/player/${player.code}`) &&
        response.status() === 200
      )
    }),
    openViewPlayerDialog(page, player)
  ])
  await page.click(`${dialogSelector} button#contact`)

  let phoneLocator = page.locator(`${dialogSelector} [data-field="phone"]`)
  let phone = await phoneLocator.textContent()
  expect(phone).to.equals(contact.phone)

  let emailLocator = page.locator(`${dialogSelector} [data-field="email"]`)
  let email = await emailLocator.textContent()
  expect(email).to.equals(contact.email)
}
