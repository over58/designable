import { Engine, TreeNode } from '@over58/designable-core'
import {
  transformToSchema,
  transformToTreeNode,
} from '@over58/designable-formily-transformer'
import { message } from 'antd'

export const saveSchema = (designer: Engine) => {
  if (designer.getCurrentTree()){
    localStorage.setItem(
      'formily-schema',
      JSON.stringify(transformToSchema(designer.getCurrentTree() as TreeNode))
    )
    message.success('Save Success')
  }
}

export const loadInitialSchema = (designer: Engine) => {
  try {
    if (designer.getCurrentTree()){
      designer.setCurrentTree(
        transformToTreeNode(JSON.parse(localStorage.getItem('formily-schema') || '{}' ))
      )
    }
  } catch {}
}
