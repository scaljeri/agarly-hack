import { Split } from './split';

export class TrickSplit extends Split {
    run(sequence: () => void) {
        let count = 0;
        this.id = setInterval(() => {
            if (++count > 5) {
                this.stop();
            }

            sequence();
            this.delayAction();
        }, 700);
    }

    isRunning(): boolean {
        return !!this.timeoutId || super.isRunning();
    }

    stop(): void {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;

        super.stop();
    }

    private delayAction(): void {
        this.timeoutId = setTimeout(() => {
            this.action();
        }, 100);

    }
}