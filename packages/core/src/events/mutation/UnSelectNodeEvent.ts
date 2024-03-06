import { ICustomEvent } from '@over58/designable-shared'
import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent'

export class UnSelectNodeEvent
  extends AbstractMutationNodeEvent
  implements ICustomEvent
{
  type = 'unselect:node'
}
