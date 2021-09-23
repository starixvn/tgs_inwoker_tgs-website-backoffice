let playlist = []
let promise = Promise.resolve()

export const play = (audio, options) => {
  if (!audio?.play) {
    return
  }

  if (playlist.includes(audio)) {
    return promise
  } else {
    playlist.push(audio)

    promise = promise
      .then(() => {
        return autoPlay(audio, options)
      })
      .then(() => {
        playlist = remove(audio, playlist)
      })
  }
}

const remove = (audio, list = []) => {
  let index = list.findIndex((item) => item == audio)
  if (index >= 0) {
    list.splice(index, 1)
  }
  return list
}

const autoPlay = (audio, options = {}) => {
  return new Promise((resolve, reject) => {
    audio.addEventListener(
      "ended",
      () => {
        resolve()
      },
      {
        once: true
      }
    )

    let playAttempt = setInterval(() => {
      audio
        .play()
        .then(() => {
          clearInterval(playAttempt)
          options?.onPlay?.()
        })
        .catch((error) =>
          console.log("Unable to play the video, User has not interacted yet.")
        )
    }, 1000)
  })
}
