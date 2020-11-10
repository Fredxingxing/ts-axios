import { isPlainObject } from './util'

export function transformRequest(data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data
}

export function transformResponseData(data: any): any {
  let newData = data
  if (typeof data === 'string') {
    try {
      newData = JSON.parse(data)
    } catch (e) {
      // do nothing
    }
  }
  return newData
}
