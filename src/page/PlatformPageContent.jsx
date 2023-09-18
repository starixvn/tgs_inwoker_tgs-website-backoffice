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
import { useMeasure } from "react-use"

const Store = createContext()

export const PlatformPageContent = ({
  title,
  addonAfterTitle,
  height = "100%",
  children,
  padding = "1rem",
  ...props
}) => {
  let userPlatformId = useUserBrandId()
  let [platformId, setPlatformId] = useState(userPlatformId)
  let [platform, setPlatform] = useState()

  let [ref, measure] = useMeasure()

  //TODO: also work with url?
  let isMobile = useBreakpoint("mobile")
  //TODO: title and actionbar overflow visible?
  return (
    <Store.Provider
      value={{
        platformId,
        platform,
        setPlatform,
        width: measure?.width
      }}
    >
      <PageContent
        ref={ref}
        maxWidth="unset"
        height={height}
        wrapperProps={{
          height
        }}
        padding={padding}
        {...props}
      >
        <Set orientation="vertical" isFilled height="100%">
          <Set orientation="horizontal" padding="1rem 0" alignY="center">
            <BrandBar
              paddingLeft="0"
              paddingTop="0"
              onBrandChange={(value) => {
                setPlatformId(value)
              }}
            />
            <Box>
              <Heading use="h3" marginTop="0" marginBottom="0">
                {title}
              </Heading>
            </Box>
            {addonAfterTitle}
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

export const usePlatformPageContentWidth = () => {
  let { width } = useContext(Store) ?? {}
  return width
}

//TODO: rm
export const usePlatform = () => {
  let { platformId, platform, setPlatform } = useContext(Store) ?? {}
  useEffect(() => {
    //TODO: fetch platform info if platform.id != platformId?
  }, [platformId, platform?.id])

  return platform
}
