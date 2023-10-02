import { urlWith, useGet, usePostData, usePutData, useDelete } from "../client"
import {
  useSystemSetting,
  useSystemSettingValue
} from "../system-admin/setting/client"

export const useGameProviderCodeStylePairs = () =>
  useSystemSettingValue("GameProviderCodeStylePairs")
