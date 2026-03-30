import { BaseAction } from './utils/basic-action';
import { Heartbeat } from './utils/heartbeat';

export class Shoot extends BaseAction {

    private trustedWDown: KeyboardEvent | null = null;
    private trustedWUp: KeyboardEvent | null = null;

    private trustedSpaceDown: KeyboardEvent | null = null;
    private trustedSpaceUp: KeyboardEvent | null = null;

    // private captureDown = (e: KeyboardEvent) => {
    //     if (e.key === 'w') {
    //         this.trustedWDown = e;
    //     }
    //     else if (e.code === 'Space') {
    //         this.trustedSpaceDown = e
    //     }

    //     if (this.trustedWDown && this.trustedSpaceDown) {
    //         window.removeEventListener('keydown', this.captureDown);
    //     }
    // };

    // private captureUp = (e: KeyboardEvent) => {
    //     if (e.key === 'w') {
    //         this.trustedWUp = e;
    //     }
    //     else if (e.code === 'Space') {
    //         this.trustedSpaceUp = e
    //     }
    //     if (this.trustedWUp && this.trustedSpaceUp) {
    //         window.removeEventListener('keyup', this.captureUp);
    //     }
    // };

    // constructor(up: (e: KeyboardEvent) => void,
    //     down: (e: KeyboardEvent) => void) {
    //     super(up, down);

    //     window.addEventListener('keydown', this.captureDown)
    //     window.addEventListener('keyup', this.captureUp)
    // }

    async repeat(): Promise<boolean> {
        this.shoot()
        return BaseAction.HEARTBEAT.start(() => this.shoot(), { beat: 10, delay: 0 })
    }

    async go(count = 1, delay = 0, beat = 50): Promise<boolean> {
        this.shoot()
        return BaseAction.HEARTBEAT.start(() => this.shoot(), { beat: 50, count, delay })
    }
}