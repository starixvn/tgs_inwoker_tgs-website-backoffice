import React, { createContext, useContext, useState } from "react"
import { Text, DropdownMenu, Button } from "bumbag"
import numeral from "numeral"
import { registerLocale, setDefaultLocale } from "react-datepicker"
import { enUS, zhCN } from "date-fns/locale"
import {
  formatDateTime,
  formatHourMinuteSecondDayMonthYear,
  HourMinuteSecondDayMonthYear
} from "./date/format"

registerLocale("en", enUS)
registerLocale("zh", zhCN)

const DefaultDateFormat = "yyyy/MM/dd"
const DefaultTimeFormat = "HH:mm:ss"

export const Locales = {
  en: "en",
  zh: "zh"
  /*
  vi: "vi"
  */
}

const defaultLocale = Locales.zh

const Store = createContext()

const Key = "lang"
//1. lang from localStorage
//2. lang from navigator.language
export const getAcceptLang = () => {
  let lang
  try {
    lang = localStorage.getItem(Key)
    if (lang) {
      return lang
    }
  } catch (error) {
    //ignore
  }

  lang = Object.values(Locales).reduce((result, lang) => {
    if (result) {
      return result
    }

    if (navigator.language.startsWith(lang)) {
      return lang
    }
  }, lang)

  return lang ?? Locales.en
}

export const getAcceptLangCulture = () => {
  let lang = getAcceptLang()
  switch (lang) {
    case Locales.zh:
      return "zh-CN"
    default:
      return "en-US"
  }
}

export const Provider = ({ value = getAcceptLang(), children }) => {
  let [locale, set] = useState(value)
  setDefaultLocale(locale)

  const setLocale = (locale) => {
    set(locale)
    setDefaultLocale(locale)
    try {
      localStorage.setItem(Key, locale)
    } catch (error) {
      //ignore
    }
  }

  return (
    <Store.Provider value={{ locale, setLocale }}>{children}</Store.Provider>
  )
}

export const useLocale = () => {
  let { locale } = useContext(Store) ?? {}
  return locale ?? defaultLocale
}

export const useEnglish = () => {
  let { setLocale } = useContext(Store)
  return () => setLocale(Locales.en)
}

export const useChinese = () => {
  let { setLocale } = useContext(Store)
  return () => setLocale(Locales.zh)
}

/*
export const useVietnamese = () => {
  let { setLocale } = useContext(Store)
  return () => setLocale(Locales.vi)
}
*/

export const useLangCode = () => {
  let enUS = "en-US"
  let Default = enUS
  let { locale } = useContext(Store) ?? {}
  switch (locale) {
    case Locales.en:
      return enUS
    case Locales.zh:
      return "zh-CN"
    // case Locales.vi:
    //   return "vi-VN"
  }
  return Default
}

export const useTrans = (messages = {}) => {
  let Default = Locales.en
  let locale = useLocale()
  return messages[locale] ?? messages[Default] ?? ""
}

export const Trans = ({ en = "", zh = "", vi = "", ...props }) => {
  let locale = useLocale()
  switch (locale) {
    case Locales.en:
      return <span {...props}>{en || ""}</span>
    // case Locales.vi:
    //   return <span {...props}>{vi || en || ""}</span>
    default:
      return <span {...props}>{zh || en || ""}</span>
  }
}

export const FormattedDate = ({
  format = DefaultDateFormat,
  value,
  placeholder = ""
}) => {
  let formatted = formatDateTime(format, value)
  return <Text>{formatted ? formatted : placeholder}</Text>
}

export const FormattedDateTime = ({
  dateFormat = DefaultDateFormat,
  timeFormat = DefaultTimeFormat,
  value,
  placeholder = ""
}) => {
  let format = `${dateFormat} ${timeFormat}`
  let formatted = formatDateTime(format, value)
  return <Text>{formatted ? formatted : placeholder}</Text>
}

export const FormatHourMinuteSecondDayMonthYear = ({
  value,
  placeholder = ""
}) => {
  let formatted = formatHourMinuteSecondDayMonthYear(value)
  return formatted ? formatted : placeholder
}

let MaxDigits = 20
export const FormattedNumber = ({
  value,
  digits,
  format = "0,0",
  postfix = "",
  placeholder = "",
  ...props
}) => {
  if (!Number.isFinite(value)) {
    return placeholder
  }

  if (Number.isInteger(digits) && digits >= 0 && digits <= MaxDigits) {
    value = value.toFixed(digits + 1).slice(0, -1)
  }
  return (
    <span {...props}>
      {numeral(value).format(format)}
      {postfix}
    </span>
  )
}

export const FormattedNumberDecimal = ({
  value,
  digits = 2,
  format = "0,0.00",
  prefix = "",
  postfix = "",
  placeholder = "",
  ...props
}) => {
  if (!Number.isFinite(value)) {
    return placeholder
  }

  if (Number.isInteger(digits) && digits >= 0 && digits <= MaxDigits) {
    value = value.toFixed(digits + 1).slice(0, -1)
  }
  return (
    <Text {...props}>
      {prefix}
      {numeral(value).format(format)}
      {postfix}
    </Text>
  )
}

export const FormattedNumberDecimalPercentage = ({
  postfix = "%",
  ...props
}) => <FormattedNumberDecimal postfix={postfix} {...props} />

export const getTrans = (messages = {}, locale = Locales.zh) =>
  Reflect.get(messages, locale) ?? Reflect.get(messages, Locales.en) ?? ""

export const LangDropdownMenu = ({ ...props }) => {
  let locale = useLocale()
  let chinese = "中文"
  let english = "English"
  let vietnamese = "Tiếng Việt" //"Vietnamese"

  let useEn = useEnglish()
  let useZh = useChinese()
  // let useVi = useVietnamese()

  return (
    <DropdownMenu
      menu={
        <>
          <DropdownMenu.Item onClick={useZh}>{chinese}</DropdownMenu.Item>
          <DropdownMenu.Item onClick={useEn}>{english}</DropdownMenu.Item>
          {/* <DropdownMenu.Item onClick={useVi}>{vietnamese}</DropdownMenu.Item> */}
        </>
      }
    >
      <Button variant="ghost" iconAfter="chevron-down">
        {locale === Locales.zh && chinese}
        {locale === Locales.en && english}
        {/* {locale === Locales.vi && vietnamese} */}
      </Button>
    </DropdownMenu>
  )
}
