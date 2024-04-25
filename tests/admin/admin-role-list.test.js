import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { faker } from "@faker-js/faker"
import { urlIncludes } from "../page/response.js"

const test = base.extend(Fixture)

test("admin role list", async ({ page }) => {
  await Promise.all([
    page.waitForResponse(urlIncludes("/api/role?")),
    page.goto("/system/roles", { waitUntil: "networkidle" })
  ])

  let name = await page
    .locator(`table td[data-column-id="name"]`)
    .first()
    .textContent()

    expect(name).not.empty
    
    
})
