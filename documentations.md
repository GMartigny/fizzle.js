# Documentations

## Fizzle

Main class for the animation.

    new Fizzle(text, [options]);

| Name | Type | Default | Comment |
| --- | --- | --- | --- |
| text | ``String\|Array<String>`` | Required | String to use or array of string for multi-lines |
| options | ``FizzleOptions`` | see [FizzleOptions](#fizzleoptions) | String to use or array of string for multi-lines |


### Methods

All values from ``options`` are dynamically editable by setting property in the object.

```js
const fizzle = new Fizzle("Text");
fizzle.text = "Another text"; // Change text
fizzle.font = "comic-sans"; // Change font
fizzle.speed = 0.5; // Change bubbles speed
// ...
```

#### render
Render everything in a drawing context.
```js
fizzle.render(ctx);
```

| Name | Type | Default | Comment |
| --- | --- | --- | --- |
| ctx | ``CanvasRenderingContext2D`` | Required | Drawing context |


#### build
Add bubbles according to current options.
```js
fizzle.build();
```

## FizzleOptions

Options for the animation.

default :

```js
options = {
  font: "sans-serif",
  fontSize: 200,
  bold: true,
  italic: false,
  align: "start",
  colors: ["#31ffb7", "#ffb031", "#c1ff31", "#7931ff"],
  density: 1,
  size: 1,
  speed: 1,
  freedom: 1,
};
```

### Properties

| Name | Type | Default | Comment |
| --- | --- | --- | --- |
| font | ``String`` | ``"sans-serif"`` | Font to use. Can be anything as long as it's installed on client computer. |
| fontSize | ``Number`` | ``200`` | Size of the text in pixel. |
| bold | ``Boolean`` | ``true`` | Should the text be bold (I advise you to use bold). |
| italic | ``Boolean`` | ``false`` | Should the text be italic. |
| align | ``String`` | ``"start"`` | Text horizontal alignment. Can be read from Fizzle.alignments.<br>Values "start" and "end" are relative to computer settings |
| colors | ``Array<String>`` | ``["#31ffb7", "#ffb031", "#c1ff31", "#7931ff"]`` | Set of color to choose from randomly. |
| density | ``Number`` | ``1`` | Ratio for bubbles' density relative to fontSize.<br> It can go higher than 1 for extreme density, can induce lag, use at your own risk (0 means no bubbles). |
| size | ``Number`` | ``1`` | Radius of the bubbles relative to fontSize (0 means no bubbles). |
| speed | ``Number`` | ``1`` | Speed of movements of bubbles relative to fontSize (0 means no movement). |
| freedom | ``Number`` | ``1`` | Bounds for bubbles movements relative to fontSize (0 means no movement). |
