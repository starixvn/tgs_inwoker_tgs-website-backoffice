let audio

export const deposit = () => {
  if (!audio) {
    audio = new Audio("/audio/deposit.mp3")
  }

  return audio
}

export default deposit
