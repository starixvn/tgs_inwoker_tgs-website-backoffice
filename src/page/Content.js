import React, {
  createContext,
  useState,
  useEffect,
  useLayoutEffect,
  useRef
} from "react"
import { css, Global } from "@emotion/react"
import {
  Heading,
  PageContent as _PageContent,
  Box,
  Stack,
  Table,
  Card,
  Button,
  InputField,
  Set,
  Divider
} from "bumbag"
import { useMeasure } from "react-use"

const Store = createContext()

export const usePageContentHeight = () => {
  let context = useContext(Store)
  return context?.body?.height
}

export const PageContent = ({
  title,
  actionBar,
  height = "100%",
  children,
  ...props
}) => {
  let [bodyRef, body] = useMeasure()

  return (
    <Store.Provider value={{ body }}>
      <_PageContent
        maxWidth="unset"
        height={height}
        wrapperProps={{
          height
        }}
        {...props}
      >
        <Set orientation="vertical" spacing="major-2" height="100%" isFilled>
          <Box>
            {title && (
              <Box marginBottom="major-3">
                <Heading use="h3">{title}</Heading>
              </Box>
            )}
            {actionBar && <Stack orientation="horizontal">{actionBar}</Stack>}
          </Box>
          <Box ref={bodyRef} flex="1">
            {children}
          </Box>
        </Set>
      </_PageContent>
    </Store.Provider>
  )
}

export default PageContent
