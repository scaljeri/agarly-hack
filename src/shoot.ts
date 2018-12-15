import { BaseAction } from './utils/basic-action';

export class Shoot extends BaseAction {
    repeat(): number {
        this.id = setInterval(() => {
            this.down({keyCode: 87});
            this.up({keyCode: 87});
        }, 20);

        return this.id;
    }
}
