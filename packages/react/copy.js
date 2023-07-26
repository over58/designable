// eslint-disable-next-line @typescript-eslint/no-var-requires
const { runCopy } = require('../../scripts/build-style/copy')

runCopy({
  esStr: 'antd/es/',
  libStr: 'antd/lib/',
})
