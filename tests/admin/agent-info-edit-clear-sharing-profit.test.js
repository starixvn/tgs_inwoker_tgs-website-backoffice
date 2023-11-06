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

const test = base.extend(Fixture)

console.warn("TODO: add clear agent sharing profit test case")
test("clear agent sharing profit", async ({
  page,
  platformCode,
  agent,
  backofficeApi
}) => {
  await gotoAgentListPage(page, platformCode)
  await searchAgent(page, agent.username)

  let dialogSelector = await openEditAgentDialog(page)
  let ClearAgentProfitShareDialog = `#clear-agent-profit-share-dialog`

  await openDialog(
    page,
    ClearAgentProfitShareDialog,
    `${dialogSelector} ${ClearAgentProfitShareDialog}-disclosure`
  )

  await Promise.all([
    page.waitForResponse((response) => {
      let isRequest = `/api/agent/${agent.id}/clear-negative-commission`

      return (
        response
          .url()
          .includes(`/api/agent/${agent.id}/clear-negative-commission`) &&
        response.status() === 200
      )
    }),
    page.click(`${ClearAgentProfitShareDialog} button[type="submit"]`)
  ])
})
