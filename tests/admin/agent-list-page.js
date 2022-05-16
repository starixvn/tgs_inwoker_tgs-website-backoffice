import faker from "@faker-js/faker"
import { add, random, last } from "lodash-es"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
const { lorem, internet } = faker

export const AgentDividendType = {
  OneLayer: "OneLayer",
  MultipleLayer: "MultipleLayer"
}

export const isOneLayer = (value) => value === AgentDividendType.OneLayer

export const searchAgent = async (page, username) => {
  let inputSelector = `input[name="username"]`
  await page.fill(inputSelector, username)

  let [listResponse] = await Promise.all([
    page.waitForResponse((response) => {
      return response.url().includes(`/api/agent?`) && response.status() === 200
    }),
    page.click(`button[type="submit"]`)
  ])
}

export const addAgent = async (page, agentDividendType, agents = []) => {
  let levelType = agents.length === 0 ? "Chief" : "Agent"
  let parentAgent = last(agents)

  let Step = 0.01
  let dividendPercentage = random(
    0,
    parentAgent?.dividendPercentage
      ? parentAgent?.dividendPercentage - Step
      : 100,
    true
  )
  let password = `${internet.password(8)}a1`
  let agent = {
    username: `${faker.name.firstName()}${new Date().getTime()}`,
    password,
    confirmPassword: password,
    levelType,
    parentUsername: parentAgent && parentAgent.username,
    dividendPercentage,
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

  if (isOneLayer(agentDividendType)) {
    await page.fill(
      `${AddAgentDialogSelector} input[name="dividendPercentage"]`,
      `${agent.dividendPercentage.toFixed(2)}`
    )
  }

  if (agent.parentUsername) {
    await page.fill(
      `${AddAgentDialogSelector} input[name="parentUsername"]`,
      agent.parentUsername
    )
  }

  await page.fill(
    `${AddAgentDialogSelector} textarea[name="remarks"]`,
    agent.remarks
  )

  await Promise.all([
    page.waitForResponse((response) => {
      return response.url().endsWith("/api/agent") && response.status() === 200
    }),
    page.click(`${AddAgentDialogSelector} button[type="submit"]`)
  ])

  let result = [...agents, agent]
  return result
}

export const openViewAgentDialog = async (page) => {
  let dialogSelector = `#view-agent-dialog`
  await Promise.all([
    page.waitForResponse((response) => {
      return response.url().includes("/api/agent") && response.status() === 200
    }),
    openDialog(page, dialogSelector)
  ])
  return dialogSelector
}

export const openEditAgentDialog = async (page) => {
  let dialogSelector = `#edit-agent-dialog`
  await openDialog(page, dialogSelector)
  return dialogSelector
}

export const gotoAgentListPage = async (page, platformCode) => {
  await page.goto("/agentmanagement/agentlist", { waitUntil: "networkidle" })
  await selectPlatformByCode(page, platformCode)
}
