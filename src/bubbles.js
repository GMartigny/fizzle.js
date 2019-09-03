import { Particles, Circle, Position } from "pencil.js";

/**
 * @class
 */
export default class Bubbles extends Particles {
    /**
     * Bubbles constructor
     * @param {Array<Position>} positions -
     * @param {Number} radius -
     * @param {String} color -
     * @param {Number} freedom -
     */
    constructor (positions, radius, color, freedom, speed) {
        const base = new Circle(undefined, radius, {
            fill: color,
        });
        const unit = new Position(speed * 0.15, 0);
        const { random } = Math;
        const initializer = index => ({
            position: Position.from(positions[index]).clone(),
            speed: unit.clone().rotate(random()),
        });
        const updater = freedom > 0 && ((data, index) => {
            data.position.add(data.speed);
            const move = data.position.clone().subtract(positions[index]);
            if ((data.speed.x > 0 && move.x > freedom) || (data.speed.x < 0 && move.x < -freedom)) {
                data.speed.x *= -1;
            }
            if ((data.speed.y > 0 && move.y > freedom) || (data.speed.y < 0 && move.y < -freedom)) {
                data.speed.y *= -1;
            }
        });
        super(undefined, base, positions.length, initializer, updater);
    }
}
