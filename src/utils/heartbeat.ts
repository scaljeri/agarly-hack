export type HeartbeatConfig = {
    beat?: number
    delay?: number
    count?: number
}
export class Heartbeat {
    private tid: number = 0
    private iid: number = 0
    private resolveD?: (value: boolean) => void
    private resolveI?: (value: boolean) => void
    public customId = 0

    isActive = () => {
        return !!this.iid || !!this.tid || !!this.customId
    }

    start = (handle: () => Promise<boolean>, config: HeartbeatConfig = { beat: 10, delay: 0 }): Promise<boolean> => {
        this.stop()
        this.iid = -1
        return this.delay(() => this.interval(handle, config.beat, config.count ?? 10000), config.delay)
    }

    interval = async (handle: () => Promise<boolean>, beat = 30, amount = 1): Promise<boolean> => {
        window.clearInterval(this.iid)
        this.resolveI?.(false)
        this.iid = -1

        return new Promise((resolve) => {
            let count = 0
            this.iid = window.setInterval(async () => {
                debugger
                console.log('ACTION................')
                if (await handle() === false) {
                    this.stop();
                    resolve(false)
                } else if (++count > amount) {
                    this.stop();
                    resolve(true)
                }
            }, beat)
        })

    }
    delay = (handle: () => Promise<boolean>, delay = 30): Promise<boolean> => {
        window.clearTimeout(this.tid)
        this.resolveD?.(false)
        this.tid = -1

        return new Promise((resolve) => {
            this.tid = window.setTimeout(async () => {
                resolve(await handle())
            }, delay)
        })
    }

    stop = () => {
        console.log('STOP-x-x-x--x-x-x-x-')
        window.clearTimeout(this.tid)
        window.clearInterval(this.iid)
        this.iid = 0
        this.tid = 0
        this.resolveI?.(false)
        this.resolveD?.(false)
    }
}