/* global $ */

let path = require('path')
let Promise = require('bluebird')

var promisedFor = Promise.method(function (condition, action, value) {
  if (!condition(value)) return value
  return action(value).then(promisedFor.bind(null, condition, action))
})

module.exports.extractLinks = function (selector) {
  var array = []
  var links = $(selector)

  for (var i = 0; i < links.length; i++) {
    array.push($(links[i]).attr('href'))
  }

  return array
}

module.exports.downloadDataFiles = (horseman, downloadDir) => {
  return (links) => {
    return promisedFor(function (i) {
      return i < links.length
    }, function (i) {
      let link = links[i]
      let name = link.split('/')
      name = name[name.length - 1]

      let downloadPath = path.join(downloadDir, name)

      process.stdout.write(`Downloading ${name} ...`)
      return horseman
              .download(link, downloadPath, true)
              .then(function (r) {
                process.stdout.write(' Done\n')
                return ++i
              })
    }, 0)
  }
}

module.exports.handleErrors = (e) => console.error(e)
