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
    var name = (track.name.length < 25) ? track.name : track.name.substring(0, 25) +"..."; // we dont want huge track names
    var album = (track.album.name.length < 25) ? track.album.name : track.album.name.substring(0, 25) +"...";

    var fonts = "font-family: 'Avenir Next', 'Segoe UI', 'Calibri', Arial, sans-serif;";
    var html = '<table style="background-color:#202528;height:120px;"><tr><td valign="middle" style="height:120px;"><img src="'+  track.album.images[1].url +'" style="display:block;height:120px;max-width:100%;vertical-align:top"></td>';
    html += '<td valign="middle" style="color:#fff; padding:0 10px; '+ fonts +'"> ';
    html += '<p style="font-size:12px;margin:0">'+ track.artists[0].name +'</p>';
    html += '<p style="font-size:18px;margin:0">'+ name +'</p>';
    html += '<p style="font-size:12px;margin:0">'+ album +'</p>';
    html += '<a href="'+track.external_urls.spotify+'" style="font-size:14px;font-style: italic; color:#70A32F; text-decoration:none">Open song in spotify</a>';
    html += '</td><td valign="middle">';
    html += '<a href="'+track.external_urls.spotify+'" id="mxplay" onclick="playerHandler(event)"></a>';
    html += '<audio id="mxplayer" ><source src="'+track.preview_url+'" type="audio/mpeg"></audio>';
    html += '</td></tr></table>\n'; 
    html += '<script>'+script+'</script>\n'; // this will be removed on email client
    html += '<style>'+style+'</style>\n';
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
