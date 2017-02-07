var playerHandler = function(){
  var player= document.getElementById("mxplayer"); 
  var play= document.getElementById("mxplay"); 
 
  if (play.className==="active"){
    player.pause(); 
    play.className = "";
  }else{
    player.play(); 
    play.className = "active";
  }
}
