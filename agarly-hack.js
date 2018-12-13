(function (document, clearInterval, getEventListeners, setInterval, window) {
    let burst, timer, mouseMoveEvent, canvas, omm, oku, okd;

    function stopBurst() {
        clearInterval(burst);
        clearTimeout(burst);
        burst = null;
    }

    let moves = {
        infinite: 1000000,

        analyseThis: () => {
            let center = {x: canvas.width / 2, y: canvas.height / 2};

            // y = ax + b
            let a = (mouseMoveEvent.clientY - center.y) / (mouseMoveEvent.clientX - center.x);
            let b = center.y - a * center.x;

            let output = {
                center: center,
                a: a,
                b: b,
                mouse: {x: mouseMoveEvent.clientX, y: mouseMoveEvent.clientY}
            };

            output.direction = {
                x: (center.x > output.mouse.x ? -1 : 1),
                y: (center.y > output.mouse.y ? -1 : 1)
            };


            return output;
        },

        moveMouse(x, y) {
            omm({
                clientX: x,
                clientY: y
            });
        },
        moveCurrentTo(degrees, info) {
            if (!info) {
                info = this.analyseThis();
            }

            let angle = degrees * Math.PI / 180; // The  angle with the current direction

            // Given (center of canvas will be the origin)
            let mx = info.mouse.x - info.center.x,
                my = info.mouse.y - info.center.y;

            let l = Math.sqrt(Math.pow(mx, 2) + Math.pow(my, 2));    // length of vector
            let angleLX = Math.atan(my / mx);                         // angle with horizontal

            angle += angleLX;
            let nx = info.direction.x * this.infinite;
            let ny = nx * Math.tan(angle);

            this.moveMouse(nx, ny);
        }
    };


    // Center stop
    moves[49] = function () { // 1
        let info = this.analyseThis();

        this.moveMouse(info.center.x + 10, info.center.y + 10);
        setTimeout(() => {
            this.moveMouse(info.center.x, info.center.y);

        }, 100);
    },
        // Move parallel in current direction
        moves[50] = function (info) { // 2
            if (!info) {
                info = this.analyseThis();
            }

            let x = info.direction.x * this.infinite;

            this.moveMouse(x, info.a * x + info.b);
        };
    // Split moves
    moves[51] = function (time = 200) { // 3
        let count = 0;
        burst = setTimeout(() => {
            let info = this.analyseThis(),
                count = 0;

            burst = setInterval(() => {
                this.moveCurrentTo((count++ % 2 ? 1 : -1) * 45, info);

                okd({keyCode: 32});
                oku({keyCode: 32});

                console.log(count);
                if (count === 8) {
                    setTimeout(() => {
                        this[50](info);
                    }, 100);
                    stopBurst();
                }
            }, 200);
        });
    };

    moves[52] = function () {       // 4
        let info = this.analyseThis(),
            initVal = 2,
            x = info.direction.x * initVal + info.center.x,
            y = info.a * x + info.b;


        if (Math.abs(Math.abs(y) - info.center.y) > Math.abs(Math.abs(x) - info.center.x)) {
            y = info.direction.y * initVal + info.center.y;
            x = (y - info.b) / info.a;
        } else {
            y = info.a * x + info.b;
        }

        console.log('x ' + info.center.x + ' vs ' + x);
        console.log('y ' + info.center.y + ' vs ' + y);
        //this.moveMouse(x + info.center.x, y + info.center.y);
        this.moveMouse(info.center.x + 20, info.center.y + 20);
    };

    moves[53] = function (info) { // 5
        info = info || this.analyseThis();

        burst = setTimeout(() => {
            this[53](info);
        }, Math.round(Math.random() * 50));


        info.direction.x = -1 * info.direction.x;
        info.direction.y = -1 * info.direction.y;

        this[50](info);
    };


    function isVisible(elm) {
        return !(!elm.offsetHeight && !elm.offsetWidth || getComputedStyle(elm).visibility === 'hidden');
    }

    document.getElementById('nick').value = 'tEaM eXtreMe - testing';

    function fireEvent(node, eventName) {
        let doc = node.ownerDocument,
            event = doc.createEvent('MouseEvents');

        event.initEvent(eventName, true, true);
        event.synthetic = true;
        node.dispatchEvent(event, true);
    }

    let start = document.getElementById('PlayImage'),
        playAgain = document.getElementById('statsContinue');

    setInterval(() => {
        if (isVisible(start)) {
            fireEvent(start, 'click');
        }

        if (isVisible(playAgain)) {
            fireEvent(playAgain, 'click');
            fireEvent(start, 'click');
        }
    }, 1000);

    function changeKeyListeneres() {
        let burst, burstKey, isRobot;

        function onKeyDown(e) {
            if (moves[e.keyCode]) {
                stopBurst();
                moves[e.keyCode]();
            } else {
                if (burst && e.keyCode !== burstKey) {
                    stopBurst(burst);
                }

                if (!burst) {
                    let output = 0, delay = 30;
                    burstKey = e.keyCode;

                    if (burstKey === 32) {
                        output = 32;
                        delay = 100
                    } else if (burstKey === 91) {
                        output = 32;
                        delay = 100;
                    } else if (burstKey >= 65 && burstKey <= 90) {
                        output = 87;
                    }

                    if (output) {
                        let splitCount = 0;

                        burst = setInterval(() => {
                            if (burstKey !== 91 || ++splitCount < 4) {
                                okd({keyCode: output});
                                oku({keyCode: output});
                            }
                        }, delay);
                    }
                }
            }
        }

        function onMouseMove(e) {
            mouseMoveEvent = e;
            stopBurst();
            console.log('orig mm');

            omm(e);
        }

        // Override key listeners
        if (window.onkeydown !== okd) {
            okd = window.onkeydown;
            window.onkeydown = onKeyDown;

            oku = window.onkeyup;
            window.onkeyup = (e) => {
                clearInterval(burst);
                burst = null;
                oku({keyCode: e.keyCode === 32 ? 32 : 87});
            };

            clearInterval(timer);
            console.log('Setup is ready, enjoy playing!!!');

            canvas = document.getElementById('canvas');
            omm = canvas.onmousemove;
            canvas.onmousemove = onMouseMove;

            // Prevent new browser tab with spam
            getEventListeners(document).mousedown.forEach(listener => {
                listener.remove();
            });

            getEventListeners(document).click.forEach(listener => {
                listener.remove();
            });
        }
    }

    timer = setInterval(() => {
        if (window.onkeydown) {
            changeKeyListeneres();
        }
    }, 500);

    // External dependencies
})(document, clearInterval, getEventListeners, setInterval, window);