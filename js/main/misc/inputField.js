class InputField {
    constructor(inputFieldSelector="#search-field", inputButtonSelector="#search-button") {
        this.field = $(inputFieldSelector);
        this.button = $(inputButtonSelector);
    }

    get value() {
        return $(this.field).val();
    }

    set value(value) {
        $(this.field).val(value);
    }
}