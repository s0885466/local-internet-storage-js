var basketOfGoods ={};
$(document).ready(function (param) {  
//очищаем все товары у элемента  catalog через функцию
$('.content').empty();
//Выводим пустую корзину или все товары из localStorage
checkLocalStorage();
//запускаем функцию ответственную за все события
allEvents();
});

//функция объединяющая все события
function allEvents(){
//Создадим событие клика по кнопке удалить
$('.removeAllGoods').on('click', reload);
//Создадим событие клика по кнопке +
$('.addGood').on('click', addOneGood);
//Создадим событие клика по кнопке -
$('.removeGood').on('click', removeOneGood);
}


function addOneGood(){
    var id = $(this).attr('data_good');
    basketOfGoods[id]['number'] ++;
    localStorage.setItem('cart', JSON.stringify(basketOfGoods));
    $('.content').empty();
    checkLocalStorage();
    allEvents();
}

function removeOneGood(){
    var id = $(this).attr('data_good');
    if (basketOfGoods[id]['number'] == 1) {delete basketOfGoods[id];}
    else {basketOfGoods[id]['number'] -- };
    localStorage.setItem('cart', JSON.stringify(basketOfGoods));
    $('.content').empty();
    checkLocalStorage();
    allEvents();
}




function reload(){
    var id = $(this).attr('data_good');
    delete basketOfGoods[id]; //удалить целый элемент из объекта
    localStorage.setItem('cart', JSON.stringify(basketOfGoods));
    $('.content').empty();
    checkLocalStorage();
    $('.removeAllGoods').on('click', reload); // добавляем вновь событие
    if (localStorage.cart === "{}") {
        $('.content').html('<div><a href = "eshop-result.html"> К списку товаров</a></div>');
    }
    allEvents();
};

function checkLocalStorage(){
    if (localStorage.cart === undefined || localStorage.cart === "{}") {
        $('.content').html('<div><a href = "eshop-result.html"> К списку товаров</a></div>');
    } else {basketOfGoods = JSON.parse(localStorage.getItem('cart'));
    fillFirst();
    fillAllOrder();
};

}

function fillFirst(){
    var $addClassGoods = $('<div></div>', {class: 'goods'}).appendTo('.content');
    var res = ""; 
    res += '<div class="image"><p>Товары</p></div>';
    res += '<div class="description"><p></p></div>';
    res += '<div class="costs"><p>Цена / Вес</p></div>';
    res += '<div class="num"><p>Кол-во</p></div>';
    res += '<div class="all"><p>Цена / Вес</p></div>';
    ($addClassGoods).html(res);
}


function fillAllOrder(){
    var sum = 0; //общая сумма товаров
    var sumWeight = 0; // общий вес товаров
    for (key in basketOfGoods){
        var res = "";
var arrResult = goods.filter(function(el){return el.id == key});
var imagePathGood = '"img/' + arrResult[0].id + '.jpg"';
var descriptionGood = arrResult[0].description;
var weightGood = arrResult[0].weight;

        var $addClassGoods = $('<div></div>', {class: 'goods'}).appendTo('.content'); 
        res += '<div class="image"><img class="image" src= ' + imagePathGood + '></img></div>';
        res += '<div class="description">\
        <p>' + descriptionGood + '</p>\
        <p>Купите еще 1 и сэкономьте еще 5%</p><a class="removeAllGoods" data_good = ' + key + '>Удалить</a></div>';
        res += '<div class="costs"><p>' + basketOfGoods[key]["cost"] + 'руб. /'+ weightGood +'гр</p></div>';
        res += '<div class="num"><p>' + basketOfGoods[key]["number"] + '</p><a class="addGood" data_good = ' + key + ' >+</a><a class="removeGood" data_good = ' + key + ' >-</a></div>';
        res += '<div class="all"><p>' + basketOfGoods[key]["cost"]*basketOfGoods[key]["number"] + 'руб\
        . / '+ weightGood * basketOfGoods[key]["number"] +' гр.</p></div>';
        ($addClassGoods).html(res);
        sum += basketOfGoods[key]["cost"]*basketOfGoods[key]["number"]; //общая сумма товаров
        sumWeight += weightGood * basketOfGoods[key]["number"]; // общий вес товаров
    }
    $('.content').append('<div class = "clearfix"><div class ="back"><a href = \
    "eshop-result.html">К списку товаров</a></div><div class ="finish">\
    <p>Итого: ' + sum + 'руб. /' + sumWeight + ' гр.</p></div></div>');
}