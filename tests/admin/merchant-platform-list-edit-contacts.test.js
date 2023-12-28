import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { faker } from "@faker-js/faker"
import { openDialog } from "../page/dialog.js"

const test = base.extend(Fixture)

test("change platform contacts", async ({ page, platform, backofficeApi }) => {
  await gotoPlatformListPage(page)

  await page.locator(`input[name="keyword"]`).fill(platform.code)

  // /api/brand?keyword=GPI&page=1&rows=20&sortby=code
  await Promise.all([
    page.waitForResponse((response) => {
      let Path = `/api/brand?keyword=${platform.code}`
      let url = response.url()
      let isApi = url.includes(Path)
      if (isApi && !response.ok()) {
        throw Error(`api [${Path}] failed`)
      }

      return isApi
    }),
    ,
    page.locator(`button[type="submit"]`).click()
  ])

  let DialogSelector = "#contacts-dialog"
  await openDialog(page, DialogSelector)

  let contacts = Array.from({ length: 2 }, (_, index) => {
    return {
      name: faker.person.firstName(),
      email: faker.internet.email(),
      remark: faker.lorem.word()
    }
  })

  //TODO: in fn way?
  let index = 0
  while (index < contacts.length) {
    let contact = contacts[index]
    await page
      .locator(`${DialogSelector} input[name="contacts.${index}.name"]`)
      .fill(contact.name)

    await page
      .locator(`${DialogSelector} input[name="contacts.${index}.email"]`)
      .fill(contact.email)

    await page
      .locator(`${DialogSelector} input[name="contacts.${index}.remark"]`)
      .fill(contact.remark)

    index++
  }

  await Promise.all([
    page.waitForResponse((response) => {
      let Path = `/api/notecontbrand/${platform.id}/email`
      let url = response.url()
      let isApi = url.includes(Path)
      if (isApi && !response.ok()) {
        throw Error(`api [${Path}] failed`)
      }

      return isApi
    }),
    page.locator(`${DialogSelector} button[type="submit"]`).click()
  ])

  let platformContacts = await backofficeApi.platform.contacts.list(platform.id)
  expect(platformContacts).deep.equals(contacts)
})

const gotoPlatformListPage = async (page) => {
  await page.goto("/merchant/brands", { waitUntil: "networkidle" })
}
