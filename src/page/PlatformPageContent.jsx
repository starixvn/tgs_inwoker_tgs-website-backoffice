import React, {
  createContext,
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useContext
} from "react"
import { css, Global } from "@emotion/react"
import {
  PageContent,
  Heading,
  Set,
  Box,
  Button,
  Level,
  Text,
  Link,
  FieldStack,
  Alert,
  List,
  useBreakpoint
} from "bumbag"
import Content from "./Content"
import BrandBar from "../report/BrandBar"
import { useUserBrandId } from "../user/context"

const Store = createContext()

export const PlatformPageContent = ({
  title,
  height = "100%",
  children,
  ...props
}) => {
  let userPlatformId = useUserBrandId()
  let [platformId, setPlatformId] = useState(userPlatformId)
  let [platform, setPlatform] = useState()

  //TODO: save platform id and platform info?
  //TODO: also work with url?
  let isMobile = useBreakpoint("mobile")
  //TODO: title and actionbar overflow visible?
  return (
    <Store.Provider value={{ platformId, platform, setPlatform }}>
      <PageContent
        maxWidth="unset"
        height={height}
        wrapperProps={{
          height
        }}
        {...props}
      >
        <Set orientation="vertical" isFilled height="100%">
          <Set orientation="horizontal" marginBottom="1.5rem" alignY="center">
            <Box>
              <Heading use="h3" marginTop="0" marginBottom="0">
                {title}
              </Heading>
            </Box>
            <BrandBar
              paddingLeft="0"
              paddingTop="0"
              onBrandChange={(value) => {
                setPlatformId(value)
              }}
            />
          </Set>
          {platformId && children}
        </Set>
      </PageContent>
    </Store.Provider>
  )
}

export const usePlatformId = () => {
  let { platformId } = useContext(Store) ?? {}
  return platformId
}

export const usePlatform = () => {
  let { platformId, platform, setPlatform } = useContext(Store) ?? {}
  useEffect(() => {
    //TODO: fetch platform info if platform.id != platformId?
  }, [platformId, platform?.id])

  return platform
}
