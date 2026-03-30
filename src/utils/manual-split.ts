import { Move } from "../move";
import { Split } from "../split";
import { BaseAction } from "./basic-action";
import { LineProjector } from "./line-projector";
import { Marker } from "./marker";

const marker = new Marker('white')

export const manualGlideSplit = async (
    shoot: () => void,
    mover: Move,
    split: Split,
    offset: number = 60 // afstand vanaf het centrum
): Promise<boolean> => {
    const splitCount = 3;    // hoeveel keer splitten
    const shootCount = 15;   // hoeveel ticks schieten
    const totalTicks = 2000;   // totale duur van de actie
    let offsetCount = 1

    let tick = 0;

    // 🔹 Init: bepaal richting van center → muis
    const center = mover.getCenter();
    const pointer = mover.getMousePosition();
    const projector = new LineProjector();
    projector.setDirection(center, pointer);

    shoot()
    split.split();
    let tid: number = 0

    return BaseAction.HEARTBEAT.start(() => {
        tick++;
        // 🔥 Shoot phase (frontloaded voor pressure)
        // if (tick <= shootCount && tick > splitCount) {
        if (tick <= shootCount && tick % 3 === 0) {
            shoot();
            // shoot();
        }

        // ⚡ Split phase (heel vroeg uitvoeren)
        if (tick <= splitCount) {
            split.tripleSplit();
        } else if (tick > splitCount) {
            const currentCenter = mover.getCenter();
            const target = projector.getOffsetPoint(currentCenter, offset/offsetCount++)
            mover.moveMouse(target.x, target.y);
            marker.move(target.x, target.y);
            clearTimeout(tid)
            tid = window.setTimeout(() => {
                marker.hide()
            }, 5000)
        } else if (tick > shootCount) {
            // ✅ Vervang mover.toCenter() door offsetpunt langs opgeslagen richting
            shoot()
        }

        return Promise.resolve(true);
    }, { delay: 0, count: totalTicks, beat: 130 });
};