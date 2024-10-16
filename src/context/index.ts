import { PluginImplements } from "../plugin/types";
import { IConfig } from "../render/types";


interface IContext {
  data: Record<string, any>;
  plugins: PluginImplements[],
  config?: IConfig
}

const defaultContext: IContext = {
  data: {},
  plugins: [],
}


export default new Proxy(defaultContext, {
  get(target, key) {
    return Reflect.get(target, key)
  },
  set(target, key, value) {
    return Reflect.set(target, key, value)
  }
})