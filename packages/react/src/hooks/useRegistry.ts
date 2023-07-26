import { GlobalRegistry, IDesignerRegistry } from '@ove/designable-core'
import { globalThisPolyfill } from '@ove/designable-shared'

export const useRegistry = (): IDesignerRegistry => {
  return globalThisPolyfill['__DESIGNER_REGISTRY__'] || GlobalRegistry
}
