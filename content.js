if (localStorage.lastRequest) {
    const button = document.getElementById("search-button");
    const input = document.getElementById("search-field");
    input.value = localStorage.lastRequest;
    button.click();
}

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