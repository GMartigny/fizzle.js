import getDirection from "text-direction";

const fullCircle = Math.PI * 2;
const { random, floor, sqrt, abs, max } = Math;
const plusOrMinus = () => Math.sign(random() - 0.5);

/**
 * Class for a single circle on a Fizzle
 * @class
 */
class Bubble {
    /**
     * Bubble constructor
     * @param {Number} x - Horizontal position
     * @param {Number} y - Vertical position
     * @param {String} color - Color string
     */
    constructor (x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.diffX = 0;
        this.diffY = 0;
        this.speedX = ((random() / 2) + 0.25) * plusOrMinus();
        this.speedY = (1 - abs(this.speedX)) * plusOrMinus();
    }

    /**
     * Draw this in a context
     * @param {CanvasRenderingContext2D} ctx - Drawing context
     * @param {Number} radius - Bubble's radius
     * @return {Bubble} Itself
     */
    render (ctx, radius) {
        const x = this.x + this.diffX;
        const y = this.y + this.diffY;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(x, y, radius, 0, fullCircle);
        ctx.fill();
        return this;
    }

    /**
     * Move the bubble around
     * @param {Number} speed - Speed of movement (in pixel)
     * @param {Number} freedom - Bound for bubble's movement (in pixel)
     * @return {Bubble} Itself
     */
    move (speed, freedom) {
        if (freedom > 0) {
            this.diffX += this.speedX * speed;
            this.diffY += this.speedY * speed;
        }

        if ((this.diffX > freedom && this.speedX > 0) || (this.diffX < -freedom && this.speedX < 0)) {
            this.speedX *= -1;
        }
        if ((this.diffY > freedom && this.speedY > 0) || (this.diffY < -freedom && this.speedY < 0)) {
            this.speedY *= -1;
        }

        return this;
    }
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
 It can go higher than 1 for extreme density, can induce lag, use at your own risk (0 means no bubbles)
 * @prop {Number} [size=1] - Radius of the bubbles relative to fontSize (0 means no bubbles).
 * @prop {Number} [speed=1] - Speed of movements of bubbles relative to fontSize (0 means no movement).
 * @prop {Number} [freedom=1] - Bounds for bubbles movements relative to fontSize (0 means no movement).
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

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const font = `${mergedOptions.bold ? "bold" : ""} ${mergedOptions.italic ? "italic" : ""}
                      ${mergedOptions.fontSize}px ${mergedOptions.font}`;
        ctx.font = font;
        const textWidth = lines.reduce((current, line) => max(current, floor(ctx.measureText(line).width)), 0);
        const textHeight = floor((lines.length + 0.2) * mergedOptions.fontSize);
        canvas.width = textWidth;
        canvas.height = textHeight;

        this.bubbles = [];
        this.size = mergedOptions.size * (mergedOptions.fontSize / 25);
        this.speed = mergedOptions.speed * (mergedOptions.fontSize / 600);
        this.freedom = mergedOptions.freedom * (mergedOptions.fontSize / 30);
        this.width = textWidth;
        this.height = textHeight;

        ctx.fillStyle = "#000";
        ctx.textAlign = mergedOptions.align;
        ctx.textBaseline = "top";
        ctx.font = font;

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

        const space = (mergedOptions.fontSize / 1e5) * (1 / mergedOptions.density);
        let counter = space / 2;
        const jump = 0.05 / sqrt(imgData.length);
        const colorLength = mergedOptions.colors.length;
        for (let i = 0, l = imgData.length / 4; i < l; ++i) {
            counter -= (imgData[(i * 4) + 3] / 255) * jump;
            if (counter < 0) {
                const color = mergedOptions.colors[floor(random() * colorLength)];
                this.bubbles.push(new Bubble(i % textWidth, floor(i / textWidth), color));
                counter = (random() + 1) * space;
            }
        }

        this.bubbles.sort(() => (random() * 2) - 1);
    }

    /**
     * Render everything in a drawing context
     * @param {CanvasRenderingContext2D} ctx - Drawing context
     * @return {Fizzle} Itself
     */
    render (ctx) {
        this.bubbles.forEach(bubble => bubble.move(this.speed, this.freedom).render(ctx, this.size));
        return this;
    }

    /**
     * Return the default options for a Fizzle
     * @return {FizzleOptions}
     */
    static get defaultOptions () {
        return {
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
