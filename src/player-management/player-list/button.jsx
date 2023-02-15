import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Box, Dialog, useModalState } from "bumbag"
import { View as ViewMenu, Update as UpdateMenu, Contact } from "./menu"
import { useIsDisplayMenuByRoute } from "../../user/context"
import {
  Tab as PlayerTab,
  Panel as PlayerPanel,
  EditPanel as PlayerEditTab,
  Key as PlayerId
} from "./player"
import {
  Tab as ContractTab,
  Panel as ContractPanel,
  EditPanel as ContractEditPanel
} from "./contact"
import { Tab as BankTab, Panel as BankPanel } from "./bank"
import { Tab as BettingTab, Panel as BettingPanel } from "./betting"
import { PlayerOperationTab, PlayerOperationPanel } from "./PlayerOperation"
import { Tab as PasswordTab, Panel as PasswordPanel } from "./password"
import LoadingBackdrop from "../../dialog/LoadingBackdrop"
import AlertDialog from "../../dialog/Alert"
import { usePlayer, usePlayerBucketAmount, usePlayerPayment } from "./client"
import {
  Trans,
  FormattedDateTime,
  FormattedNumber,
  useTrans,
  FormattedNumberDecimal
} from "../../i18n"
import Disclosure from "../../dialog/Disclosure"
import { Tabs, TabList, useTabState } from "../../tab"
import {
  PlayerBalanceChangePanel,
  PlayerBalanceChangeTab
} from "./PlayerBalanceChange"
import { PlayerPromotionPanel, PlayerPromotionTab } from "./PlayerPromotion.jsx"
import { Features, isDev, isFeatureEnabled } from "../../env"
import textColumn from "../../table/column/textColumn"
import {
  PlayerVipChangeListPanel,
  PlayerVipChangeListTab
} from "./PlayerVipChangeList"

export const ViewButton = ({
  player,
  brandId,
  showParentUsername,
  ...props
}) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([ViewMenu])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog} {...props}>
        <Trans zh="查看" en="View" />
      </Disclosure>
      {dialog.visible && (
        <TabsDialog
          id="view-player-dialog"
          playerCode={player.playerCode}
          brandId={brandId}
          dialog={dialog}
          showParentUsername={showParentUsername}
        />
      )}
    </>
  )
}

export const EditButton = ({
  brandId,
  player,
  showParentUsername,
  onSubmitted,
  ...props
}) => {
  let dialog = useModalState()

  let isDisplay = useIsDisplayMenuByRoute([UpdateMenu])
  if (!isDisplay) {
    return null
  }

  return (
    <>
      <Disclosure {...dialog} {...props}>
        <Trans zh="修改" en="Edit" />
      </Disclosure>
      {dialog.visible && (
        <TabsDialog
          id="edit-player-dialog"
          edit={true}
          brandId={brandId}
          playerCode={player.playerCode}
          showParentUsername={showParentUsername}
          onSubmitted={onSubmitted}
          dialog={dialog}
        />
      )}
    </>
  )
}

const TabsDialog = ({
  playerCode,
  brandId,
  edit = false,
  dialog,
  onSubmitted,
  showParentUsername,
  ...props
}) => {
  const readonly = !edit
  let tab = useTabState({
    selectedId: PlayerId
  })

  let title = useTrans({
    zh: "玩家详情",
    en: "Player info"
  })

  const {
    data,
    isLoading: isLoadingPlayer,
    error: playerError,
    mutate
  } = usePlayer(playerCode)

  const {
    data: wageringRequirement,
    isLoading: isLoadingWageringRequirement,
    error: wageringRequirementError
  } = usePlayerBucketAmount(playerCode)

  let {
    data: playerPayment,
    isLoading: isLoadingPlayerPayment,
    error: playerPaymentError
  } = usePlayerPayment(playerCode)

  let isLoading =
    isLoadingPlayer ||
    isLoadingWageringRequirement /* || isLoadingPlayerPayment */
  let error =
    playerError || wageringRequirementError /* || playerPaymentError */
  let player = { ...data, wageringRequirement, playerPayment }

  const onBankSubmitted = () => {
    mutate()
  }

  const onClickClose = dialog.hide

  return (
    <>
      {isLoading && <LoadingBackdrop {...dialog} />}
      {error && <AlertDialog {...error} onClickClose={onClickClose} />}
      {data && (
        <Dialog.Modal
          title={title}
          hideOnClickOutside={false}
          showCloseButton={true}
          placement="top"
          {...dialog}
          {...props}
          css={css`
            min-width: 80vw;
            min-height: 85vh;

            & .bb-DialogContent {
              min-height: 85vh;
            }
          `}
        >
          {readonly && (
            <ViewTabs
              playerCode={playerCode}
              brandId={brandId}
              player={player}
              showParentUsername={showParentUsername}
              tab={tab}
            />
          )}
          {edit && (
            <EditTabs
              playerCode={playerCode}
              brandId={brandId}
              player={player}
              showParentUsername={showParentUsername}
              tab={tab}
              onSubmitted={() => {
                onSubmitted?.()
                dialog.hide()
                mutate()
              }}
              onBankSubmitted={onBankSubmitted}
              onClickClose={onClickClose}
            />
          )}
        </Dialog.Modal>
      )}
    </>
  )
}

const ViewTabs = ({ playerCode, brandId, showParentUsername, player, tab }) => {
  let contactAuth = useIsDisplayMenuByRoute([Contact])
  return (
    <Tabs isFitted>
      <TabList use={TabList} {...tab}>
        <PlayerTab {...tab} />
        {contactAuth && <ContractTab {...tab} />}
        <BankTab {...tab} />
        <BettingTab {...tab} />
        <PlayerOperationTab {...tab} />
        <PlayerBalanceChangeTab {...tab} />
        <PlayerPromotionTab {...tab} />
        <PlayerVipChangeListTab {...tab} />
      </TabList>
      <PlayerPanel
        player={player}
        showParentUsername={showParentUsername}
        {...tab}
      />
      {contactAuth && <ContractPanel player={player} {...tab} />}
      <BankPanel banks={player.banks} {...tab} />
      <BettingPanel
        playerCode={playerCode}
        player={player}
        brandId={brandId}
        {...tab}
      />
      <PlayerOperationPanel playerCode={playerCode} {...tab} />
      <PlayerBalanceChangePanel
        playerCode={playerCode}
        brandId={brandId}
        {...tab}
      />
      <PlayerPromotionPanel
        playerCode={playerCode}
        brandId={brandId}
        {...tab}
      />
      <PlayerVipChangeListPanel
        playerCode={playerCode}
        brandId={brandId}
        {...tab}
      />
    </Tabs>
  )
}

const EditTabs = ({
  brandId,
  playerCode,
  player,
  showParentUsername,
  tab,
  onSubmitted,
  onBankSubmitted,
  onClickClose
}) => {
  let contactAuth = useIsDisplayMenuByRoute([Contact])
  return (
    <Tabs isFitted>
      <TabList use={TabList} {...tab}>
        <PlayerTab {...tab} />
        {contactAuth && <ContractTab {...tab} />}
        <BankTab {...tab} />
        <PasswordTab {...tab} />
      </TabList>
      <PlayerEditTab
        player={player}
        showParentUsername={showParentUsername}
        brandId={brandId}
        playerCode={playerCode}
        onSubmitted={onSubmitted}
        onClickClose={onClickClose}
        {...tab}
      />
      {contactAuth && (
        <ContractEditPanel
          player={player}
          playerCode={playerCode}
          onSubmitted={onSubmitted}
          onClickClose={onClickClose}
          {...tab}
        />
      )}
      <BankPanel
        brandId={brandId}
        playerCode={playerCode}
        banks={player.banks}
        edit={true}
        onSubmitted={onBankSubmitted}
        {...tab}
      />
      <PasswordPanel
        playerCode={playerCode}
        onSubmitted={onSubmitted}
        onClickClose={onClickClose}
        {...tab}
      />
    </Tabs>
  )
}
