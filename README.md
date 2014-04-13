Proto*
======

[![Build Status](https://travis-ci.org/robotlolita/proto-star.png)](https://travis-ci.org/robotlolita/proto-star)
[![Dependencies Status](https://david-dm.org/robotlolita/proto-star.png)](https://david-dm.org/robotlolita/proto-star.png)
[![NPM version](https://badge.fury.io/js/proto-star.png)](http://badge.fury.io/js/proto-star)
[![experimental](http://hughsk.github.io/stability-badges/dist/experimental.svg)](http://github.com/hughsk/stability-badges)

Proxy-based Self-and-Slate-inspired slow-as-fuck multiple-delegation for
ECMAScript6-aka-JavaScript

## Example

```js
var Proto = require('proto-star')

var Healthy = Proto.cloneWith({
  move: function(direction) {
    this.x += direction * 2;
  }
})

var Hurt = Proto.cloneWith({
  move: function(direction) {
    this.x += direction
  }
})

var Shark = Proto.cloneWith({
  left: function() {
    this.move(-1)
    return this
  }
, right: function(){
    this.move(1)
    return this
  }
})

var bob = Shark.cloneWith({ x: 10 })
bob.addDelegation(Healthy)
bob.left() // { x: 8 }
bob.addDelegation(Hurt)
bob.left() // { x: 7 }
bob.removeDelegation(Hurt)
bob.left() // { x: 5 }
```

## Installing

    $ npm install proto-star
    
    
## Platform support

You'll need Node 0.11+ and run stuff with the `--harmony` flag.


## Licence

Copyright (c) 2013 Quildreen Motta.

Released under the [MIT licence](https://github.com/robotlolita/proto-star/blob/master/LICENCE).
