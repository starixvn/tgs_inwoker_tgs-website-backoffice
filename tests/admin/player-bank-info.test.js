import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { selectPlatformByCode } from "../page/content.js"

const test = base.extend(Fixture)

test.skip("edit and view player bank info", async ({
  page,
  platformCode,
  player
}) => {})
