import { Move } from './move';
import { Shoot } from './shoot';
import { Split } from './split';
import { TrickSplit } from './trick-split';

declare var getEventListeners: any;

let down = getEventListeners(window).keydown[0].listener;
let up = getEventListeners(window).keyup[0].listener;
let mmove = getEventListeners(document.querySelector('canvas')).mousemove[0].listener;

const shoot = new Shoot(up, down);
const split = new Split(up, down);
const trickSplit = new TrickSplit(up, down);
const move = new Move(mmove);


(() => {
    initialize();

    autoPlay();
})();

function stop() {
    shoot.stop();
    split.stop();
    trickSplit.stop();
    move.stop();
}

function isActive(): boolean {
    return shoot.isRunning() || split.isRunning() || trickSplit.isRunning() || move.isRunning();
}

function initialize(): void {
    window.addEventListener('keydown', (e) => {
        const kc = e.keyCode;
        console.log('keycode=' + kc);

        if (isActive()) {
            return;
        }

        if (kc === 49) { // 1
            move.toInfinity();
        } else if (kc === 50) { // 2
            move.toCenter();
        } else if (kc === 51) { // 3
            console.log('sequence');
            trickSplit.run(move.getSequence());
        } else if (kc === 52) { //43
            move.freeze();
        } else if (kc === 32) {
            split.max();
        } else if (kc === 91) {
            split.attack();
        } else if (kc >= 65 && kc <= 90) {
            shoot.repeat();
        }
    });


    window.addEventListener('keyup', (e) => {
        stop();
    });
}

function autoPlay(): void {
    setInterval(() => {
        const playBtn = document.querySelector('#playBtn') as HTMLButtonElement;

        if (playBtn) {
            playBtn.click();
        }
    }, 1000);
}