import base from "@playwright/test"
import { loginUser, login } from "../auth.js"
import { host } from "../env.js"
import brandCertApi from "../../client/brandCertApi/index.js"
import operatorApi from "../../client/operatorApi/index.js"
import sboGameProviderApi from "../../client/gameProviderApi/sbo/index.js"
import backofficeApi from "../client/index.js"
import reportApi from "../../client/reportApi/index.js"
import reportAggregateApi from "../../client/reportAggregateApi/index.js"
import { AgentDividendType } from "../admin/agent-list-page.js"
import { use } from "chai"
import { faker } from "@faker-js/faker"

const Path = "./.playwright"
const AuthPath = `${Path}/admin-auth.json`
const AdminUsername = "admin.enabled"

export const loginAdminUser = async (browser, options = {}) =>
  login(
    {
      username: AdminUsername,
      password: "TgsP@ssw0rd",
      browser,
      storageStatePath: AuthPath
    },
    options
  )

export const Fixture = {
  adminUsername: AdminUsername,
  platformCode: "GPI",
  resellerCode: "TGS",
  licenseeCode: "TGS",
  host: host(),
  platformToken: async ({ platformCode }, use) => {
    let platformToken = await brandCertApi.platformToken(platformCode)
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
  //TODO: need?
  /*
  gameProviderCodeColorPairs: async ({ backofficeApi }, use) => {
    const key = "GameProviderCodeColorPairs"

    let settings = await backofficeApi.system.admin.setting.get(key)
    if (!settings) {
    }
  },
  */
  manualPaymentProvider: async ({ backofficeApi }, use) => {
    let manualPaymentProvider = await backofficeApi?.payment?.provider?.manual()
    use(manualPaymentProvider)
  },
  bankPaymentMethod: async ({ backofficeApi }, use) => {
    let paymentMethod = await backofficeApi?.payment?.method?.bank()
    use(paymentMethod)
  },
  customBankPaymentChannel: async ({ backofficeApi }, use) => {
    let channel = await backofficeApi.payment.channel.customBank()
    use(channel)
  },
  customBankManualPaymentMethodChannel: async (
    {
      backofficeApi,
      manualPaymentProvider,
      bankPaymentMethod,
      customBankPaymentChannel
    },
    use
  ) => {
    let paymentId = manualPaymentProvider.id
    let methodId = bankPaymentMethod.id
    let channelId = customBankPaymentChannel.id

    let pmc = await backofficeApi.payment.paymentMethodChannel.findOrCreate(
      paymentId,
      methodId,
      channelId
    )
    use(pmc)
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

    let platformPayment = await backofficeApi.platform.payment.findOrCreate({
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

    let platformPayment = await backofficeApi.platform.payment.findOrCreate({
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
  pulsaManualDepositPayment: async (
    { pulsaManualPaymentMethodChannel, platform, backofficeApi },
    use
  ) => {
    let paymentMethodChannelId = pulsaManualPaymentMethodChannel.id
    let brandId = platform.id

    let platformPayment = await backofficeApi.platform.payment.findOrCreate({
      brandId,
      transferType: backofficeApi.platform.payment.TransferType.Deposit,
      paymentMethodChannelId,
      extendedData: {
        phone: "000000"
      }
    })
    use(platformPayment)
  },
  pulsaManualWithdrawPayment: async (
    { pulsaManualPaymentMethodChannel, platform, backofficeApi },
    use
  ) => {
    let paymentMethodChannelId = pulsaManualPaymentMethodChannel.id
    let brandId = platform.id

    let platformPayment = await backofficeApi.platform.payment.findOrCreate({
      brandId,
      transferType: backofficeApi.platform.payment.TransferType.Withdrawal,
      paymentMethodChannelId
    })
    use(platformPayment)
  },
  operatorApi: async ({}, use) => {
    use(operatorApi)
  },
  brandCertApi: async ({}, use) => {
    use(brandCertApi)
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
    //TODO: able use login api without page?
    let adminUserInfo = await loginUser(page, adminUsername)
    use(adminUserInfo)
  },
  platform: async ({ platformCode, backofficeApi }, use) => {
    let platform = await backofficeApi.platform.findPlatform(platformCode)
    use(platform)
  },
  agentOneLayerPlatform: async ({ licensee, backofficeApi }, use) => {
    const PlatformCode = "AG-ONE-LAYER"
    let platform = await backofficeApi.platform.findPlatform(PlatformCode)
    if (!platform) {
      platform = await backofficeApi.platform.addPlatform({
        licenseeId: licensee.id,
        code: PlatformCode,
        agentDividendType: AgentDividendType.OneLayer
      })
    }
    use(platform)
  },
  agentMultipleLayerPlatform: async ({ licensee, backofficeApi }, use) => {
    const PlatformCode = "AG-MULTI-LAYER"
    let platform = await backofficeApi.platform.findPlatform(PlatformCode)
    if (!platform) {
      platform = await backofficeApi.platform.addPlatform({
        licenseeId: licensee.id,
        code: PlatformCode,
        agentDividendType: AgentDividendType.MultipleLayer
      })
      platform = await backofficeApi.platform.findPlatform(PlatformCode)
    }
    use(platform)
  },
  agentPlayerPlatform: async ({ licensee, backofficeApi }, use) => {
    const PlatformCode = "AG-PLAYER"
    let platform = await backofficeApi.platform.findPlatform(PlatformCode)
    if (!platform) {
      platform = await backofficeApi.platform.addPlatform({
        licenseeId: licensee.id,
        code: PlatformCode,
        enablePlayerAgent: true
      })
      platform = await backofficeApi.platform.findPlatform(PlatformCode)
    }
    use(platform)
  },
  allAgentPlatform: async ({ licensee, backofficeApi }, use) => {
    const PlatformCode = "ALL-AGENT"
    let platform = await backofficeApi.platform.findPlatform(PlatformCode)
    if (!platform) {
      platform = await backofficeApi.platform.addPlatform({
        licenseeId: licensee.id,
        code: PlatformCode
      })
      platform = await backofficeApi.platform.findPlatform(PlatformCode)
    }
    await backofficeApi.platform.allAgent.enable(platform.id)
    use(platform)
  },
  reviewPlayerIdPlatform: async ({ licensee, backofficeApi }, use) => {
    const PlatformCode = "REVIEW-PLAYER-ID"
    let platform = await backofficeApi.platform.findPlatform(PlatformCode)
    if (!platform) {
      platform = await backofficeApi.platform.addPlatform({
        licenseeId: licensee.id,
        code: PlatformCode,
        enablePlayerIdentity: true
      })
      platform = await backofficeApi.platform.findPlatform(PlatformCode)
    }
    use(platform)
  },
  vipPlatform: async ({ licensee, backofficeApi }, use) => {
    const PlatformCode = "VIP"
    let platform = await backofficeApi.platform.findPlatform(PlatformCode)

    if (!platform) {
      platform = await backofficeApi.platform.addPlatform({
        licenseeId: licensee.id,
        code: PlatformCode
      })
      platform = await backofficeApi.platform.findPlatform(PlatformCode)
    }

    let vipList = await backofficeApi.platform.vip.list(platform.id)
    if (vipList.length === 1) {
      let value = 10
      let result = await backofficeApi.platform.vip.add({
        brandId: platform.id,

        levelUpAccumulateBetAmount: value,
        levelUpAccumulateDeposit: value,

        birthBenefit: value,
        promotionBenefit: value,
        quarterlyBenefit: value,

        liveDealerRebate: value,
        slotRebate: value,
        cardGameRebate: value,
        sportsRebate: value,
        virtualSportsRebate: value,
        lotteryRebate: value
      })
    }

    use(platform)
  },
  autoClearWageringRequirementPlatform: async (
    {
      licensee,
      backofficeApi,
      brandCertApi,
      customBankManualPaymentMethodChannel
    },
    use
  ) => {
    const PlatformCode = "AUTO_CLEAR"
    let platform = await backofficeApi.platform.findPlatform(PlatformCode)

    if (!platform) {
      let AutoClearBucketAmount = 10
      platform = await backofficeApi.platform.addPlatform({
        licenseeId: licensee.id,
        code: PlatformCode,
        autoClearWageringRequirement: true,
        autoClearWageringRequirementBalance: AutoClearBucketAmount
      })
      platform = await backofficeApi.platform.findPlatform(PlatformCode)
    }

    //TODO: move to other fns?
    let [depositPayment, withdrawPayment] = await Promise.all([
      backofficeApi.platform.payment.findOrCreate({
        brandId: platform.id,
        transferType: backofficeApi.platform.payment.TransferType.Deposit,
        paymentMethodChannelId: customBankManualPaymentMethodChannel.id,
        extendedData: {
          name: faker.finance.accountName(),
          bankAccount: faker.finance.accountNumber()
        }
      }),
      backofficeApi.platform.payment.findOrCreate({
        brandId: platform.id,
        transferType: backofficeApi.platform.payment.TransferType.Withdrawal,
        paymentMethodChannelId: customBankManualPaymentMethodChannel.id
      })
    ])

    use(platform)
  },
  autoClearWageringRequirementPlatformDepositPayment: async (
    {
      autoClearWageringRequirementPlatform: platform,
      backofficeApi,
      customBankManualPaymentMethodChannel
    },
    use
  ) => {
    let depositPayment = await backofficeApi.platform.payment.findOrCreate({
      brandId: platform.id,
      transferType: backofficeApi.platform.payment.TransferType.Deposit,
      paymentMethodChannelId: customBankManualPaymentMethodChannel.id,
      extendedData: {
        name: faker.finance.accountName(),
        bankAccount: faker.finance.accountNumber()
      }
    })
    use(depositPayment)
  },
  licensee: async ({ licenseeCode, backofficeApi }, use) => {
    let licensee = await backofficeApi.licensee.findLicensee(licenseeCode)
    use(licensee)
  },
  reseller: async ({ resellerCode, backofficeApi }, use) => {
    let reseller = await backofficeApi.reseller.find(resellerCode)
    use(reseller)
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
          En: "Account First Deposit-Lifetime only",
          Zh: "帳號首充(可延用)"
        }
      },
      {
        Name: "AccountFirstDeposit",
        Trans: {
          En: "Account First Deposit-First deposit only",
          Zh: "帳號首充(不可延用) "
        }
      },
      {
        Name: "DailyFirstDeposit",
        SettlementIntervalType: "Instantly",
        Trans: {
          En: "Daily First Deposit",
          Zh: "每日首充"
        }
      },
      {
        Name: "DailySecondDeposit",
        SettlementIntervalType: "Instantly",
        Trans: {
          En: "Daily Re-Deposit",
          Zh: "每日再充"
        }
      },
      {
        Name: "DepositReward",
        Trans: {
          En: "Basic Deposit Bonus",
          Zh: "充就送"
        }
      }
    ],
    Trans: {
      En: "Deposit",
      Zh: "充值送",
      Vi: "Nạp tặng"
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
        }
      },
      {
        Name: "TurnoverRebateWeekly",
        SettlementIntervalType: "Weekly",
        Trans: {
          En: "Weekly Turnover Rebate",
          Zh: "每周流水反水"
        }
      }
    ],
    Trans: {
      En: "Turnover",
      Zh: "流水",
      vi: "Vòng cược"
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
        }
      },
      {
        Name: "ReliefMoneyWeekly",
        SettlementIntervalType: "Weekly",
        Trans: {
          En: "Weekly SOS",
          Zh: "每周救援金"
        }
      },
      {
        Name: "ReliefMoneyMonthly",
        SettlementIntervalType: "Monthly",
        Trans: {
          En: "Monthly SOS",
          Zh: "每月救援金"
        }
      }
    ],
    Trans: {
      En: "SOS",
      Zh: "救援金",
      Vi: "Quỹ cứu trợ"
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
        }
      }
    ],
    Trans: {
      En: "New User",
      Zh: "新用戶",
      Vi: "Người dùng mới"
    }
  },
  {
    Name: "Lottery",
    Types: [
      {
        Name: "DepositAccumulateRoulette",
        Trans: {
          En: "Deposit-Lotttory",
          Zh: "充值抽獎"
        }
      }
    ],
    Trans: {
      En: "Lottery",
      Zh: "抽獎",
      Vi: "Bốc thăm"
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
      Zh: "基本活動",
      Vi: "Hoạt động cơ bản"
    }
  },
  {
    Name: "Offline",
    Types: [
      {
        Name: "OfflineLoginReward",
        Trans: {
          En: "Login Reward",
          Zh: "登入送"
        }
      },
      {
        Name: "OfflineDepositReward",
        Trans: {
          En: "Deposit Reward",
          Zh: "存款送"
        }
      }
    ],
    Trans: {
      En: "Offline",
      Zh: "線下活動",
      Vi: "Hoạt động dưới tuyến"
    }
  }
])
