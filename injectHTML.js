document.title = 'ictisOnline Extension';


document.getElementsByTagName("link")[0].remove();
document.getElementsByTagName("script")[0].remove();

document.getElementsByTagName("body")[0].innerHTML = 
`
<div id="schedule">
    <div class="container d-flex">
        <div class="input-field w-100" id="input-block">
            <input placeholder="Введите номер группы, аудиторию или преподавателя" id="search-field" type="text">
        </div>
        <div class="input-field">
            <a class="btn" id="search-button">Найти</a>
        </div>
    </div>

    <div class="container collection" id="list-block"></div>

    <div class="container table-block" id="table-block" style="display:none">
        <h3 id="header-block" class="center"></h3>

        <div class="" id="week-block">
            <span>Недели:</span>
        </div>

        <div class="">
            <table class="striped">
                <thead>
                    <tr>
                        <td>Пары</td>
                        <td>1-я</td>
                        <td>2-я</td>
                        <td>3-я</td>
                        <td>4-я</td>
                        <td>5-я</td>
                        <td>6-я</td>
                        <td>7-я</td>
                    </tr>
                    <tr>
                        <td>Время</td>
                        <td>08:00-09:35</td>
                        <td>09:50-11:25</td>
                        <td>11:55-13:30</td>
                        <td>13:45-15:20</td>
                        <td>15:50-17:25</td>
                        <td>17:40-19:15</td>
                        <td>19:30-21:05</td>
                    </tr>
                </thead>
                <tbody id="tbody-block"></tbody>
            </table>
        </div>

        <a id="calendar-link" href="#">Скачать календарь</a>
    </div>
</div>
`