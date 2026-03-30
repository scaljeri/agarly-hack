import { Move } from './move';
import { Shoot } from './shoot';
import { Split } from './split';
import { TrickSplit } from './trick-split';
import { BaseAction } from './utils/basic-action';
import { Heartbeat } from './utils/heartbeat';
import { runKeyboardSetup } from './utils/initialize-keys';
import { manualGlideSplit } from './utils/manual-split';

const iframe = document.createElement('iframe');
document.body.appendChild(iframe);

if (iframe.contentWindow) {
    const cw = iframe.contentWindow as unknown as { console: Console };

    const nativeConsole = cw.console;

    console.log = nativeConsole.log.bind(nativeConsole);
    console.error = nativeConsole.error.bind(nativeConsole);
    console.warn = nativeConsole.warn.bind(nativeConsole);
}

declare var getEventListeners: any;

const winListeners = getEventListeners(window);

BaseAction.KEY_DOWN =
    (winListeners.keydown && winListeners.keydown[1]?.listener) ||
    window.onkeydown;

BaseAction.KEY_UP =
    (winListeners.keyup && winListeners.keyup[0]?.listener) ||
    window.onkeyup;

const canvas = document.querySelectorAll('canvas')[1];

const canvasListeners = getEventListeners(canvas);
BaseAction.MOUSE_MOVE =
    (canvasListeners.mousemove && canvasListeners.mousemove[0]?.listener);


const heartbeat = new Heartbeat()
BaseAction.HEARTBEAT = heartbeat
const shoot = new Shoot();
const split = new Split();
const trickSplit = new TrickSplit();
const move = new Move();
split.move = move;


// (() => {
//     initialize();

//     autoPlay();
// })();

function isActive(): boolean {
    return BaseAction.HEARTBEAT.isActive()
}

function initialize(): void {
    const events_up = Object.values(BaseAction.EVENTS!).map(e => e.up)
    const events_down = Object.values(BaseAction.EVENTS!).map(e => e.down)

    window.addEventListener('keyup', (e) => {
        const kc = e.key.toUpperCase().charCodeAt(0);

        if (kc === 82) { // R -> Record
            return
        }

        e.stopImmediatePropagation()
        e.stopPropagation()

        if (events_up.includes(e)) {
            return
        }

        heartbeat.stop()
        if (kc !== 83) {
            e.stopPropagation()
            e.stopImmediatePropagation()
        }
    }, true)

    window.addEventListener('keydown', (e) => {
        const kc = e.key.toUpperCase().charCodeAt(0);
        if (kc === 82) { // R -> Record
            return
        }
        e.stopImmediatePropagation()
        e.stopPropagation()

        if (isActive()) {
            return;
        }
        console.log('_________________________ NEW EVENT -_________________________' + kc)

        if (kc !== 83) {
            e.stopPropagation()
            e.stopImmediatePropagation()
        }

        if (kc === 48) {
            console.log('FIX freeze')
            // split.doDown('s');

            split.doUp('s');
        } else if (kc === 49) { // 1
            console.log('To Infinity')
            move.toInfinity();
        } else if (kc === 50) { // 2
            console.log('To Center')
            move.toCenter();
            shoot.repeat()
        } else if (kc === 51) { // 3
            console.log('Run Sequence')
            trickSplit.run(move.getSequence());
        } else if (kc === 52) { //4
            console.log('Freeze')
            move.freeze();
        } else if (kc === 53) { // 5
            // shoot.go(1, () => {
            //     split.go(0, 1)
            // })
        } else if (kc === 32) { // Space
            console.log('Split')
            split.go();
            // split.glideSplit();
        } else if (kc === 91) { // [
            // console.log('Fast split a.k.a Attack')
            // split.attack();
        } else if (kc === 81) { // q - glide split       
            console.log('Glide Split')
            // split.glideSplit(() => shoot.shoot(), move);
            manualGlideSplit(() => shoot.shoot(), move, split);
        } else if (kc >= 65 && kc <= 90) {
            console.log('Fire')
            shoot.repeat();
        }

    }, true);


    window.addEventListener('keyup', (e) => {
        stop();
    });
}

// function autoPlay(): void {
//     setInterval(() => {
//         const playBtn = document.querySelector('#playBtn') as HTMLButtonElement;

//         if (playBtn) {
//             playBtn.click();
//         }
//     }, 1000);
// }

(async () => {
    const setup = await runKeyboardSetup();
    BaseAction.EVENTS = setup

    console.log('Setup result:', setup);
    (document.querySelector('.fas.fa-times') as HTMLElement)?.click()
    initialize();

    // hier injecteer je keys & posities in Shoot / Move
})();