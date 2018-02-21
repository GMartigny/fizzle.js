import random from "random-int";
import getDirection from "text-direction";

const fullCircle = Math.PI * 2;

/**
 * Class for a single circle on a Fizzle
 * @class
 */
class Bubble {
    /**
     * Bubble constructor
     * @param {Number} x - Horizontal position
     * @param {Number} y - Vertical position
     */
    constructor (x, y) {
        this.x = x;
        this.y = y;
        this.diffX = 0;
        this.diffY = 0;
        this.speedX = random(10, 100) / 100;
        this.speedY = 1 - this.speedX;
    }

    /**
     * Draw this in a context
     * @param {CanvasRenderingContext2D} ctx - Drawing context
     * @param {Number} radius - Bubble's radius
     * @return {Bubble} Itself
     */
    render (ctx, radius) {
        ctx.arc(this.x + this.diffX, this.y + this.diffY, radius, 0, fullCircle);
        return this;
    }

    /**
     * Move the bubble around
     * @param {Number} speed - Speed of movement (in pixel)
     * @param {Number} freedom - Bound for bubble's movement (in pixel)
     * @return {Bubble} Itself
     */
    move (speed, freedom) {
        this.diffX += this.speedX * speed;
        this.diffY += this.speedY * speed;

        if ((this.diffX > freedom && this.speedX > 0) || (this.diffX < freedom && this.speedX < 0)) {
            this.speedX *= -1;
        }
        if ((this.diffY > freedom && this.speedY > 0) || (this.diffY < freedom && this.speedY < 0)) {
            this.speedY *= -1;
        }

        return this;
    }
}

/**
 * @typedef {Object} FizzleOptions
 * @prop {String} [font="sans-serif"] - Font to use. Can be anything as long as it's installed on client computer.
 * @prop {Number} [fontSize=10] - Size of the text in pixel.
 * @prop {String} [align="start"] - Text horizontal alignment. Can be read from Fizzle.alignments.
 * Values "start" and "end" are relative to computer settings.
 * @prop {Array<String>} [colors=["#31ffb7", "#ffb031", "#c1ff31", "#7931ff"]] - Set of color to choose from randomly.
 * @prop {Number} [size=5] - Radius of the bubbles.
 * @prop {Number} [density=0.5] - Ratio between 0 and 1 for bubbles' density (relative to fontSize).
 * Can go higher than 1 for extreme density, can induce lag, use at your own risk (0 means no bubbles)
 * @prop {Number} [speed=0.5] - Speed of movements of bubbles in pixels (0 means no movement).
 * @prop {Number} [freedom=10] - Bounds for bubbles movements in pixels (0 means no movement).
 */

/**
 * Class that render some text using dynamic bubbles
 * @class
 */
export default class Fizzle {
    /**
     * Fizzle constructor
     * @param {Array<String>|String} text -
     * @param {FizzleOptions} options -
     */
    constructor (text, options) {
        const lines = Array.isArray(text) ? text.map(str => str.toString()) : [text.toString()];
        const mergedOptions = Object.assign(Fizzle.defaultOptions, options);

        this.bubbles = {};
        this.size = mergedOptions.size;
        this.speed = mergedOptions.speed;
        this.freedom = mergedOptions.freedom;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#000";
        ctx.font = `${mergedOptions.fontSize}px ${mergedOptions.font}`;
        ctx.textAlign = mergedOptions.align;
        ctx.textBaseline = "top";
        const textWidth = lines.reduce((max, line) => Math.max(max, ctx.measureText(line).width), 0);
        const textHeight = (lines.length + 0.2) * mergedOptions.fontSize;
        canvas.width = textWidth;
        canvas.height = textHeight;
        const textDirection = getDirection();
        let position = 0;
        if (mergedOptions.align === Fizzle.alignments.right ||
            (textDirection === "rtl" && mergedOptions.align === Fizzle.alignments.start) ||
            (textDirection === "ltr" && mergedOptions.align === Fizzle.alignments.end)) {
            position = textWidth;
        }
        else if (mergedOptions.align === Fizzle.alignments.center) {
            position = textWidth / 2;
        }
        lines.forEach((line, n) => ctx.fillText(line, position, n * mergedOptions.fontSize));
        const imgData = ctx.getImageData(0, 0, textWidth, textHeight).data;

        let space = 0;
        const colorLength = mergedOptions.colors.length - 1;
        for (let i = 3, l = imgData.length; i < l; i += 4) {
            space -= +(imgData[i] === 0);
            if (space < 0) {
                const color = mergedOptions.colors[random(0, colorLength)];
                if (!this.bubbles[color]) {
                    this.bubbles[color] = [];
                }
                this.bubbles[color].push(new Bubble((i / 4) % textWidth, (i / 4) / textWidth));
                space = mergedOptions.fontSize * (1 / mergedOptions.density);
            }
        }
    }

    /**
     * Render everything in a drawing context
     * @param {CanvasRenderingContext2D} ctx - Drawing context
     * @return {Fizzle} Itself
     */
    render (ctx) {
        Object.keys(this.bubbles).forEach((color) => {
            ctx.fillStyle = color;
            ctx.beginPath();

            this.bubbles[color].forEach(bubble => bubble.move(this.speed, this.freedom).render(ctx, this.size));

            ctx.fill();
        });
        return this;
    }

    /**
     * Return the default options for a Fizzle
     * @return {FizzleOptions}
     */
    static get defaultOptions () {
        return {
            font: "sans-serif",
            fontSize: 10,
            align: Fizzle.alignments.start,
            colors: ["#31ffb7", "#ffb031", "#c1ff31", "#7931ff"],
            size: 5,
            density: 0.5,
            speed: 0.5,
            freedom: 10,
        };
    }

    /**
     * Enum of possible horizontal alignment
     * @return {{left, center, right, start, end}}
     */
    static get alignments () {
        return {
            left: "left",
            center: "center",
            right: "right",
            start: "start",
            end: "end",
        };
    }
}
