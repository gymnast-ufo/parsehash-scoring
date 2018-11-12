import ajax from './ajax.js';


const parsing = () => {
    let hashParams = {},
        e,
        a = /\+/g,  // Regex for replacing addition symbol with a space
        r = /([^&;=]+)=?([^&;]*)/g,
        d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
        q = window.location.hash.substring(1);
    while (e = r.exec(q)) {
        hashParams[d(e[1])] = d(e[2]);
    }
    return hashParams;
}

const parseHash = () => {
	//if has hash, parse him, else hide selects
    if (window.location.hash) {
        // разбить на хеш элементы и вставить в инпуты если изменён хеш
        getHashValue(parsing());
        //отправить ajax запрос при загрузке страницы
        ajax.armSelectDataAjax(parsing());
    } else {
        $('.single-filter').not(':first').hide();
        emptyHash();
    }
};

const emptyHash = () => {
    // отправить ajax запрос, если хеш пустой
    // первому селекту поставить значение All
    let firstFilter = $('.single-filter:first'),
    firstSelect = firstFilter.find('.single-filter__select'),
    firstSelectName = firstSelect.attr('name'),
    firstSelectValue = firstSelect.val(),
    firstSelectStyled = firstSelect.next('.single-filter__select-styled'),
    hash = {};
    firstSelectValue = 'All';
    firstSelectStyled.text('Все');
    hash[firstSelectName] = firstSelectValue;
    ajax.armSelectDataAjax(hash);
}

const getHashValue = (hashParams) => {
    // берём элементы хеша и отправляем в соответствующие селекты
	for (let param in hashParams) {
		let hashParam = param,
		hashValue = hashParams[param];
        $(document).ready(function() {
            hashInToSelect(hashParam, hashValue);
        });
	}
};

const hashInToSelect = (hashParam, hashValue) => {
    // вставить хеш в селекты
    $('.single-filter__select').each(function() {
        let $this = $(this),
        $styledSelect = $this.next('.single-filter__select-styled'),
        itemParent = $($this).parents('.single-filter'),
        thisIndex = $(itemParent).index();
        if ($this.attr('name') === hashParam && !$this.hasClass('insert-value')) {
            // если нужного хеша нет, то вписать "все"
            $this.addClass('insert-value');
            itemParent.show();
            $this.val(hashValue);
            $styledSelect.text(hashValue);
            switch(hashValue) {
                case 'All': $styledSelect.text('Все'); break;
                case 'null': $styledSelect.text('Все'); break;
                default: $styledSelect.text(hashValue); break;
            }
        }
        if (!$this.hasClass('insert-value')) {
            $this.parents('.single-filter').hide();
            $('.insert-value').parents('.single-filter').next().show();
            $this.val('All');
            $this.next('.single-filter__select-styled').text('Все');
        }
    });
    //скрывать другие селекты
};

const history = () => {
    // отслеживание браузерных кнопок вперёд/назад
    window.addEventListener('hashchange', function(e) {
        $('.single-filter__select').removeClass('insert-value');
        if (window.location.hash) {
            getHashValue(parsing());
            ajax.armSelectDataAjax(parsing());
        } else {
            emptyHash();
        }
    });
};

const selectWidth = () => {
    $('.single-filter__select').each(function() {
        let $this = $(this),
        Arr = new Array();
        $($this).find('option').each(function() {
            Arr.push($(this));
        });
        let longest = Arr.reduce((prev, current) => {
            return (current.first().val().length >= prev.first().val().length) ? current : prev;
        }),
        width = Math.ceil(longest.val().length * 8.5 + 40);
        $this.css('width', width);
    });
};

    // не действующая, нигде не используется
// const selectData = ($this, thisIndex) => {
// 	// создание объекта данных для ajax запроса
//     let tableFiltersData = {};
//     if ($this.is(':visible')) {
//         tableFiltersData[$this.attr('name')] = $this.val();
//     }
//     console.log(tableFiltersData);
// };

const itemsHashCreate = ($this) => {
	// создание хеша и что-то сделать с недействующими селектами
	let thisIndex = $($this).parents('.single-filter').index();
	let itemsHash = '';
	itemsHash = rewriteHash(thisIndex, itemsHash);
	// вставить хеш в строку и удалить последний амперсанд в строчке
	window.location.hash = itemsHash.substring(0, itemsHash.length - 1);
};

const rewriteHash = (thisIndex, itemsHash) => {
    // написать/переписать хеш, скрыть лишние селекты
    for(let item of $('.single-filter__select')) {
        let itemParent = $(item).parents('.single-filter');
        switch(itemParent.index() <= thisIndex) {
            case true:
                itemsHash = writeHashString(item, itemsHash);
            break;
            case false: 
                hideExtraSelects(item, thisIndex, itemParent); 
            break;
        }
    };
    return itemsHash;
};

const writeHashString = (item, itemsHash) => {
    // взять данные с селектов и создать поисковый запрос
	itemsHash += $(item).attr('name') + '=' + $(item).val() + '&';
	return itemsHash;
};

const hideExtraSelects = (item, thisIndex, itemParent) => {
    // скрытие следующих селектов
	switch (itemParent.index() > thisIndex + 1) {
		case true: 
            $(itemParent).hide();
		break;
		case false: 
            ($(itemParent).is(':hidden')) ? 
                $(itemParent).show() : 
                false;
			$(item).val('All');
			$(item).next('.single-filter__select-styled').text('Все');
		break;
	}
};

const armSelect = () =>  {
	$('.single-filter__select').each(function(){
    // custom filters
    let $this = $(this),
    numberOfOptions = $(this).children('option').length;
    $this.addClass('select-hidden');
    $this.wrap($('<div />', {
    	class: 'single-filter__select-wrap'
    }));
    $this.after($('<div />', {
    	class: 'single-filter__select-styled'
    }));
    // создать псевдо-инпут
    let $styledSelect = $this.next('.single-filter__select-styled');
    $styledSelect.text($this.children('option').eq(0).text());
    // создать ul
    let $list = $('<ul />', {
    	class: 'single-filter__select-options'
    }).insertAfter($styledSelect);
    // создать li
    for (let i = 0; i < numberOfOptions; i++) {
    	$('<li />', {
    		class: 'single-filter__select-options__item',
    		text: $this.children('option').eq(i).text(),
    		rel: $this.children('option').eq(i).val()
    	}).appendTo($list);
    }
    let $listItems = $list.children('li');

    $styledSelect.click(function(e) {
    	e.stopPropagation();
    	$('.single-filter__select-styled.active').not(this).each(function(){
    		$(this).removeClass('active').next('.single-filter__select-options').hide();
    	});
    	$(this).toggleClass('active').next('.single-filter__select-options').toggle();
    });

    $listItems.click(function(e) {
    	e.stopPropagation();
    	$styledSelect.text($(this).text()).removeClass('active');
    	$this.val($(this).attr('rel'));
    	$list.hide();
    	itemsHashCreate($this);
    });

    $(document).click(function() {
    	$styledSelect.removeClass('active');
    	$list.hide();
    });

  });
};

const sort = () => {
  //table sort
  $('.sortable').DataTable({
  	paging:   false,
  	info: false,
  	searching: false,
  	"columnDefs": [
  		{ "orderable": false, "targets": 0 }
  	],
  	"order": [ 1, 'desc' ],
    dom: 'B<"clear">lfrtip',
    buttons: [
        'excel'
    ]
  });
}

const preloader = (word) => {
    // прелоадер
    // при вызове функции надо передавать 'start' для запуска и 'stop' для остановки
    // например: functions.preloader('start')
    let preloader = $('.preloader');
    switch (word) {
        case 'start':
            preloader.fadeIn(300);
            $('html, body').css({ 'overflow': 'hidden' });
        break;
        case 'stop':
            preloader.delay(1500).fadeOut(300);
            setTimeout(function () {
                $('html, body').css({ 'overflow': 'auto' });
            }, 1800);
        break;
    }
};

export default {
	armSelect,
	sort,
	parseHash,
    history,
    selectWidth,
    history,
    preloader
}