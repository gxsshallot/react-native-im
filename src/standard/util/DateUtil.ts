import * as RNLocalize from 'react-native-localize';
import DateFormat from 'dateformat';
import i18n from 'i18n-js';

export function showDateTime(
    timestamp: number,
    showTime: boolean
) {
    if (isNaN(timestamp)) {
        return '';
    }
    const now = new Date();
    const that = new Date(timestamp);
    const locale = i18n.locale;
    const options: Intl.DateTimeFormatOptions = {
    };
    const isSameDay = sameDay(now, that);
    const isSameWeek = sameWeek(now, that);
    const timeStr = (isSameDay || showTime) ? that.toLocaleTimeString(locale, {
        hour: 'numeric',
        minute: 'numeric',
        hour12: RNLocalize.uses24HourClock(),
    }) : '';
    const dayStr = isSameDay ? '' : isSameWeek ? that.toLocaleDateString(locale, {
        weekday: 'long',
    }) : that.toLocaleDateString(locale, {
        year: 'numeric',
        month: showTime ? 'short' : 'numeric',
        day: 'numeric',
    });
    return [dayStr, timeStr].filter(i => i.length > 0).join(' ');
}

function sameWeek(now: Date, that: Date) {
    return isInNDay(now, that, 7);
}

function sameDay(now: Date, that: Date) {
    return now.getYear() === that.getYear() && now.getMonth() === that.getMonth() && now.getDate() === that.getDate();
}

function isInNDay(now: Date, that: Date, number: number) {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const before = new Date(today - 24 * 3600 * 1000 * number).getTime();
    return that.getTime() < today && before <= that.getTime();
}