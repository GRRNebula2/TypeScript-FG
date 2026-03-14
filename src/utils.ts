import type { GameObj, KaboomCtx } from "kaboom";
import type { TiledTileLayer } from "./types";


export async function fetchMapData(mapFilePath: string) {

    if (!mapFilePath.includes("tmj")) {
        throw new Error("Map file path is invalid")
    }

    const response = await fetch(mapFilePath)
    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return await response.json()

}

export function drawTile(
    k: KaboomCtx,
    map: GameObj,
    layer: TiledTileLayer,
    tilewidth: number,
    tileheight: number
) {
    let numberOfDrawnTiles = 0
    const tilePos = k.vec2(0, 0);

    for (const tileNumber of layer.data) {
        if (numberOfDrawnTiles % layer.width === 0) {
            tilePos.x = 0;
            tilePos.y += tileheight;
        }
        else {
            tilePos.x += tilewidth;
        }

        numberOfDrawnTiles++;

        if (tileNumber === 0) continue;

        map.add([
            k.sprite("tileset", { frame: tileNumber - 1 }),
            k.pos(tilePos),
            k.offscreen()
        ])
    }
}