class Diapason {
    constructor(start, end){
        this.start = start;
        this.end = end;
    }

    includes(number){
        return number > this.start && number < this.end ? true : false;
    }
}

// Временные промежутки пар в секундах
var timeDiapasons = [
    new Diapason(28800, 34500), // 08:00-09:35
    new Diapason(35400, 41100), // 09:50-11:25
    new Diapason(42900, 48600), // 11:55-13:30
    new Diapason(49500, 55200), // 13:45-15:20
    new Diapason(57000, 62700), // 15:50-17:25
    new Diapason(63600, 69300), // 17:40-19:15
    new Diapason(70200, 75900) // 19:30-21:05
];

function clockTimer() {
    var tbody = document.getElementsByClassName("current-day")[0];

    if (!tbody){
        return;
    }

    var date = new Date();
    // Перевод времени в секунды
    var time = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();

    for (var i = 0; i < timeDiapasons.length; i++) {
        if (timeDiapasons[i].includes(time)) {
            var percent = (time - timeDiapasons[i].start) / (timeDiapasons[i].end - timeDiapasons[i].start) * 100;
            tbody.children[i+1].style = `background: linear-gradient(to right, var(--current-week-color) ${percent}%, var(--selected-week-color) ${percent}%);`;
        }
        else if (timeDiapasons[i].start > time) {
            tbody.children[i+1].style = "background-color: var(--selected-week-color);";
        }
        else {
            tbody.children[i+1].style = "background-color: var(--current-week-color);";
        }
    }
}