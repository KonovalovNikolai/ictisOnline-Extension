var global_group = undefined;
var base_url = '/schedule-api';
var global_week = null;

var firstRequest = true;
var currentWeek = null;

var index = (new Date()).getDay() + 1;
index == 1 ? 8 : index;

docment.getElementById("search-button").onclick = function () {
    var value = document.getElementById("search-field").value;
    if (value != ''){
        localStorage.lastRequest = value;
    }
    search(value);
}

function parseTableFromResponse(response) {
    console.log(response);

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

    var html = '<table class="striped"><thead>';
    var separator = '</thead><tbody>';
    var end = '</tbody></table>';
    var counter = 0;

    var rowEnd = '</tr>';
    for (var i in table) {
        var row = '';

        for (var j in table[i]) {
            var template = '<td>' + table[i][j] + '</td>';
            row += template;
        }

        var rowStart = '<tr>';
        if (currentWeek === global_week && index == i){
            rowStart = '<tr style="background-color: rgb(155, 204, 137)">';
        }

        row = rowStart + row + rowEnd;
        counter += 1;

        if (counter === 2) {
            row += separator;
        }

        html += row;
    }

    html += end;
    document.getElementById("table-block").innerHTML = html;

    firstRequest = false;
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
    if (response.choices) {
        parseListFromResponse(response);
        document.getElementById("table-block").innerHTML = '';
        document.getElementById("header-block").innerHTML = '';
        document.getElementById("week-block").innerHTML = '';
        document.getElementById("calendar-link").innerHTML = '';
    } else if (response.table) {
        parseTableFromResponse(response);
        setCalendarLink(response);
        parseHeaderFromResponse(response);
        parseWeekFromResponse(response);
        document.getElementById("list-block").innerHTML = '';
    }
}

function parseListFromResponse(response) {
    var html = '<div class="collection">';
    var end = '</div>';
    for (var i in response.choices) {
        var template = '<a href="#!" class="collection-item" doc_group="' +
            response.choices[i].group + '">' + response.choices[i].name + '</a>';
        html += template;
    }
    html += end;
    document.getElementById("list-block").innerHTML = html;
}

function setCalendarLink(response) {
    var group = response.table.link;
    var html = '<a href="/schedule-api/calendar/'+group+'">РЎРєР°С‡Р°С‚СЊ РєР°Р»РµРЅРґР°СЂСЊ</a>';
    document.getElementById('calendar-link').innerHTML = html;
}

function noTableRender(response) {
    global_week = response.table.week;
    global_group = response.table.group;
    document.getElementById("table-block").innerHTML = '<p>РќРµС‚ СЂР°СЃРїРёСЃР°РЅРёСЏ РЅР° СЌС‚Сѓ РЅРµРґРµР»СЋ</p>';
}

function parseHeaderFromResponse(response) {
    document.getElementById("header-block").innerHTML =
        '<h3>' + response.table.type + ' ' +
        response.table.name + '<span class="print"> - РќРµРґРµР»СЏ  '+response.table.week+'</span></h3>';
}

function parseWeekFromResponse(response) {
    var weeks = '<span>РќРµРґРµР»Рё: </span>';
    for (var i in response.weeks) {
        weeks += '<a href="#!"><div class="chip" week="' + response.weeks[i] +
            '">' + response.weeks[i] + '</div></a>'
    }
    document.getElementById("week-block").innerHTML = weeks;
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