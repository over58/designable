import { ICustomEvent } from '@over58/designable-shared'
import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent'

export class UpdateChildrenEvent
  extends AbstractMutationNodeEvent
  implements ICustomEvent
{
  type = 'update:children'
}
