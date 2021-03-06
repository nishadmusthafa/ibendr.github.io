// navigation keys
keysNav = {
    39: 0, // Right
    40: 1, // Down
    37: 2, // Left
    38: 3, // Up
    
    35: 4, // End
  0:  5, // PgDn
    36: 6, // Home
  0:  7 // PgUp
};
    
    
function EventManager() {
  this.events = {};

  if (window.navigator.msPointerEnabled) {
    //Internet Explorer 10 style
    this.eventTouchstart    = "MSPointerDown";
    this.eventTouchmove     = "MSPointerMove";
    this.eventTouchend      = "MSPointerUp";
  } else {
    this.eventTouchstart    = "touchstart";
    this.eventTouchmove     = "touchmove";
    this.eventTouchend      = "touchend";
  }

  this.listen();	// most of the work
}

// "on" adds a function to a list to be called for that 'event'
EventManager.prototype.on = function ( event, callback ) {
  if (!this.events[event]) {
    this.events[event] = [];
  }
  this.events[event].push(callback);
};

// "emit" simply calls the list of functions - no transmission to another process
EventManager.prototype.emit = function ( event , data ) {
  var callbacks = this.events[ event ];
  if ( callbacks ) {
    callbacks.forEach( function ( callback ) {
      callback( data );
    });
  }
};

var keyMapMove = {
    39: 0, // Right
    40: 1, // Down
    37: 2, // Left
    38: 3, // Up

  };

var keyMapAction = {
    27: "quit",
     9: "nextSpot",
    36: "home",
    35: "end",
    46: "delete",
    13: "enter"
}
var keyCtrlAction = {
    81: "quit",   	// Q
    82: "restart",	// R
    83: "solve",	// S
    84: "nextSpot",	// T
    
}
EventManager.prototype.listen = function () {
  var self = this;

//   var map = keyMapMove;
//   var keyLog = [];
  // Respond to direction keys
  document.addEventListener("keydown", function (event) {
    var extraModifiers = ( event.altKey ? 4 : 0 ) | ( event.ctrlKey ? 2 : 0 ) | ( event.metaKey ? 8 : 0 );
    var shift = ( event.shiftKey ? 1 : 0 );
    var modifiers = extraModifiers | shift;
    var keyCode = event.which;
//     // debug stuff
//     keyLog.push( 1000 * modifiers + keyCode );
//     if ( keyCode == 65 ) alert ( keyLog );
    // If it's a letter - put it in the grid
    if ( keyCode >= 65 && keyCode <= 90 ) {
      if (!modifiers) {
	self.emit( "insert" , keyCode );
      }
      else {  // unless modifiers - ctrl- gives certain commands
	if ( event.ctrlKey ) {
	  var mapped = keyCtrlAction[ keyCode ];
	  if ( mapped ) {
	    event.preventDefault();
	    self.emit( mapped , keyCode , modifiers );
	  }
	}
      }
    }
    else {
      // check for move keys (arrows)
      var mapped = keyMapMove[ keyCode ];
      if ( mapped !== undefined ) {
	if ( !extraModifiers ) {
	  event.preventDefault();
	  self.emit( "move", mapped + ( shift ? 4 : 0 ) ) ;
	}
	else {
	  // check for ctrl- or alt- arrow combinations here
	}
      }
      else {
	// Finally check for command keys - Home, End, Del, Esc etc.
	var mapped = keyMapAction[ keyCode ];
	if ( mapped !== undefined ) {
	  event.preventDefault();
	  self.emit( mapped , keyCode , modifiers );
	}
      }
    }
  });
//       // ctrl-R key restarts the game
//       if (event.ctrlKey && event.which === 82) {
// 	self.restart.call(self, event);

  // Respond to button presses
  this.bindButtonPress(".retry-button", this.restart);
  this.bindButtonPress(".restart-button", this.restart);
  this.bindButtonPress(".keep-playing-button", this.keepPlaying);

  // Respond to swipe events
  var touchStartClientX, touchStartClientY;
  var gameContainer = document.getElementsByClassName( "game-container" )[ 0 ];

  if ( gameContainer ) {
    gameContainer.addEventListener( this.eventTouchstart, function ( event ) {
      if ( (!window.navigator.msPointerEnabled && event.touches.length > 1 ) ||
	  event.targetTouches > 1 ) {
	return; // Ignore if touching with more than 1 finger
      }

      if (window.navigator.msPointerEnabled) {
	touchStartClientX = event.pageX;
	touchStartClientY = event.pageY;
      } else {
	touchStartClientX = event.touches[0].clientX;
	touchStartClientY = event.touches[0].clientY;
      }

      event.preventDefault();
    });

    gameContainer.addEventListener(this.eventTouchmove, function (event) {
      event.preventDefault();
    });

    gameContainer.addEventListener(this.eventTouchend, function (event) {
      if ((!window.navigator.msPointerEnabled && event.touches.length > 0) ||
	  event.targetTouches > 0) {
	return; // Ignore if still touching with one or more fingers
      }

      var touchEndClientX, touchEndClientY;

      if (window.navigator.msPointerEnabled) {
	touchEndClientX = event.pageX;
	touchEndClientY = event.pageY;
      } else {
	touchEndClientX = event.changedTouches[0].clientX;
	touchEndClientY = event.changedTouches[0].clientY;
      }

      var dx = touchEndClientX - touchStartClientX;
      var absDx = Math.abs(dx);

      var dy = touchEndClientY - touchStartClientY;
      var absDy = Math.abs(dy);

      if (Math.max(absDx, absDy) > 10) {
	// (right : left) : (down : up)
	self.emit("move", absDx > absDy ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0));
      }
    });
  }
};

// EventManager.prototype.restart = function (event) {
//   event.preventDefault();
//   this.emit("restart");
// };
// 
// EventManager.prototype.keepPlaying = function (event) {
//   event.preventDefault();
//   this.emit("keepPlaying");
// };

EventManager.prototype.bindButtonPress = function ( selector , fn ) {
  var button = document.querySelector( selector );
  if ( button ) {
    button.addEventListener("click", fn.bind(this));
    button.addEventListener(this.eventTouchend, fn.bind(this));
  }
};
