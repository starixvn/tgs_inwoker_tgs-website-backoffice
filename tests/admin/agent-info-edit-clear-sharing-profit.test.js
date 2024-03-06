import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { selectPlatformByCode } from "../page/content.js"
import {
  gotoAgentListPage,
  searchAgent,
  openEditAgentDialog,
  openViewAgentDialog
} from "./agent-list-page.js"
import { openDialog } from "../page/dialog.js"
import { urlIncludes } from "../page/response.js"

const test = base.extend(Fixture)

test("clear agent sharing profit", async ({
  page,
  platform,
  agent,
  backofficeApi
}) => {
  await gotoAgentListPage(page, platform.code)
  await searchAgent(page, agent.username)

  let dialogSelector = await openEditAgentDialog(page)
  let ClearAgentProfitShareDialog = `#clear-agent-profit-share-dialog`

  await openDialog(
    page,
    ClearAgentProfitShareDialog,
    `${dialogSelector} ${ClearAgentProfitShareDialog}-disclosure`
  )

  await Promise.all([
    page.waitForResponse(
      urlIncludes(`/api/agent/${agent.id}/clear-negative-commission`)
    ),
    page.click(`${ClearAgentProfitShareDialog} button[type="submit"]`)
  ])
})
