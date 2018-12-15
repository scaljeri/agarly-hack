window.agarlyHook = (function (document, clearInterval, getEventListeners, setInterval, window) {
    let register$,
        pluginQueue = [],
        keyMap = {},
        hooks = {
            register: (keyCode, action, name) => {
                pluginQueue.push({keyCode: keyCode, action: action, name: name});
            }
        };

    function loadRxJS(callback) {
        let src = 'https://cdnjs.cloudflare.com/ajax/libs/rxjs/5.0.1/Rx.min.js';

        let script = document.createElement('script'),
            loaded;

        script.setAttribute('async', 'false');
        script.setAttribute('src', src);
        script.onreadystatechange = script.onload = () => {
            if (!loaded) {
                callback();
            }
            loaded = true;
        };

        document.getElementsByTagName('head')[0].appendChild(script);
    }

    function registerHandler(obj) {
        if (Array.isArray(obj.keyCode)) {
            let startVal = obj.keyCode.start, endVal = obj.keyCode.end;

            Rx.Observable.from(Array(end - start))
                //t .scan((acc)
        }
        keyMap[obj.keyCode] = obj;
    }

    loadRxJS(() => {
        let canvas;
        let oku, okd, omm;
        let keyDown$, keyUp$, mouseMove$;

        function gameSetup() {
            if (window.onkeydown !== okd) {
                okd = window.onkeydown;
                keyDown$ = Rx.Observable.create(observer => {
                    window.onkeydown = (event) => {
                        observer.next(event);
                    }
                }).share();

                oku = window.onkeyup;
                keyUp$ = Rx.Observable.create(observer => {
                    window.onkeyup = (event) => {
                        observer.next(event);
                    }

                }).share();

                let keyStream$ = keyDown$
                    .first()
                    .switchMap(event=> Rx.Observable.interval(100)
                            .mapTo(event))
                    .takeUntil(keyUp$)
                    .map(event => event.keyCode)
                    .repeat();

                keyStream$
                    .map(keyCode=> keyMap[keyCode])
                    .filter(obj=> !!obj)
                    .subscribe(x=> console.log(x));

                // Prevent new browser tab with spam
                canvas = document.getElementById('canvas');
                omm = canvas.onmousemove;

                mouseMove$ = Rx.Observable.create(observer => {
                    canvas.onmousemove = (event) => {
                        observer.next(event);
                    };
                });

                mouseMove$.subscribe(omm);

                register$ = Rx.Observable.merge(
                    Rx.Observable.from(pluginQueue),
                    Rx.Observable.create((observer) => {
                        hooks.register = (keyCode, action, name) => {
                            observer.next({name: name, keyCode: keyCode, action: action})
                        }
                    }));

                register$.subscribe(registerHandler);

                // Prevent spam
                getEventListeners(document).mousedown.forEach(listener => {
                    listener.remove();
                });

                getEventListeners(document).click.forEach(listener => {
                    listener.remove();
                });


                console.log('Setup is ready, enjoy playing!!!');
            }
        }

        Rx.Observable.interval(500).take(1)
            .filter(() => !!window.onkeydown) // Wait until agarly is ready
            .subscribe(() => {
                gameSetup();
            });
    });

    return hooks;
})(document, clearInterval, getEventListeners, setInterval, window/*, Rx */);

agarlyHook.register('test', 2, (a$, b$) => {
    console.log('setup test');
});
