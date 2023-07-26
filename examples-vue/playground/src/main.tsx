import ReactDOM from 'react-dom'
import { createElement } from 'react'
import { App } from '@examples-vue/react'
import { sources } from '@examples-vue/vue'
import { ContentWidget } from './widgets'
ReactDOM.render(
  createElement(App, {
    Content: () =>
      createElement(ContentWidget, {
        components: {
          ...sources,
        },
      }),
    sources: Object.values(sources),
  }),
  document.getElementById('root') as HTMLElement
)
