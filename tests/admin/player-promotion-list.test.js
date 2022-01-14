import base from "@playwright/test"
import { Fixture } from "./auth.js"
import { expect } from "chai"
import { selectPlatformByCode } from "../page/content.js"
import { openDialog } from "../page/dialog.js"
import numeral from "numeral"
import {
  gotoPlayerListPage,
  searchPlayer,
  ViewPlayerDialogSelector
} from "./player-list-page.js"

const test = base.extend(Fixture)

test.skip("view player promotion list", async ({
  page,
  platformCode,
  player
}) => {})
