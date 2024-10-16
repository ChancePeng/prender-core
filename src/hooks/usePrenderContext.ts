

import context from "../context"
const usePrenderContext = (key: 'data' | 'config') => {
  const result = context[key];
  if (result) {
    return new Proxy(result, {
      get(target, key) {
        return Reflect.get(target, key)
      },
      set() {
        console.error('config is readonly')
        return true
      }
    })
  }
  return result;

}

export default usePrenderContext;