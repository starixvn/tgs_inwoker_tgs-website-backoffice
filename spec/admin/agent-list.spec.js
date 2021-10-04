import { chromium } from "playwright"
import { expect } from "chai"
import { StorageState } from "../auth"
import { host, headless } from "../env"
import { add, random, last } from "lodash"
import numeral from "numeral"
import { startOfDay, endOfTomorrow, format } from "date-fns"
import { lorem, internet } from "faker"
import clone from "clone-deep"
import { fillDatePicker } from "../fill"
import { goto } from "../sidebar"
import platform from "../platform"

let browser
let context
let page

describe.skip("Admin user", () => {
  before(async () => {
    browser = await chromium.launch({ headless: headless() })
    context = await browser.newContext({ storageState: StorageState.Admin })
  })

  beforeEach(async () => {
    page = await context.newPage()

    await page.goto(host(), {
      waitUntil: "networkidle0"
    })

    await gotoAgentListPage()
  })

  afterEach(async () => {
    await page.close()
  })

  after(async () => {
    await browser.close()
  })

  it("should able to add, edit, change parent and vidw agent", async () => {
    let agents = await addAgent()
    agents = await addAgent(agents)
    //FIXME: not able to add more agents?
    // agents = await addAgent(agents)
    // agents = await addAgent(agents)
    // agents = await addAgent(agents)

    let lastAgent = clone(last(agents))
    await searchBy({ field: "username", value: lastAgent.username })
    let newLastAgent = await editAgentInfo(lastAgent)
    await viewAgentInfo(newLastAgent)
  })

  const API = "/api/agent"

  const changeAgentParent = async (agent, newParent, list) => {
    //TODO
  }

  const EditAgentSelector = `#edit-agent-dialog`

  const ViewAgentSelector = `#view-agent-dialog`
  const viewAgentInfo = async (expectedAgent) => {
    await searchBy({ value: expectedAgent.username })

    await page.click(`${ViewAgentSelector}-disclosure`)
    await page.click("button#AgentInfo")

    let dividendPercentageString = await page.$eval(
      `${TabPanelSelector} #dividendPercentage`,
      ({ dataset }) => dataset.value
    )
    let dividendPercentage = parseInt(dividendPercentageString)
    expect(dividendPercentage).to.equal(expectedAgent.dividendPercentage)
  }

  const TabPanelSelector = ".bb-TabsPanel"
  const editAgentInfo = async (agent) => {
    await searchBy({ value: agent.username })
    await page.click(`${EditAgentSelector}-disclosure`)

    await page.click("button#AgentInfo")

    let dividendPercentage = randomDividendPercentage(agent)
    let newAgent = {
      ...agent,
      dividendPercentage
    }

    await page.fill(
      `${TabPanelSelector} input[name="dividendPercentage"]`,
      `${newAgent.dividendPercentage}`
    )

    let id = await page.$eval(
      `${TabPanelSelector} input[name="id"]`,
      ({ value }) => value
    )

    await Promise.all([
      page.waitForResponse((response) => {
        return (
          response.url().endsWith(`${API}/${id}`) && response.status() === 200
        )
      }),
      page.click(`${TabPanelSelector} button[type="submit"]`)
    ])

    await page.waitForLoadState("networkidle")
    await page.waitForLoadState("domcontentloaded")

    return newAgent
  }

  const randomDividendPercentage = (agent) => {
    let dividendPercentage = random(
      agent.MinDividendPercentage,
      agent.MaxDividendPercentage
    )
    while (dividendPercentage == agent.dividendPercentage) {
      dividendPercentage = random(
        agent.MinDividendPercentage,
        agent.MaxDividendPercentage
      )
    }
    return dividendPercentage
  }

  const searchBy = async ({ field = "username", value }) => {
    await page.fill(`input[name="${field}"]`, value)
    await Promise.all([
      page.waitForResponse((response) => {
        return response.url().includes(API) && response.status() === 200
      }),
      page.click(`button[type="submit"]`)
    ])

    await Promise.all([
      page.waitForLoadState("networkidle"),
      page.waitForLoadState("domcontentloaded"),
      page.waitForSelector("#agent")
    ])
  }

  const addAgent = async (agents = []) => {
    let levelType = agents.length === 0 ? "Chief" : "Agent"
    let parentAgent = last(agents)
    let MaxDividendPercentage = 100 - agents.length * 10
    let MinDividendPercentage =
      MaxDividendPercentage - (agents.length + 1) * 10 + 1
    let dividendPercentage = random(
      MinDividendPercentage,
      MaxDividendPercentage
    )

    let password = `${internet.password(8)}a1`
    let agent = {
      username: internet.userName(),
      password,
      confirmPassword: password,
      levelType,
      parentUsername: parentAgent && parentAgent.username,
      dividendPercentage,
      remarks: lorem.sentence(),
      MinDividendPercentage,
      MaxDividendPercentage
    }

    const AddAgentDialogSelector = `#add-agent-dialog`
    await page.click(`${AddAgentDialogSelector}-disclosure`)
    await page.waitForSelector(`${AddAgentDialogSelector}`)
    await page.fill(
      `${AddAgentDialogSelector} input[name="username"]`,
      agent.username
    )
    await page.fill(
      `${AddAgentDialogSelector} input[name="password"]`,
      agent.password
    )
    await page.fill(
      `${AddAgentDialogSelector} input[name="confirmPassword"]`,
      agent.confirmPassword
    )
    await page.selectOption(
      `${AddAgentDialogSelector} select[name="levelType"]`,
      agent.levelType
    )
    if (agent.parentUsername) {
      await page.fill(
        `${AddAgentDialogSelector} input[name="parentUsername"]`,
        agent.parentUsername
      )
    }
    await page.fill(
      `${AddAgentDialogSelector} input[name="dividendPercentage"]`,
      `${agent.dividendPercentage}`
    )
    await page.fill(
      `${AddAgentDialogSelector} textarea[name="remarks"]`,
      agent.remarks
    )

    await Promise.all([
      page.waitForResponse((response) => {
        return response.url().endsWith(API) && response.status() === 200
      }),
      page.click(`${AddAgentDialogSelector} button[type="submit"]`)
    ])

    await page.waitForLoadState("networkidle")
    await page.waitForLoadState("domcontentloaded")
    await page.waitForTimeout(1000)

    let result = [...agents, agent]
    return result
  }

  const gotoAgentListPage = async () => {
    await goto({ page, value: "/agentmanagement/agentlist" })
    await platform.selectFirst({ page })
  }
})
