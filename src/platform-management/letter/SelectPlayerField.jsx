import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Box, OptionButtons } from "bumbag"
import { Trans, useTrans } from "../../i18n"
import Select from "../../select/Select"
import { LetterType, LetterTypeSelect } from "./LetterType"
import Label from "../../form/Label"
import { PlayerSelect } from "../../player-management/player-list/PlayerSelect"

//TODO: rm?
export const SelectPlayerField = ({
  name,
  designatedPlayersProps = {},
  brandId
}) => {}
