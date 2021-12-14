import fetcher from "./fetcher"
import faker from "faker"
import { operatorApi } from "./env"
import FormData from "form-data"
import { fileURLToPath } from "url"
import { createReadStream } from "fs-extra"

export const DefaultPassword = "TgsP@ssw0rd"

export const DefaultCurrencyCode = "CNY"


export const withdrawPaymentList = async (platformToken, token) => {
  let url = `${operatorApi()}/withdraw`
  let headers = {
    "Content-Type": "application/json",
    "brand-token": platformToken,
    Token: token
  }

  //{"data":[{"banktype":"Bank","channelid":"3e3cc1eb-1a4e-413f-926c-1ad48707bc66","channelname":"Manual_BankTransfer_Custom","channelcode":"CustomBank","extended":{},"id":"528730b6-b4f5-4b88-1398-08d98a24e67d","methodcode":"BankTransfer","methodid":"67252f3a-6826-45ce-8bbc-c53e2ca7cdcb","paymentcode":"Manual","paymentid":"30cb4d17-2506-4d72-8470-65063b80f9c9","transferlimit":{"from":10.000000,"to":100000.000000},"displayorder":0},{"banktype":"Bank","channelid":"3e3cc1eb-1a4e-413f-926c-1ad48707bc66","channelname":"PrimePay_BankTransfer_Custom","channelcode":"CustomBank","extended":{},"id":"6d879310-f198-49b2-139e-08d98a24e67d","methodcode":"BankTransfer","methodid":"67252f3a-6826-45ce-8bbc-c53e2ca7cdcb","paymentcode":"PrimePay","paymentid":"e7d2533b-7319-4113-b1a1-7072cb6bb8d3","transferlimit":{"from":10.000000,"to":100000.000000},"displayorder":0},{"banktype":"Crypto","channelid":"b90029f9-f0c6-4e77-9031-0c554028f9ba","channelname":"LeePay_Crypto_ETHEREUM","channelcode":"ETHEREUM","extended":{},"id":"a4c87f17-2e98-4a19-139a-08d98a24e67d","methodcode":"Crypto","methodid":"798d21c6-9cf5-4fc0-bd09-8d67d2c9e7e1","paymentcode":"LeePay","paymentid":"ec6ebd49-e002-4db9-b7de-1750fadc0c8e","transferlimit":{"from":10.000000,"to":100000.000000},"displayorder":0},{"banktype":"Crypto","channelid":"9d76809a-4611-457d-8f49-d341d3a464ea","channelname":"LeePay_Crypto_TRON","channelcode":"TRON","extended":{},"id":"66dccb18-3bb1-49dd-139b-08d98a24e67d","methodcode":"Crypto","methodid":"798d21c6-9cf5-4fc0-bd09-8d67d2c9e7e1","paymentcode":"LeePay","paymentid":"ec6ebd49-e002-4db9-b7de-1750fadc0c8e","transferlimit":{"from":10.000000,"to":100000.000000},"displayorder":0}],"err":0,"errmsg":"","errmsgid":null}
  let result = await fetcher(url, {
    headers
  })

  return result && result.data
}

export const depositPaymentList = async (platformToken, token) => {
  let url = `${operatorApi()}/deposit`
  let headers = {
    "Content-Type": "application/json",
    "brand-token": platformToken,
    Token: token
  }

  let result = await fetcher(url, {
    headers
  })

  return result && result.data
}

export const listBankInfos = async (platformToken, token) => {
  let url = `${operatorApi()}/bankinfo`
  let headers = {
    "Content-Type": "application/json",
    "brand-token": platformToken,
    Token: token
  }

  //{"data":[{"banktype":"Bank","detail":{"name":"jojo","bankName":"bank","bankBranch":"branch","bankAccount":"acc123456"},"id":"4f5b7855-84d1-4168-9961-35d527ad6d99","paymentchannelid":"3e3cc1eb-1a4e-413f-926c-1ad48707bc66"}],"err":0,"errmsg":"","errmsgid":null}
  let result = await fetcher(url, {
    headers
  })
  return result && result.data
}

export const applyManualWithdrawForm = async (
  platformToken,
  token,
  { bankinfoid, amount }
) => {
  if (!bankinfoid) {
    let [bankinfo] = await listBankInfos(platformToken, token)
    bankinfoid = bankinfo.id
  }

  let payload = {
    bankinfoid,
    amount
  }

  let url = `${operatorApi()}/withdraw`
  let headers = {
    "Content-Type": "application/json",
    "brand-token": platformToken,
    Token: token
  }

  //{"data":"37efb986-dbd3-4d23-a9a6-dea3db726bb6","err":0,"errmsg":"","errmsgid":null}
  let result = await fetcher(url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers
  })

  return result.data
}

export const manualDeposit = async (
  platformToken,
  token,
  { paymentid, account, amount, promotionid }
) => {
  if (!paymentid) {
    let paymentList = await depositPaymentList(platformToken, token)

    let payment = paymentList.find(
      ({ paymentcode }) => paymentcode === "Manual"
    )

    paymentid = payment && payment.id
  }

  let payload = {
    paymentid,
    account,
    amount,
    promotionid
  }

  let url = `${operatorApi()}/deposit/manual`
  let headers = {
    "Content-Type": "application/json",
    "brand-token": platformToken,
    Token: token
  }

  //{"data":"43e8e093-962d-48fc-9435-0c6a8fd37f39","err":0,"errmsg":"","errmsgid":null}
  let result = await fetcher(url, {
    method: "PUT",
    body: JSON.stringify(payload),
    headers
  })

  return result.data
}

const dummyImagePath = fileURLToPath(new URL("./dummy.png", import.meta.url))
export const applyManualDepositForm = async (platformToken, token, formId) => {
  const form = new FormData()
  let dummyImageStream = await createReadStream(dummyImagePath)
  form.append("file", dummyImageStream, "dummy.png")

  let headers = {
    ...form.getHeaders(),
    "brand-token": platformToken,
    Token: token
  }

  let url = `${operatorApi()}/deposit/manual/${formId}`
  return await fetcher(url, {
    method: "POST",
    body: form,
    headers
  })
}

export const wallet = async (platformToken, token) => {
  let url = `${operatorApi()}/wallet`

  let headers = {
    "brand-token": platformToken,
    Token: token
  }

  let result = await fetcher(url, {
    method: "GET",
    headers
  })

  return result && result.data && result.data.main
}

export const addManualBankCard = async (
  platformToken,
  token,
  { paymentchannelid, bankName, bankBranch, name, bankAccount }
) => {
  if (!paymentchannelid) {
    let paymentList = await withdrawPaymentList(platformToken, token)
    let payment = paymentList.find(
      ({ paymentcode }) => paymentcode === "Manual"
    )

    paymentchannelid = payment && payment.channelid
  }

  let url = `${operatorApi()}/bankinfo`
  let payload = {
    banktype: "Bank",
    paymentchannelid,
    detail: {
      bankName,
      bankBranch,
      name,
      bankAccount
    }
  }

  let headers = {
    "Content-Type": "application/json",
    "brand-token": platformToken,
    Token: token
  }

  //{"err":0,"errmsg":"","errmsgid":null}
  let result = await fetcher(url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers
  })
  return result
}

export const promotionList = async (platformToken, token, lang = "en-US") => {
  let url = `${operatorApi()}/playerpromotion/${lang}?all=true`

  let headers = {
    "Content-Type": "application/json",
    "brand-token": platformToken,
    Token: token
  }

  let result = await fetcher(url, {
    method: "GET",
    headers
  })
  return result && result.data
}
