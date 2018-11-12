import functions from './functions.js';

const armSelectDataAjax = (tableFiltersData) => {
	$.ajax({
		method: 'POST',
		url: '',
		data: tableFiltersData,
		type: 'json',
		beforeSend: functions.preloader('start'),
        complete: functions.preloader('stop')
	});
};

const scoringRequest = (m, y) => {
    m = (String(m).length < 2) ? '0' + m : m;
    let scoringDate = m + '.' + y,
        date = {scoringDate};
    $.ajax({
        method: 'POST',
        url: '/api/scoring/getscoringtable',
        data: date,
        beforeSend: functions.preloader('start'),
        complete: functions.preloader('stop')
    });
};

export default {
	armSelectDataAjax,
	scoringRequest
}