import { Point } from "./types";
import { BaseAction } from "./utils/basic-action";
import { Marker } from "./utils/marker";
import { LineProjector } from "./utils/line-projector";

const MAX_VAL = 1000000;

export class Move extends BaseAction {
    // mouseX = 0;
    // mouseY = 0;

    private projector = new LineProjector();

    stepperAMarker = new Marker('orange');
    stepperBMarker = new Marker('white');

    constructor() {
        super();
        this.registerMouseMoveHandler(this.mouseMovedHandler);
    }

    /** Mouse move handler: update mouse positie */
    private mouseMovedHandler = (e: MouseEvent) => {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
    }

    /** Huidige muispositie */
    getMousePosition(): Point {
        return { x: this.mouseX, y: this.mouseY };
    }

    /** Center van het canvas of spelobject */
    getCenter(offset = 0): Point {
        return { x: BaseAction.CANVAS.width / 2, y: BaseAction.CANVAS.height / 2 };
    }

    /** Initieer richting projector bij start van een actie */
    initDirection(): void {
        const center = this.getCenter();
        const pointer = this.getMousePosition();
        this.projector.setDirection(center, pointer);
    }

    /** Move naar een punt op een offset langs de opgeslagen richting */
    toCenter(offset = 0): void {
        const center = this.getCenter();
        const target = this.projector.getOffsetPoint(center, offset);
        this.moveMouse(target.x, target.y);
    }

    /** Move ver in de richting van de projector (infinity) */
    toInfinity(): void {
        const center = this.getCenter();
        const dir = this.projector.getDirection();

        const MAX_MOVE = 10000; // kan aangepast worden aan je canvas
        const x = center.x + dir.x * MAX_MOVE;
        const y = center.y + dir.y * MAX_MOVE;

        this.moveMouse(x, y);
    }

    /** Beweeg in een specifieke richting */
    to(dirX: number, dirY: number): void {
        this.moveMouse(dirX * MAX_VAL, dirY * MAX_VAL);
    }

    /** Generiek sequentieel bewegen links/rechts */
    getSequence(): () => void {
        const center = this.getCenter();
        let count = 1;

        return () => {
            const dir = (++count % 2) * 2 - 1;
            this.moveMouse(
                center.x + MAX_VAL * dir,
                center.y + MAX_VAL
            );
        };
    }

    /** Freeze beweging: beweeg naar vier hoeken rondom het centrum */
    freeze(): void {
        const center = this.getCenter();

        const positions = [
            { x: -MAX_VAL, y: -MAX_VAL },
            { x: MAX_VAL, y: -MAX_VAL },
            { x: MAX_VAL, y: MAX_VAL },
            { x: -MAX_VAL, y: MAX_VAL }
        ];

        let i = 0;

        BaseAction.HEARTBEAT.start(async () => {
            const p = positions[i];
            this.moveMouse(center.x + p.x, center.y + p.y);
            i = (i + 1) % 4;
            return true;
        }, { beat: 50 });
    }
}