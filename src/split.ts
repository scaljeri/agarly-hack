import { BaseAction } from './utils/basic-action';

export class Split extends BaseAction {
    timeoutId: number;

    public attack(amount = 7): number {
        return this.times(amount);
    }

    public stop(): void {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;

        super.stop();
    }

    public isRunning(): boolean {
        return !!this.timeoutId || super.isRunning();
    }

    public max(isDelay = true): void {

        if (isDelay) {
            this.timeoutId = window.setTimeout(() => {
                this.times(8);
            }, 200);
        } else {
            this.times(8);
        }
    }

    public times(amount: number): number {
        let count = 0;

        this.stop();
        this.up({keyCode: 32});

        this.id = window.setInterval(() => {
            this.action();

            if (++count > amount) {
                this.stop();
            }
        }, 15);

        return this.id;
    }

    action(): void {
        this.down({keyCode: 32});
        this.up({keyCode: 32});
    }
}