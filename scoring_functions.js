import ajax from './ajax.js';

const scoringDateInit = () => {
    $('.scoring-date').datepicker({
        format: 'MM yyyy',
        minViewMode: 'months',
        startView: 'month',
        maxViewMode: 'years',
        language: "ru",
        endDate: 'today',
        autoclose: true,
        disableTouchKeyboard: true,
        assumeNearbyYear: true,
        immediateUpdates: true
    });
};

const scoringDateChangeDate = () => {
    $('.scoring-date').datepicker().on('changeDate', (e) => {
        scoringChangeDate(e);
    });
};

const scoringDateArrows = () => {
    $('.scoring-header .input-group-addon').on('click', (e) => {
        let $this = e.currentTarget,
            getDate = $('.scoring-date').datepicker('getDate'),
            d,
            m,
            y = getDate.getFullYear();
        switch ($this.getAttribute('data-contain')) {
            case 'next': m = getDate.getMonth() + 1; break;
            case 'prev': m = getDate.getMonth() - 1; break;
        }
        d = new Date(y, m);
        switch (d > new Date()) {
            case false: 
                $('.scoring-date').datepicker('update', d);
                scoringClickDate(d);
            break;
            case true: 
                return false;
            break;
        }
    });
};

const scoringChangeDate = (e) => {
    let m = e.date.getMonth() + 1,
    y = e.date.getFullYear();
    ajax.scoringRequest(m, y);
};

const scoringClickDate = (e) => {
    let m = e.getMonth() + 1,
    y = e.getFullYear();
    ajax.scoringRequest(m, y);
};


export default {
    scoringDateInit,
    scoringDateChangeDate,
    scoringDateArrows
}