/* global jest test expect */

import Fizzle from "./fizzle";

test("Default options", () => {
    const defaultOpts = Fizzle.defaultOptions;

    expect(defaultOpts.font).toBe("sans-serif");
    expect(defaultOpts.fontSize).toBe(200);
    expect(defaultOpts.bold).toBe(true);
    expect(defaultOpts.italic).toBe(false);
    expect(defaultOpts.align).toBe("start");
    expect(defaultOpts.colors).toBeDefined();
    expect(defaultOpts.density).toBe(1);
    expect(defaultOpts.size).toBe(1);
    expect(defaultOpts.speed).toBe(1);
    expect(defaultOpts.freedom).toBe(1);

    const aligns = Fizzle.alignments;
    expect(aligns.left).toBe("left");
    expect(aligns.center).toBe("center");
    expect(aligns.right).toBe("right");
    expect(aligns.start).toBe("start");
    expect(aligns.end).toBe("end");
});

test("Creation", () => {
    // Overrides to avoid using canvas methods on node
    Fizzle.prototype.getImageData = jest.fn(() => []);

    let text = "Test";
    const fizzle = new Fizzle(text);

    expect(fizzle.bubbles.length).toBe(0);
    expect(fizzle.text).toBe(text);
    expect(Fizzle.prototype.getImageData.mock.calls.length).toBe(1);

    text = "Other";
    fizzle.text = text;
    expect(fizzle.text).toBe(text);
});
