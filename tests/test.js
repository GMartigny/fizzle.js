import test from "ava";
import Fizzle from "..";

test("Default options", (t) => {
    const defaultOpts = Fizzle.defaultOptions;

    t.is(defaultOpts.font, "sans-serif");
    t.is(defaultOpts.fontSize, 200);
    t.is(defaultOpts.bold, true);
    t.is(defaultOpts.italic, false);
    t.is(defaultOpts.align, "start");
    t.true(Array.isArray(defaultOpts.colors));
    t.is(defaultOpts.density, 1);
    t.is(defaultOpts.size, 1);
    t.is(defaultOpts.speed, 1);
    t.is(defaultOpts.freedom, 1);

    const aligns = Fizzle.alignments;
    t.is(aligns.left, "left");
    t.is(aligns.center, "center");
    t.is(aligns.right, "right");
    t.is(aligns.start, "start");
    t.is(aligns.end, "end");
});

test("Creation", (t) => {
    // Overrides to avoid using canvas methods on node
    Fizzle.prototype.getImageData = () => {
        t.pass();
        return [];
    };
    t.plan(5);

    let text = "Test";
    const fizzle = new Fizzle(text);

    t.is(fizzle.bubbles.length, 0);
    t.is(fizzle.text, text);

    text = "Other";
    fizzle.text = text;
    t.is(fizzle.text, text);
});
