document.title = 'ictisOnline Extension';

const button = document.getElementById("search-button");
const input = document.getElementById("search-field");
const currentDate = new Date();

const injectedCode = 
`
var firstRequest = true;
var current_week = null;

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
    
    var html = '<table class="striped"><thead>';
    var separator = '</thead><tbody>';
    var end = '</tbody></table>';
    var counter = 0;
    for (var i in table) {
        var row = '<tr>';
        var rowEnd = '</tr>';
        for (var j in table[i]) {
            var template = '<td>' + table[i][j] + '</td>';
            row += template;
        }
        row += rowEnd;
        counter += 1;
        if (counter === 2) {
            row += separator;
        }
        html += row;
    }
    html += end;
    document.getElementById("table-block").innerHTML = html;
    global_week = response.table.week;
    global_group = response.table.group;
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