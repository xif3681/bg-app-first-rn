export const sleepPromise = async (timeout: number) => {
  return new Promise((resolve, reject) => {
      if (timeout < 0) reject(new Error('参数错误'))
      setTimeout(() => {
          resolve()
      }, timeout);
  })
}