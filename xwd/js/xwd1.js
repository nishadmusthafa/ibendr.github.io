/*
 * javascript crossword code for including with a html file
 * 
 * This is a master file that mostly includes other bits
 * 
 */

var paramDecs  = ( "docName=" + document.URL ).split( "?" );
var parameters = {};
paramDecs.forEach( function( paramDec ) {
  var vnn = paramDec.split( "=" ).reverse();
  if ( vnn.length == 1 ) vnn = [ true , vnn[ 0 ] ];
  vnn.slice(1).forEach( function( n ) {
    parameters[ n ] = vnn[ 0 ] });
});
delete paramDecs;

var xwdPuzzleName = parameters.docName.split(".xwd.html")[ 0 ];

document.write( '\
  <head>\
    <title>' + xwdPuzzleName + '</title>\
  <link href = "style/xwd1.css" rel="stylesheet" type="text/css">\
  <link rel="shortcut icon" href="favicon.ico">\
  ');

[
  "js/xwd.js" , "js/local_storage_manager1.js" , "js/event_manager.js" ,
  "js/dom1.js" , "js/htmlElement4.js" , "js/xwdInterface.js" , "js/xwd2.js"
 /* "js/bind_polyfill.js" , "js/classlist_polyfill.js" ,
  "js/animframe_polyfill.js" , "js/keyboard_input_manager.js" ,
  "js/html_actuator.js" , "js/grid.js" , "js/tile.js" ,
  "js/local_storage_manager.js" , "js/game_manager.js" , "js/application.js" */ 
].forEach( function( file ) {
    document.write( '<script type="text/javascript" src="' + file + '"></script>' );
});

document.write( '  </head><body><pre>')

stdHtml = '\
  <table class="layout">\
    <tr>\
      <td class="game-container">\
	<div class="tile-container">\
	</div>\
	<div class="grid-container">\
        </div>\
	<div class="game-message">\
	  <p></p>\
	  <div class="lower">\
	    <a class="keep-playing-button">Keep going</a>\
	    <a class="retry-button">Try again</a>\
	  </div>\
	</div>\
      </td>\
      <td class="side-bar">\
	<div class="heading">\
	  <h1 id="title">xwd</h1>\
	  <div class="scores-container">\
	    <div class="score-container">0</div>\
	    <div class="best-container">0</div>\
	  </div>\
	</div>\
	<p class="game-intro"></p>\
	<a class="restart-button">Clear grid</a>\
	<p class="game-explanation"> \
	</p>\
	<p id="clue-container" class="clue-container">\
	</p>\
      </td>\
    </tr>\
  </table>\
'
// document.write( stdHtml )
// 
// var xwd, xwdClues, xwdGrid;
// 
// xwdReader = function() {
//   var xwdText = document.getElementsByTagName("pre")[0].textContent.split("\nSolution:\n");
// 
//   alert( xwdText);
//   
//   xwdClues = xwdText[ 0 ].split("\n");
//   xwdGrid  = xwdText[ 1 ].split("\n");
//   
//   return ( xwd = new Crossword( xwdGrid , xwdClues ) );
// }
