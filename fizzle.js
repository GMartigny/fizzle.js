import getDirection from "text-direction";

const fullCircle = Math.PI * 2;
const {
    random,
    floor,
    sqrt,
    abs,
    max,
} = Math;
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

const optionsKey = Symbol("_options");

/**
 * Class that render some text using dynamic bubbles
 * @class
 */
export default class Fizzle {
    /**
     * Fizzle constructor
     * @param {Array<String>|String} text - Any string
     * @param {FizzleOptions} [options] - Specific options
     */
    constructor (text, options) {
        this[optionsKey] = Object.assign(Fizzle.defaultOptions, options);

        this.bubbles = [];

        this.text = text;
    }

    /**
     * Return image data according to current options.
     * @return {Array}
     */
    getImageData () {
        const options = this[optionsKey];
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const font = `${options.bold ? "bold" : ""} ${options.italic ? "italic" : ""}
                      ${options.fontSize}px ${options.font}`;
        ctx.font = font;

        const textWidth = options.text.reduce((m, line) => max(m, floor(ctx.measureText(line).width)), 0);
        const textHeight = floor((options.text.length + 0.2) * options.fontSize);
        canvas.width = textWidth;
        canvas.height = textHeight;

        this.width = textWidth;
        this.height = textHeight;

        let imgData = [];

        if (this.width && this.height) {
            ctx.fillStyle = "#000";
            ctx.textAlign = options.align;
            ctx.textBaseline = "top";
            ctx.font = font;

            const textDirection = getDirection();
            let position = 0;
            if (options.align === Fizzle.alignments.right ||
                (textDirection === "rtl" && options.align === Fizzle.alignments.start) ||
                (textDirection === "ltr" && options.align === Fizzle.alignments.end)) {
                position = this.width;
            }
            else if (options.align === Fizzle.alignments.center) {
                position = this.width / 2;
            }
            options.text.forEach((line, n) => ctx.fillText(line, position, n * options.fontSize));
            imgData = ctx.getImageData(0, 0, this.width, this.height).data;
        }

        return imgData;
    }

    /**
     * Add bubbles according to current options.
     */
    build () {
        this.bubbles = [];
        const imgData = this.getImageData();
        const space = (this[optionsKey].fontSize / 1e5) * (1 / this[optionsKey].density);
        let counter = space / 2;
        const jump = 0.08 / sqrt(imgData.length);
        const colorLength = this[optionsKey].colors.length;
        for (let i = 0, l = imgData.length / 4; i < l; ++i) {
            counter -= (imgData[(i * 4) + 3] / 255) * jump;
            if (counter < 0) {
                const color = this[optionsKey].colors[floor(random() * colorLength)];
                this.bubbles.push(new Bubble(i % this.width, floor(i / this.width), color));
                counter = (random() + 1) * space;
            }
        }

        this.bubbles.sort(() => (random() * 2) - 1);
    }

    /**
     * Change text at runtime (trigger a rebuild).
     * @param {String} text - Any string
     */
    set text (text) {
        this[optionsKey].text = Array.isArray(text) ? text.map(str => str.toString()) : [text.toString().split(/\n/g)];
        this.build();
    }

    /**
     * Get current text.
     * @return {String}
     */
    get text () {
        return this[optionsKey].text.join("\n");
    }

    /**
     * Change font at runtime (trigger a rebuild).
     * @param {String} font - New value for font
     */
    set font (font) {
        this[optionsKey].font = font;
        this.build();
    }

    /**
     * Get the current font
     * @return {String}
     */
    get font () {
        return this[optionsKey].font;
    }

    /**
     * Change font-size at runtime (trigger a rebuild).
     * @param {Number} fontSize - New value for font-size
     */
    set fontSize (fontSize) {
        this[optionsKey].fontSize = fontSize;
        this.build();
    }

    /**
     * Get current font-size
     * @return {Number}
     */
    get fontSize () {
        return this[optionsKey].fontSize;
    }

    /**
     * Change if the font is bold at runtime (trigger a rebuild).
     * @param {Boolean} bold - New value for bold
     */
    set bold (bold) {
        this[optionsKey].bold = bold;
        this.build();
    }

    /**
     * Get whether font is bold
     * @return {Boolean}
     */
    get bold () {
        return this[optionsKey].bold;
    }

    /**
     * Change if the font is italic at runtime (trigger a rebuild).
     * @param {Boolean} italic - New value for italic
     */
    set italic (italic) {
        this[optionsKey].italic = italic;
        this.build();
    }

    /**
     * Get whether font is italic
     * @return {Boolean}
     */
    get italic () {
        return this[optionsKey].italic;
    }

    /**
     * Change text alignment at runtime (trigger a rebuild).
     * @param {String} align - New value for alignment
     */
    set align (align) {
        this[optionsKey].align = align;
        this.build();
    }

    /**
     * Get current alignment
     * @return {String}
     */
    get align () {
        return this[optionsKey].align;
    }

    /**
     * Change density at runtime (trigger a rebuild).
     * @param {Number} density - New value for density
     */
    set density (density) {
        this[optionsKey].density = density;
        this.build();
    }

    /**
     * Get current density
     * @return {Number}
     */
    get density () {
        return this[optionsKey].density;
    }

    /**
     * Change bubbles' speed at runtime
     * @param {Number} speed - New value for bubbles' speed
     */
    set speed (speed) {
        this[optionsKey].speed = speed;
    }

    /**
     * Get current bubbles' speed
     * @return {Number}
     */
    get speed () {
        return this[optionsKey].speed;
    }

    /**
     * Change bubbles' freedom at runtime
     * @param {Number} freedom - New value for bubbles' freedom
     */
    set freedom (freedom) {
        this[optionsKey].freedom = freedom;
    }

    /**
     * Get current bubbles' freedom
     * @return {Number}
     */
    get freedom () {
        return this[optionsKey].freedom;
    }

    /**
     * Change bubbles' size at runtime
     * @param {Number} size - New value for bubbles' size
     */
    set size (size) {
        this[optionsKey].size = size;
    }

    /**
     * Get current bubbles' size
     * @return {Number}
     */
    get size () {
        return this[optionsKey].size;
    }

    /**
     * Change bubbles' colors at runtime
     * @param {Array<String>} colors - New value for bubbles' colors
     */
    set colors (colors) {
        this[optionsKey].colors = colors;
        const colorLength = colors.length;
        this.bubbles.forEach(bubble => bubble.color = this[optionsKey].colors[floor(random() * colorLength)]);
    }

    /**
     * Get current bubbles' colors
     * @return {Array<String>}
     */
    get colors () {
        return this[optionsKey].colors;
    }

    /**
     * Render everything in a drawing context.
     * @param {CanvasRenderingContext2D} ctx - Drawing context
     * @return {Fizzle} Itself
     */
    render (ctx) {
        const speed = this.speed * (this.fontSize / 600);
        const freedom = this.freedom * (this.fontSize / 30);
        const size = this.size * (this.fontSize / 40);
        this.bubbles.forEach(bubble => bubble.move(speed, freedom).render(ctx, size));
        return this;
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
