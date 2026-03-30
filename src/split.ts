import { Move } from './move';
import { BaseAction } from './utils/basic-action';
import { Marker } from './utils/marker';

export class Split extends BaseAction {
    private marker = new Marker('white')
    public move!: Move
    // public stepper = new LineStepper()

    public go(delay = 150, count = 50): Promise<boolean> {
        this.marker.reshape(20, 20)
        this.split()
        // this.move.stepper.updateDirection(this.move.getMousePosition())
        const position = this.move.getMousePosition()
        let counter = 1
        return BaseAction.HEARTBEAT.start(() => {
            this.split()
            // const next = this.move.stepper.getNextStepFromPoint(position, ++counter)
            // this.move.moveMouse(next.x, next.y)
            // this.marker.move(next.x, next.y)
            return Promise.resolve(true)
        }, { delay, count, beat: 50 })
    }

    // public async glideSplit(shoot: () => void, mover: Move): Promise<boolean> {
    //     this.move.stepper.updateDirection(this.move.getMousePosition())
    //     const startPosition = this.move.getMousePosition()
    //     this.marker.move(startPosition.x, startPosition.y)
    //     const center = this.move.getCenter()
    //     const splitCount = 2 // 8
    //     const shootCount = 6
    //     this.tripleSplit()
    //     let count = 0
    //     mover.toInfinity()
    //     return BaseAction.HEARTBEAT.start(() => {
    //         if (++count < shootCount) {
    //             shoot()
    //             shoot()
    //             shoot()
    //         }
    //         if (count < splitCount) {
    //             this.split('g')
    //             const next = this.move.stepper.getNextStepFromPoint(startPosition, 1.5)
    //             this.move.moveMouse(next.x, next.y)
    //             // this.marker.move(next.x, next.y)
    //             shoot()
    //             shoot()
    //         } else {
    //             // const next = this.move.stepper.getNextStepFromPoint(startPosition, 1.5)
    //             this.move.moveMouse(next.x, next.y)
    //             this.marker.move(next.x, next.y)
    //         }
    //         return Promise.resolve(true)
    //     }, { delay: 0, count: 100, beat: 100 })

    //     return true
    // }
    // public async _glideSplit(): Promise<boolean> {
    //     const c = this.getCenter();

    //     const mouseMovehandler = (x: number, y: number) => this.moveMouse(x, y)
    //     const splitHandler = () => {
    //         this.split()
    //     }
    //     const glideSplitHandler = glideSplit(c, { x: this.mouseX, y: this.mouseY }, mouseMovehandler, splitHandler, 5)
    //     glideSplitHandler()
    //     // const glideSplitHandler = glideCurve(mouseMovehandler, splitHandler, { x: this.mouseX, y: this.mouseY }, 100, 5)
    //     // glideSplitHandler()

    //     return BaseAction.HEARTBEAT.start(glideSplitHandler, { beat: 60, count: 500, delay: 150 })

    // }

    // public goLimited(handle: () => void, amount = 5) {
    //     for (let i = 0; i < amount; i++) {
    //         this.split()
    //     }
    //     handle()
    // }

    // public times(amount: number): number {
    // let count = 0;
    // // const down = this.getDownEvent('space')
    // // const up = this.getUpEvent('space')

    // this.stop();
    // this.doUp('space');

    // this.id = window.setInterval(() => {
    //     this.action();

    //     if (++count > amount) {
    //         this.stop();
    //     }
    // }, 15);

    // return this.id;
    // }

    // action(): void {
    //     this.doDown('space');
    //     this.doUp('space');
    // }

    public async glideSplit(shoot: () => void, mover: Move): Promise<boolean> {
        // 1. Update richting en startpositie
        const startPosition = this.move.getMousePosition();
        // this.move.stepper.updateDirection(startPosition);
        const center = this.move.getCenter();

        this.marker.move(startPosition.x, startPosition.y);

        const splitCount = 2; // aantal splits
        const shootCount = 6; // aantal shoot-cycli
        const glideSteps = 6; // aantal fibo-glide stappen naar center

        this.tripleSplit();
        // mover.toInfinity();
        // this.move.moveMouse(this.stepper.getPoint(startPosition, 2.5))

        // Genereer Fibonacci-glide punten
        // const glidePoints = Array.from(this.move.stepper.iterateToCenterFibo(startPosition, glideSteps));
        let glideIndex = 0;
        let count = 0;

        return BaseAction.HEARTBEAT.start(async () => {
            // 2. Shoot routine
            if (++count <= shootCount) {
                shoot();
                shoot();
                shoot();
            }

            // 3. Split routine
            if (count <= splitCount) {
                this.split('g');



                // shoot();
                // shoot();
            // } else if (glideIndex < glidePoints.length) {
            //     // 4. Gliding naar center volgens Fibonacci
            //     const next = glidePoints[glideIndex++];
            //     // this.move.moveMouse(next.x, next.y);
            //     // this.marker.move(next.x, next.y);
            //     // const next = this.move.stepper.getNextStepFromPoint(startPosition, 1.5);
            //     // this.move.moveMouse(next.x, next.y);
            //     // this.marker.move(next.x, next.y);
            // } else {
                // 5. Optioneel: eindpunt check, fix op center
                this.move.moveMouse(center.x, center.y);
                this.marker.move(center.x, center.y);
                return false
            }

            return true
        }, { delay: 0, count: 1000, beat: 100 });
    }
}