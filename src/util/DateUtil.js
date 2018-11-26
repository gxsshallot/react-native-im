import DateFormat from 'dateformat';

const week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
const todayStr = '今天';
const yesterdayStr = '昨天';
const beforeYesterdayStr = '前天';

export function dateFormat(times, dateType, format = undefined) {
    if (typeof times === 'undefined') {
        return undefined;
    }
    const selectDate = new Date(Number(times));
    let dateString = "";
    let dateformat = format;
    if (typeof dateformat === 'undefined' || dateformat.length === 0) {
        dateformat = dateType === 'Date' ? 'yyyy年m月d日' : 'yyyy年m月d日 HH:MM';
    }
    if (dateType === 'Date') {
        dateString = DateFormat(selectDate, dateformat);
    } else {
        dateString = DateFormat(selectDate, dateformat);
    }
    return dateString;
}

/**
 * 根据通用业务规则，获取指定历史时间的显示方式
 * @param timestamp 展示时间
 * @param pattern 默认格式
 */
export function showDateTime(timestamp, pattern = "yy/mm/dd HH:MM") {
    if (typeof timestamp !== 'number') {
        return '';
    }
    const now = new Date();
    const that = new Date(timestamp);
    const between = now.getTime() - timestamp;
    const sameYearPattern = pattern.slice(pattern.indexOf('m'));
    if (between < 0) {
        return DateFormat(that, pattern);
    } else if (between < 60 * 1000) {
        return '刚刚';
    } else if (between < 60 * 60 * 1000) {
        return Math.ceil(between / 1000 / 60) + '分钟前';
    } else if (sameDay(now, that)) {
        return DateFormat(that, "HH:MM");
    } else if (yesterday(now, that)) {
        return yesterdayStr + " " + DateFormat(that, "HH:MM");
    } else if (beforeYesterday(now, that)) {
        return beforeYesterdayStr + " " + DateFormat(that, "HH:MM");
    } else if (sameWeek(now, that)) {
        return week[that.getDay()] + " " + DateFormat(that, "HH:MM");
    } else if (sameYear(now, that)) {
        return DateFormat(that, sameYearPattern);
    } else {
        return DateFormat(that, pattern);
    }
}

/**
 * 根据通用业务规则，获取指定历史时间的显示方式
 * @param timestamp 展示时间
 * @param useWeek 7天内是否展示星期
 * @param pattern 默认格式
 * @param useToday 如果true，当天展示"今天"，如果false，则展示HH-MM
 */
export function showDate(timestamp, params = {}) {
    if (typeof timestamp !== 'number') {
        return '';
    }
    const {useWeek = true, pattern = "m-d", useToday} = params;
    const now = new Date();
    const that = new Date(timestamp);
    if (sameDay(now, that)) {
        return useToday ? todayStr : DateFormat(that, "HH:MM");
    } else if (yesterday(now, that)) {
        return yesterdayStr;
    } else if (beforeYesterday(now, that)) {
        return beforeYesterdayStr;
    } else if (useWeek && sameWeek(now, that)) {
        return week[that.getDay()];
    } else {
        return DateFormat(that, pattern);
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

function beforeYesterday(now, that) {
    return isInNDay(now, that, 2);
}

function sameWeek(now, that) {
    return isInNDay(now, that, 6);
}

function isInNDay(now, that, number) {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const before = new Date(today - 24 * 3600 * 1000 * number).getTime();
    return that.getTime() < today && before <= that.getTime();
}