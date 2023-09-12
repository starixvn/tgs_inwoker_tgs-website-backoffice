import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { last } from "lodash-es"
import {
  AgentDividendType,
  addAgent,
  gotoAgentListPage
} from "./agent-list-page.js"
import { openDialog } from "../page/dialog.js"

const test = base.extend(Fixture)

test("add one layer agents", async ({ page, licensee, backofficeApi }) => {
  let platform = await backofficeApi.platform.addPlatform({
    licenseeId: licensee.id,
    agentDividendType: AgentDividendType.OneLayer
  })

  await gotoAgentListPage(page, platform.code)

  let agents = await addAgent(page, AgentDividendType.OneLayer)
  agents = await addAgent(page, AgentDividendType.OneLayer, agents)

  let [parent, agent] = agents
  let findAgentResult = await backofficeApi.agent.findAgent(
    platform.id,
    agent.username
  )
  let agentRecord = await backofficeApi.agent.getAgent(findAgentResult?.id)
  expect(agentRecord.parentUsername).to.equals(parent.username)
})
