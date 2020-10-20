var lineReader = require('line-reader');
var fs = require('fs');
var config = require('./config/credentials.json');
const PersonalityInsightsV3 = require('ibm-watson/personality-insights/v3');
const {
  IamAuthenticator
} = require('ibm-watson/auth');

var timeline = require('./data/timeline.json');

var newTimeLine = [];

const personality_insights = new PersonalityInsightsV3({
  version: '2019-10-13',
  authenticator: new IamAuthenticator({
    apikey: config.personalityInsights.key,
  }),
  url: config.personalityInsights.url,
});

var pi = config.personalityInsights;

var results = [];

function analyze(words, era) {
  var profileParams = {
    // Get the content from the JSON file.
    content: words,
    contentType: 'text/plain',
    consumptionPreferences: true,
    rawScores: true,
  };

  // console.log(profileParams)

  personality_insights.profile(profileParams)
    .then(response => {
      console.log('running personality insights');
      era.analysis = response.result;
      newTimeLine[era.order -1] = era;

      fs.writeFile('./data/mac.json', JSON.stringify(newTimeLine), function (err) {
        if (err) {
          return console.log(err);
        }
      })
    })
    .catch(err => {
      console.log('error:', err);
    });
}

function loadLyricsForAlbum(lyricsfile) {
  return new Promise(function (resolve, reject) {
    fs.readFile('./data/lyrics/' + lyricsfile, 'utf8', function (err, data) {
      if (err) {
        reject(err);
        throw err;
      } else {
        resolve(data)

      }
    })
  })
}

function loadLyricsForEra(era) {
  return new Promise(function (resolve, reject) {

    var eralyrics = "";

    var lyricpromises = [];

    era.albums.forEach(function (album) {
      lyricpromises.push(loadLyricsForAlbum(album.filename));
    });

    console.log('Loading lyrics for era: ' + era.era);
    console.log('Lyric promises: ' + lyricpromises.length);

    Promise.all(lyricpromises).then(function (values) {
      eralyrics = values;
      resolve(eralyrics);
    })
  })
}

console.log('Running through each era in the timeline');

timeline.forEach(function (era) {
  var eralyrics = "";
  var p = loadLyricsForEra(era);
  p.then(function (eralyrics) {
    analyze(eralyrics, era);
  }, function (err) {
  });
});