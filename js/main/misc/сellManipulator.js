class CellManipulator {
    constructor(manipulatableElementsClass="manipulatable",
                highlightedElementsClass="highlighted",
                hiddedElementClass="hidded") {
        this.manipulatableElementsClass = manipulatableElementsClass;
        this.manipulatableElementsSelector = `.${manipulatableElementsClass}`;

        this.highlightedElementsClass = highlightedElementsClass;
        this.highlightedElementsSelector = `.${highlightedElementsClass}`;

        this.hiddedElementClass = hiddedElementClass;
        this.hiddedElementSelector = `.${hiddedElementClass}`;
    }

    HighlightManipulatableElements() {
        $(this.manipulatableElementsSelector).addClass(this.highlightedElementsClass);
    }

    UndoHighlightManipulatableElements() {
        $(this.manipulatableElementsSelector).removeClass(this.highlightedElementsClass);
    }

    MakeManipulatable(element) {
        $(element).addClass(this.manipulatableElementsClass);

        if (localStorage[$(element).text()]) {
            $(element).addClass(this.hiddedElementClass);
        }
    }

    MarkElementAsHidded(element) {
        localStorage[$(element).text()] = true;
    }

    UnmarkElementAsHided(element) {
        localStorage.removeItem($(element).text());
    }
}