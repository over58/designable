import React from 'react'
import { Content } from './content'
import { renderSandboxContent } from '@ove/designable-react-sandbox'
import './theme.less'

renderSandboxContent(() => {
  return <Content />
})
