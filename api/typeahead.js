var config = require('../config/config');
var request = require('request');
var _ = require('underscore');


// The Type Ahead API.
module.exports = function(req, res) {
  var term = req.query.text.trim();
  if (!term) {
    res.json([{
      title: '<i>(enter a search term)</i>',
      text: ''
    }]);
    return;
  }

  request({
    url: 'https://api.spotify.com/v1/search',
    qs: {
      q: term,
      limit: 20,
      type: 'track'
    },
    gzip: true,
    json: true,
    timeout: 10 * 1000
  }, function(err, response) {
    if (err || response.statusCode !== 200 || !response.body || !response.body.tracks ) {
      res.status(500).send('Error');
      return;
    }
    
    
    var results = _.chain(response.body.tracks.items)
      .filter(function(track) {
        return track || track.name || track.id || track.artists || track.href;
      })
      .map(function(track) {
        return {
          title: '<span>'+ track.artists[0].name + ' - ' + track.name + '</span>',
          text: track.id
        };
      })
      .value();

    if (results.length === 0) {
      res.json([{
        title: '<i>(no results)</i>',
        text: ''
      }]);
    } else {
      res.json(results);
    }
  });

};
