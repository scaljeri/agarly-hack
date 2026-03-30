export class Line {
    private el: HTMLDivElement;

    constructor(
        color: string = 'yellow',
        thickness: number = 2,
        x1 = 0,
        y1 = 0,
        x2 = 0,
        y2 = 0
    ) {
        this.el = document.createElement('div');
        this.el.style.position = 'absolute';
        this.el.style.backgroundColor = color;
        this.el.style.height = `${thickness}px`;
        this.el.style.transformOrigin = '0 0'; // belangrijk!

        document.body.appendChild(this.el);

        this.update(x1, y1, x2, y2);
    }

    update(x1: number, y1: number, x2: number, y2: number) {
        const dx = x2 - x1;
        const dy = y2 - y1;

        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx); // radians

        this.el.style.width = `${length}px`;
        this.el.style.left = `${x1}px`;
        this.el.style.top = `${y1}px`;
        this.el.style.transform = `rotate(${angle}rad)`;
    }
}