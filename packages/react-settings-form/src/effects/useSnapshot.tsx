import { Operation } from '@over58/designable-core'
import { onFieldInputValueChange } from '@formily/core'
import { globalThisPolyfill } from '@over58/designable-shared'

let timeRequest = 0

export const useSnapshot = (operation: Operation) => {
  onFieldInputValueChange('*', () => {
    clearTimeout(timeRequest)
    timeRequest = globalThisPolyfill.setTimeout(() => {
      operation.snapshot('update:node:props')
    }, 1000)
  })
}
