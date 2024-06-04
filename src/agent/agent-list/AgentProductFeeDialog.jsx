import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import {
  Stack,
  Box,
  Text,
  Dialog,
  useModalState,
  Set,
  Icon,
  FieldStack
} from "bumbag"
import { Disclosure } from "../../dialog/Disclosure"
import AlertDialog from "../../dialog/Alert"
import { useIsDisplayMenuByRoute } from "../../user/context"
import { ProductFee } from "./menu"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import FormDialog from "../../form/FormDialog"
import { useAgentProductFee, useUpdateAgentProductFee } from "./client"
import clone from "clone-deep"
import { AgentUsernameTrans } from "../../trans/Agent"
import Label from "../../form/Label"
import { ProductFeeTrans, useProductFeeTrans } from "../../trans/Platform"
import { pick } from "ramda"
import { FieldValues } from "../../layout/Grid"
import { PercentageNumberInputField } from "../../input/NumberInput"
import {
  CardGameTrans,
  EGameTrans,
  LiveDealerTrans,
  LotteryTrans,
  SportsbookTrans,
  VirtualSportsTrans
} from "../../trans/Game"
import { CurrentCycleTrans, NextCycleTrans } from "../../trans/Field"
import { SWRConfig } from "swr"

export const AgentProductFeeDialogDisclosure = ({
  agent,
  id,
  dialogId = "agent-product-fee-dialog"
}) => {
  let dialog = useModalState()

  let auth = useIsDisplayMenuByRoute([ProductFee])
  if (!auth) {
    return null
  }

  id = id ?? (dialogId ? `${dialogId}-disclosure` : undefined)
  return (
    <>
      <Disclosure {...dialog}>
        <ProductFeeTrans />
      </Disclosure>
      {dialog.visible && (
        <SWRConfig value={{ provider: () => new Map() }}>
          <FetchDialog agent={agent} dialog={dialog} dialogId={dialogId} />
        </SWRConfig>
      )}
    </>
  )
}

const FetchDialog = ({ agent, dialog }) => {
  let { isLoading, data, error } = useAgentProductFee(agent.id)

  if (isLoading) {
    return <LoadingBackdrop {...dialog} />
  }

  if (error) {
    return <AlertDialog {...error} onClickClose={dialog.hide} />
  }

  return <EditDialog agent={agent} record={data} dialog={dialog} />
}

const EditDialog = ({ agent, record, dialog, dialogId }) => {
  let title = useProductFeeTrans()

  let [formData, setSubmit] = useState()
  let { isLoading, result, error, deleteCache } =
    useUpdateAgentProductFee(formData)

  const onSubmit = (data) => {
    setSubmit({
      ...data,
      agentId: agent.id
    })
  }

  const reset = () => {
    deleteCache()
    setSubmit(null)
  }

  return (
    <FormDialog
      defaultValues={clone(record)}
      onSubmit={onSubmit}
      isLoading={isLoading}
      result={result}
      error={error}
      onCloseErrorAlert={reset}
      dialog={dialog}
      title={title}
      id={dialogId}
    >
      <FieldValues>
        <Box
          css={css`
            font-weight: bold;
          `}
        >
          <AgentUsernameTrans />
        </Box>
        <Box>{agent.username}</Box>
      </FieldValues>
      <FieldStack>
        <Label>
          <LiveDealerTrans />
        </Label>
        <Set orientation="horizontal" isFilled>
          <PercentageNumberInputField
            name="currentLiveDealerPercentage"
            label={<CurrentCycleTrans />}
            required
            step="1"
            registerOptions={{
              valueAsNumber: true
            }}
            css={css`
              flex: 1;
            `}
          />
          <PercentageNumberInputField
            name="nextLiveDealerPercentage"
            label={<NextCycleTrans />}
            required
            step="1"
            registerOptions={{
              valueAsNumber: true
            }}
            css={css`
              flex: 1;
            `}
          />
        </Set>

        <Label>
          <SportsbookTrans />
        </Label>
        <Set orientation="horizontal">
          <PercentageNumberInputField
            name="currentSportsPercentage"
            label={<CurrentCycleTrans />}
            required
            step="1"
            registerOptions={{
              valueAsNumber: true
            }}
            css={css`
              flex: 1;
            `}
          />
          <PercentageNumberInputField
            name="nextSportsPercentage"
            label={<NextCycleTrans />}
            required
            step="1"
            registerOptions={{
              valueAsNumber: true
            }}
            css={css`
              flex: 1;
            `}
          />
        </Set>

        <Label>
          <EGameTrans />
        </Label>
        <Set orientation="horizontal">
          <PercentageNumberInputField
            name="currentSlotPercentage"
            label={<CurrentCycleTrans />}
            required
            step="1"
            registerOptions={{
              valueAsNumber: true
            }}
            css={css`
              flex: 1;
            `}
          />
          <PercentageNumberInputField
            name="nextSlotPercentage"
            label={<NextCycleTrans />}
            required
            step="1"
            registerOptions={{
              valueAsNumber: true
            }}
            css={css`
              flex: 1;
            `}
          />
        </Set>

        <Label>
          <CardGameTrans />
        </Label>
        <Set orientation="horizontal">
          <PercentageNumberInputField
            name="currentCardGamePercentage"
            label={<CurrentCycleTrans />}
            required
            step="1"
            registerOptions={{
              valueAsNumber: true
            }}
            css={css`
              flex: 1;
            `}
          />
          <PercentageNumberInputField
            name="nextCardGamePercentage"
            label={<NextCycleTrans />}
            required
            step="1"
            registerOptions={{
              valueAsNumber: true
            }}
            css={css`
              flex: 1;
            `}
          />
        </Set>

        <Label>
          <LotteryTrans />
        </Label>
        <Set orientation="horizontal">
          <PercentageNumberInputField
            name="currentLotteryPercentage"
            label={<CurrentCycleTrans />}
            required
            step="1"
            registerOptions={{
              valueAsNumber: true
            }}
            css={css`
              flex: 1;
            `}
          />
          <PercentageNumberInputField
            name="nextLotteryPercentage"
            label={<NextCycleTrans />}
            required
            step="1"
            registerOptions={{
              valueAsNumber: true
            }}
            css={css`
              flex: 1;
            `}
          />
        </Set>

        <Label>
          <VirtualSportsTrans />
        </Label>
        <Set orientation="horizontal">
          <PercentageNumberInputField
            name="currentVirtualSportsPercentage"
            label={<CurrentCycleTrans />}
            required
            step="1"
            registerOptions={{
              valueAsNumber: true
            }}
            css={css`
              flex: 1;
            `}
          />
          <PercentageNumberInputField
            name="nextVirtualSportsPercentage"
            label={<NextCycleTrans />}
            required
            step="1"
            registerOptions={{
              valueAsNumber: true
            }}
            css={css`
              flex: 1;
            `}
          />
        </Set>
      </FieldStack>
    </FormDialog>
  )
}
