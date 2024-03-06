import { isFn, globalThisPolyfill } from '@over58/designable-shared'
import ReactDOM from 'react-dom'
import { useSandboxScope } from '../hooks'

export const renderSandboxContent = (render: (scope?: any) => JSX.Element) => {
  if (isFn(render)) {
    const container = document.getElementById('__SANDBOX_ROOT__')
    if (container) {
      ReactDOM.render(render(useSandboxScope()), container)
      globalThisPolyfill.addEventListener('unload', () => {
        ReactDOM.unmountComponentAtNode(container)
      })
    } else {
      console.error('dom __SANDBOX_ROOT__ is non-existent')
    }
  }
}
