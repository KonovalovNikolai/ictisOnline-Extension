class ScheduleTable {
    _currentWeek = undefined;
    _selectedWeek = undefined;
    currentGroup = undefined;
    _interval = undefined;

    _firstParse = true;
    _addsTimeLine = true;


    constructor(weekBlockItemsClass="chip",
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

        this._rowIndex = (new Date()).getDay() + 1;
        this._rowIndex = (this._rowIndex == 1) ? 8 : this._rowIndex;
    }

    hide() {
        $(this.tableBlock).hide();
        clearInterval(this._interval);
    }

    show() {
        $(this.tableBlock).show();
    }

    parseFromResponse(response) {
        clearInterval(this._interval);

        this._selectedWeek = response.table.week;
        this.currentGroup = response.table.group;

        if (this._firstParse) {
            this._currentWeek = response.table.week;
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
                    td.classList.add("hideable");
                }

                tr.appendChild(td);
            }
            
            if (this._addsTimeLine && this._currentWeek == this._selectedWeek && this._rowIndex === i){
                tr.id = "current-day";
            }

            $(this.tableBody).append(tr);
        }

        if (this._addsTimeLine){
            TimeLine.Draw();
            this._interval =  setInterval(TimeLine.Draw, 1000);
        }

    }

    parseHeaderFromResponse(type, name) {
        $(this.tableHeader).text(`${type} ${name}`);
    }

    markWeek() {
        var weeks = $(this.weekBlock).children('div');
        for(var week of weeks) {
            if ($(week).text() == this._selectedWeek) {
                $(week).css('background-color', 'var(--selected-week-color)');
            }
            else if ($(week).text() == this._currentWeek) {
                $(week).css('background-color', 'var(--current-week-color)');
            }
            else  {
                $(week).css('background-color', 'var(--unselected-week-color)');
            }
        }
    }
}