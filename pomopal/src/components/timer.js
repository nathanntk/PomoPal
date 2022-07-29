
export default function Timer() {

    // script.js

    /******  Timer Feature  ******/

    // timer variable with properties containing duration of timer, breaks, and interval
    const timer = {
        pomodoro: 25,
        shortBreak: 5,              
        longBreak: 15,
        longBreakInterval: 4,
        sessions: 0,    // sessions will increment up to 4 before the long break starts
    };

    let interval;

    // start button functionality
    const buttonSound = new Audio('sounds_chime-sound.mp3');
    const mainButton = document.getElementById('js-btn');
    mainButton.addEventListener('click', () => {
        buttonSound.play();
        const { action } = mainButton.dataset;
        if (action === 'start') {
            startTimer();
        } else {
            stopTimer();
        }
    });

    // detects a click of any of the mode buttons. 
    // modeButtons points to the containing element. once clicked, handleMode() is invoked.
    const modeButtons = document.querySelector('#js-mode-buttons');
    modeButtons.addEventListener('click', handleMode);

    // finds the difference between the current and end time in ms
    // computes total with difference and computes minutes/seconds
    function getRemainingTime(endTime) {
        const currentTime = Date.parse(new Date());
        const difference = endTime - currentTime;
    
        const total = Number.parseInt(difference / 1000, 10);
        const minutes = Number.parseInt((total / 60) % 60, 10);
        const seconds = Number.parseInt(total % 60, 10);
    
        return {
        total,
        minutes,
        seconds,
        };
    }

    function startTimer() {
        // get total time and end time
        let { total } = timer.remainingTime;
        const endTime = Date.parse(new Date()) + total * 1000;

        // check session number and increment
        if (timer.mode === 'pomodoro') timer.sessions++;
    
        // button changes to 'stop' when 'start' is pressed
        mainButton.dataset.action = 'stop';
        mainButton.textContent = 'stop';
        mainButton.classList.add('active');
    
        interval = setInterval(function() {
        timer.remainingTime = getRemainingTime(endTime);
        updateClock();
    
        total = timer.remainingTime.total;
        if (total <= 0) {
            clearInterval(interval);

            // rotate between short break, long break, or pomodoro as sessions increment
            switch (timer.mode) {
                case 'pomodoro':
                if (timer.sessions % timer.longBreakInterval === 0) {
                    switchMode('longBreak');
                } else {
                    switchMode('shortBreak');
                }
                break;
                default:
                switchMode('pomodoro');
            }
            
            document.querySelector(`[data-sound="${timer.mode}"]`).play();

            startTimer();
        }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(interval);    // pause countdown

        // change button to 'start'
        mainButton.dataset.action = 'start';
        mainButton.textContent = 'start';
        mainButton.classList.remove('active');
    }

    // gives the timer extra zeroes so that minutes and seconds each have two zeroes
    function updateClock() {
        const { remainingTime } = timer;
        const minutes = `${remainingTime.minutes}`.padStart(2, '0');
        const seconds = `${remainingTime.seconds}`.padStart(2, '0');
    
        const min = document.getElementById('js-minutes');
        const sec = document.getElementById('js-seconds');
        min.textContent = minutes;
        sec.textContent = seconds;

        const text = timer.mode === 'pomodoro' ? 'Time to work!' : 'Break time!';
        document.title = `${minutes}:${seconds} — ${text}`;
    }

    // mode could be pomodoro, shortBreak, or longBreak
    function switchMode(mode) {
        timer.mode = mode;
        // remainingTime property with total being set to 300 (5 x 60)
        timer.remainingTime = {
            total: timer[mode] * 60,
            minutes: timer[mode],
            seconds: 0, // always at zero at start
        };

        // active class is removed from all the mode buttons
        document
            .querySelectorAll('button[data-mode]')
            .forEach(e => e.classList.remove('active'));
        document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
        document.body.style.backgroundColor = `var(--${mode})`;

        updateClock();
    }
    
    // data-mode is retrieved. If it DNE, the target element was not one of the buttons,
    // otherwise switchMode is invoked.
    function handleMode(event) {
        const { mode } = event.target.dataset;
    
        if (!mode) return;
    
        switchMode(mode);
        stopTimer();
    }

    /****** Navigation Bar ******/

    const flashcards = document.getElementById('js-flash-cards');
    flashcards.addEventListener('click', () => {
    window.open('pomopal/src/components/flash-cards.html', '_blank');
    //location.href = './pages/flash-cards.html';
    })

    /****** Load DOM content on swithchMode ******/

    document.addEventListener('DOMContentLoaded', () => {
    switchMode('pomodoro');
    });
}