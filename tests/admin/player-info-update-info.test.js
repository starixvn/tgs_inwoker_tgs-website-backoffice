import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { fillDatePicker } from "../fill.js"
import {
  gotoPlayerListPage,
  searchPlayer,
  openEditPlayerDialog,
  openViewPlayerDialog
} from "./player-list-page.js"
import { faker } from "@faker-js/faker"
import { urlIncludes } from "../page/response.js"
import { format } from "date-fns"

const test = base.extend(Fixture)

test("update player real name, birthdate, idNumber and vip auto state ", async ({
  page,
  platformCode,
  player,
  backofficeApi
}) => {
  await gotoPlayerListPage(page, platformCode)
  await searchPlayer(page, player)

  let updated = await editPlayerInfo(page, player)
  let record = await backofficeApi.player.getPlayer(player.code)

  expect(record.realName).to.equals(updated.realName)
  expect(record.idNumber).to.equals(updated.idNumber)
  expect(record.birthdate).equals(updated.birthdate)
  expect(record.vipLevelAutoState).equals(updated.vipLevelAutoState)
  expect(record.remark).equals(updated.remark)
})

const editPlayerInfo = async (page, player) => {
  let dialogSelector = await openEditPlayerDialog(page)

  let birthdate = format(new Date(), "yyyy/MM/dd")

  let info = {
    realName: faker.person.firstName(),
    idNumber: faker.string.alphanumeric(5),
    birthdate,
    vipLevelAutoState: false,
    remark: faker.lorem.word()
  }

  await page.fill(
    `${dialogSelector} [aria-labelledby="player"] input[name="realName"]`,
    info.realName
  )
  await page.fill(
    `${dialogSelector} [aria-labelledby="player"] input[name="idNumber"]`,
    info.idNumber
  )
  await fillDatePicker({
    page,
    selector: `${dialogSelector} [aria-labelledby="player"] .react-datepicker-wrapper input.bb-Input`,
    value: info.birthdate
  })
  await page
    .locator(
      `${dialogSelector} [aria-labelledby="player"] input[name="vipLevelAutoState"] + div.bb-SwitchIcon`
    )
    .click()

  await page
    .locator(
      `${dialogSelector} [aria-labelledby="player"] textarea[name="remark"]`
    )
    .fill(info.remark)

  await Promise.all([
    page.waitForResponse(urlIncludes(`/api/player/info/${player.code}`)),
    page.click(
      `${dialogSelector} [aria-labelledby="player"] button[type="submit"]`
    )
  ])

  return info
}
