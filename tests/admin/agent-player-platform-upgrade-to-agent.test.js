import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { selectPlatformByCode } from "../page/content.js"
import { random } from "lodash-es"
import { openDialog } from "../page/dialog.js"
import { searchAgent } from "./agent-list-page.js"
import { urlIncludes } from "../page/response.js"

const test = base.extend(Fixture)

test("upgrade player to agent", async ({
  page,
  brandCertApi,
  agentPlayerPlatform,
  operatorApi
}) => {
  let platformToken = await brandCertApi.platformToken(agentPlayerPlatform.code)
  let player = await operatorApi.player.createAndLogin(platformToken)
  console.log("player", player)
})
