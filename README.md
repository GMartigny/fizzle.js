# Fizzle.js
[![dependencies Status](https://david-dm.org/GMartigny/fizzle.js/status.svg)](https://david-dm.org/GMartigny/fizzle.js)
[![devDependencies Status](https://david-dm.org/GMartigny/fizzle.js/dev-status.svg)](https://david-dm.org/GMartigny/fizzle.js?type=dev)

![Sample Fizzle](https://media.giphy.com/media/7YCBAYKAP00yeyQwy5/giphy.gif)

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
        font: "monospace",
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

## "But, I don't like modules and I just want to run this code on my customer's browser ..."

Ok, I got you. If you want to go old-school, just load the script with [unpkg](https://unpkg.com/) or [jsdelivr](https://www.jsdelivr.com/).

```html
    <script src="https://unpkg.com/fizzle.js"></script>
    <!-- or -->
    <script src="https://cdn.jsdelivr.net/npm/fizzle.js"></script>
```


## Documentation

### Fizzle

Main animation class for the animation.

    new Fizzle(text, [options]);

**text** - String to use or array of string for multi-lines<br>
type: ``Array<String>\|String``

**[options]** - Rendering options<br>
type: ``FizzleOptions``<br>

Returned object will expose :

**bubbles** - Array of all the bubbles.<br>
type: ``Array``

**size** - Bubbles current radius, can be dynamically edited (see FizzleOptions).<br>
type: ``Number``

**speed** - Bubbles current speed, can be dynamically edited (see FizzleOptions).<br>
type: ``Number``

**freedom** - Bubbles current bounds, can be dynamically edited (see FizzleOptions).<br>
type: ``Number``

**width** - Total width.<br>
type: ``Number``

**height** - Total height.<br>
type: ``Number``


### FizzleOptions
Set of options for the fizzle object.

default:
```js
options = {
    font: "sans-serif",
    fontSize: 200,
    bold: true,
    italic: false,
    align: Fizzle.alignments.start,
    colors: ["#31ffb7", "#ffb031", "#c1ff31", "#7931ff"],
    density: 1,
    size: 1,
    speed: 1,
    freedom: 1,
}
```

#### Params

**[font]** - Font to use. Can be anything as long as it's installed on client computer.<br>
type: ``String``<br>
default: ``"sans-serif"``

**[fontSize]** - Size of the text in pixel.<br>
type: ``Number``<br>
default: ``200``

**[bold]** - Should the text be bold (I advise you to use bold).<br>
type: ``Boolean``<br>
default: ``true``

**[italic]** - Should the text be italic.<br>
type: ``Boolean``<br>
default: ``false``

**[align]** - Text horizontal alignment. Can be read from ``Fizzle.alignments``.
Values ``start`` and ``end`` are relative to computer settings.<br>
type: ``String``<br>
default: ``Fizzle.alignments.start``

**[colors]** - Set of color to choose from randomly.<br>
type: ``Array<String>``<br>
default: ``["#31ffb7", "#ffb031", "#c1ff31", "#7931ff"]``

**[density]** - Ratio for bubbles' density relative to fontSize.
It can go higher than 1 for extreme density, can induce lag, use at your own risk (0 means no bubbles).<br>
type: ``Number``<br>
default: ``1``

**[size]** - Radius of the bubbles relative to fontSize (0 means no bubbles).<br>
type: ``Number``<br>
default: ``1``

**[speed]** - Speed of movements of bubbles relative to fontSize (0 means no movement).<br>
type: ``Number``<br>
default: ``1``

**[freedom]** - Bounds for bubbles movements relative to fontSize (0 means no movement).<br>
type: ``Number``<br>
default: ``1``


## License

MIT
