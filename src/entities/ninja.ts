import type { GameObj, KaboomCtx, Vec2 } from "kaboom";


export function makeNinja(
    k: KaboomCtx,
    parent: GameObj,
    pos: Vec2
) {
    let gameObj = parent.add([
        k.sprite("ninja", { anim: "idle" }),
        k.pos(pos),
        k.area({
            shape: new k.Rect(k.vec2(0, 6), 20, 40),
            collisionIgnore: ["samurai"]
        }),
        k.anchor("center"),
        k.body(),
        k.health(10),
        k.opacity(),
        "ninja",
        {

        },
    ]);

    return {
        gameObj,
        setControls: () => {
            //todo
        },
    }
}