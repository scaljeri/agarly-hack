import { FakeKeyboardEvent } from './defaults';

export class BaseAction {
    public id: number;

    constructor(public up: (e: FakeKeyboardEvent) => void,
                public down: (e: FakeKeyboardEvent) => void) {
    }

    public isRunning(): boolean {
        return !!this.id;
    }

    stop(): void {
        clearInterval(this.id);
        this.id = null;
    }
}