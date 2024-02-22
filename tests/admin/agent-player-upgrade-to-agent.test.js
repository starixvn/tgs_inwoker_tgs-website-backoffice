import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { selectPlatformByCode } from "../page/content.js"
import { random } from "lodash-es"
import { openDialog } from "../page/dialog.js"
import { urlIncludes } from "../page/response.js"
import { gotoPlayerListPage, searchPlayer } from "./player-list-page.js"

const test = base.extend(Fixture)

test("upgrade player to agent", async ({
  page,
  brandCertApi,
  agentPlayerPlatform,
  operatorApi,
  backofficeApi
}) => {
  let [platformToken] = await Promise.all([
    brandCertApi.platformToken(agentPlayerPlatform.code),
    gotoPlayerListPage(page, agentPlayerPlatform.code)
  ])
  let player = await operatorApi.player.createAndLogin(platformToken)

  await searchPlayer(page, player)

  let DialogSelector = `#upgrade-player-to-agent-dialog`
  await openDialog(page, DialogSelector)

  await Promise.all([
    urlIncludes(`/api/player/upgrade/${player.code}/agent`),
    page.locator(`${DialogSelector} button[type="submit"]`).click()
  ])

  //TODO: test redirect to agent page?

  let agent = await backofficeApi.agent.findAgent(
    agentPlayerPlatform.id,
    player.username
  )
  expect(agent.username).equals(player.username)
})
