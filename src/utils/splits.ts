import { Point } from "../types";
import { Marker } from "./marker";

export const glideSplit = (start: Point, end: Point, moveMouse: (x: number, y: number) => void, split: () => void, splits = 4):
    () => Promise<boolean> => {
    const steps = 20;

    let currentStep = 0;

    const dx = (end.x - start.x) / steps;
    const dy = (end.y - start.y) / steps;

    const splitMoments: number[] = [0];
    for (let i = 1; i <= splits; i++) {
        splitMoments.push(Math.floor((i / splits) * steps));
    }

    return async () => {
        const x = start.x + dx * currentStep;
        const y = start.y + dy * currentStep;

        console.log('Move to ' + x, y)
        moveMouse(x, y);

        if (splitMoments.includes(currentStep)) {
            split();
        }

        currentStep++;

        if (currentStep > steps) {
            return false
        }
        return true
    }
}

export const glideCurve = (moveMouse: (x: number, y: number) => void, split: () => void, center: Point, radius = 100, splits = 4): () => Promise<boolean> => {
    const steps = 25;

    let step = 0;

    const splitMoments: number[] = [0];
    for (let i = 1; i <= splits; i++) {
        splitMoments.push(Math.floor((i / splits) * steps));
    }

    return async () => {
        const angle = (Math.PI * step) / steps; // halve cirkel

        const x = center.x + Math.cos(angle) * radius;
        const y = center.y + Math.sin(angle) * radius;

        moveMouse(x, y);

        if (splitMoments.includes(step)) {
            split();
        }

        step++;

        if (step > steps) {
            return false;
        }

        return true
    }
}