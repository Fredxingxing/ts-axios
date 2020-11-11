import { AxiosRequestConfig } from './types'
import { buildURL } from './helpers/url'
import xhr from './xhr'
import { transformRequest } from './helpers/data'
import { processHeaders } from './helpers/header'

function axios(config: AxiosRequestConfig): void {
  const generatorConfig = processConfig(config)
  xhr(generatorConfig)
}

function transformUrl(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url, params)
}

function processConfig(config: AxiosRequestConfig): AxiosRequestConfig {
  return {
    ...config,
    headers: transformHeaders(config),
    data: transformRequestData(config),
    url: transformUrl(config)
  }
}

function transformRequestData(config: AxiosRequestConfig): AxiosRequestConfig {
  return transformRequest(config.data)
}

function transformHeaders(config: AxiosRequestConfig) {
  const { headers = {}, data } = config
  return processHeaders(headers, data)
}

export default axios
