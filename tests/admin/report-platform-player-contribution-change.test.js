import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { selectPlatformByCode } from "../page/content.js"

const test = base.extend(Fixture)

test.skip("view platform player balance contribution report", async ({
  page,
  platformCode,
  player
}) => {})
