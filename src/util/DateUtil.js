import DateFormat from 'dateformat';

const times = ['凌晨', '早上', '下午', '晚上'];
const yesterdayStr = '昨天';

export function showDate(timestamp, alwaysShowTime) {
    if (typeof timestamp !== 'number') {
        return '';
    }
    const now = new Date();
    const that = new Date(timestamp);
    const timeStr = times[Math.floor(that.getHours() / 6)] + DateFormat(that, 'h:MM');
    const timeOption = alwaysShowTime ? ' ' + timeStr : '';
    if (sameDay(now, that)) {
        return timeStr;
    } else if (yesterday(now, that)) {
        return yesterdayStr + timeOption;
    } else if (sameYear(now, that)) {
        return DateFormat(that, 'm月d日') + timeOption;
    } else {
        return DateFormat(that, 'yyyy年m月d日') + timeOption;
    }
}

function sameYear(now, that) {
    return now.getYear() === that.getYear();
}

function sameDay(now, that) {
    return now.getYear() === that.getYear() && now.getMonth() === that.getMonth() && now.getDate() === that.getDate();
}

function yesterday(now, that) {
    return isInNDay(now, that, 1);
}

function isInNDay(now, that, number) {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const before = new Date(today - 24 * 3600 * 1000 * number).getTime();
    return that.getTime() < today && before <= that.getTime();
}