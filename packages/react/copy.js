// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-var-requires 
const { runCopy } = require('../../scripts/build-style/copy.js')

runCopy({
  esStr: 'antd/es/',
  libStr: 'antd/lib/',
})
