//заводим глобальную переменную currentGoods
var currentGoods = goods;
//Заводим глобальную переменную basketOfGoods
var basketOfGoods = {};
//Проверяем пустая ли корзина и если нет то рисуем ее
if (localStorage.cart === undefined || localStorage.cart === "{}") {}
else {basketOfGoods = JSON.parse(localStorage.getItem('cart'));
HowMuchInBasketOfGoods();
}
    
//Выполнить перед загрузкой страницы
$(document).ready(function (param) {  
//очищаем все товары у элемента  catalog через функцию
clearInnerElementInClass('catalog');
//очищаем все товары у элемента  filter__categories через функцию
clearInnerElementInClass('filter__categories');
//очищаем все товары у элемента  filter__brands через функцию
clearInnerElementInClass('filter__brands');
//очищаем все товары у элемента  filter__costs через функцию
clearInnerElementInClass('filter__costs');
//добавляем все товары
addAllGoods(goods);

//добавляем все категории
var CategoryAndGoods = HowManyGoodsIn(goods, 'category');
addListParameters(CategoryAndGoods, 'filter__categories', 'category');
//добавим сброс фильтров на все товары
$('.filter__categories').append('<li><a href = "eshop-result.html">Все товары\
</a><span class="badge">' + goods.length + '</span></li>');


//добавляем все бренды
var BrandAndGoods = HowManyGoodsIn(goods, 'brand');
addListParameters(BrandAndGoods, 'filter__brands', 'brand');

//добавляем пару строчек с товарами
var MoreCostGoods = getGoodsOfCost(goods, 600);
var LessCostGoods = getGoodsOfCost(goods, 600, 1);
addListCosts(MoreCostGoods, 'filter__costs', 'price', 'менее 600 руб.');
addListCosts(LessCostGoods, 'filter__costs', 'price', 'более 600 руб.');
//добавляем событие вывода товаров от цены
$('.filter__costs').click(function(event){
    var target = event.target;
    console.log(target);
    if (target.getAttribute('data-price') != null) clearInnerElementInClass('catalog');
    switch (target.getAttribute('data-price')){
    case 'менее 600 руб.':
    addAllGoods(LessCostGoods);
    currentGoods = LessCostGoods;
    break
    case 'более 600 руб.':
    addAllGoods(MoreCostGoods);
    currentGoods = MoreCostGoods;
    break
    }
    $('.catalog__item-preview').on('click', clickOneGood); //добавляем вновь событие клика по товару
})

//добавляем событие клика по категории
fillGoodsfromParam(goods, '.filter__categories', 'data-category', 'category');
//добавляем событие клика по бренду
fillGoodsfromParam(goods, '.filter__brands', 'data-brand', 'brand');
//добавляем событие клика по товару
$('.catalog__item-preview').on('click', clickOneGood);

//заполним поиск товарами
search();
    
});
//////////////////////////////////////////////////////////////////

//заполняем немного кривой поиск 
function search(){
    var addName = "";
goods.forEach(function(el){
    addName += '<option>' + el.name + '</option>';
});
$('#search').html(addName);
$( ".search__input" ).keydown(function(e) {
    //if(e.keyCode === 13){
        console.log($(this).val());
    //}
    var thisValue = ( $(this).val());

    console.log(thisValue);
searchGoods = goods.filter(function(el){
return (el["name"].indexOf(thisValue) != -1); // тут можно еще добавить или логическое и загнать больше
});

if (searchGoods.length > 0){
    clearInnerElementInClass('catalog');
    addAllGoods(searchGoods);
    currentGoods = searchGoods;
    $('.catalog__item-preview').on('click', clickOneGood);

}


});

}


//Заполним поиск массивом элементов
function addElemInSearch() {
}
//функция клика по одному товару
function clickOneGood(){
    var key = $(this).attr('data_id');
    var arrResult = goods.filter(function(el){return el.id == key});
    console.log(arrResult);
    var name_ = arrResult[0].name;
    var description_ = arrResult[0].description;
    var weight_ = arrResult[0].weight;
    var cost_ = arrResult[0].cost;
    clearInnerElementInClass('catalog');
    $('<div></div>', {class: 'catalog__item'}).appendTo($('.catalog'));
    var res = "";
    res += '<span class="catalog__item-name">'+ name_ +'</span>'
    res += '<img class="catalog__item-preview" src="img/' + key + '.jpg" data_id='+ key +'></img>'
    res += '<span class="catalog__item-description">'+ description_ +'</span>'
    res += '<span class="catalog__item-weight">' + weight_ + ' гр.</span>'
    res += '<span class="catalog__item-cost">' + cost_ + ' руб.</span>'
    res += '<button class="button-good" data__goods=' + key + '>Купить</button>'
    $('.catalog__item').html(res);
    $('.catalog__item-preview').on('click', clickOneGood); //добавляем вновь событие клика по товару
    $('.button-good').on('click', buttonBuy); //добавляем событие клика по кнопке купить

};




//функция добавления списков категорий/брендов и т д и количества товаров в них
function addListParameters(goodsAndParameter, inClass, txt){
for (key in goodsAndParameter){
    var $li = $('<li></li>');
    $li.appendTo(jQuery('.' + inClass)[0]);
    var $a = $('<a></a>', {href: '#', text: key});
    $a.attr('data-' + txt, key);
    $a.appendTo($li);
    var $span = $('<span></span>', {class: 'badge', text: goodsAndParameter[key]});
    $span.appendTo($a);
}
}

//функция добавления по стоимости
function addListCosts(goodsAndParameter, inClass, txt, cost){
    
        var $li = $('<li></li>');
        $li.appendTo(jQuery('.' + inClass)[0]);
        var $a = $('<a></a>', {href: '#', text: cost});
        $a.attr('data-' + txt, cost);
        $a.appendTo($li);
        var $span = $('<span></span>', {class: 'badge', text: goodsAndParameter.length});
        $span.appendTo($a);
        
    }

//фильтр товаров в зависимости от цены
function getGoodsOfCost(goods_, limit, param){
    var arr = goods_.filter(function(el){
    if (param === undefined ){return el.cost > limit}
        else {return el.cost < limit}
    });
    return arr;
}

//СОРТИРОВКА ТОВАРОВ
//добавляем событие сортировки товаров вверх по цене
jQuery('.sorting').on('click', '#cost_up' ,function(){
    clearInnerElementInClass('catalog'); //чистим товары
    sortGoods(currentGoods,'cost'); //  сортируем по цене вверх
    addAllGoods(currentGoods); // добавляем отсортированные товары
    $('.catalog__item-preview').on('click', clickOneGood); //добавляем вновь событие клика по товару
});

//добавляем событие сортировки товаров вниз по цене
jQuery('.sorting').on('click', '#cost_down' ,function(){
    clearInnerElementInClass('catalog'); //чистим товары
    sortGoods(currentGoods, 'cost', 1 ); //  сортируем по цене вниз
    addAllGoods(currentGoods); // добавляем отсортированные товары
    $('.catalog__item-preview').on('click', clickOneGood); //добавляем вновь событие клика по товару
});

//добавляем событие сортировки товаров вверх по весу
jQuery('.sorting').on('click', '#weight_up' ,function(){
    clearInnerElementInClass('catalog'); //чистим товары
    sortGoods(currentGoods,'weight'); //  сортируем по весу вверх
    addAllGoods(currentGoods); // добавляем отсортированные товары
    $('.catalog__item-preview').on('click', clickOneGood); //добавляем вновь событие клика по товару
});
//добавляем событие сортировки товаров вниз по весу
jQuery('.sorting').on('click', '#weight_down' ,function(){
    clearInnerElementInClass('catalog'); //чистим товары
    sortGoods(currentGoods,'weight', 1); //  сортируем по весу вниз
    addAllGoods(currentGoods); // добавляем отсортированные товары
    $('.catalog__item-preview').on('click', clickOneGood); //добавляем вновь событие клика по товару
});
//добавляем событие сортировки товаров вверх по популярности
jQuery('.sorting').on('click', '#popularity_up' ,function(){
    clearInnerElementInClass('catalog'); //чистим товары
    sortGoods(currentGoods,'popularity'); //  сортируем по популярности вверх
    addAllGoods(currentGoods); // добавляем отсортированные товары
    $('.catalog__item-preview').on('click', clickOneGood); //добавляем вновь событие клика по товару
});
//добавляем событие сортировки товаров вниз по популярности
jQuery('.sorting').on('click', '#popularity_down' ,function(){
    clearInnerElementInClass('catalog'); //чистим товары
    sortGoods(currentGoods,'popularity', 1); //  сортируем по популярности вниз
    addAllGoods(currentGoods); // добавляем отсортированные товары
    $('.catalog__item-preview').on('click', clickOneGood); //добавляем вновь событие клика по товару
});

//добавляем событие сортировки товаров по всему)))
function fillGoodsfromParam(goods_, className, attrib, param){
    //вешаем функцию событий на 
$(className).click(function (event) { 
    
    var target = event.target.getAttribute(attrib);
    var newGoods = goods_.filter(function(el){
    return el[param]==target;
    });
    console.log(target);
    if (target != null) clearInnerElementInClass('catalog');
    addAllGoods(newGoods);
    currentGoods = newGoods;
    $('.catalog__item-preview').on('click', clickOneGood); //добавляем вновь событие клика по товару
});
}

//добавляем все товары 
function addAllGoods(goods_){
    goods_.forEach(function(el){
    var $catalogItem = $('<div></div>', {class: 'catalog__item' }).appendTo(jQuery('.catalog')[0]);
    var $goodsName = $('<span></span>', {text: el.name, class: 'catalog__item-name'}).appendTo($catalogItem);
    var $goodsWeight = $('<span></span>', {text: el.weight +' гр.', class: 'catalog__item-weight'}).appendTo($catalogItem);
    var $img = $('<img></img>', {class: 'catalog__item-preview', src: 'img/' + el.id + '.jpg', 'data_id':el.id}).appendTo($catalogItem);
    var $goodsCost = $('<span></span>', {text: el.cost + ' руб.', class: 'catalog__item-cost'}).appendTo($catalogItem);
    var star = "";
    for(var i=0; i < el.popularity; i++){
    star = star + "★";
    }
    var $popularity = $('<span></span>', {text: star, class: 'catalog__item-popularity'}).appendTo($catalogItem);
    var $button = $('<button class="button-good" ' +'data__goods=' + el.id + '>Купить</button>').appendTo($catalogItem);
 })
 //обрабатываем нажатие на кнопку по классу ей присвоенному
$('.button-good').on('click', buttonBuy);
 ;}

//Функция нажатия по кнопке купить
function buttonBuy(){
    var id = ($(this).attr('data__goods'));
    if (basketOfGoods[id] === undefined){
    basketOfGoods[id]={
        cost: goods.filter(function(el){return el['id'] == id })[0]['cost'],
        number: 1 //получаем цену из массива goods для элемента по id
    };
    } else basketOfGoods[id]['number']++;
    localStorage.setItem('cart', JSON.stringify(basketOfGoods));

    //посчитаем количество товаров добавленых в корзину
    HowMuchInBasketOfGoods();
};

 //рисуем корзину
 function HowMuchInBasketOfGoods(){
    var num = 0;
	var sumCost = 0;
for (key in basketOfGoods){
    num += basketOfGoods[key]['number'];
	sumCost = basketOfGoods[key]['cost']*basketOfGoods[key]['number'] + sumCost;
   }
$('#basketOfGoods').html('<span>Корзина</span>'+ '(' + num + ')'+'(' + sumCost + ' руб.)');
}



 //считаем сколько товаров в зависимости от категории, бренда или чего-то еще
function HowManyGoodsIn(goods_, param){
    var obj = {};
goods_.forEach(function(el){
if ((obj[el[param]]) === undefined) {obj[el[param]] = 1}
else obj[el[param]]++;
})
return obj;
}

//функция очистки любого элемента по его классу
function clearInnerElementInClass(className){
jQuery('.' + className).empty();
}

//функция сортировки товаров по параметрам c изменением по возрастанию и убыванию
function sortGoods(goods_, param, up){
    goods_.sort(function(a,b){
        if (up === undefined){ // up - необязательный параметр, выполняющий роль переключателя
            return b[param] - a[param] }
        else { return a[param] - b[param] }
    });
};

