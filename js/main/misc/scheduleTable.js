class ScheduleTable {
    _currentWeekNumber = undefined;
    _selectedWeekNumber = undefined;
    currentGroup = undefined;

    selectedWeek = undefined;

    _firstParse = true;

    constructor(timeLine,
                cellManipulator,
                weekBlockItemsClass="chip",
                tableSelector="#table-block",
                tBodySelector="#tbody-block",
                headerSelector="#header-block",
                weekBlockSelector="#week-block",
                calenderLinkSelector="#calendar-link")
    {
        this.tableBody = $(tBodySelector);
        this.tableBlock = $(tableSelector);
        this.tableHeader = $(headerSelector);
        this.weekBlock = $(weekBlockSelector);
        this.calendarLink = $(calenderLinkSelector);

        this.weekBlockItemsClass = weekBlockItemsClass;
        this.weekBlockItemsSelector = `.${weekBlockItemsClass}`;

        this._currentDayRowIndex = (new Date()).getDay() + 1;
        this._currentDayRowIndex = (this._currentDayRowIndex == 1) ? 8 : this._currentDayRowIndex;

        this._timeLine = timeLine;
        this._cellManipulator = cellManipulator;
    }

    hide() {
        $(this.tableBlock).hide();
        this.selectedWeek = undefined;
        this._timeLine.ClearInterval()
    }

    show() {
        $(this.tableBlock).show();
    }

    isCurrentWeek() {
        return this._currentWeekNumber == this._selectedWeekNumber;
    }

    ShowTimeLine() {
        this._timeLine.SetIntervalDraw();
    }

    parseFromResponse(response) {
        this._timeLine.ClearInterval()

        this._selectedWeekNumber = response.table.week;
        this.currentGroup = response.table.group;

        if (this._firstParse) {
            this._currentWeekNumber = response.table.week;
            this._firstParse = false;
        }

        this.setCalendarLink(response.table.link);
        this.parseWeekFromResponse(response.weeks);
        this.parseTableFromResponse(response.table.table);
        this.parseHeaderFromResponse(response.table.type, response.table.name);

        this.markWeek();
    }

    setCalendarLink(link) {
        $(this.calendarLink).attr('href', `/schedule-api/calendar/${link}`);
    }

    parseWeekFromResponse(weeks) {
        $(this.weekBlock).empty()

        for (var i in weeks) {
            var div = document.createElement("div");
            div.classList.add(this.weekBlockItemsClass);
            div.textContent = weeks[i];
            div.setAttribute("week", weeks[i]);
            
            $(this.weekBlock).append(div);
        }
    }

    parseTableFromResponse(table) {
        if (!table.length) {
            return;
        }
        
        $(this.tableBody).empty();

        for (var i = 2; i < table.length; i++) {
            var tr = document.createElement("tr");

            for (var j in table[i]) {
                var td = document.createElement("td");
                td.textContent = table[i][j];
                
                if (table[i][j] != '' && j != 0) {
                    this._cellManipulator.MakeManipulatable(td);
                }

                tr.appendChild(td);
            }
            
            if (this._currentWeekNumber == this._selectedWeekNumber && this._currentDayRowIndex === i){
                this._timeLine.MarkDay(tr);
            }

            $(this.tableBody).append(tr);
        }

        this._timeLine.SetIntervalDraw();

    }

    parseHeaderFromResponse(type, name) {
        $(this.tableHeader).text(`${type} ${name}`);
    }

    markWeek() {
        var weeks = $(this.weekBlock).children('div');
        for(var week of weeks) {
            if ($(week).text() == this._selectedWeekNumber) {
                this.selectedWeek = week;
                $(week).css('background-color', 'var(--selected-week-color)');
            }
            else if ($(week).text() == this._currentWeekNumber) {
                $(week).css('background-color', 'var(--current-week-color)');
            }
            else  {
                $(week).css('background-color', 'var(--unselected-week-color)');
            }
        }
    }
}