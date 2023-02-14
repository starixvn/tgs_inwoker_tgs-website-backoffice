import base from "@playwright/test"
import { loginUser, login } from "../auth.js"
import { host } from "../env.js"
import globalApi from "../../client/globalApi/index.js"
import operatorApi from "../../client/operatorApi/index.js"
import sboGameProviderApi from "../../client/gameProviderApi/sbo/index.js"
import backofficeApi from "../client/index.js"
import reportApi from "../../client/reportApi/index.js"
import reportAggregateApi from "../../client/reportAggregateApi/index.js"
import { use } from "chai"

const Path = "./.playwright"
const AuthPath = `${Path}/admin-auth.json`
const AdminUsername = "admin.enabled"

export const loginAdminUser = async (browser) =>
  login({
    username: AdminUsername,
    password: "TgsP@ssw0rd",
    browser,
    storageStatePath: AuthPath
  })

export const Fixture = {
  adminUsername: AdminUsername,
  platformCode: "GPI",
  resellerCode: "TGS",
  licenseeCode: "TGS",
  host: host(),
  platformToken: async ({ platformCode }, use) => {
    let platformToken = await globalApi.platformToken(platformCode)
    use(platformToken)
  },
  player: async ({ platformToken }, use) => {
    let player = await operatorApi.player.createAndLogin(platformToken)
    use(player)
  },
  context: async ({ browser, host }, use) => {
    let context = await browser.newContext({
      storageState: AuthPath,
      baseURL: host
    })
    use(context)
  },
  backofficeApi: async ({ context, host }, use) => {
    backofficeApi.init({
      fetcher: context.request,
      host
    })

    use(backofficeApi)
  },
  promotionSetting: async ({ backofficeApi }, use) => {
    const key = "PromotionTypes"

    let promotionSettings = await backofficeApi.system.admin.setting.get(key)
    if (!promotionSettings) {
      await backofficeApi.system.admin.setting.add({
        key,
        value: PromotionSettingsString
      })
      promotionSettings = await backofficeApi.system.admin.setting.get(key)
    }

    use(promotionSettings)
  },
  manualPaymentProvider: async ({ backofficeApi }, use) => {
    let manualPaymentProvider = await backofficeApi?.payment?.provider?.manual()
    use(manualPaymentProvider)
  },
  eWalletPaymentMethod: async ({ backofficeApi }, use) => {
    let paymentMethod = await backofficeApi?.payment?.method?.eWallet()
    use(paymentMethod)
  },
  eWalletPaymentChannel: async ({ backofficeApi }, use) => {
    let channel = await backofficeApi.payment.channel.eWallet()
    use(channel)
  },
  eWalletManualPaymentMethodChannel: async (
    {
      backofficeApi,
      manualPaymentProvider,
      eWalletPaymentMethod,
      eWalletPaymentChannel
    },
    use
  ) => {
    let paymentId = manualPaymentProvider.id
    let methodId = eWalletPaymentMethod.id
    let channelId = eWalletPaymentChannel.id

    let pmc = await backofficeApi.payment.paymentMethodChannel.findOrCreate(
      paymentId,
      methodId,
      channelId
    )
    use(pmc)
  },
  eWalletManualDepositPayment: async (
    { eWalletManualPaymentMethodChannel, platform, backofficeApi },
    use
  ) => {
    let paymentMethodChannelId = eWalletManualPaymentMethodChannel.id
    let brandId = platform.id

    let platformPayment = await backofficeApi.platform.payment.create({
      brandId,
      transferType: backofficeApi.platform.payment.TransferType.Deposit,
      paymentMethodChannelId,
      extendedData: {
        phone: "000000",
        eMoneyName: "platformEMoneyName"
      }
    })
    use(platformPayment)
  },
  eWalletManualWithdrawPayment: async (
    { eWalletManualPaymentMethodChannel, platform, backofficeApi },
    use
  ) => {
    let paymentMethodChannelId = eWalletManualPaymentMethodChannel.id
    let brandId = platform.id

    let platformPayment = await backofficeApi.platform.payment.create({
      brandId,
      transferType: backofficeApi.platform.payment.TransferType.Withdrawal,
      paymentMethodChannelId
    })
    use(platformPayment)
  },
  pulsaPaymentMethod: async ({ backofficeApi }, use) => {
    let paymentMethod = await backofficeApi?.payment?.method?.pulsa()
    use(paymentMethod)
  },
  pulsaPaymentChannel: async ({ backofficeApi }, use) => {
    let channel = await backofficeApi.payment.channel.pulsa()
    use(channel)
  },
  pulsaManualPaymentMethodChannel: async (
    {
      backofficeApi,
      manualPaymentProvider,
      pulsaPaymentMethod,
      pulsaPaymentChannel
    },
    use
  ) => {
    let paymentId = manualPaymentProvider.id
    let methodId = pulsaPaymentMethod.id
    let channelId = pulsaPaymentChannel.id

    let pmc = await backofficeApi.payment.paymentMethodChannel.findOrCreate(
      paymentId,
      methodId,
      channelId
    )
    use(pmc)
  },
  operatorApi: async ({}, use) => {
    use(operatorApi)
  },
  globalApi: async ({}, use) => {
    use(globalApi)
  },
  sboGameProviderApi: ({}, use) => {
    use(sboGameProviderApi)
  },
  sboGameProvider: async ({ backofficeApi, sboGameProviderApi }, use) => {
    let sboGameProvider = await backofficeApi.gameProvider.findByCode(
      sboGameProviderApi.code
    )
    use(sboGameProvider)
  },
  reportApi: ({}, use) => {
    use(reportApi)
  },
  reportAggregateApi: ({}, use) => {
    use(reportAggregateApi)
  },
  page: async ({ context }, use) => {
    let page = await context.newPage()
    use(page)
  },
  adminUser: async ({ page, adminUsername }, use) => {
    let adminUserInfo = await loginUser(page, adminUsername)
    use(adminUserInfo)
  },
  platform: async ({ platformCode, backofficeApi }, use) => {
    let platform = await backofficeApi.platform.findPlatform(platformCode)
    use(platform)
  },
  licensee: async ({ licenseeCode, backofficeApi }, use) => {
    let licensee = await backofficeApi.licensee.findLicensee(licenseeCode)
    use(licensee)
  },
  agent: async ({ platform }, use) => {
    let { id: brandId } = platform

    let agent = await backofficeApi.agent.addAgent({ brandId })
    use(agent)
  }
}

const PromotionSettingsString = JSON.stringify([
  {
    Name: "Deposit",
    Types: [
      {
        Name: "FirstDeposit",
        SettlementIntervalType: "Instantly",
        Trans: {
          En: "Account First Deposit",
          Zh: "帳號首充"
        },
        autoSentPlayerBonus: {
          checked: true,
          disabled: true
        }
      },
      {
        Name: "DailyFirstDeposit",
        SettlementIntervalType: "Instantly",
        Trans: {
          En: "Daily First Deposit",
          Zh: "每日首充"
        },
        autoSentPlayerBonus: {
          checked: true,
          disabled: true
        }
      },
      {
        Name: "DailySecondDeposit",
        SettlementIntervalType: "Instantly",
        Trans: {
          En: "Daily Re-Deposit",
          Zh: "每日再充"
        },
        autoSentPlayerBonus: {
          checked: true,
          disabled: true
        }
      },
      {
        Name: "DepositReward",
        Trans: {
          En: "Basic Deposit Bonus",
          Zh: "充就送"
        },
        unlimited: {
          checked: true,
          disabled: true
        },
        autoSentPlayerBonus: {
          checked: true,
          disabled: true
        }
      }
    ],
    Trans: {
      En: "Deposit",
      Zh: "充值送"
    }
  },
  {
    Name: "Turnover",
    Types: [
      {
        Name: "TurnoverRebate",
        SettlementIntervalType: "Daily",
        Trans: {
          En: "Daily Turnover Rebate",
          Zh: "每日流水返水"
        },
        autoSentPlayerBonus: {
          checked: true,
          disabled: true
        }
      },
      {
        Name: "TurnoverRebateWeekly",
        SettlementIntervalType: "Weekly",
        Trans: {
          En: "Weekly Turnover Rebate",
          Zh: "每周流水反水"
        },
        autoSentPlayerBonus: {
          checked: true,
          disabled: true
        }
      }
    ],
    Trans: {
      En: "Turnover",
      Zh: "流水"
    }
  },
  {
    Name: "ReliefMoney",
    Types: [
      {
        Name: "ReliefMoneyDaily",
        SettlementIntervalType: "Daily",
        Trans: {
          En: "Daily SOS",
          Zh: "每日救援金"
        },
        autoSentPlayerBonus: {
          checked: true,
          disabled: true
        }
      },
      {
        Name: "ReliefMoneyWeekly",
        SettlementIntervalType: "Weekly",
        Trans: {
          En: "Weekly SOS",
          Zh: "每周救援金"
        },
        autoSentPlayerBonus: {
          checked: true,
          disabled: true
        }
      },
      {
        Name: "ReliefMoneyMonthly",
        SettlementIntervalType: "Monthly",
        Trans: {
          En: "Monthly SOS",
          Zh: "每月救援金"
        },
        autoSentPlayerBonus: {
          checked: true,
          disabled: true
        }
      }
    ],
    Trans: {
      En: "SOS",
      Zh: "救援金"
    }
  },
  {
    Name: "NewUser",
    Types: [
      {
        Name: "Register",
        SettlementIntervalType: "Instantly",
        Trans: {
          En: "Register",
          Zh: "首次註冊"
        },
        autoSentPlayerBonus: {
          checked: true,
          disabled: true
        }
      }
    ],
    Trans: {
      En: "New User",
      Zh: "新用戶"
    }
  },
  {
    Name: "Dummy",
    Types: [
      {
        Name: "Dummy",
        Trans: {
          En: "Dummy",
          Zh: "基本活動"
        }
      }
    ],
    Trans: {
      En: "Dummy",
      Zh: "基本活動"
    }
  },
  {
    Name: "Offline",
    Types: [
      {
        Name: "LoginReward",
        Trans: {
          En: "Login Reward",
          Zh: "登入送"
        },
        vipLevels: {
          visible: false
        },
        totalFunds: {
          visible: false
        }
      }
    ],
    Trans: {
      En: "Offline",
      Zh: "線下活動"
    }
  }
])
