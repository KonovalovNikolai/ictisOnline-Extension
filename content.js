document.title = 'ictisOnline Extension';

const button = document.getElementById("search-button");
const input = document.getElementById("search-field");

const injectedCode = 
`
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
`
var script = document.createElement("script");
script.textContent = injectedCode;

(document.head).appendChild(script);

if (localStorage.lastRequest){
    input.value = localStorage.lastRequest;
    button.click();
}