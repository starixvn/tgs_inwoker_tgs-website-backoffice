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
import BrandBar from "../report/BrandBar"
import { useUserResellerId } from "../user/context"
import { useMeasure } from "react-use"
import { Reseller } from "../merchant/resellers"

const Store = createContext()

export const ResellerPageContent = ({
  title,
  addonAfterTitle,
  height = "100%",
  children,
  ...props
}) => {
  let userResellerId = useUserResellerId()
  let [resellerId, setResellerId] = useState(userResellerId)

  let [ref, measure] = useMeasure()

  //TODO: also work with url?
  let isMobile = useBreakpoint("mobile")
  //TODO: title and actionbar overflow visible?
  return (
    <Store.Provider
      value={{
        resellerId,
        setResellerId,
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
        {...props}
      >
        <Set orientation="vertical" isFilled height="100%">
          <Set orientation="horizontal" alignY="center">
            <BrandBar
              end={Reseller}
              onResellerChange={(value) => {
                setResellerId(value)
              }}
            />
            <Box>
              <Heading use="h3" marginTop="0" marginBottom="0">
                {title}
              </Heading>
            </Box>
            {addonAfterTitle}
          </Set>
          {resellerId && children}
        </Set>
      </PageContent>
    </Store.Provider>
  )
}

export const useResellerId = () => {
  let { resellerId } = useContext(Store) ?? {}
  return resellerId
}

export const useResellerPageContentWidth = () => {
  let { width } = useContext(Store) ?? {}
  return width
}
