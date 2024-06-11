import React, { useState, useEffect, useMemo, useRef } from "react"
import { css, Global } from "@emotion/react"
import { Locales, Trans, useLocale, useTrans } from "../i18n"
import { Select, SelectField } from "../select/Select"
import { useGameTypeGroupList } from "./client"
import { mapOmit } from "../list/map"
import {
  useGameTypeTrans,
  LiveDealer as LiveDealerTrans,
  Sportsbook as SportsbookTrans,
  EGame as EGameTrans,
  ESports as ESportsTrans,
  VirtualSports as VirtualSportsTrans,
  Slot as SlotTrans,
  CardGame as CardGameTrans,
  Lottery as LotteryTrans,
  Fishing as FishingTrans,
  Arcade as ArcadeTrans,
  TableGame as TableGameTrans
} from "../trans/Game"

const Sportsbook = "Sportsbook"
const SportsbookValue = 1

const VirtualSports = "VirtualSports"
const VirtualSportsValue = 2

const VirtualSportsLobby = "VirtualSportsLobby"
const VirtualSportsLobbyValue = 3
const VirtualSportsLobbyTrans = {
  zh: "虚拟体育大厅",
  en: "Virtual Sports Lobby"
}

const ESports = "ESports"
const ESportsValue = 4

const LiveDealer = "LiveDealer"
const LiveDealerValue = 5

const LiveDealerLobby = "LiveDealerLobby"
const LiveDealerLobbyValue = 6
const LiveDealerLobbyTrans = {
  zh: "真人大厅",
  en: "Live Dealer Lobby"
}

const CardGame = "CardGame"
const CardGameValue = 7

const CardGameLobby = "CardGameLobby"
const CardGameLobbyValue = 8
const CardGameLobbyTrans = {
  zh: "棋牌大厅",
  en: "Card Game Lobby"
}

const Fishing = "Fishing"
const FishingValue = 9

const FishingLobby = "FishingLobby"
const FishingLobbyValue = 10
const FishingLobbyTrans = {
  zh: "捕鱼大厅",
  en: "Fishing Lobby"
}

const Arcade = "Arcade"
const ArcadeValue = 11

const ArcadeLobby = "ArcadeLobby"
const ArcadeLobbyValue = 12
const ArcadeLobbyTrans = {
  zh: "街机大厅",
  en: "Arcade Game Lobby"
}

const Slot = "Slot"
const SlotValue = 15

const Lottery = "Lottery"
const LotteryValue = 13

const LotteryLobby = "LotteryLobby"
const LotteryLobbyValue = 14
const LotteryLobbyTrans = {
  zh: "彩票大厅",
  en: "Lottery Lobby"
}

const TableGame = "TableGame"
const TableGameValue = 16

export const toGameTypeString = (value) => {
  switch (value) {
    case SportsbookValue:
      return Sportsbook
    case VirtualSportsValue:
      return VirtualSports
    case VirtualSportsLobbyValue:
      return VirtualSportsLobby
    case ESportsValue:
      return ESports
    case LiveDealerValue:
      return LiveDealer
    case LiveDealerLobbyValue:
      return LiveDealerLobby
    case CardGameValue:
      return CardGame
    case CardGameLobbyValue:
      return CardGameLobby
    case FishingValue:
      return Fishing
    case FishingLobbyValue:
      return FishingLobby
    case ArcadeValue:
      return Arcade
    case ArcadeLobbyValue:
      return ArcadeLobby
    case LotteryValue:
      return Lottery
    case LotteryLobbyValue:
      return LotteryLobby
    case SlotValue:
      return Slot
    case TableGameValue:
      return TableGame
    default:
      return value
  }
}

export const toGameTypeValue = (value) => {
  switch (value) {
    case Sportsbook:
      return SportsbookValue
    case VirtualSports:
      return VirtualSportsValue
    case VirtualSportsLobby:
      return VirtualSportsLobbyValue
    case ESports:
      return ESportsValue
    case LiveDealer:
      return LiveDealerValue
    case LiveDealerLobby:
      return LiveDealerLobbyValue
    case CardGame:
      return CardGameValue
    case CardGameLobby:
      return CardGameLobbyValue
    case Fishing:
      return FishingValue
    case FishingLobby:
      return FishingLobbyValue
    case Arcade:
      return ArcadeValue
    case ArcadeLobby:
      return ArcadeLobbyValue
    case Lottery:
      return LotteryValue
    case LotteryLobby:
      return LotteryLobbyValue
    case Slot:
      return SlotValue
    case TableGame:
      return TableGameValue
    default:
      return value
  }
}

export const GameType = {
  Sportsbook,
  VirtualSports,
  VirtualSportsLobby,
  ESports,
  LiveDealer,
  LiveDealerLobby,
  CardGame,
  CardGameLobby,
  Fishing,
  FishingLobby,
  Arcade,
  ArcadeLobby,
  Lottery,
  LotteryLobby,
  Slot,
  TableGame
}

export const SportGameTypes = [
  Sportsbook,
  VirtualSports,
  VirtualSportsLobby,
  ESports
]

export const isSportGameType = (value = "") => SportGameTypes.includes(value)

const LobbyGameTypes = [
  VirtualSportsLobby,
  LiveDealerLobby,
  CardGameLobby,
  FishingLobby,
  ArcadeLobby,
  LotteryLobby
]
export const isLobbyGameType = (value = "") => LobbyGameTypes.includes(value)

export const notLobbyGameType = (value = "") => !isLobbyGameType(value)

const LiveDealerGroupTrans = LiveDealerTrans

const SportsGroupTrans = SportsbookTrans

const EGameGroupTrans = EGameTrans

const CardGameGroupTrans = CardGameTrans

const VirtualSportsGroupTrans = VirtualSportsTrans

const LotteryGroupTrans = LotteryTrans

const AllTrans = [
  {
    name: "LiveDealer",
    trans: LiveDealerGroupTrans,
    items: [
      {
        name: LiveDealer,
        trans: LiveDealerTrans
      },
      {
        name: LiveDealerLobby,
        trans: LiveDealerLobbyTrans
      }
    ]
  },
  {
    name: "Sports",
    trans: SportsGroupTrans,
    items: [
      {
        name: Sportsbook,
        trans: SportsbookTrans
      },
      {
        name: ESports,
        trans: ESportsTrans
      }
    ]
  },
  {
    name: "EGame",
    trans: EGameGroupTrans,
    items: [
      {
        name: Slot,
        trans: SlotTrans
      },
      {
        name: Fishing,
        trans: FishingTrans
      },
      {
        name: FishingLobby,
        trans: FishingLobbyTrans
      },
      {
        name: Arcade,
        trans: ArcadeTrans
      },
      {
        name: ArcadeLobby,
        trans: ArcadeLobbyTrans
      },
      {
        name: TableGame,
        trans: TableGameTrans
      }
    ]
  },
  {
    name: "CardGame",
    trans: CardGameGroupTrans,
    items: [
      {
        name: CardGame,
        trans: CardGameTrans
      },
      {
        name: CardGameLobby,
        trans: CardGameLobbyTrans
      }
    ]
  },
  {
    name: "VirtualSports",
    trans: VirtualSportsGroupTrans,
    items: [
      {
        name: VirtualSports,
        trans: VirtualSportsTrans
      },
      {
        name: VirtualSportsLobby,
        trans: VirtualSportsLobbyTrans
      }
    ]
  },
  {
    name: "Lottery",
    trans: LotteryGroupTrans,
    items: [
      {
        name: Lottery,
        trans: LotteryTrans
      },
      {
        name: LotteryLobby,
        trans: LotteryLobbyTrans
      }
    ]
  }
]

const findTrans = (name, list = AllTrans) => {
  return list.reduce((result, group) => {
    if (result) {
      return result
    }

    if (group.name === name) {
      return group.trans
    }

    if (group.items) {
      return findTrans(name, group.items)
    }
  }, undefined)
}

const findGroup = (name, list = AllTrans) =>
  mapOmit(["items"], list).find((item) => item.name === name)

const findGroupTrans = (name) => findGroup(name)?.trans

export const useGameTypeGroupLabelOf = (gameType = "") => {
  let locale = useLocale()
  let { isLoading, data: groups, error } = useGameTypeGroupList()
  if (isLoading) {
    return ""
  }

  let group = groups?.reduce((result, group) => {
    if (result) {
      return result
    }

    if (group?.items?.includes(gameType)) {
      return group
    }
  }, undefined)

  let trans = findGroupTrans(group?.name)
  return trans?.[locale] ?? group?.name ?? ""
}

export const useGameTypeGroupValueOf = (gameType = "") => {
  let { isLoading, data: groups, error } = useGameTypeGroupList()
  if (isLoading) {
    return ""
  }

  let group = groups?.reduce((result, group) => {
    if (result) {
      return result
    }

    if (group?.items?.includes(gameType)) {
      return group
    }
  }, undefined)

  return group?.name ?? ""
}

export const GameTypeGroupSelect = ({ placeholder, ...props }) => {
  let defaultPlaceholder = useGameTypeTrans()
  placeholder = placeholder ?? defaultPlaceholder

  let locale = useLocale()
  let { isLoading, data: groups } = useGameTypeGroupList()

  let options = groups.map(({ name, ...group }) => {
    let trans = findGroupTrans(name)
    return {
      label: trans?.[locale] ?? name,
      value: name
    }
  })

  return (
    <Select
      placeholder={placeholder}
      isLoading={isLoading}
      options={options}
      {...props}
    />
  )
}

export const GameTypeLabel = ({ value }) => {
  let locale = useLocale()

  return findTrans(value)?.[locale] ?? value ?? ""
}

export const GameTypeSelect = ({ placeholder, group, ...props }) => {
  let defaultPlaceholder = useGameTypeTrans()
  placeholder = placeholder ?? defaultPlaceholder

  let locale = useLocale()
  let { isLoading, data: groups, error } = useGameTypeGroupList()

  let options = groups
    ?.filter(({ name }) => {
      if (group) {
        return group === name
      }
      return true
    })
    .reduce((list, { items, ...group }) => {
      let groupItems = findGroup(group.name)?.items ?? []

      let options = items
        .filter((name) => {
          return !name.toLowerCase().endsWith("lobby")
        })
        .map((name) => {
          let trans = findTrans(name, groupItems)
          return {
            label: trans?.[locale],
            value: name
          }
        })

      return [...list, ...options]
    }, [])

  return (
    <Select
      placeholder={placeholder}
      isLoading={isLoading}
      options={options}
      {...props}
    />
  )
}

export const GameTypeSelectField = ({
  placeholder,
  group,
  /*dropLobbyGame = false,*/ ...props
}) => {
  let defaultPlaceholder = useGameTypeTrans()
  placeholder = placeholder ?? defaultPlaceholder

  let locale = useLocale()
  let { isLoading, data: groups, error } = useGameTypeGroupList()

  let options = groups
    ?.filter(({ name }) => {
      if (group) {
        return group === name
      }
      return true
    })
    .reduce((list, { items, ...group }) => {
      let groupItems = findGroup(group.name)?.items ?? []

      let options = items.map((name) => {
        let trans = findTrans(name, groupItems)
        return {
          label: trans?.[locale],
          value: name
        }
      })

      return [...list, ...options]
    }, [])

  return (
    <SelectField
      placeholder={placeholder}
      isLoading={isLoading}
      options={options}
      {...props}
    />
  )
}

// Game Type List include Lobby Type
export const AllGameTypeSelect = ({ placeholder, group, ...props }) => {
  let defaultPlaceholder = useGameTypeTrans()
  placeholder = placeholder ?? defaultPlaceholder

  let locale = useLocale()
  let { isLoading, data: groups, error } = useGameTypeGroupList()

  let options = groups
    ?.filter(({ name }) => {
      if (group) {
        return group === name
      }
      return true
    })
    .reduce((list, { items, ...group }) => {
      let groupItems = findGroup(group.name)?.items ?? []

      let options = items.map((name) => {
        let trans = findTrans(name, groupItems)
        return {
          label: trans?.[locale],
          value: name
        }
      })

      return [...list, ...options]
    }, [])

  return (
    <Select
      placeholder={placeholder}
      isLoading={isLoading}
      options={options}
      {...props}
    />
  )
}

export default GameType
