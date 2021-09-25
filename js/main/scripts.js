var global_group = undefined;
var base_url = '/schedule-api';
var global_week = null;

var firstRequest = true;
var currentWeek = null;

var tableIndex = (new Date()).getDay() + 1;
tableIndex == 1 ? 8 : tableIndex;

var clockId = undefined;

$("#search-button").click( function () {
    var value = $("#search-field").val();
    if (value != ''){
        localStorage.lastRequest = value;
    }

    search(value);
});

$('#search-field').keyup(function(event) {
    if (event.which == 13) {
        event.preventDefault();
        $('#search-button').click();
    }
});

$(document).on("click", ".collection-item", function (event) {
    event.preventDefault();
    var group = $(this).attr('doc_group');
    getFromGroup(group);
});

$(document).on("click", ".chip", function (event) {
    event.preventDefault();
    var week = $(this).attr("week");
    getFromGroupWeek(global_group, week);
});

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
        clearInterval(clockId);

        $("#week-block").empty();
        $("#table-block").hide();

        parseListFromResponse(response);
    } else if (response.table) {
        clearInterval(clockId);

        $("#week-block").empty();
        $("#list-block").hide();

        setCalendarLink(response);
        parseWeekFromResponse(response);
        parseTableFromResponse(response);
        parseHeaderFromResponse(response);

        markWeek();
    }
}

function markWeek() {
    var weekBlock = $('#week-block');
    if (!weekBlock) {
        return;
    }

    $(weekBlock).children('div').each(function () {
        if ($(this).text() == global_week) {
            $(this).css('background-color', 'var(--selected-week-color)');
        }
        else if ($(this).text() == currentWeek) {
            $(this).css('background-color', 'var(--current-week-color)');
        }
        else  {
            $(this).css('background-color', 'var(--unselected-week-color)');
        }
    });
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

            if (table[i][j] != '' && j != 0) {
                td.classList.add("hideable");
            }

            tr.appendChild(td);
        }
        

        if (currentWeek === global_week && tableIndex == i){
            tr.classList.add("current-day");
        }

        tbody.appendChild(tr);
    }

    clockTimer();
    clockId =  setInterval(clockTimer, 1000);

    $("#table-block").show();
}

function parseListFromResponse(response) {
    var listBlock = $("#list-block");

    for (var i in response.choices) {
        var a = document.createElement("a");

        a.href = "#!";
        a.classList.add("collection-item");
        a.setAttribute("doc_group", response.choices[i].group);
        a.textContent =  response.choices[i].name;

        $(listBlock).append(a);
    }

    $(listBlock).show();
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
    $("#header-block").text(`${response.table.type} ${response.table.name}`);
}

function parseWeekFromResponse(response) {
    var weekBlock = document.getElementById("week-block");

    for (var i in response.weeks) {
        var div = document.createElement("div");
        div.classList.add("chip");
        div.textContent = response.weeks[i];
        div.setAttribute("week", response.weeks[i]);

        weekBlock.appendChild(div);
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

if (localStorage.lastRequest) {
    $("#search-field").val(localStorage.lastRequest);
    $("#search-button").click();
}