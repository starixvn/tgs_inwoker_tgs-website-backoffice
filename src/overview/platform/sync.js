export const EventName = "sync"

export const on = (handler) => {
  document.addEventListener(EventName, handler)

  return () => {
    console.log("of handler")
    off(handler)
  }
}

export const off = (handler) => {
  document.removeEventListener(EventName, handler)
}

export const fire = () => {
  let event = new Event(EventName)
  document.dispatchEvent(event)
}

export default {
  on,
  off,
  fire
}
