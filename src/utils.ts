

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