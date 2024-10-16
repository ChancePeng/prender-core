
import { get, isEmpty as _isEmpty } from 'lodash-es'
import context from "../context";
import type { IConfig, Runtime, VisibleOption, Options, VisibleEnvType } from "./types";




export const isVisible = (config: IConfig, visible: VisibleOption, data: Record<string, any>, options?: Options): boolean => {
  const { dataSource, dataIndex } = config;
  const emptyCallback = options?.emptyCallback ?? _isEmpty;
  const _isVisible = (value: boolean | VisibleEnvType) => {
    if (value === 'HIDDEN_WHILE_DATAINDEX_IS_EMPTY') {
      return !emptyCallback(dataIndex)
    }
    if (value === 'HIDDEN_WHILE_DATASOURCE_IS_EMPTY') {
      return !emptyCallback(dataSource)
    }
    return value;
  }
  if (visible instanceof Function) {
    const result = visible(dataSource, data);
    return _isVisible(result)
  }
  if (typeof visible === 'string' || typeof visible === 'boolean') {
    return _isVisible(visible)
  }
  const { key, isEmpty = emptyCallback } = visible;
  if (Array.isArray(key)) {
    return !key.every(item => isEmpty(get(data, item)))
  }
  const value = get(data, key)
  return !isEmpty(value)
}

export const toElement = (content: IConfig['header'], data: any, record: Record<string, any>) => {
  if (content instanceof Function) {
    return content(data, record)
  }
  return content;

}

export const defineRuntime = (config: IConfig, data: Record<string, any>, options?: Options): Runtime => {
  const {
    dataIndex,
    dataSource,
    visible = true,
    header,
    footer,
    rootProps,
    props = {},
    children,
    render: renderComponent,
    renderEmpty,
  } = config;

  // 上下文：设置当前配置信息
  // 后续可通过：usePrenderContext 获取当前配置信息
  context.config = config;

  // 运行时状态存储
  const runtime: Runtime = {
    config: {
      props,
      rootProps,
      dataSource,
      header,
      footer,
      visible,
      children,
      render: renderComponent,
      renderEmpty,
    },
    visible: isVisible(config, visible, data, options),
    dataSource
  }

  // 根据数据索引从data中获取数据
  if (dataIndex) {
    if (Array.isArray(dataIndex)) {
      runtime.dataSource = dataIndex.map(item => get(data, item))
    } else {
      runtime.dataSource = get(data, dataIndex)
    }
  }
  return runtime;
}
