import type { FunctionComponent, ComponentClass, Key, ReactHTML, ReactNode } from 'react';
import { PluginType } from '../plugin/types';

export type VisibleEnvType = 'HIDDEN_WHILE_DATAINDEX_IS_EMPTY' | 'HIDDEN_WHILE_DATASOURCE_IS_EMPTY';
export type VisibleCallback = (data: any, record: Record<string, any>) => VisibleEnvType | boolean;


export type VisibleType = VisibleEnvType | boolean | VisibleCallback;
export type VisibleOption = VisibleType | {
  key: string | string[],
  isEmpty?: (data: any) => boolean
}

type HTMLTagType = keyof ReactHTML;



export interface IConfig<T = string, P = Record<string, any>, O = any> {
  // ReactKey
  key?: Key,
  // 组件名称
  componentName?: T,
  // 标签名称
  elementType?: HTMLTagType,
  // 数据索引
  dataIndex?: string | string[],
  // 数据源
  dataSource?: any,
  // 组件属性
  props?: P,
  // 根组件属性
  rootProps?: any,
  // 头信息
  header?: ReactNode | ((data: any, record: Record<string, any>) => ReactNode),
  // 尾配置
  footer?: ReactNode | ((data: any, record: Record<string, any>) => ReactNode),
  // 显示隐藏
  visible?: VisibleOption,
  // 子元素
  children?: IConfig<T, P, O>[],
  // 插件配置
  pluginRuntimeOptions?: O,
  beforeDataRendered?: <T = any>(data: T, record: Record<string, any>) => T;
  // 重新定义属性
  defineConfig?: (runtime: Runtime) => void,
  // 重新定义渲染
  render?: (data: any, record: Record<string, any>, dom: ReactNode) => ReactNode,
  // 空值渲染
  renderEmpty?: (data: any, record: Record<string, any>) => ReactNode,
}


export type ComponentType<P = Record<string, any>> = FunctionComponent<P> | ComponentClass<P>


export interface Options {
  View?: ComponentType | HTMLTagType,
  Document?: ComponentType | HTMLTagType,
  Page?: ComponentType | HTMLTagType,
  components?: Record<string, ComponentType>,
  data?: Record<string, any>,
  plugins?: PluginType[],
  emptyCallback?: (data: any) => boolean,
  onFinished?: () => void,
}


export type Runtime = {
  config: Omit<IConfig, 'refineConfig' | 'componentName' | 'dataIndex' | 'elementType'>,
  visible: boolean,
  dataSource: any,
}