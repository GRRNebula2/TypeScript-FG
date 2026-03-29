import type { GameObj, KaboomCtx, Vec2 } from "kaboom";
import { Directions } from "../types";


export function makeHealthBar(
    k: KaboomCtx,
    direction: Directions,
    owner: GameObj
) {

    const healthContainerPos: { [key: string]: Vec2 } = {
        LEFT: k.vec2(310, 40),
        RIGHT: k.vec2(972, 40),
    }

    const healthContainer = k.add([
        k.rect(600, 50),
        k.color(200, 0, 0),
        k.area(),
        k.anchor("center"),
        k.outline(4),
        k.pos(healthContainerPos[direction]),
        k.fixed(),
    ]);

    const healthDisplay = healthContainer.add([
        k.rect(600, 46),
        k.color(0, 200, 0),
        k.pos(-300, -23),
        k.rotate(0),
    ]);

    if (direction === Directions.RIGHT) {
        healthDisplay.rotateBy(180);
        healthDisplay.pos = k.vec2(300, 23);
    }

}