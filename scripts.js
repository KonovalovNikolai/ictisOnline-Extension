var global_group = undefined;
var base_url = '/schedule-api';
var global_week = null;

var firstRequest = true;
var currentWeek = null;

var tableIndex = (new Date()).getDay() + 1;
tableIndex == 1 ? 8 : tableIndex;

var clockId = undefined;

function hide(element) {
    element.style.display = "none";
}

function show(element) {
    element.style.display = "";
}

document.getElementById("search-button").onclick = function () {
    var value = document.getElementById("search-field").value;
    if (value != ''){
        localStorage.lastRequest = value;
    }
    search(value);
}

document.getElementById('search-field').onkeyup = function(event) {
  if (event.key === 13 || event.keyCode === 13) {
    event.preventDefault();
    document.getElementById('search-button').click();
  }
};

document.getElementById('list-block').onclick = function (event) {
    event.preventDefault();
    if (event.target.tagName === 'A') {
        var a = event.target;
        var group = a.getAttribute('doc_group');
        global_group = group;
        getFromGroup(group);
    }
};

document.getElementById('week-block').onclick = function (event) {
    event.preventDefault();
    if (event.target.tagName === 'DIV') {
        var a = event.target;
        var week = a.getAttribute('week');
        getFromGroupWeek(global_group, week);
    }
};

function search(query) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            processResult(this.responseText);
        }
    };
    xhttp.open("GET", base_url + "/?query=" + query, true);
    xhttp.send();
}

function processResult(response) {
    response = JSON.parse(response);

    if (response.choices) {
        document.getElementById("week-block").innerHTML = '';
        hide(document.getElementById("table-block"));
        clearInterval(clockId);

        parseListFromResponse(response);
    } else if (response.table) {
        document.getElementById("week-block").innerHTML = '';
        hide(document.getElementById("list-block"));
        clearInterval(clockId);

        setCalendarLink(response);
        parseWeekFromResponse(response);
        parseTableFromResponse(response);
        parseHeaderFromResponse(response);

        markWeek();
    }
}

function markWeek() {
    console.log("hello");
    var week = global_week;

    var el = document.getElementById('week-block');
    if (!el) {
        return;
    }

    var weekBlock = el.getElementsByTagName('a');
    for (var i = 0;  i < weekBlock.length; i++) {
        if (parseInt(weekBlock[i].firstChild.textContent) === parseInt(week)) {
            weekBlock[i].firstChild.style.setProperty('background-color', 'var(--selected-week-color)');
        }
        else if (parseInt(weekBlock[i].firstChild.textContent) === parseInt(currentWeek)) {
            weekBlock[i].firstChild.style.setProperty('background-color', 'var(--current-week-color)');
        }
        else {
            weekBlock[i].firstChild.style.setProperty('background-color', 'var(--unselected-week-color)');
        }
    }
}

function parseTableFromResponse(response) {
    console.log(response);

    var table = response.table.table;

    if (!table.length) {
        // noTableRender(response);
        return;
    }

    global_week = response.table.week;
    global_group = response.table.group;

    if (firstRequest) {
        currentWeek = response.table.week;
        firstRequest = false;
    }

    var tbody = document.getElementById("tbody-block");
    tbody.innerHTML = "";

    for (var i = 2; i < table.length; i++) {
        var tr = document.createElement("tr");

        for (var j in table[i]) {
            var td = document.createElement("td");
            td.textContent = table[i][j];

            tr.appendChild(td);
        }

        if (currentWeek === global_week && tableIndex == i){
            tr.classList.add("current-day");
        }

        tbody.appendChild(tr);
    }

    clockTimer();
    clockId =  setInterval(clockTimer, 1000);
    
    show(document.getElementById("table-block"));
}

function parseListFromResponse(response) {
    var listBlock = document.getElementById("list-block");

    for (var i in response.choices) {
        var a = document.createElement("a");

        a.href = "#!";
        a.classList.add("collection-item");
        a.setAttribute("doc_group", response.choices[i].group);
        a.textContent =  response.choices[i].name;

        listBlock.appendChild(a);
    }

    show(listBlock);
}

function setCalendarLink(response) {
    var a = document.getElementById('calendar-link');
    a.href = "/schedule-api/calendar/" + response.table.link;
}

// function noTableRender(response) {
//     global_week = response.table.week;
//     global_group = response.table.group;

//     var tableBlock = document.getElementById("table-block");
//     tableBlock.innerHTML = '<p>Нет расписания.</p>';

//     show(tableBlock)
// }

function parseHeaderFromResponse(response) {
    var header = document.getElementById("header-block");
    header.textContent = response.table.type + ' ' + response.table.name;
}

function parseWeekFromResponse(response) {
    var weekBlock = document.getElementById("week-block");

    for (var i in response.weeks) {
        var a = document.createElement("a");
        a.href = "#!";

        var div = document.createElement("div");
        div.classList.add("chip");
        div.textContent = response.weeks[i];
        div.setAttribute("week", response.weeks[i]);

        a.appendChild(div);

        weekBlock.appendChild(a);
    }

}

function getFromGroup(group) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            processResult(this.responseText);
        }
    };
    xhttp.open("GET", base_url + "/?group=" + group, true);
    xhttp.send();
}

function getFromGroupWeek(group, week) {
    if (week === null) {
        return;
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            processResult(this.responseText);
        }
    };
    xhttp.open("GET", base_url + "/?group=" + group + '&week=' + week, true);
    xhttp.send();
}

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