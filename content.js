document.title = 'ictisOnline Extension';

const button = document.getElementById("search-button");
const input = document.getElementById("search-field");

const injectedCode = 
`
var firstRequest = true;
var current_week = null;
var index = -1;

const currentDate = new Date();

const weekDay = { 
    'января' : 0, 
    'февраля' : 1, 
    'марта' : 2,
    'апреля' : 3,
    'мая' : 4,
    'июня' : 5,
    'июля' : 6,
    'августа' : 7,
    'сентября' : 8,
    'октября' : 9,
    'ноября' : 10,
    'декабря' : 11
};

document.getElementById("search-button").onclick = function () {
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
        current_week = response.table.week;
    }

    var checkDate = false;
    if (current_week === global_week){
        checkDate = true;
    }

    var html = '<table class="striped"><thead>';
    var separator = '</thead><tbody>';
    var end = '</tbody></table>';
    var counter = 0;

    for (var i in table) {
        var row = '';
        var rowEnd = '</tr>';

        for (var j in table[i]) {
            if (firstRequest && checkDate && j == 0) {
                if (table[i][j].includes(currentDate.getDate())){
                    console.log(weekDay[table[i][j].slice(table[i][j].indexOf(' ')+2)] == currentDate.getMonth());
                    if (weekDay[table[i][j].slice(table[i][j].indexOf(' ')+2)] == currentDate.getMonth()) {
                        index = i;
                        firstRequest = false;
                    }
                }
            }
            var template = '<td>' + table[i][j] + '</td>';
            row += template;
        }

        var rowStart = '<tr>';
        if (checkDate && index === i){
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
        else if (parseInt(weekBlock[i].firstChild.textContent) === parseInt(current_week)) {
            weekBlock[i].firstChild.style.setProperty('background-color', '#9bcc89');
        }
        else {
            weekBlock[i].firstChild.style.setProperty('background-color', '#e4e4e4');
        }
    }
}
`
var script = document.createElement("script");
script.textContent = injectedCode;

(document.head).appendChild(script);

if (localStorage.lastRequest){
    input.value = localStorage.lastRequest;
    button.click();
}