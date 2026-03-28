import type { KaboomCtx } from "kaboom";
import k from "./kaboomCtx";
import { drawTile, fetchMapData } from "./utils";

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

k.loadSprite("tileset", "./assets/oak_woods_tileset.png", {
    sliceX: 31,
    sliceY: 22,
});

async function arena(k: KaboomCtx) {
    k.add([k.sprite("background-layer-1"), k.pos(0, 0), k.scale(4), k.fixed()]);
    k.add([k.sprite("background-layer-2"), k.pos(0, 0), k.scale(4), k.fixed()]);

    const { layers, tilewidth, tileheight } = await fetchMapData(
        "./maps/arena.tmj"
    );

    const map = k.add([k.pos(0, 0)]);

    for (const layer of layers) {
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
                            k.pos(object.x, object.y + 9),
                            k.area(),
                            k.anchor("center"),
                        ]);
                        break;
                    default:
                }
            }
            continue;
        }

        if (layer.name === "Boundaries" && layer.type === "objectgroup") {
            for (const object of layer.objects) {
                map.add([
                    k.area({ shape: new k.Rect(k.vec2(0), object.width, object.height) }),
                    k.pos(object.x, object.y + tileheight),
                    k.body({ isStatic: true }),
                ])
            }
            continue;
        }

        if (layer.name === "SpawnPoints" && layer.type === "objectgroup") {
            //todo
        }

        if (layer.type === "tilelayer") {
            drawTile(k, map, layer, tilewidth, tileheight);
        }
    }

    k.camPos(k.center().x - 450, k.center().y - 160);
    k.camScale(4, 4);

}

k.scene("arena", () => arena(k));

k.go("arena");