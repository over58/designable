import { globalThisPolyfill } from '@over58/designable-shared'

export const useSandboxScope = () => {
  return globalThisPolyfill['__DESIGNABLE_SANDBOX_SCOPE__']
}
