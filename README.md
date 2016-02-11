# ui.drag
Simple mousedrag event without jQuery


## Usage
```javascript
var param = {
  container: document.getElementById('pane'),
  el: document.getElementById('child'),
  debug: document.getElementById('logger')
}

new Drag(param, function(x, y) {
  // x is offset X, y is offset Y at el
  this._el.style.left = x + 'px';
  this._el.style.top = y + 'px';
});
```

If you wanna get more example, see index.html


## Support
- IE7,8,9,10,11
- Chrome
- Firefox
- Safari (only Mac)
