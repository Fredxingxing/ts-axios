import { AxiosRequestConfig, AxiosStatic } from './types'
import Axios from './core/axios'
import defaults from './default'
import { extend } from './helpers/util'
import mergeConfig from './core/mergeConfig'
import CancelToken from './cancel/CancelToken'
import Cancel, { isCancel } from './cancel/Cancel'

function createInstance(config: AxiosRequestConfig): AxiosStatic {
  // 实例化 context
  const context = new Axios(config)
  // 创建instance 指向 request 方法,绑定上下文
  const instance = Axios.prototype.request.bind(context)
  // 把context的原型方法喝实例方法全部拷贝到Instance上
  extend(instance, context)
  return instance as AxiosStatic
}

// 这样我们就可以通过 createInstance 工厂函数创建了 axios，
// 当直接调用 axios 方法就相当于执行了 Axios 类的 request 方法发送请求，
// 当然我们也可以调用 axios.get、axios.post 等方法
const axios = createInstance(defaults)

axios.create = function create(config: AxiosRequestConfig) {
  return createInstance(mergeConfig(defaults, config))
}
axios.CancelToken = CancelToken
axios.Cancel = Cancel
axios.isCancel = isCancel
export default axios
