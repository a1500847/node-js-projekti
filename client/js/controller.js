var socket = io();

$("#messageForm").submit(function() {
    var message = $('#m').val();
    var msgcolor = $('#active-color').css('background-color');
    //console.log(rgb2hex(msgcolor));
    socket.emit('chat message', {
        message: message,
        msgcolor: msgcolor
    });
    $('#m').val('');
    return false;
});

$("#usernameForm").submit(function() {
    $("#username_field").css("display", "none");
    $("#myCanvas_field").css("display", "block");

    var username = $('#username').val();
    socket.emit('new user', {
        username: username
    });
    $('#username').val('');
    return false;
});

socket.on('update userlist', function(data) {
    var kayttajat = data;
    $('#current-users-list').html('');
    for (var k in kayttajat) {
        $('#current-users-list').append($('<li>').text(kayttajat[k].username));
    }
});

// Päivitetään colors-list
socket.on('update colorslist', function(data) {
    var colors = data.colors;
    $('#color-stats').html('');

    for (i = 0; i < colors.length; i++) {
      $('#color-stats').append($('<li style="background-color: ' + colors[i][0] + ';" onclick="pickColor(this)">').text(colors[i][1]));
    }
});

socket.on('update clientbg', function(data){
    document.body.style.backgroundColor = data.backgroundcolor;
});

function pickColor(element) {
  var hexcolor = rgb2hex(element.style.backgroundColor);
  $('#active-color').css("background-color", hexcolor);
}

// rgb väri muutetaan hex väriksi. tarvitaan color-picker valuen
// muuttamiseen
function rgb2hex(rgb){
 rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
 return (rgb && rgb.length === 4) ? "#" +
  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}

$('#m').on("invalid", function(e) {
  e.preventDefault();
});


$(document).ready(function(){
  $('#m').keypress(function(e){
    if(e.keyCode==13)
    $('#submit').click();
  });
});

$('#helper').click(function(){
  if ($('#helper_text').css("display") == "none") {
    $('#helper_title').text("X");
    $('#helper_text').css("display", "block");
  } else {
    $('#helper_title').text("?");
    $('#helper_text').css("display", "none");
  }
});

$('#helper').hover(function(){
  $('#helper').css("background", "linear-gradient(to bottom,  rgba(0,0,0,0) 0%,rgba(0,0,0,0.25) 100%)");
}, function(){
  $('#helper').css("background", "linear-gradient(to bottom,  rgba(0,0,0,0.04) 0%,rgba(0,0,0,0.4) 100%)");
});
