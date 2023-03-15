export const valueOf = (value) => {
  if (Number.isFinite(value)) {
    return `${value}px`
  }
  return value
}

export default {
  valueOf
}
