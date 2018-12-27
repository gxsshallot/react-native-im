export default function (data) {
    if (data) {
        return JSON.parse(JSON.stringify(data));
    } else {
        return null;
    }
}