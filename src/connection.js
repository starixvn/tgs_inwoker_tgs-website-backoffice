import * as signalR from "@microsoft/signalr"
import { isDev } from "./env"
/*
TODO: test on chrome & edge
var lockResolver;
if (navigator && navigator.locks && navigator.locks.request) {
    const promise = new Promise((res) => {
        lockResolver = res;
    });

    navigator.locks.request('unique_lock_name', { mode: "shared" }, () => {
        return promise;
    });
}
*/

export let connection

const ReconnectTimeDelay = 5000

const start = (connection) => {
  console.log("start SignalR connection")

  return connection
    .start()
    .then(() => {
      console.log("SignalR connected")
    })
    .catch((error) => {
      console.error(error)
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(start(connection))
        }, ReconnectTimeDelay)
      })
    })
}

export const init = async () => {
  if (!connection) {
    //init
    connection = new signalR.HubConnectionBuilder()
      .withUrl("/api/notify")
      .withAutomaticReconnect()
      .build()

    connection.onreconnecting((error) => {
      console.log(`SignalR error "${error}". Reconnecting.`)
    })

    connection.onreconnected((connectionId) => {
      console.log(
        `SignalR connection reestablished, connectionId "${connectionId}".`
      )
    })

    connection.onclose((error) => {
      console.log("SignalR connection closed due to error", error)
      setTimeout(() => {
        start(connection)
      }, ReconnectTimeDelay)
    })

    window.connection = connection

    return start(connection)
  }
}

export default connection
