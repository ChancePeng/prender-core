import { Runtime } from "../render/types";



export interface PluginImplements<T = any> {
  run(ctx: Runtime, options?: T, next?: () => void | Promise<void>): void;
}

export interface IPlugin<T> {
  new(options?: T): PluginImplements
}

export type PluginType<T = unknown> = IPlugin<T> | {
  use: IPlugin<T>,
  options: T
}