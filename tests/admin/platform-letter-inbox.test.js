import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { random } from "lodash-es"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"

const test = base.extend(Fixture)

test("view letter inbox", async ({
  page,
  platform,
  player,
  operatorApi,
  platformToken
}) => {
  let result = await operatorApi.player.sendLetter(platformToken, player.token)
  console.log("result", result)
})
