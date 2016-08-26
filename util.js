/* global $ */

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

module.exports.downloadDataFiles = (horseman) => {
  return (links) => {
    return promisedFor(function (i) {
      return i < links.length
    }, function (i) {
      let link = links[i]
      let name = link.split('/')
      name = name[name.length - 1]
      console.log(`Downloading ${name}...`)
      name = name[name.length - 1]
      return horseman
              .download(link, `data/${name}`, true)
              .then(function (r) {
                return ++i
              })
    }, 0)
  }
}

module.exports.handleErrors = (e) => console.error(e)
