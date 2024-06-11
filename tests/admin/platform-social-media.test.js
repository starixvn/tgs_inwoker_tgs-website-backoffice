import base from "@playwright/test"
import { expect } from "chai"
import { Fixture } from "./auth.js"
import { selectByValue } from "../page/select.js"
import { selectPlatformByCode } from "../page/content.js"
import { faker } from "@faker-js/faker"
import { urlIncludes } from "../page/response.js"
import { openDialog } from "../page/dialog.js"

const test = base.extend(Fixture)

test("add and delete social media", async ({
  page,
  platform,
  backofficeApi
}) => {
  await gotoPlatformOperationSettingsPage(page, platform.code)

  let DialogSelector = "#social-media-list-dialog"
  await openDialog(page, DialogSelector)

  let socialMedia = await addSocialMedia({ page, platform, backofficeApi })
  await deleteSocialMedia({ page, platform, socialMedia })
})

const addSocialMedia = async ({ page, platform, backofficeApi }) => {
  let DialogSelector = "#add-social-media-dialog"
  await openDialog(page, DialogSelector)

  let SocialMedia = "X"
  await page.locator(`${DialogSelector} input[name="name"]`).fill(SocialMedia)

  await selectByValue(
    page,
    `${DialogSelector} select[name="type"]`,
    SocialMedia
  )

  let url = faker.internet.url()
  await page.locator(`${DialogSelector} input[name="url"]`).fill(url)

  await Promise.all([
    page.waitForResponse(urlIncludes(`api/brand/social/${platform.id}`)),
    page.locator(`${DialogSelector} button[type="submit"]`).click()
  ])

  let list = await backofficeApi.platform.socialMedia.list(platform.id)
  console.log("url", url)
  console.log(list)
  let socialMedia = list.find((item) => item.url === url)
  expect(socialMedia.name).equals(SocialMedia)
  expect(socialMedia.type).equals(SocialMedia)
  return socialMedia
}

const deleteSocialMedia = async ({ page, platform, socialMedia }) => {
  let DialogSelector = `#delete-social-media-dialog`
  await openDialog(
    page,
    DialogSelector,
    `tr[data-row-id=${socialMedia.id}] button#delete-social-media-dialog-disclosure`
  )

  let [result] = await Promise.all([
    page.waitForResponse(
      urlIncludes(`api/brand/social/${platform.id}/${socialMedia.id}`),
      page.locator(`${DialogSelector} button[type="submit"]`).click()
    )
  ])

  expect(result).to.be.true
}

const gotoPlatformOperationSettingsPage = async (page, platformCode) => {
  await page.goto("/platform/imsettings", { waitUntil: "networkidle" })
  await selectPlatformByCode(page, platformCode)
}
