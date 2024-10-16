import { render } from '@change/prender-core'
import React from 'react'
import './example.less';

const Headline = (props) => {
  return React.createElement(props.tag, 'prender-headeline', props.dataSource)
}


export default () => {
  return (
    <div>
      {
        render([
          {
            componentName: 'Page',
            children: [
              {
                elementType: 'h3',
                props: {
                  children: '这是第一页'
                }
              },
              {
                componentName: 'Headline',
                dataSource: '这是Headline创建的一级标题',
                key: '1',
                props: {
                  tag: 'h1'
                },
              },
              {
                elementType: 'h6',
                key: '2',
                props: {
                  children: '这是通过html创建的二级标题'
                }
              }
            ]
          },
          {
            componentName: 'Page',
            children: [
              {
                elementType: 'h3',
                props: {
                  children: '这是第✌页'
                }
              },
              {
                componentName: 'Headline',
                dataSource: '这是2-h1',
                key: '1',
                props: {
                  tag: 'h1'
                },
                header: 'header',
                footer: 'footer',
              },
            ]
          },

        ], {
          components: {
            Headline,
          },
          onFinished() {
            console.log('finished')
          }
        })
      }
    </div>
  )
}