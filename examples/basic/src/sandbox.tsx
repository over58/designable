import React from 'react'
import { Content } from './content'
import { renderSandboxContent } from '@over58/designable-react-sandbox'
import './theme.less'

renderSandboxContent(() => {
  return <Content />
})
