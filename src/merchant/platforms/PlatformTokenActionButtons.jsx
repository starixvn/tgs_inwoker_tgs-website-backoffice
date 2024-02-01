import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  Stack,
  Heading,
  Box,
  Text,
  FieldStack,
  Card,
  Set,
  Group,
  Button
} from "bumbag"
import { getTrans, Trans, useLocale, useTrans } from "../../i18n"
import { useBrandToken } from "./client"
import { Input } from "../../input/Input"
import copy from "clipboard-copy"
import AlertDialog from "../../dialog/Alert"

export const PlatformTokenActionButtons = ({ platformId }) => {
  let [id, setId] = useState()
  let { isLoading, data, error, mutate } = useBrandToken(id)

  return (
    <Group>
      <Input
        value={data?.token}
        flex="1"
        readOnly
        isLoading={isLoading}
        css={css`
          & input {
            text-overflow: ellipsis;
          }
        `}
      />
      <Button
        isLoading={isLoading}
        disabled={isLoading}
        onClick={() => {
          if (!id) {
            setId(platformId)
          } else {
            mutate(null)
          }
        }}
      >
        Get Brand Token
      </Button>
      <Button
        disabled={!data?.token}
        onClick={() => {
          if (data?.token) {
            copy(data?.token)
          }
        }}
      >
        <Trans zh={`复制`} en={`Copy`} />
      </Button>
      {error && (
        <AlertDialog
          {...error}
          onClickClose={() => {
            mutate(null, false)
          }}
        />
      )}
    </Group>
  )
}
