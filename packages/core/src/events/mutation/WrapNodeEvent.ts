import { ICustomEvent } from '@over58/designable-shared'
import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent'

export class WrapNodeEvent
  extends AbstractMutationNodeEvent
  implements ICustomEvent
{
  type = 'wrap:node'
}
