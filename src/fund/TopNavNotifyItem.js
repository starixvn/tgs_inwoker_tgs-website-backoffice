import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global, keyframes } from "@emotion/react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import {
  Switch,
  Route,
  Link,
  useLocation,
  useHistory,
  useParams,
  useRouteMatch
} from "react-router-dom"
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
  Icon
} from "bumbag"
import { FormattedNumberDecimal, Trans, useTrans } from "../i18n"
import clone from "clone-deep"
import { SortOrder } from "../table/order"
import { sortBy, head, differenceBy } from "lodash-es"
import { subDays, addSeconds, setMilliseconds, formatISO } from "date-fns"
import { faBell } from "@fortawesome/free-solid-svg-icons"
import anime from "animejs/lib/anime.es.js"
import { play } from "../audio/player"

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

  let [params, setParams] = useState({
    page: 1,
    sortby: "CreatedOn",
    orderby: SortOrder.Descending,
    rows: 20,
    status,
    bc: queryStartTime(),
    ec: queryEndTime()
  })

  const updateFetch = () => {
    let time = queryEndTime()
    setParams((state) => ({ ...state, ec: time }))
  }

  useEffect(() => {
    let id = setInterval(updateFetch, 15 * SecondInMilliseconds)

    return () => {
      clearInterval(id)
    }
  }, [])

  let { data, isLoading, error, mutate, deleteCache } = useFetch(
    brandId,
    params
  )

  useEffect(() => {
    if (updateFetchEventName) {
      document.addEventListener(updateFetchEventName, () => {
        updateFetch()
      })
      return () => {
        document.removeEventListener(updateFetchEventName, updateFetch)
      }
    }
  }, [updateFetchEventName])

  let [items, setItems] = useState([])

  useEffect(() => {
    let diff = differenceBy(data?.items, items, "id")
    if (diff.length > 0) {
      if (audio) {
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
    }

    if (data?.items) {
      setItems(clone(data.items))
    }
  }, [JSON.stringify(data?.items)])

  return (
    items.length > 0 && (
      <TopNav.Item {...props}>
        <Button
          variant="link"
          iconBefore="solid-bell"
          color={color}
          onClick={(event) => {
            let state = {
              fromNotify: params.ec.getTime(),
              brandId,
              status
            }

            let samePage = pathname == href
            if (samePage) {
              history.replace(href, state)
            } else {
              history.push(href, state)
            }

            /*
            if (samePage) {
              history.go()
            }
            */
          }}
        >
          {children}
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
