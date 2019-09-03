import { Scene, OffScreenCanvas, Text } from "pencil.js";
import Bubbles from "./bubbles";

/**
 * Class that render some text using dynamic bubbles
 * @class
 */
export default class Fizzle {
    /**
     * Fizzle constructor
     * @param {Array<String>|String} text - Any string
     * @param {CanvasRenderingContext2D} context -
     * @param {FizzleOptions} [options] - Specific options
     */
    constructor (text, context, options) {
        this.options = {
            ...Fizzle.defaultOptions,
            ...options,
        };

        this.container = new Scene(context.canvas);

        this.text = text;

        this.build();

        this.container.startLoop();
    }

    /**
     * Return image data according to current options.
     * @return {Array}
     */
    getImageData () {
        const { font, fontSize, bold, italic, align } = this.options;
        const text = new Text(undefined, this.text, {
            font,
            fontSize,
            bold,
            italic,
            align,
        });
        const offscreen = new OffScreenCanvas(text.width, text.height);
        offscreen.add(text).render();
        return offscreen.getImageData();
    }

    /**
     * Add bubbles according to current options.
     */
    build () {
        this.container.empty();

        const { floor, random, sqrt } = Math;
        const { density, colors, radius, freedom, speed } = this.options;
        const positions = {};
        const { data, width } = this.getImageData();

        const size = sqrt(data.length);
        const space = this.options.fontSize / (density * 22);
        let counter = space / 2;
        const colorLength = colors.length;
        for (let i = 0, l = data.length / 4; i < l; ++i) {
            const value = data[(i * 4) + 3] / 255;
            counter -= value / space;
            if (counter < 0) {
                const color = colors[floor(random() * colorLength)];
                if (!positions[color]) {
                    positions[color] = [];
                }
                positions[color].push([i % width, floor(i / width)]);
                counter = space;
            }
        }

        const moves = (this.options.fontSize * freedom) / 30;
        console.log(moves);
        Object.keys(positions).forEach((color) => {
            const bubbles = new Bubbles(positions[color], radius, color, moves, speed);
            this.container.add(bubbles);
        });
    }

    get width () {
        return Text.measure(this.text, this.options).width;
    }

    get height () {
        return Text.measure(this.text, this.options).height;
    }

    /**
     * @typedef {Object} FizzleOptions
     * @prop {String} [font="sans-serif"] - Font to use. Can be anything as long as it's installed on client computer.
     * @prop {Number} [fontSize=200] - Size of the text in pixel.
     * @prop {Boolean} [bold=true] - Should the text be bold (I advise you to use bold).
     * @prop {Boolean} [italic=false] - Should the text be italic.
     * @prop {String} [align=Fizzle.alignments.start] - Text horizontal alignment. Can be read from Fizzle.alignments.
     * Values "start" and "end" are relative to computer settings.
     * @prop {Array<String>} [colors=["#31ffb7", "#ffb031", "#c1ff31", "#7931ff"]] - Set of color to choose from randomly.
     * @prop {Number} [density=1] - Ratio for bubbles' density relative to fontSize.
     * It can go higher than 1 for extreme density, can induce lag, use at your own risk (0 means no bubbles).
     * @prop {Number} [size=1] - Radius of the bubbles relative to fontSize (0 means no bubbles).
     * @prop {Number} [speed=1] - Speed of movements of bubbles relative to fontSize (0 means no movement).
     * @prop {Number} [freedom=1] - Bounds for bubbles movements relative to fontSize (0 means no movement).
     */
    /**
     * Return the default options for a Fizzle.
     * @return {FizzleOptions}
     */
    static get defaultOptions () {
        return {
            font: "sans-serif",
            fontSize: 200,
            bold: true,
            italic: false,
            align: Text.alignments.start,
            colors: ["#31ffb7", "#ffb031", "#c1ff31", "#7931ff"],
            density: 1,
            radius: 8,
            speed: 1,
            freedom: 1,
        };
    }
}
