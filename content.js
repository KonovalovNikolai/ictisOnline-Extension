document.title = 'ictisOnline Extension';

const button = document.getElementById("search-button");
const input = document.getElementById("search-field");

document.getElementsByTagName("link")[0].remove();
document.getElementsByTagName("script")[0].remove();

if (localStorage.lastRequest){
    input.value = localStorage.lastRequest;
    button.click();
}