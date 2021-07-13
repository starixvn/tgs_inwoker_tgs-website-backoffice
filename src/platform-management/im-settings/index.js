import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { Dialog } from "bumbag"
import PageContent from "../../page/Content"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute,
  useUserBrandId,
  useUserRoleType
} from "../../user/context"
import { Code } from "./menu"
