import { FakeKeyboardEvent } from './defaults';
import { Heartbeat, HeartbeatConfig } from './heartbeat';
import { CapturedKey } from './initialize-keys';
import { Marker } from './marker';
import { Line } from './line';
import { Point } from '../types';

export interface FakeMouseMoveEvent {
    clientX: number;
    clientY: number;
}

const KEY_MAP = {
    'w': 87,
    'space': 32,
    's': 83,
    "t": 84,
    "g": 71,
} as const;

type KeyName = keyof typeof KEY_MAP;

const CANVAS = document.querySelectorAll('canvas')[1];

export class BaseAction {
    static EVENTS?: Record<number, CapturedKey>;
    static CANVAS = document.querySelectorAll('canvas')[1]
    static COUNT_DOWN = 0

    static KEY_UP: (e: KeyboardEvent) => void
    static KEY_DOWN: (e: KeyboardEvent) => void
    static MOUSE_MOVE: (e: FakeMouseMoveEvent) => void
    static HEARTBEAT: Heartbeat
    public id?: number | null;
    private mouseMoveHandlers: ((e: MouseEvent) => void)[] = []

    public mouseX = 0
    public mouseY = 0
    // public mouseMarker = new Marker()
    // public centerMarker = new Marker()
    // public pointerMarker = new Line('blue')

    constructor() {
        CANVAS.style.border = '1px solid red'
        CANVAS.addEventListener('mousemove', e => {
            this.mouseX = e.clientX
            this.mouseY = e.clientY
            this.mouseMoveHandlers.forEach((item) => item(e))

            // this.mouseMarker.move(e.clientX, e.clientY)
            // this.pointerMarker.update(this.mouseX, this.mouseY, CANVAS.width / 2, CANVAS.height / 2)
        })
        // this.centerMarker.move(CANVAS.width / 2, CANVAS.height / 2)
    }

    public isRunning(): boolean {
        return !!this.id || BaseAction.COUNT_DOWN > 0
    }

    start(handle: () => Promise<boolean>, config: HeartbeatConfig) {
        BaseAction.HEARTBEAT.start(handle, config)
    }

    stop(): void {
        BaseAction.HEARTBEAT.stop()
    }

    getDownEvent(char: string) {
        const code = char.toUpperCase().charCodeAt(0);
        return BaseAction.EVENTS?.[code].down
    }

    async shoot() {
        this.doDown('w')
        this.doUp('w')
        return true
    }

    async tripleSplit() {
        return this.split('t')
    }


    async split(key: KeyName = 'space') {
        this.doDown(key)
        this.doUp(key)
        return true
    }

    getUpEvent(char: string) {
        const code = char.toUpperCase().charCodeAt(0);
        return BaseAction.EVENTS?.[code].up
    }

    doUp(char: KeyName) {
        const event = BaseAction.EVENTS![KEY_MAP[char]].up
        BaseAction.KEY_UP(event!)
    }

    doDown(char: KeyName) {
        const event = BaseAction.EVENTS![KEY_MAP[char]].down
        BaseAction.KEY_DOWN(event!)
    }

    moveMouse(x: number | Point, y?: number): void {
        if (typeof x === 'object') {
            y = x.y
            x = x.x
        }
        BaseAction.MOUSE_MOVE({ clientX: x, clientY: y! })
    }

    registerMouseMoveHandler(handler: (e: MouseEvent) => void) {
        this.mouseMoveHandlers.push(handler)
    }

    removeMouseMoveHandler(handler: (e: MouseEvent) => void) {
        const index = this.mouseMoveHandlers.indexOf(handler);
        if (index !== -1) {
            this.mouseMoveHandlers.splice(index, 1);
        }
    }

    getCenter(): Point {
        return { x: BaseAction.CANVAS.width / 2, y: BaseAction.CANVAS.height / 2 };
    }
}