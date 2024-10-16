import { Runtime } from "../render/types";
import { PluginImplements, PluginType } from "./types";


class Plugin {
  plugins: PluginImplements[];
  state;
  constructor(plugins: PluginType[]) {
    this.plugins = plugins.map(item => {
      if (item instanceof Function) {
        return new item()
      }
      const { use, options } = item;
      return new use(options)
    })
    this.state = true;
  }
  next() {
    this.state = true;
  }
  execute(ctx: Runtime, options?: any) {
    this.state = true;
    const length = this.plugins.length;
    for (let i = 0; i < length; i++) {
      if (!this.state) {
        break;
      }
      const plugin = this.plugins[i]
      plugin.run.call(plugin, ctx, options, this.next)
    }
  }
}

export default Plugin;