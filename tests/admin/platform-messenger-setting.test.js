import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { goto } from "../sidebar.js"
import { selectRandomOption } from "../page/select.js"
import { selectRandomPlatform } from "../page/content.js"
import faker from "faker"

const test = base.extend(Fixture)
const { lorem, phone, datatype } = faker

test("add, edit and remove messenger", async ({ page, adminUser }) => {
  await gotoPlatformCustomerServicePage(page)

  await page.click("#instant-messaging-dialog-disclosure")

  await addInstantMessaging(page)
  await editInstantMessaging(page)
  await deleteInstantMessaging(page)
})

const addInstantMessaging = async (page) => {
  let AddDialogSelector = `#add-instant-messaging-dialog`
  await page.click(`${AddDialogSelector}-disclosure`)
  await page.waitForSelector(AddDialogSelector)

  let type = await selectRandomOption(
    page,
    `${AddDialogSelector} ${InstantMessagingSelectSelector}`
  )

  let instantMessaging = {
    type,
    phone: phone.phoneNumber(),
    appId: datatype.uuid()
  }

  await page.fill(
    `${AddDialogSelector} input[name="phone"]`,
    instantMessaging.phone
  )
  await page.fill(
    `${AddDialogSelector} input[name="appId"]`,
    instantMessaging.appId
  )

  await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().endsWith(`/api/BrandCommunication`) &&
        response.status() === 200
      )
    }),
    page.click(`${AddDialogSelector} button[type="submit"]`)
  ])
}

const editInstantMessaging = async (page) => {
  let EditDialogSelector = `#edit-instant-messaging-dialog`
  await page.click(`${EditDialogSelector}-disclosure`)
  await page.waitForSelector(EditDialogSelector)

  let type = await selectRandomOption(
    page,
    `${EditDialogSelector} ${InstantMessagingSelectSelector}`
  )

  let instantMessaging = {
    type,
    phone: phone.phoneNumber(),
    appId: datatype.uuid()
  }

  await page.fill(
    `${EditDialogSelector} input[name="phone"]`,
    instantMessaging.phone
  )
  await page.fill(
    `${EditDialogSelector} input[name="appId"]`,
    instantMessaging.appId
  )

  let id = await page.inputValue(`${EditDialogSelector} input[name="id"]`)
  let expectedUrl = `/api/BrandCommunication/${id}`

  await Promise.all([
    page.waitForResponse((response) => {
      return response.url().endsWith(expectedUrl) && response.status() === 200
    }),
    page.click(`${EditDialogSelector} button[type="submit"]`)
  ])
}

const deleteInstantMessaging = async (page) => {
  let DeleteDialogSelector = `#delete-instant-messaging-dialog`
  await page.click(`${DeleteDialogSelector}-disclosure`)
  await page.waitForSelector(DeleteDialogSelector)

  let id = await page.inputValue(`${DeleteDialogSelector} input[name="id"]`)
  let expectedUrl = `/api/BrandCommunication/${id}`

  await Promise.all([
    page.waitForResponse((response) => {
      return response.url().endsWith(expectedUrl) && response.status() === 200
    }),
    page.click(`${DeleteDialogSelector} button[type="submit"]`)
  ])
}

let InstantMessagingSelectSelector = `select[name="type"]`

const gotoPlatformCustomerServicePage = async (page) => {
  await goto({ page, value: "/platform/imsettings" })
  await selectRandomPlatform(page)
}
