import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { Box, Button, Icon } from "bumbag"
import {
  faMinus,
  faArrowTrendUp,
  faArrowTrendDown
} from "@fortawesome/free-solid-svg-icons"

const Up = "Up"
const Flat = "Flat"
const Down = "Down"
export const Trend = {
  Up,
  Flat,
  Down
}

export const TrendIcon = ({ value }) => {
  switch (value) {
    case Up:
      return (
        <Button palette="success" isStatic size="small" minHeight="1.5rem">
          <Icon
            icon={faArrowTrendUp}
            type="font-awesome"
            color={"white"}
            fontSize="300"
          />
        </Button>
      )
    case Down:
      return (
        <Button palette="danger" isStatic size="small" minHeight="1.5rem">
          <Icon
            icon={faArrowTrendDown}
            type="font-awesome"
            color={"white"}
            fontSize="300"
          />
        </Button>
      )
    case Flat:
      return (
        <Button palette="warning" isStatic size="small" minHeight="1.5rem">
          <Icon
            icon={faMinus}
            type="font-awesome"
            color={"white"}
            fontSize="300"
          />
        </Button>
      )
    default:
      return null
  }
}
