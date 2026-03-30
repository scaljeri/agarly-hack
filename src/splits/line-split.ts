import { Move } from "../move";
import { BaseAction } from "../utils/basic-action";

export const lineSplit = async (shoot: () => void, mover: Move): Promise<boolean> => {
    return BaseAction.HEARTBEAT.start(async () => {
    }, { delay: 0, count: 100, beat: 100 });
}