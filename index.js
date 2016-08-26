let Horseman = require('node-horseman')

let util = require('./util')

const BASE_URL = 'https://www.kaggle.com'
const KAGGLE_LOGIN_URL = `${BASE_URL}/account/login`

let oblivion = (username, password, competitionID) => {
  const COMPETITION_URL = `${BASE_URL}/c/${competitionID}/data`

  let horseman = new Horseman({
    timeout: Infinity,
    loadImages: false,
    webSecurity: false
  })

  horseman
    .userAgent('Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36')
    .open(KAGGLE_LOGIN_URL)
    .type('input[name="UserName"]', username)
    .type('input[name="Password"]', password)
    .click('#get-started')
    .waitForNextPage()
    .open(COMPETITION_URL)
    .evaluate(util.extractLinks, '#data-files > tbody a')
    .then(util.downloadDataFiles(horseman))
    .catch(util.handleErrors)
    .close()
}

module.exports = oblivion
