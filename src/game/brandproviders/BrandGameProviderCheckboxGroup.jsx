import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  Table,
  Set,
  Heading,
  Text,
  useModalState,
  Icon,
  FieldStack,
  Box,
  Group,
  Button,
  Spinner
} from "bumbag"
import { useBrandGameProviderList } from "./client"
import { Trans, useTrans } from "../../i18n"
import Checkbox from "../../checkbox"
import { useFormContext, useWatch } from "react-hook-form"
import Input from "../../input/Input"
import { isAllPropChecked } from "../../checkbox/isAllChecked"
import { differenceWith } from "lodash-es"
import clone from "clone-deep"

export const BrandGameProviderCheckboxGroupTable = ({
  brandId,
  name = "gameProviders",
  gameType = undefined,
  disabled,
  ...props
}) => {
  let { control, watch, reset, getValues } = useFormContext()
  let { isLoading, data, error } = useBrandGameProviderList({
    brandId,
    showAll: true,
    sortby: "gameProviderName",
    gameType
  })

  let gameProviders = watch(name)
  let items = data?.items

  useEffect(() => {
    if (
      !isLoading &&
      gameProviders &&
      gameProviders.length > 0 &&
      items &&
      Number.isFinite(items.length)
    ) {
      let diffs = differenceWith(gameProviders, items, (a, b) => {
        return a.gameProviderId === b.gameProviderId
      })

      if (diffs.length) {
        gameProviders = clone(items).map((gameProvider) => ({
          ...clone(gameProvider),
          checked: false
        }))

        let defaultValue = clone(getValues())
        Reflect.set(defaultValue, name, gameProviders)
        reset(defaultValue)
      }
    }
  }, [brandId, gameType, isLoading])

  if (isLoading) {
    return <Spinner />
  }

  return (
    <Body
      name={name}
      gameProviders={gameProviders}
      items={data?.items}
      disabled={disabled}
    />
  )
}

const Body = ({ name, gameProviders, items = [], disabled, ...props }) => {
  let { control, setValue, watch } = useFormContext()

  let allChecked = isAllPropChecked(gameProviders)
  return (
    <Table id={`${name}-table`}>
      <Table.Head>
        <Table.Row>
          <Table.HeadCell textAlign="center">
            <Box>
              <Checkbox
                id={`all-${name}`}
                checked={allChecked}
                onChange={(event) => {
                  let checked = event.target.checked
                  items.forEach((field, index) => {
                    setValue(toCheckedFieldName(name, index), checked)
                  })
                }}
                disabled={disabled}
              />
            </Box>
          </Table.HeadCell>
          <Table.HeadCell textAlign="center" width="100%">
            <Trans zh="游戏厂商" en="Game Provider" />
          </Table.HeadCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {items.map((item, index) => (
          <Row
            key={index}
            name={name}
            gameProvider={item}
            index={index}
            disabled={disabled}
          />
        ))}
      </Table.Body>
    </Table>
  )
}

const Row = ({ name, gameProvider, index, disabled = false, ...props }) => {
  let gameProviderFieldName = `${name}.${index}`
  return (
    <Table.Row>
      <Table.Cell textAlign="center" width="fit-content">
        <Box>
          <Checkbox
            name={`${gameProviderFieldName}.checked`}
            disabled={disabled}
          />
          <Input
            type="hidden"
            name={`${gameProviderFieldName}.gameProviderId`}
            value={gameProvider.gameProviderId}
          />
        </Box>
      </Table.Cell>
      <Table.Cell textAlign="center">
        {gameProvider.gameProviderName}
      </Table.Cell>
    </Table.Row>
  )
}

const toGameProviderFieldName = (name, index) => `${name}.${index}`

const toCheckedFieldName = (name, index) => {
  let gameProviderFieldName = toGameProviderFieldName(name, index)
  return `${gameProviderFieldName}.checked`
}
