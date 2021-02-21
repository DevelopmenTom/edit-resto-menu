export const killTime = (msToKill: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, msToKill)
  })
}
