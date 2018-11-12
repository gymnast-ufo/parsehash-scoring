import ARM from './functions.js';
import SCORING from './scoring_functions.js';

const arm = () => {
	ARM.parseHash();
	ARM.sort();
	ARM.armSelect();
	ARM.history();
	ARM.selectWidth();
};

const scoring = () => {
	SCORING.scoringDateInit();
    SCORING.scoringDateChangeDate();
    SCORING.scoringDateArrows();
};

const init = () => {
	{$('.director-table').length > 0 && arm()};
	scoring();
};

export default {
	init
}