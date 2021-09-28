let audio
export const withdraw = () => {
  if (!audio) {
    audio = new Audio("/audio/withdraw.mp3")
  }

  return audio
}

export default withdraw
