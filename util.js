/* global $ */

const path = require('path')
const Promise = require('bluebird')

const promisedFor = Promise.method((condition, action, value) => {
  if (!condition(value)) return value
  return action(value).then(promisedFor.bind(null, condition, action))
})

const handleErrors = (e) => console.error(e)

const extractLinks = (selector) => {
  const array = []
  const links = $(selector)

  for (let link of links) {
    array.push($(link).attr('href'))
  }

  return array
}

const downloadDataFiles = (horseman, downloadDir) => {
  return (links) => {
    return promisedFor((i) => i < links.length, (i) => {
      const link = links[i]
      const names = link.split('/')
      const name = names[names.length - 1]
      const downloadPath = path.join(downloadDir, name)

      process.stdout.write(`Downloading ${name} ...`)

      return horseman.download(link, downloadPath, true)
                     .then((r) => {
                       process.stdout.write(' Done\n')
                       return ++i
                     })
    }, 0)
  }
}

module.exports = {
  handleErrors,
  extractLinks,
  downloadDataFiles
}
