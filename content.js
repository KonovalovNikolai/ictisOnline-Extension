document.title = 'ictisOnline Extension';

// document.getElementById("search-button").replaceWith(document.getElementById("search-button").cloneNode(true));

const button = document.getElementById("search-button");
const input = document.getElementById("search-field");

const injectedCode = 
`
document.getElementById("search-button").onclick = function () {
    var value = document.getElementById("search-field").value;
    if (value != ''){
        localStorage.lastRequest = value;
    }
    search(value);
}
`
var script = document.createElement("script");
script.textContent = injectedCode;

(document.head).appendChild(script);

if (localStorage.lastRequest){
    input.value = localStorage.lastRequest;
    button.click();
}