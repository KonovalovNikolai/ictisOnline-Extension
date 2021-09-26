class CellManipulator {
    constructor(manipulatableElementsClass="manipulatable") {
        this.manipulatableElementsClass = manipulatableElementsClass;
    }

    MakeManipulatable(element) {
        element.classList.add(this.manipulatableElementsClass);
    }
}