import type { KaboomCtx } from "kaboom";
import k from "./kaboomCtx";
import { fetchMapData } from "./utils";

k.loadSprite(
    "background-layer-1",
    "./assets/background/background_layer_1.png"
);

k.loadSprite(
    "background-layer-2",
    "./assets/background/background_layer_2.png"
);

k.loadSprite("shop", "./assets/shop_anim.png", {
    sliceX: 6,
    sliceY: 1,
    anims: {
        default: {
            from: 0,
            to: 5,
            loop: true,
        },
    },
});

k.loadSprite("fence-1", "./assets/fence_1.png");


async function arena(k: KaboomCtx) {
    k.add([k.sprite("background-layer-1"), k.pos(0, 0), k.scale(4), k.fixed()]);
    k.add([k.sprite("background-layer-2"), k.pos(0, 0), k.scale(4), k.fixed()]);

    const { layers, tilewidth, tileheight } = await fetchMapData(
        "./maps/arena.tmj"
    );

    const map = k.add([k.pos(0, 0)]);

    let layer;
    for (layer of layers) {
        if (
            layer.name === "DecorationSpawnPoints" &&
            layer.type === "objectgroup"
        ) {
            for (const object of layer.objects) {
                switch (object.name) {
                    case "shop":
                        map.add([
                            k.sprite("shop", { anim: "default" }),
                            k.pos(object.x, object.y),
                            k.area(),
                            k.anchor("center"),
                        ]);
                        break;
                    case "fence-1":
                        map.add([
                            k.sprite("fence-1"),
                            k.pos(object.x, object.y + 6),
                            k.area(),
                            k.anchor("center"),
                        ]);
                        break;
                    default:
                }
            }

        }
    }

    k.camPos(k.center().x - 450, k.center().y - 160);
    k.camScale(4, 4);

}

k.scene("arena", () => arena(k));

k.go("arena");