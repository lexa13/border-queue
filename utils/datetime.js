'use strict';

function hhmm2mm(hhmm) {
    const time = hhmm.trim().match(/^(\d{2})\:(\d{2})$/);
    if (null === time) {
        return false;
    }
    return +time[2] + +time[1] * 60;
}

module.exports = {
    hhmm2mm
}
