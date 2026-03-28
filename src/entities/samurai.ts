import type { GameObj, KaboomCtx, Vec2 } from "kaboom";


export function makeSamurai(
    k: KaboomCtx,
    parent: GameObj,
    pos: Vec2
) {
    let gameObj = parent.add([
        k.sprite("samurai", { anim: "idle" }),
        k.pos(pos),
        k.area({
            shape: new k.Rect(k.vec2(0), 20, 40),
            collisionIgnore: ["ninja"]
        }),
        k.anchor("center"),
        k.body(),
        k.health(10),
        k.opacity(),
        "samurai",
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