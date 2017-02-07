var request = require('request');
var _ = require('underscore');
var read = require('read-file');
 


// The API that returns the in-email representation.
module.exports = function(req, res) {
  var term = req.query.text.trim();
  if (term.length === 22) {
    // term cotains id
    handleIdString(term, req, res);
  } else {
    // Else search
    handleSearchString(term, req, res);
  }
};


  function builder(track){
    var script = read.sync('assets/js/app.js', {encoding: 'utf8'});
    var style = read.sync('assets/style/style.css', {encoding: 'utf8'});
    var name = (track.name.length < 25) ? track.name : track.name.substring(0, 25) +"...";
    var album = (track.album.name.length < 25) ? track.album.name : track.album.name.substring(0, 25) +"...";


    var fonts = "font-family: 'Avenir Next', 'Segoe UI', 'Calibri', Arial, sans-serif;";
    var html = '<div style="background-color:#202528; height:120px; width:440px; display:block; margin:30px 0;'+ fonts +'">';
    html += '<span style="background-image: url('+ track.album.images[1].url+'); background-repeat:no-repeat; background-size:cover; width:120px; height:120px; display:inline-block; margin:-20px 20px 0 20px ;"></span>';
    html += '<span style=" width:180px; display:inline-block; color:#fff; line-height:20px; margin-top:5px;">';
      html += '<a  href="'+track.artists[0].external_urls.spotify+'" style="font-size:12px; margin:0; text-decoration:none;  color:#fff;">'+track.artists[0].name +'</a>';
      html += '<p style="font-size:16px; margin:0">'+ name +'</p>';
      html += '<p style="font-size:12px; margin:0">'+ album +'</p>';
      html += '<a href="'+track.external_urls.spotify+'" style="font-size:14px;font-style: italic; color:#70A32F; text-decoration:underline"> Open song in spotify</a>';
    html += '</span>';
    html += '<span style="vertical-align: middle; float:right; height:120px; line-height: 120px;"><button onclick="playerHandler()" type="button" id="mxplay"></button>';
    html += '</span>';
    html += '<audio id="mxplayer"><source src="'+track.preview_url+'" type="audio/mpeg">';
    html += '  Your browser does not support the audio element.</audio>';
    html += '<script>'+script+'</script>';
    html += '<style>'+style+'</style>';
    html += '</div>';
    return html;
  };

function handleIdString(id, req, res) {
  request({
    url: 'https://api.spotify.com/v1/tracks/' + id,
    gzip: true,
    json: true,
    timeout: 15 * 1000
  }, function(err, response) {
    if (err) {
      res.status(500).send('Error');
      return;
    }
    var html = builder(response.body);
    res.json({
      body: html
    });
  });
}

function handleSearchString(term, req, res) {
  //if the user press enter before selecting a song we search for a track
  request({
    url: 'https://api.spotify.com/v1/search',
    qs: {
      q: term,
      limit: 1,
      type: 'track'
    },
    gzip: true,
    json: true,
    timeout: 15 * 1000
  }, function(err, response) {
    if (err) {
      res.status(500).send('Error');
      return;
    }
    var html = builder(response.body.tracks.items[0]);
  
    res.json({
      body: html
    });
  });
}
