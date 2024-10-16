import React, { ReactNode } from "react";
import { isEmpty } from 'lodash-es'
import classnames from 'classnames'
import Plugin from "../plugin";
import { toElement, defineRuntime } from "./utils";
import context from "../context";
import type { IConfig, Options } from "./types";

function render<T extends IConfig>(configs: T[], options?: Options): ReactNode {
  const {
    components: _components,
    data = {},
    View = 'div',
    Page = 'div',
    Document = 'div',
    plugins = [],
    emptyCallback = isEmpty,
  } = options || {};
  const components: Options['components'] = {
    ..._components,
    Page: (props) => React.createElement(Page, props),
    View: props => React.createElement(View, props),
  }
  // 初始化所有插件
  const pluginHandler = new Plugin(plugins);
  // 上下文：存储数据
  context.data = data;
  // 上下文：存储插件
  context.plugins = pluginHandler.plugins;
  // 闭包缓存上下文&插件
  const _render = (_configs: IConfig[]): ReactNode[] => {
    // 迭代配置信息
    return _configs.map((config) => {
      const {
        key,
        componentName,
        elementType,
        dataIndex,
        pluginRuntimeOptions,
        defineConfig,
        beforeDataRendered,
      } = config;
      // 获取运行时态
      const runtime = defineRuntime(config, data, options);
      if (beforeDataRendered) {
        runtime.dataSource = beforeDataRendered(runtime.dataSource, data)
      }
      // 如果配置了 refineConfig 则允许中间修改运行时状态
      defineConfig?.(runtime);
      // 依次执行所有插件（过程方便统一处理当前运行时态）
      pluginHandler.execute(runtime, pluginRuntimeOptions);

      const {
        config: {
          props,
          header,
          footer,
          children,
          rootProps,
          render: renderComponent,
          renderEmpty,
        },
        dataSource,
        visible,
      } = runtime;

      if (!visible) {
        return <></>;
      }

      let contentJsx = null;
      // 当前空值状态判断
      if (emptyCallback(dataSource) && renderEmpty) {
        contentJsx = renderEmpty(dataSource, data)
      } else {
        // 在物料组件中查找到当前组件则渲染
        if (componentName && components?.[componentName]) {
          // 如果是Page或者View，则只渲染子配置项
          if (componentName === 'Page' || componentName === 'View') {
            contentJsx = _render(children || [] as T[])
          } else {
            const Component = components[componentName];
            const className = classnames(`prender-component-${componentName.toLowerCase()}`, props?.className)
            contentJsx = (
              <Component className={className} {...props} dataIndex={dataIndex} dataSource={dataSource}>
                {_render(children || [] as T[])}
              </Component>
            )
          }

        } else if (elementType) {
          // 没有物料组件，但是配置了元素标签，则渲染元素标签
          const _prpos = {
            ...props,
          }
          if (!props?.children && children?.length) {
            _prpos.children = _render(children)
          }
          contentJsx = React.createElement(elementType, _prpos)
        }
      }
      // 定义了重渲染函数，则对组件进行二次渲染逻辑
      if (renderComponent) {
        contentJsx = renderComponent(dataSource, data, contentJsx)
      }

      // 如果组件名称是Page或者是View则不渲染footer和header,将包裹内容渲染Page和View
      // 此处认为Page和View设置header和footer并没有使用场景
      if (componentName === 'Page' || componentName === 'View') {
        const Component = componentName === 'Page' ? Page : View;
        return <Component key={key} className={`prender-${componentName.toLowerCase()}`}>{contentJsx}</Component>
      }
      // 头内容
      const headerJsx = toElement(header, dataSource, data)
      // 尾内容
      const footerJsx = toElement(footer, dataSource, data)
      const classNames = ['header', 'content', 'footer']
      const elements = [headerJsx, contentJsx, footerJsx].map((item, index) => item ? <View key={index} className={`prender-row-${classNames[index]}`}>{item}</View> : <></>);
      const viewProps = {
        ...rootProps,
        className: classnames(rootProps?.className, 'prender-row'),
        key,
      }
      return React.createElement(View, viewProps, elements)
    })
  }
  const jsx = _render(configs)
  return React.createElement(Document, {
    className: 'prender-document',
  }, jsx)
}

export default render;