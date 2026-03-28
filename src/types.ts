
type TiledBaseLayer = {
    id: number;
    name: string;
    height: number;
    width: number;
    x: number;
    y: number;
    visible: boolean;
    opacity: number;
}

export type TiledTileLayer = TiledBaseLayer & {
    type: "tilelayer";
    data: number[];
    objects: never;
}

export type TileObjectLayer = TiledBaseLayer & {
    type: "objectgroup";
    data: never;
    objects: TiledObject[];
}

export type TiledLayer = TiledTileLayer | TileObjectLayer;


export type TiledObject = {
    height: number;
    id: number;
    name: string;
    point: boolean;
    rotation: number;
    type: string;
    visible: boolean;
    width: number;
    x: number;
    y: number;
}