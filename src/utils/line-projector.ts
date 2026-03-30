type Point = { x: number; y: number };

export class LineProjector {
    private direction: Point = { x: 0, y: 0 }; // unit vector van center → initial pointer

    /**
     * Initialiseer de richting bij het starten van de actie.
     * @param center Het huidige centrum van de speler/cel.
     * @param pointer De initiële muispositie of target.
     */
    setDirection(center: Point, pointer: Point) {
        const dx = pointer.x - center.x;
        const dy = pointer.y - center.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len === 0) {
            this.direction = { x: 0, y: 0 };
        } else {
            this.direction = { x: dx / len, y: dy / len };
        }
    }

    /**
     * Bereken een punt langs de opgeslagen richting vanaf het huidige centrum.
     * @param center Het huidige centrum.
     * @param offset Hoe ver van het centrum het punt moet liggen.
     */
    getOffsetPoint(center: Point, offset: number): Point {
        return {
            x: center.x + this.direction.x * offset,
            y: center.y + this.direction.y * offset
        };
    }

    /**
     * Schaal een punt t.o.v. het huidige centrum.
     * @param center Het centrum als referentiepunt.
     * @param point Het punt dat geschaald moet worden.
     * @param multi Factor waarmee de afstand van het centrum wordt vermenigvuldigd.
     */
    scaleFromCenter(center: Point, point: Point, multi: number): Point {
        return {
            x: center.x + (point.x - center.x) * multi,
            y: center.y + (point.y - center.y) * multi
        };
    }

    /**
     * Punt voorbij pointer (overshoot), gebruikt de opgeslagen richting.
     * @param pointer Het referentiepunt.
     * @param distance Afstand om verder te gaan in dezelfde richting.
     */
    extendFromPointer(pointer: Point, distance: number): Point {
        return {
            x: pointer.x + this.direction.x * distance,
            y: pointer.y + this.direction.y * distance
        };
    }

    /** Haal de opgeslagen richting op */
    getDirection(): Point {
        return this.direction;
    }

    /**
     * Afstand tussen 2 punten.
     * @param a Punt A
     * @param b Punt B
     */
    static getDistance(a: Point, b: Point): number {
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}