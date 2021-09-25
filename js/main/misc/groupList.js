class GroupList {
    constructor(listBlockSelector="#list-block", listItemClass="collection-item") {
        this.listBlock = $(listBlockSelector);
        
        this.listItemClass = listItemClass;
        this.listItemSelector = `.${listItemClass}`;
    }

    hide() {
        $(this.listBlock).hide();
    }

    show() {
        $(this.listBlock).show();
    }

    parseListFromResponse(response) {
        $(this.listBlock).empty();

        for (var i in response.choices) {
            var a = document.createElement("a");
    
            a.href = "#!";
            a.classList.add(this.listItemClass);
            a.setAttribute("doc_group", response.choices[i].group);
            a.textContent =  response.choices[i].name;
    
            $(this.listBlock).append(a);
        }
    }
}