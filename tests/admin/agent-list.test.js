import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { last } from "lodash-es"
import { selectPlatformByCode } from "../page/content.js"
import faker from "@faker-js/faker"
import { gotoPlatformListPage, addPlatform } from "./platform-list-page.js"
import {
  AgentDividendType,
  addAgent,
  gotoAgentListPage,
  searchAgent
} from "./agent-list-page.js"
import { openDialog } from "../page/dialog.js"
import {
  gotoPlatformSettingPage,
  openProfitSharingSettingDialog,
  setPlatformProfitSharingSetting
} from "./platform-setting-page.js"

const test = base.extend(Fixture)
const { lorem, internet } = faker

/*
test("add one layer agents", async ({ page }) => {
  await gotoPlatformListPage(page)
  let platform = await addPlatform(page, {
    agentDividendType: AgentDividendType.OneLayer
  })

  await gotoAgentListPage(page)
  await selectPlatformByCode(page, platform.code)

  let agents = await addAgent(page, AgentDividendType.OneLayer)
  agents = await addAgent(page, AgentDividendType.OneLayer, agents)

  let [parent, agent] = agents
  await searchAgent(page, agent.username)

  let viewAgentDialogSelector = `#view-agent-dialog`
  await openDialog(page, viewAgentDialogSelector)

  let parentUsernameLocator = page.locator(
    `${viewAgentDialogSelector} [data-type="parent-username"]`
  )
  let parentUsername = await parentUsernameLocator.textContent()
  expect(parentUsername).to.equals(parent.username)
})
*/

test("add multiple layer agents", async ({ page }) => {
  await gotoPlatformListPage(page)
  let platform = await addPlatform(page, {
    agentDividendType: AgentDividendType.MultipleLayer
  })

  await gotoAgentListPage(page)
  await selectPlatformByCode(page, platform.code)

  let agents = await addAgent(page, AgentDividendType.MultipleLayer)

  await configProfitSharing(page)

  await gotoPlatformSettingPage(page, platform.code)
  let expectedProfitSharingSettings = await setPlatformProfitSharingSetting(
    page
  )

  await gotoAgentListPage(page)
  await selectPlatformByCode(page, platform.code)

  agents = await addAgent(page, AgentDividendType.MultipleLayer, agents)
  let [parent, agent] = agents
  await searchAgent(page, agent.username)

  let viewProfitSharingDialogSelector = `#agent-profit-sharing-setting-dialog`
  await openDialog(page, viewProfitSharingDialogSelector)
})

const configProfitSharing = async (page) => {
  let dialogSelector = `#config-agent-dialog`
  await openDialog(page, dialogSelector)

  let profitSharingDialogSelector = `#agent-profit-sharing-setting-dialog`
  await openDialog(page, profitSharingDialogSelector)

  await page.click(
    `${profitSharingDialogSelector} button#add-profit-sharing-setting`
  )

  let activeNumber = 1
  await page.fill(
    `${profitSharingDialogSelector} #activeNumber input`,
    `${activeNumber}`
  )

  let netProfit = 1
  await page.fill(
    `${profitSharingDialogSelector} #netProfit input`,
    `${netProfit}`
  )

  let dividendPercentage = 1
  await page.fill(
    `${profitSharingDialogSelector} #dividendPercentage input`,
    `${dividendPercentage}`
  )

  await page.click(`${profitSharingDialogSelector} button[type="submit"]`)

  await Promise.all([
    page.waitForResponse((response) => {
      return response.url().includes(`/api/agent/`) && response.status() === 200
    }),
    page.click(`${dialogSelector} button[type="submit"]`)
  ])
}

/*
let browser
let context
let page

//TODO: add a platform use
console.warn("TODO: add one layer agents")
console.warn("TODO: add multiple layer agents")
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

  it("add, edit, change parent and vidw agent", async () => {
    let agents = await addAgent()
    agents = await addAgent(agents)
    //FIXME: not able to add more agents?
    // agents = await addAgent(agents)
    // agents = await addAgent(agents)
    // agents = await addAgent(agents)

    //TODO: wait for backend fix
    // let lastAgent = clone(last(agents))
    // await searchBy({ field: "username", value: lastAgent.username })
    // let newLastAgent = await editAgentInfo(lastAgent)
    // await viewAgentInfo(newLastAgent)
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

  const DefaultProfitSharingSettings = [
    [
      {
        netProfit: "10000",
        activeNumber: "3",
        dividendPercentage: "35"
      },
      {
        netProfit: "100000",
        activeNumber: "10",
        dividendPercentage: "65"
      },
      {
        netProfit: "300000",
        activeNumber: "15",
        dividendPercentage: "90"
      }
    ],
    [
      {
        netProfit: "20000",
        activeNumber: "3",
        dividendPercentage: "25"
      },
      {
        netProfit: "200000",
        activeNumber: "10",
        dividendPercentage: "55"
      },
      {
        netProfit: "500000",
        activeNumber: "20",
        dividendPercentage: "70"
      }
    ],
    [
      {
        netProfit: "50000",
        activeNumber: "3",
        dividendPercentage: "15"
      },
      {
        netProfit: "300000",
        activeNumber: "10",
        dividendPercentage: "35"
      },
      {
        netProfit: "600000",
        activeNumber: "25",
        dividendPercentage: "50"
      }
    ]
  ]

  //TODO: a brand for add 3 layer DefaultProfitSharingSettings
  const addAgent = async (
    agents = [],
    profitSharingSettingList = DefaultProfitSharingSettings
  ) => {
    let index = agents.length
    let profitSharingSettings = profitSharingSettingList[index]
    let levelType = agents.length === 0 ? "Chief" : "Agent"
    let parentAgent = last(agents)

    let password = `${internet.password(8)}a1`
    let agent = {
      username: internet.userName(),
      password,
      confirmPassword: password,
      levelType,
      parentUsername: parentAgent && parentAgent.username,
      profitSharingSettings,
      remarks: lorem.sentence()
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

    await addProfitSharingSettings(0, profitSharingSettings)

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

  const addProfitSharingSettings = async (index, list = []) => {
    let DialogSelector = `#agent-profit-sharing-setting-dialog`
    if (index == 0) {
      await page.click(`button#agent-profit-sharing-setting-dialog-disclosure`)
      await page.waitForSelector(DialogSelector)
    }

    await page.click(
      `${DialogSelector} button#add-agent-profit-sharing-setting`
    )
    let RowSelector = `list.${index}`
    let profitSharingSetting = list[index]
    await page.fill(
      `input[name="${RowSelector}.netProfit"]`,
      profitSharingSetting.netProfit
    )
    await page.fill(
      `input[name="${RowSelector}.activeNumber"]`,
      profitSharingSetting.activeNumber
    )
    await page.fill(
      `input[name="${RowSelector}.dividendPercentage"]`,
      profitSharingSetting.dividendPercentage
    )
    await page.click(`${DialogSelector} button[type="submit"]`)
  }

  const gotoAgentListPage = async () => {
    await goto({ page, value: "/agentmanagement/agentlist" })
    await selectRandomPlatform(page)
  }
})
*/
