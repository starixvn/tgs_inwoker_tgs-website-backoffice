import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { faker } from "@faker-js/faker"
import { openDialog } from "../page/dialog.js"
import { urlIncludes } from "../page/response.js"
import { gotoAgentListPage, searchAgent } from "./agent-list-page.js"

const test = base.extend(Fixture)

test("new agent with default product fee", async ({
  page,
  agentProductFeePlatform: platform,
  backofficeApi
}) => {
  console.warn("add agent from platform", platform)
})
