var request = require('request');
var _ = require('underscore');


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
    var track = response.body;
    var fonts = "font-family: 'Avenir Next', 'Segoe UI', 'Calibri', Arial, sans-serif;";
    var html = '<div style="background-color:#202528; height:120px; width:440px; display:block; margin:30px;'+ fonts +'">';
    html += '<span style="background-image: url('+ track.album.images[1].url+'); background-repeat:no-repeat; background-size:cover; width:120px; height:120px; display:inline-block; margin:-20px 20px 0 20px ;"></span>';
    html += '<span style=" width:180px; display:inline-block; color:#fff; line-height:22px">';
      html += '<a  href="'+track.artists[0].external_urls.spotify+'" style="font-size:12px; margin:0; text-decoration:none;  color:#fff;">'+track.artists[0].name +'</a>';
      html += '<p style="font-size:18px; margin:0">'+track.name +'</p>';
      html += '<p style="font-size:12px; margin:0">'+track.album.name +'</p>';
      html += '<a href="'+track.external_urls.spotify+'" style="font-size:14px;font-style: italic; color:#70A32F; text-decoration:none"> Listen on spotify</a>';
    html += '</span>';
    html += '<span style="vertical-align: middle; float:right; height:120px; line-height: 120px;"><button onclick="mxPlay()" type="button" class="play">Play</button>';
    html += '</span>';
    html += '<audio id="mxPlayer"><source src="'+track.preview_url+'" type="audio/mpeg">';
    html += '  Your browser does not support the audio element.</audio>';
    html += '<script>var mxPlayer= document.getElementById("mxPlayer"); function mxPlay() {  mxPlayer.play(); } function s() { mxPlayer.pause(); } </script>';
    html += "<style>button.play{ width: 50px;height: 50px; background: rgba(255, 255, 255, 0.9); border: none; border-radius: 100%; margin: 0 20px 0 0; cursor: pointer; } button.play:focus {  outline: 0; box-shadow: 0 0 0 5px rgba(255, 255, 255, 0.2); button.play::after { content: '';  display: inline-block;  position: relative;  top: 1px;  left: 3px;  border-style: solid;  border-width: 15px 0px 15px 20px;  border-color: transparent transparent transparent #333;}</style>";
    html += '</div>';


    res.json({
      body: html
        // Add raw:true if you're returning content that you want the user to be able to edit
    });
  });
}

function handleSearchString(term, req, res) {
  request({
    url: 'http://api.giphy.com/v1/gifs/random',
    qs: {
      tag: term,
      api_key: key
    },
    gzip: true,
    json: true,
    timeout: 15 * 1000
  }, function(err, response) {
    if (err) {
      res.status(500).send('Error');
      return;
    }

    var data = response.body.data;

    var width = data.image_width > 600 ? 600 : data.image_width;
    var html = '<img style="max-width:100%;" src="' + data.image_url + '" width="' + width + '"/>';
    res.json({
      body: html
        // Add raw:true if you're returning content that you want the user to be able to edit
    });
  });
}
