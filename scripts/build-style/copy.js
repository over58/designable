const { copy, readFile, writeFile, existsSync } = require('fs-extra')
const glob = require('glob')

const importLibToEs = async ({ libStr, esStr, filename }) => {
  if (!existsSync(filename)) {
    return Promise.resolve()
  }

  const fileContent = (await readFile(filename)).toString()

  return writeFile(
    filename,
    fileContent.replace(new RegExp(libStr, 'g'), esStr)
  )
}

const runCopy = ({ resolveForItem, ...lastOpts }) => {
  return new Promise((resolve, reject) => {
    glob(`./src/**/*`, (err, files) => {
      if (err) {
        return reject(err)
      }

      const all = []

      for (let i = 0; i < files.length; i += 1) {
        const filename = files[i]

        resolveForItem?.(filename)

        if (/\.(less|scss)$/.test(filename)) {
          all.push(copy(filename, filename.replace(/src\//, 'esm/')))
          all.push(copy(filename, filename.replace(/src\//, 'lib/')))

          continue
        }

        if (/\/style.ts$/.test(filename)) {
          importLibToEs({
            ...lastOpts,
            filename: filename.replace(/src\//, 'esm/').replace(/\.ts$/, '.js'),
          })

          continue
        }
      }
    })
  })
}

module.exports = {
  runCopy,
}
