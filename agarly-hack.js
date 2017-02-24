(function (document, clearInterval, getEventListeners, setInterval, window) {
    let timer;

    function isVisible(elm) {
        return !(!elm.offsetHeight && !elm.offsetWidth || getComputedStyle(elm).visibility === 'hidden');
    }

    document.getElementById('nick').value = 'tEaM eXtreMe++';

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
        let okd, oku, burst, burstKey;

        function stopBurst() {
            clearInterval(burst);
            burst = null;
        }

        function onKeyDown(e) {
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
}) (document, clearInterval, getEventListeners, setInterval, window);