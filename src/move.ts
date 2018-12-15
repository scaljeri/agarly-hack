interface FakeMouseMoveEvent {
    clientX: number;
    clientY: number;
}

interface Center {
    x: number,
    y: number
}

const CANVAS = document.querySelector('canvas');
const MAX_VAL = 1000000;

export class Move {
    private id: number;
    private rico: number;
    private mx: number;
    private my: number;
    private b: number;

    constructor(private handler: (e: FakeMouseMoveEvent) => void) {
        CANVAS.addEventListener('mousemove', e => {
            const c = this.getCenter();

            this.mx = e.clientX;
            this.my = e.clientY;

            this.rico = (e.clientY - c.y) / (e.clientX - c.x);
            this.b = e.clientY - this.rico * e.clientX;
        });
    }

    stop(): void {
        clearInterval(this.id);
        this.id = null;
    }

    isRunning(): boolean {
        return !!this.id;
    }

    toCenter(): void {
        const center = this.getCenter();

        this.doMove(center.x, center.y);
    }

    toInfinity(): void {
        const center = this.getCenter();

        const dirX = center.x > this.mx ? -1 : 1;
        const x = dirX * MAX_VAL;
        const y = this.rico * x + this.b;

        this.doMove(x, y);
    }

    getCenter(): Center {
        return {x: CANVAS.width / 2, y: CANVAS.height / 2};
    }

    private doMove(x: number, y: number): void {
        this.handler({clientX: x, clientY: y});
    }

    to(dirX: number, dirY: number): void {
        this.doMove(dirX * MAX_VAL, dirY * MAX_VAL);
    }

    getSequence(): () => void {
        const center = this.getCenter();
        let count = 1;

        return () => {
            const dir = (++count % 2) * 2 - 1;

            this.doMove(
                center.x + MAX_VAL * dir,
                center.y + MAX_VAL);

        }
    }

    freeze(): void {
        let dirX = 0;
        let dirY = 0;

        const center = this.getCenter();

        this.id = setInterval(() => {
            this.doMove(
                center.x + MAX_VAL * dirX,
                center.y + MAX_VAL * dirY
            );

            dirX = dirX === 1 ? -1 : dirX + 1;
            dirY = dirY === 1 ? -1 : dirY + 1;
        }, 20);
    }
}
