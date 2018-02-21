# Fizzle.js
Write any text in a canvas with fizzly bubbles.

# Installation

    npm install fizzle.js

# Usage

Once installed, add it to your project with common.js or ES6 syntax :

```js
    const Fizzle = require("fizzle.js");
    // or
    import Fizzle from "fizzle.js";
```

Then, you can start to use it on your code :

```js
    const text = "Hello world";
    const options = {
        font: "cursive",
        fontSize: 42,
        colors: ["red", "green", "blue"]
    };
    // Instantiate a new Fizzle
    let myFyzzle = new Fizzle(text, options);
    let ctx = myCanvas.getContext("2d");
    
    // Function run each frame
    function loop () {
        ctx.save();
        ctx.translate(x, y); // move to desired location
        myFyzzle.render(ctx); // draw it
        ctx.restore();
    }
```

Since today's web browser don't support module requirements yet, you need to use a bundler like [webpack](https://webpack.js.org/) or [browserify](http://browserify.org/).

## Documentation

### Fizzle

Main animation class for the animation.

    new Fizzle(text, [options]);

**text** - String to use or array of string for multi-lines<br>
type: ``Array<String>\|String``

**[options]** - Rendering options<br>
type: ``FizzleOptions``<br>

Returned object will expose :

**bubbles** - 
type: ``Object``

**size** - Bubbles current radius, can be dynamically edited (see FizzleOptions).
type: ``Number``

**speed** - Bubbles current speed, can be dynamically edited (see FizzleOptions).
type: ``Number``

**freedom** - Bubbles current bounds, can be dynamically edited (see FizzleOptions).
type: ``Number``


### FizzleOptions
Set of options for the fizzle object.

default:
```js
options = {
    font: "sans-serif",
    fontSize: 10,
    align: Fizzle.alignments.start,
    colors: ["#31ffb7", "#ffb031", "#c1ff31", "#7931ff"],
    size: 5,
    density: 0.5,
    speed: 0.5,
    freedom: 10,
}
```

#### Params

**[font]** - Font to use. Can be anything as long as it's installed on client computer.<br>
type: ``String``<br>
default: ``"sans-serif"``

**[fontSize]** - Size of the text in pixel.<br>
type: ``Number``<br>
default: ``10``

**[align]** - Text horizontal alignment. Can be read from ``Fizzle.alignments``.
Values ``start`` and ``end`` are relative to computer settings.<br>
type: ``String``<br>
default: ``Fizzle.alignments.start``

**[colors]** - Set of color to choose from randomly.<br>
type: ``Array<String>``<br>
default: ``["#31ffb7", "#ffb031", "#c1ff31", "#7931ff"]``

**[size]** - Radius of the bubbles.<br>
type: ``Number``<br>
default: ``5``

**[density]** - Ratio between 0 and 1 for bubbles' density (relative to fontSize).
Can go higher than 1 for extreme density, can induce lag, use at your own risk (0 means no bubbles).<br>
type: ``Number``<br>
default: ``0.5``

**[speed]** - Speed of movements of bubbles in pixels (0 means no movement).<br>
type: ``Number``<br>
default: ``0.5``

**[freedom]** - Bounds for bubbles movements in pixels (0 means no movement).<br>
type: ``Number``<br>
default: ``10``


## License

MIT
