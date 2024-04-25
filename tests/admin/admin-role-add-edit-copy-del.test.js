import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { faker } from "@faker-js/faker"
import {
  selectByLabel,
  selectByValue,
  selectFirstValidOption
} from "../page/select.js"
import { urlIncludes } from "../page/response.js"
import { openDialog } from "../page/dialog.js"
import { head } from "lodash-es"

const test = base.extend(Fixture)

test("admin role add > edit > copy > del", async ({
  page,
  reseller,
  licensee,
  backofficeApi
}) => {
  let [platform] = await Promise.all([
    backofficeApi.platform.addPlatform({
      licenseeId: licensee.id
    }),
    page.goto("/system/roles", { waitUntil: "networkidle" })
  ])

  let rootRole = await addRootRole({ page, reseller, licensee, platform })

  let role = await addRole({
    page,
    reseller,
    licensee,
    platform,
    rootRole
  })

  await editRole({
    page,
    platform,
    role,
    rootRole
  })

  let roleClone = await copyRole({
    page,
    licensee,
    platform,
    role
  })

  await deleteRole({
    page,
    licensee,
    platform,
    role: roleClone
  })
})

const addRootRole = async ({ page, reseller, licensee, platform }) => {
  let DialogSelector = "#add-role-dialog"
  await openDialog(page, DialogSelector)

  await selectByValue(
    page,
    `${DialogSelector} select[name="roleType"]`,
    "Brand"
  )

  await selectByValue(
    page,
    `${DialogSelector} select[name="resellerId"]`,
    reseller.id
  )

  await selectByValue(
    page,
    `${DialogSelector} select[name="licenseeId"]`,
    licensee.id
  )

  await selectByValue(
    page,
    `${DialogSelector} select[name="brandId"]`,
    platform.id
  )

  await page
    .locator(`${DialogSelector} input[name="isRoot"] + .bb-CheckboxIcon`)
    .click()

  let name = `${platform.name}_root`

  await page.locator(`${DialogSelector} input[name="name"]`).fill(name)

  let modules = ["Overview", "Platform"]
  await modules.reduce(async (promise, module) => {
    await promise
    return page
      .locator(
        `${DialogSelector} input[data-type="module"][data-module="${module}"] + .bb-CheckboxIcon`
      )
      .click()
  }, Promise.resolve())

  let [response] = await Promise.all([
    page.waitForResponse(urlIncludes("/api/role")),
    page.locator(`${DialogSelector} button[type="submit"]`).click()
  ])

  let result = await response.json()
  expect(result.valid).to.be.true

  return {
    name,
    modules
  }
}

const addRole = async ({
  page,
  reseller,
  licensee,
  platform,
  rootRole = {}
}) => {
  let DialogSelector = "#add-role-dialog"
  await openDialog(page, DialogSelector)

  await selectByValue(
    page,
    `${DialogSelector} select[name="roleType"]`,
    "Brand"
  )

  await selectByValue(
    page,
    `${DialogSelector} select[name="resellerId"]`,
    reseller.id
  )

  await selectByValue(
    page,
    `${DialogSelector} select[name="licenseeId"]`,
    licensee.id
  )

  await selectByValue(
    page,
    `${DialogSelector} select[name="brandId"]`,
    platform.id
  )

  let name = `${platform.name}_not_root`
  await page.locator(`${DialogSelector} input[name="name"]`).fill(name)

  let module = head(rootRole.modules)
  await page
    .locator(
      `${DialogSelector} input[data-type="module"][data-module="${module}"] + .bb-CheckboxIcon`
    )
    .click()

  let [response] = await Promise.all([
    page.waitForResponse(urlIncludes("/api/role")),
    page.locator(`${DialogSelector} button[type="submit"]`).click()
  ])

  let result = await response.json()
  expect(result.valid).to.be.true

  return {
    name,
    modules: [module]
  }
}

const editRole = async ({ page, platform, role = {}, rootRole = {} }) => {
  await selectByValue(page, `select[name="brandId"]`, platform.id)
  await page.locator(`input[name="name"]`).fill(role.name)
  await Promise.all([
    page.waitForResponse(urlIncludes("/api/role?")),
    page.locator(`button[type="submit"]`).click()
  ])

  let DialogSelector = `#edit-role-dialog`
  await openDialog(page, DialogSelector)

  let module = rootRole.modules.find((module) => !role.modules.includes(module))
  console.log("module", module)
  await page
    .locator(
      `${DialogSelector} input[data-type="module"][data-module="${module}"] + .bb-CheckboxIcon`
    )
    .click()

  let [response] = await Promise.all([
    page.waitForResponse(urlIncludes("/api/role")),
    page.locator(`${DialogSelector} button[type="submit"]`).click()
  ])

  let result = await response.json()
  expect(result.valid).to.be.true

  return {
    ...role,
    module: [...role.modules, module]
  }
}

const copyRole = async ({ page, platform, role = {} }) => {
  await selectByValue(page, `select[name="brandId"]`, platform.id)
  await page.locator(`input[name="name"]`).fill(role.name)
  await Promise.all([
    page.waitForResponse(urlIncludes("/api/role?")),
    page.locator(`button[type="submit"]`).click()
  ])

  let DialogSelector = `#copy-role-dialog`
  await openDialog(page, DialogSelector)

  let name = `${role.name}_clone`
  let nameInputLocator = page.locator(`${DialogSelector} input[name="name"]`)
  await nameInputLocator.clear()
  await nameInputLocator.fill(name)

  let [response] = await Promise.all([
    page.waitForResponse(urlIncludes("/copy")),
    page.locator(`${DialogSelector} button[type="submit"]`).click()
  ])

  let result = await response.json()
  expect(result.valid).to.be.true

  return {
    ...role,
    name
  }
}

const deleteRole = async ({ page, platform, role = {} }) => {
  await selectByValue(page, `select[name="brandId"]`, platform.id)
  await page.locator(`input[name="name"]`).fill(role.name)
  await Promise.all([
    page.waitForResponse(urlIncludes("/api/role?")),
    page.locator(`button[type="submit"]`).click()
  ])

  let DialogSelector = `#delete-role-dialog`
  await openDialog(page, DialogSelector)

  let [response] = await Promise.all([
    page.waitForResponse(urlIncludes("/api/role/")),
    page.locator(`${DialogSelector} button[type="submit"]`).click()
  ])

  let result = await response.json()
  expect(result.valid).to.be.true
}
