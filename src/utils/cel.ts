import { Point } from "../types"

export type Cel = {
    center: Point,
    mouse: Point,
    direction: Point
}

export function scaleFromCenter(cel: Cel, factor: number): Point {
    return {
        x: cel.center.x + cel.direction.x * factor,
        y: cel.center.y + cel.direction.y * factor
    }
}