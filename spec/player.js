import fetcher from "./fetcher"
import faker from "faker"
import { globalApi, operatorApi } from "./env"

export const DefaultPassword = "TgsP@ssw0rd"

export const DefaultCurrencyCode = "CNY"

export const register = async (
  token,
  {
    username = `${faker.name.firstName()}${new Date().getTime()}`,
    currency = DefaultCurrencyCode,
    pwd = DefaultPassword,
    confirmpwd = DefaultPassword,
    invitationcode = "",
    testplayer = false
  } = {}
) => {
  let payload = {
    username,
    currency,
    pwd,
    confirmpwd,
    invitationcode,
    testplayer
  }

  let url = `${operatorApi()}/player/create`
  let headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  }

  //TODO: check err = 0?
  //{"uid":"4ueulel28rd6","isnew":true,"err":0,"errmsg":"","errmsgid":null}
  let result = await fetcher(url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers
  })

  return {
    username,
    currency,
    password: pwd,
    ...result
  }
}

const Type = {
  Desktop: 0,
  Mobile: 1
}

export const login = async (
  token,
  { username, password = DefaultPassword, platformtype = Type.Desktop }
) => {
  let payload = {
    username,
    password,
    platformtype
  }

  let url = `${operatorApi()}/player/login`
  let headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  }

  //TODO: check err = 0?
  //{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJTNGZZZVlCQjJhTnZlbXExWkpwanlzNjBsRVNoUmxHdmdGeUxEZ0FkNkd0OFBiUkxEd2pJdHo1Q0tYZ0pndUk0MFpGek5MaDc5d1V3ek5GNklzVFB1S0tOcHV6bzFYa3pWOFYwcld6RzJvTTBuRW5CN1NqbVpoU1Fnd09aSlpFR25KSHVwaWtPN1A1Z0ZBbDJ6MkE3Smp4UHpqWmZEaGxGellVelJlZmdiTkVLYnc4aUh5STNxS0F4cXBKSUNUd2JxNVlhTkRzZjBjNVNaOUdxQU9hdWhPMCIsImp0aSI6IjYwNjYyMTFjLTQ5NWQtNDMwNS05ZjhkLWJkMTE4ZmJkNGE2OSIsIm5iZiI6MTYzMjM3NTQ1MywiZXhwIjoxNjMyNDE4NjUzLCJpYXQiOjE2MzIzNzU0NTMsImlzcyI6Im9wZXJhdG9yLWFwaSJ9.IOh1_Oz0p4ArbHNL2bZcPc3Eiz1Og_33ILl1053YMa8","logintime":1632375453014,"err":0,"errmsg":"","errmsgid":null}
  let result = await fetcher(url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers
  })

  return result
}
