import { GlobalRegistry, IDesignerRegistry } from '@over58/designable-core'
import { globalThisPolyfill } from '@over58/designable-shared'

export const useRegistry = (): IDesignerRegistry => {
  return globalThisPolyfill['__DESIGNER_REGISTRY__'] || GlobalRegistry
}
