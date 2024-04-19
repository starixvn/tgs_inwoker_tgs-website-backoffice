import React, { useState, useEffect, useMemo } from "react"
import { css, Global } from "@emotion/react"
import { Box, Set, Level } from "bumbag"
import {
  PlatformPageContent,
  usePlatformId,
  usePlatformPageContentWidth
} from "../../page/PlatformPageContent"
import {
  useIsDisplayMenuByRoute,
  useHasSubMenuByRoute
} from "../../user/context"
import { View, Code } from "./menu"
import { useTabState, Tabs, TabList, Tab, TabPanel } from "../../tab"
import { pageCount, Table, toApiParams, useTable } from "../../table"
import {
  SamePlayerIpAddressTabId,
  SamePlayerIpAddressTab,
  SamePlayerIpAddressTabPanel
} from "./SamePlayerIpAddress"
import {
  PlayerIPAddressByUsernameTab,
  PlayerIPAddressByUsernameTabPanel
} from "./PlayerIpAddressByUsername"
import {
  PlayerByIpAddressTabId,
  PlayerByIpAddressTab,
  PlayerByIpAddressTabPanel
} from "./PlayerByIpAddress"
import { CheckIPTrans } from "../../trans/Platform"

export { Code }

export const Content = () => {
  let isDisplay = useIsDisplayMenuByRoute()
  if (!isDisplay) {
    return null
  }

  return (
    <PlatformPageContent title={<CheckIPTrans />}>
      <Body />
    </PlatformPageContent>
  )
}

const Body = () => {
  let brandId = usePlatformId()
  let DefaultTab = SamePlayerIpAddressTabId
  let tab = useTabState({
    selectedId: DefaultTab
  })

  const activePlayerIPAddressByUsernameTab = () => {
    tab.select(PlayerByIpAddressTabId)
  }

  let table = useTable({
    brandId
  })

  let { setState, setPageIndex, setSortOrder } = table

  useEffect(() => {
    setState({
      brandId,
      pageIndex: 0,
      ipType: undefined,
      userName: undefined,
      ipAddress: undefined
    })
    tab.select(DefaultTab)
  }, [brandId])

  return (
    <Tabs>
      <TabList {...tab}>
        <SamePlayerIpAddressTab {...tab} />
        <PlayerIPAddressByUsernameTab {...tab} />
        <PlayerByIpAddressTab {...tab} />
      </TabList>
      <SamePlayerIpAddressTabPanel
        table={table}
        brandId={brandId}
        onClickIpAddress={(ipAddress) => {
          setState({
            ipAddress,
            pageIndex: 0
          })
          activePlayerIPAddressByUsernameTab()
        }}
        {...tab}
      />
      <PlayerIPAddressByUsernameTabPanel
        table={table}
        brandId={brandId}
        onClickIpAddress={(ipAddress) => {
          setState({
            ipAddress,
            pageIndex: 0
          })
          activePlayerIPAddressByUsernameTab()
        }}
        {...tab}
      />
      <PlayerByIpAddressTabPanel table={table} brandId={brandId} {...tab} />
    </Tabs>
  )
}
