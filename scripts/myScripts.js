let timeoutId;
let countdownId;
const nInterval = 60 * 30; //interval time in seconds

function resetOutput() {
    setOutput("Timer has been reset!");
}

function setOutput(outputString) {
    document.querySelector('#timeroutput').textContent = outputString;
}

function startTimer() {
    writeToLog('Timer started on');
    startCountdown();

    timeoutId = setInterval(() => {
        stopAllTimers(false);
        writeToLog('Shown alert on');
        shownotification("Hey buddy!\nTime to get up and get moving!");
        startTimer();
    }, nInterval * 1000);
}

function writeToLog(prefix) {
    const logConsole = document.getElementById('output');
    logConsole.innerHTML += (`\n${prefix} ${currentDateTime()}`);
    logConsole.scrollTop = console.scrollHeight;
}
function currentDateTime() {
    var objToday = new Date();
    return objToday.toLocaleDateString() + ' ' + objToday.toLocaleTimeString();
}
function startCountdown() {
    countdownId = setInterval(() => {
        //TODO Change following to how much time left before next reminder
        setOutput(currentDateTime());
    }, 1000); //every second
}

function stopAllTimers(resetTextOutput = true) {
    stopCountDown();
    clearInterval(timeoutId);

    if (resetTextOutput) {
        setOutput("Timer stopped!");
    }
    writeToLog("Timer stopped on");
}

function stopCountDown() {
    clearInterval(countdownId);
}

function showAlert(message) {
    window.alert(message);
}

//Html5 notification API
function askNotificationPermission() {
    // function to actually ask the permissions
    function handlePermission(permission) {
        // Whatever the user answers, we make sure Chrome stores the information
        if (!('permission' in Notification)) {
            Notification.permission = permission;
        }

        // set the button to shown or hidden, depending on what the user answers
        //show some error?
    }

    // Let's check if the browser supports notifications
    if (!"Notification" in window) {
        console.log("This browser does not support notifications.");
    } else {
        if (checkNotificationPromise()) {
            Notification.requestPermission()
                .then((permission) => {
                    handlePermission(permission);
                })
        } else {
            Notification.requestPermission(function (permission) {
                handlePermission(permission);
            });
        }
    }
}

// Function to check whether browser supports the promise version of requestPermission()
// Safari only supports the old callback-based version
function checkNotificationPromise() {
    try {
        Notification.requestPermission().then();
    } catch (e) {
        console.log(e);
        return false;
    }

    return true;
}

function createNotification(message) {

    // Create and show the notification
    let img = '../images/clock.ico';
    let notification = new Notification('Inactive Timer', { body: message, icon: img });

    var ms = 15000; // close notification after 15 sec
    notification.onshow = () => {setTimeout(notification.close, ms)};
}

function shownotification(message) {
    if (Notification.permission === 'granted') {
        createNotification(message);
    }
    else
    {
        showAlert(`No notification permission given, showing Window alert instead!\n${message}`);
    }
}