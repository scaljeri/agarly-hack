export type CapturedKey = {
    down?: KeyboardEvent;
    up?: KeyboardEvent;
};

export async function runKeyboardSetup(): Promise<Record<string, CapturedKey>> {

    console.log('%c=== KEYBOARD SETUP STARTED ===', 'color: orange');
    console.log("Press keys you want to register. Press 'Enter' when done.");

    const captured: Record<string, CapturedKey> = {};

    return new Promise(resolve => {

        const downHandler = (e: KeyboardEvent) => {
            if (e.code === 'Enter') {
                finish();
                return;
            }

            const kc = e.key.toUpperCase().charCodeAt(0);
            if (!captured[kc]) {
                captured[kc] = {};
            }

            if (!captured[kc].down) {
                captured[kc].down = e;
                console.log(`Captured DOWN: ${e.code} - ${kc}`);
            }
        };

        const upHandler = (e: KeyboardEvent) => {

            if (e.code === 'Enter') {
                finish();
                return;
            }

            const kc = e.key.toUpperCase().charCodeAt(0);
            if (!captured[kc]) {
                captured[e.code] = {};
            }

            if (!captured[kc].up) {
                captured[kc].up = e;
                console.log(`Captured UP: ${e.code} - ${kc}`);
            }
        };

        function finish() {
            window.removeEventListener('keydown', downHandler);
            window.removeEventListener('keyup', upHandler);

            console.log('%c=== SETUP COMPLETE ===', 'color: lime');
            console.log('Captured keys:', captured);

            console.log('OUTPUT', captured)
            resolve(captured);
        }

        window.addEventListener('keydown', downHandler);
        window.addEventListener('keyup', upHandler);
    });
}