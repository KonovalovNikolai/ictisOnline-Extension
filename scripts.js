var global_group = undefined;
var base_url = '/schedule-api';
var global_week = null;

var firstRequest = true;
var currentWeek = null;

var index = (new Date()).getDay() + 1;
index == 1 ? 8 : index;

document.getElementById("search-button").onclick = function () {
    var value = document.getElementById("search-field").value;
    if (value != ''){
        localStorage.lastRequest = value;
    }
    search(value);
}

function parseTableFromResponse(response) {
    // console.log(response);

    var table = response.table.table;

    if (!table.length) {
        noTableRender(response);
        return;
    }

    global_week = response.table.week;
    global_group = response.table.group;

    if (firstRequest) {
        currentWeek = response.table.week;
        firstRequest = false;
    }

    var tableElem = document.createElement("table");
    tableElem.classList.add("striped");

    var theadElem = document.createElement("thead");
    var tbodyElem = document.createElement("tbody");

    for (var i in table) {
        var tr = document.createElement("tr");

        for (var j in table[i]) {
            var td = document.createElement("td");
            td.textContent = table[i][j];
            tr.appendChild(td);
        }

        if (currentWeek === global_week && index == i){
            tr.style = "background-color: rgb(155, 204, 137)";
        }

        if (i < 2) {
            theadElem.appendChild(tr);
        }
        else {
            tbodyElem.appendChild(tr);
        }
    }

    tableElem.appendChild(theadElem);
    tableElem.appendChild(tbodyElem);

    document.getElementById("table-block").appendChild(tableElem);
}

function markWeek() {
    var week = global_week;

    var el = document.getElementById('week-block');
    if (!el) {
        return;
    }

    var weekBlock = el.getElementsByTagName('A');
    for (var i = 0;  i < weekBlock.length; i++) {
        if (parseInt(weekBlock[i].firstChild.textContent) === parseInt(week)) {
            weekBlock[i].firstChild.style.setProperty('background-color', '#3f51b5');
        }
        else if (parseInt(weekBlock[i].firstChild.textContent) === parseInt(currentWeek)) {
            weekBlock[i].firstChild.style.setProperty('background-color', '#9bcc89');
        }
        else {
            weekBlock[i].firstChild.style.setProperty('background-color', '#e4e4e4');
        }
    }
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

    document.getElementById("list-block").innerHTML = '';
    document.getElementById("week-block").innerHTML = '';
    document.getElementById("table-block").innerHTML = '';
    document.getElementById("header-block").innerHTML = '';
    document.getElementById("calendar-link").innerHTML = '';

    if (response.choices) {
        parseListFromResponse(response);
    } else if (response.table) {
        setCalendarLink(response);
        parseWeekFromResponse(response);
        parseTableFromResponse(response);
        parseHeaderFromResponse(response);
    }
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
}

function setCalendarLink(response) {
    var a = document.getElementById('calendar-link');
    a.href = "/schedule-api/calendar/" + response.table.link;
}

function noTableRender(response) {
    global_week = response.table.week;
    global_group = response.table.group;

    var tableBlock = document.getElementById("table-block");
    tableBlock.innerHTML = '<p>Нет расписания.</p>';
}

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


var target = document.querySelector('#table-block');
var week_observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    markWeek();
  });
});
var config = { attributes: true, childList: true, characterData: true };
week_observer.observe(target, config);