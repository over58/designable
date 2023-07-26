import { IBehavior, IResource } from 'ove-designable-core'
import { defineComponent } from 'vue'

type Component<P extends Record<string, any>> = ReturnType<
  typeof defineComponent<P>
>

export type DnFC<P extends Record<string, any>> = Component<P> & {
  Resource?: IResource[]
  Behavior?: IBehavior[]
}

export type DnComponent<P extends Record<string, any>> = Component<P> & {
  Resource?: IResource[]
  Behavior?: IBehavior[]
}

export interface IDesignerComponents {
  [key: string]: DnFC<any> | DnComponent<any>
}
