
document.getElementsByTagName("link")[0].remove();
document.getElementsByTagName("script")[0].remove();

document.getElementsByTagName("body")[0].innerHTML = 
`
<div id="schedule">
    <div class="row">
    <div class="input-field col s10" id="input-block">
        <input placeholder="Введите номер группы, аудиторию или преподавателя" id="search-field" type="text">
    </div>
    <div class="input-field col s2">
        <a class="waves-effect indigo waves-light btn" id="search-button">Найти</a>
    </div>
</div>

<div class="row">
    <div class="col s12">
        <div class="collection" id="list-block"></div>
    </div>
</div>
    <div class="row">
        <h3 id="header-block" class="col s12 center"></h3>

        <div class="col s12" id="week-block">
            <span>Недели:</span>
        </div>

        <div class="col s12" id="table-block">
        </div>

        <a id="calendar-link" href="#">Скачать календарь</a>
    </div>
</div>
`