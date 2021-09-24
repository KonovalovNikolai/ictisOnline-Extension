document.title = 'ictisOnline Extension';

const button = document.getElementById("search-button");
const input = document.getElementById("search-field");

if (localStorage.lastRequest){
    input.value = localStorage.lastRequest;
    button.click();
}