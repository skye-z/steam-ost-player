const audio = new Audio();

export function start(path) {
    audio.src = path;
    audio.load();
    audio.play();
}

export function stop() {
    audio.pause();
}