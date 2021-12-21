let timeoutId;
let countdownId;
let nextAlertAt;
let nIntervalInMinutes = 30
let nInterval = 60 * nIntervalInMinutes; //interval time in seconds

function setOutput(outputString, ticker) {
    document.querySelector('#timeroutput-date').textContent = outputString;
    document.querySelector('#ticker').textContent = ticker ? ticker : "00:00";
}

function startTimer(mins) {
    nextAlertAt = setTimerInterval(mins);
    startCountdown();

    timeoutId = setInterval(() => {
        stopAllTimers(false);
        writeToOutputConsole('Shown alert on');
        shownotification("Hey buddy!\nTime to get up and get moving for 2-3 minutes!");
        startTimer(nIntervalInMinutes);
    }, nInterval * 1000);

    writeToOutputConsole('Timer (re)started on');
}

function setTimerInterval(mins) {
    const parsed = parseInt(mins);
    if (isNaN(parsed) || parsed < 1) {
        nIntervalInMinutes = 30;
        nInterval = 60 * nIntervalInMinutes;
        writeToOutputConsole('Invalid interval value, reverting to the default value', true);
    }
    else {
        nInterval = 60 * parsed;
        nIntervalInMinutes = parsed;
    }
    return dateAdd(nInterval);
}

function dateAdd(nSeconds) {
    var d1 = new Date();
    d1.setSeconds(d1.getSeconds() + nSeconds);
    return d1;
}

function clearOutput() {
    writeToOutputConsole("Output cleared", true);
}

function writeToOutputConsole(prefix, clearOutput = false) {
    const logConsole = document.getElementById('output');
    if (clearOutput || logConsole.textLength < 1) {
        logConsole.innerHTML = (`${prefix} on ${currentDateTime()}`);
    }
    else {
        logConsole.innerHTML += (`\n${prefix} ${currentDateTime()}`);
    }
    logConsole.scrollTop = console.scrollHeight;
}

function currentDateTime() {
    var objToday = new Date();
    return objToday.toLocaleDateString() + ' ' + objToday.toLocaleTimeString();
}

function startCountdown() {
    stopAllTimers(false); //clear any previous timers

    countdownId = setInterval(() => {
        var datediff = new Date(nextAlertAt - Date.now());

        setOutput(`Next alert at ${nextAlertAt.toLocaleDateString() + ' ' + nextAlertAt.toLocaleTimeString()}`, `${datediff.getMinutes()}:${datediff.getSeconds()}`);
    }, 1000); //every second
}

function stopAllTimers(resetTextOutput = true) {
    stopCountDown();
    stopInactiveAlertTimer();

    if (resetTextOutput) {
        setOutput("Timer stopped!");
        writeToOutputConsole("Timer stopped on");
    }
}

function stopCountDown() {
    clearInterval(countdownId);
}

function stopInactiveAlertTimer() {
    clearInterval(timeoutId);
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

        // set the button to shown or hidden, depending on what the user answers, here showing a notification
        shownotification(`Permission ${Notification.permission}`);
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
}

function shownotification(message) {
    if (Notification.permission === 'granted') {
        createNotification(message);
    }
    else {
        showAlert(`No notification permission given, showing Window alert instead!\n${message}`);
    }
}