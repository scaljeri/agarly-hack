import { Split } from './split';
import { BaseAction } from './utils/basic-action';

export class TrickSplit extends Split {
    run(sequence: () => void) {
        let count = 0;
        BaseAction.HEARTBEAT.start(async () => {
            if (++count > 5) {
                return false
            }

            sequence();
            this.delayAction();
            return true
        }, { beat: 700 });
    }

    private delayAction(): void {
        this.split();
    }
}