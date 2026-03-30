export class Marker {
    private marker!: HTMLDivElement

    constructor(color: string = 'red', x = 0, y = 0,) {
        this.marker = document.createElement('div')
        this.marker.style.position = 'absolute'
        this.marker.style.left = `${x}px`
        this.marker.style.top = `${y}0px`

        this.marker.style.width = '20px'
        this.marker.style.height = '20px'
        this.marker.style.backgroundColor = color
        this.marker.style.borderRadius = '50%'
        this.marker.style.transform = 'translate(-50%, -50%)'

        document.body.appendChild(this.marker);
    }

    reshape(width: number, height: number): void {
        this.marker.style.width = `${width}px`
        this.marker.style.height = `${height}px`
    }

    move(x: number, y: number): void {
        this.marker.style.left = `${x}px`;
        this.marker.style.top = `${y}px`;
        this.marker.style.display = 'block';
    }
    hide(): void {
        this.marker.style.display = 'none';
    }
}