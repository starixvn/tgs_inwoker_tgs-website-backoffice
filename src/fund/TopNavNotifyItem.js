import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global, keyframes } from "@emotion/react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { useLocation, useHistory } from "react-router-dom"
import {
  Heading,
  Stack,
  Box,
  Button,
  Set,
  useModalState,
  Flex,
  Level,
  FieldStack,
  FieldWrapper,
  useToasts,
  Dialog,
  TopNav,
  Icon,
  Text
} from "bumbag"
import { FormattedNumberDecimal, Trans, useTrans } from "../i18n"
import clone from "clone-deep"
import { SortOrder } from "../table/order"
import { sortBy, head, differenceBy } from "lodash-es"
import { subDays, addSeconds, setMilliseconds, formatISO } from "date-fns"
import { faBell } from "@fortawesome/free-solid-svg-icons"
import anime from "animejs/lib/anime.es.js"
import { play } from "../audio/player"
import { isDev } from "../env"

const SecondInMilliseconds = 1000

export const TopNavNotifyItem = ({
  brandId,
  href,
  color,
  useFetch,
  status,
  updateFetchEventName = "",
  audio,
  children,
  ...props
}) => {
  let history = useHistory()
  let { pathname } = useLocation()

  let {
    data: total,
    isLoading,
    error,
    mutate,
    deleteCache
  } = useFetch(brandId, {
    refreshInterval: 15 * SecondInMilliseconds
  })

  let [unprocessed, setUnprocessed] = useState(0)

  const reset = () => {
    deleteCache()
    mutate()
  }

  useEffect(() => {
    if (updateFetchEventName) {
      document.addEventListener(updateFetchEventName, reset)
      return () => {
        document.removeEventListener(updateFetchEventName, reset)
      }
    }
  }, [updateFetchEventName])

  useEffect(() => {
    if (Number.isFinite(total)) {
      if (total > 0) {
        play(audio, {
          onPlay: () => {
            if (props.id) {
              let animationDelay = SecondInMilliseconds * 0.01
              setTimeout(() => {
                bellAnime(props.id)
              }, animationDelay)
            }
          }
        })
      }
      setUnprocessed(total)
      mutate(null, false) //reset total > null > play alarm next effect
    }
  }, [total])

  return (
    unprocessed > 0 && (
      <TopNav.Item data-unprocessed={unprocessed} {...props}>
        <Button
          variant="link"
          iconBefore="solid-bell"
          color={color}
          onClick={(event) => {
            let state = {
              fromNotify: queryEndTime(),
              brandId,
              status
            }

            let samePage = pathname == href
            if (samePage) {
              history.replace(href, state)
            } else {
              history.push(href, state)
            }
          }}
        >
          {children} {unprocessed}
        </Button>
      </TopNav.Item>
    )
  )
}

const bellAnime = (id = "") => {
  return null //poc
  anime({
    targets: `#${id} .bb-ButtonIcon`,
    keyframes: [
      { rotate: 0 },
      { rotate: 30 },
      { rotate: -28 },
      { rotate: 34 },
      { rotate: -32 },
      { rotate: 30 },
      { rotate: -28 },
      { rotate: 26 },
      { rotate: -24 },
      { rotate: 22 },
      { rotate: -20 },
      { rotate: 18 },
      { rotate: -16 },
      { rotate: 14 },
      { rotate: -12 },
      { rotate: 10 },
      { rotate: -8 },
      { rotate: 6 },
      { rotate: -4 },
      { rotate: 2 },
      { rotate: -1 },
      { rotate: 1 },
      { rotate: 0 }
    ],
    duration: 2000,
    easing: "easeInOutCubic"
  })
}

const queryStartTime = () => {
  let lastDay = subDays(new Date(), 1)
  let result = setMilliseconds(lastDay, 0)
  return result
}

const queryEndTime = () => {
  let nextSecondTime = addSeconds(new Date(), 1) //add one second look ahead time
  let result = setMilliseconds(nextSecondTime, 0)
  return result
}

export default TopNavNotifyItem
