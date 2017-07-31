const fetch = require('node-fetch');

const config = require('../../.env.json');

module.exports.findMpByConstituencyName = constituencyName =>
  fetch(
    `https://www.theyworkforyou.com/api/getMP?constituency=${constituencyName}&key=${config.theyWorkForYou.apiKey}`
  ).then(res => res.json());

module.exports.findConstituency = name =>
  fetch(
    `https://www.theyworkforyou.com/api/getConstituencies?search=${name}&key=${config.theyWorkForYou.apiKey}`
  ).then(res => res.json());
