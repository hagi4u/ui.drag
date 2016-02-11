;(function(window) {
  function Drag(param, callback) {
    var self = this;

    /*
     * Public variables
     */

    self.X = 0;
    self.Y = 0;

    /*
     * Private variables
     */

    self._container = param.container
    self._el = param.el;
    self._debug = param.debug;
    self._callback = callback;

    self._target;

    self._oldZindex = 0;
    self._isMouseDown = false;

    self._start = {
      X :0,
      Y: 0
    };
    self._offset = {
      X: 0, 
      Y: 0
    };
    self._limitX = {
      'left': 0,
      'right': null
    };
    self._limitY = {
      'top': 0,
      'bottom': null
    };

    this.setLimit(self);

    // Default Event Bind
    self._el.style.left = self._limitX.left + 'px';
    self._el.style.top = self._limitY.top + 'px';

    self._container.onmousedown = function(e) {
      self.onmousedown(e, self);
    };

    self._container.onmouseup = function(e) {
      self.onmouseup(e, self);  
      if( !self.checkLimit(self) ) return true;
    };

    self._container.onmousemove = function(e) {
      if (self._isMouseDown)
        self.onmousemove(e, self);
    };

    self._container.onselectstart = function() {
      return false;
    };

    window.onresize = function(e){
      self.setLimit(self);
      self.checkLimit(self);
    };
  };

  Drag.prototype.onmousemove = function(e, self) {
    if( !self.checkLimit(self) ) 
      self._isMouseDown = false;

    if (e == null)
      e = window.event;

    self.X= (self._offset.X + e.clientX - self._start.X),
    self.Y = (self._offset.Y + e.clientY - self._start.Y)

    self._callback(self.X, self.Y);
  };

  Drag.prototype.onmousedown = function(e, self) {
    if (e == null)
      e = window.event;

    self._target = (e.target !== null && typeof e.target !== "undefined") ? e.target : e.srcElement;
    self._debug.innerHTML = (self._target.className === 'window') ? 'draggable element clicked' : 'NON-draggable element clicked';

    if ((e.button === 1 && window.event !== null ||
        e.button === 0) && self._target.className === 'window') {

      self._isMouseDown = true;

      self._start.X = e.clientX;
      self._start.Y = e.clientY;

      self._offset.X = self.X;
      self._offset.Y = self.Y;

      self._oldZindex = self._target.style.zIndex;

      self._target.style.zIndex = 1000;
      self._target.ondragstart = function() {
        return false;
      };

      return false;
    }
  };

  Drag.prototype.onmouseup = function(e, self) {
    if (self._target !== null) {
      self._target = null;
      self._isMouseDown = false;
    }
  };

  Drag.prototype.setLimit = function(self){
    var 
    container = {
      width : self._container.clientWidth,
      height: self._container.clientHeight
    },
    elem = {
      width: self._el.clientWidth,
      height: self._el.clientHeight
    };
    var
    limit = {
      'x': container.width - elem.width,
      'y': container.height - elem.height
    };

    ( limit.x > 0 ) ? limit.x = limit.x * -1 : limit.x;
    ( limit.y > 0 ) ? limit.y = limit.y * -1 : limit.y;

    self._limitX.right = limit.x;
    self._limitY.bottom = limit.y;
  };

  Drag.prototype.checkLimit = function(self){
    /*
     * @cond: Axis X (Left, Right limit)
     */
    if( self._limitX.left < self.X ){
      self._isMouseDown = false;
      self.X = self._limitX.left;
      self._el.style.left = self._limitX.left + 'px';
      
      return false;
    } 
    if( self._limitX.right > self.X ){
      self._isMouseDown = false;
      self.X = self._limitX.right;
      self._el.style.left = self._limitX.right + 'px';
      
      return false;
    }
    /*
     * @cond: Axis Y (Top, Bottom limit)
     */
    if( self._limitY.top < self.Y ){
      self._isMouseDown = false;
      self.Y = self._limitY.top;
      self._el.style.top = self._limitY.top + 'px';
      
      return false;
    }
    if( self._limitY.bottom > self.Y ){
      self._isMouseDown = false;
      self.Y = self._limitY.bottom;
      self._el.style.top = self._limitY.bottom + 'px';
      
      return false;
    }

    return true;
  };

  // ---------------------------------------------------------
  // Utilities
  // ---------------------------------------------------------

  Drag.prototype.parseNumber = function(value) {
    var n = parseInt(value);
    return n == null || isNaN(n) ? 0 : n;
  };

  window.Drag = Drag;
})(window);
