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
import { useUserBrandId, useUserLicenseeId } from "../user/context"
import { useMeasure } from "react-use"
import { Licensee } from "../merchant/licensees"

const Store = createContext()

export const LicenseePageContent = ({
  title,
  addonAfterTitle,
  height = "100%",
  children,
  padding = "1rem",
  ...props
}) => {
  let userLicenseeId = useUserLicenseeId()
  let [licenseeId, setLicenseeId] = useState(userLicenseeId)
  let [licensee, setLicensee] = useState()

  let [ref, measure] = useMeasure()

  //TODO: also work with url?
  let isMobile = useBreakpoint("mobile")
  //TODO: title and actionbar overflow visible?
  return (
    <Store.Provider
      value={{
        licenseeId,
        licensee,
        setLicensee,
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
          <Set orientation="horizontal" padding="0.5rem 0" alignY="center">
            <BrandBar
              paddingLeft="0"
              paddingTop="0"
              end={Licensee}
              onLicenseeChange={(value) => {
                setLicenseeId(value)
              }}
            />
            <Box>
              <Heading use="h3" marginTop="0" marginBottom="0">
                {title}
              </Heading>
            </Box>
            {addonAfterTitle}
          </Set>
          {licenseeId && children}
        </Set>
      </PageContent>
    </Store.Provider>
  )
}

export const useLicenseeId = () => {
  let { licenseeId } = useContext(Store) ?? {}
  return licenseeId
}

export const useLicenseePageContentWidth = () => {
  let { width } = useContext(Store) ?? {}
  return width
}

//TODO: isLoading?
export const useLicensee = () => {
  let { licenseeId, licensee, setLicensee } = useContext(Store) ?? {}

  useEffect(() => {
    //TODO: fetch licensee when licenseeId != licensee
  }, [licenseeId, licensee?.id])

  return licensee
}
