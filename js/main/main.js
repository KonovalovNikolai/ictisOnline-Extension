const baseUrl = '/schedule-api';

var timeLine = new TimeLine();
var cellManipulator = new CellManipulator();

const groupList = new GroupList();
const inputField = new InputField();
const scheduleTable = new ScheduleTable(timeLine=timeLine, cellManipulator=cellManipulator)

$(inputField.button).click(function () {
    var value = inputField.value;
    if (value != ''){
        localStorage.lastRequest = value;
    }

    search(value);
});

$(inputField.field).keyup(function (event) {
    if (event.which == 13) {
        event.preventDefault();
        $(inputField.button).click()
    }
});

$(document).keydown(function (event) {
    if (!event.ctrlKey) {
        return;
    }

    cellManipulator.HighlightManipulatableElements();
});

$(document).keyup(function (event) {    
    if (event.which != 17) {
        return;
    }
    cellManipulator.UndoHighlightManipulatableElements();
});

$(document).on("click", cellManipulator.highlightedElementsSelector, function () {
    cellManipulator.MarkElementAsHidded(this);

    if (scheduleTable.selectedWeek) {
        $(scheduleTable.selectedWeek).click();
        return;
    }
});

$(document).on("click", cellManipulator.hiddedElementSelector, function () {
    cellManipulator.UnmarkElementAsHided(this);
    
    if (scheduleTable.selectedWeek) {
        $(scheduleTable.selectedWeek).click();
        return;
    }
});

$(document).on("click", groupList.listItemSelector, function (event) {
    event.preventDefault();
    var group = $(this).attr('doc_group');
    inputField.value = $(this).text();
    $(inputField.button).click();
});

$(document).on("click", scheduleTable.weekBlockItemsSelector, function (event) {
    event.preventDefault();
    var week = $(this).attr("week");
    getFromGroupWeek(scheduleTable.currentGroup, week);
});

function processResult(response) {
    response = JSON.parse(response);

    if (response.choices) {
        scheduleTable.hide();
        groupList.parseListFromResponse(response);
        groupList.show();
    }
    else if (response.table) {
        groupList.hide();
        scheduleTable.parseFromResponse(response);
        scheduleTable.show();
    }
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
    xhttp.open("GET", baseUrl + "/?group=" + group + '&week=' + week, true);
    xhttp.send();
}

function search(query) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            processResult(this.responseText);
        }
    };
    xhttp.open("GET", baseUrl + "/?query=" + query, true);
    xhttp.send();
}

if (localStorage.lastRequest) {
    inputField.value = localStorage.lastRequest;
    inputField.button.click();
}