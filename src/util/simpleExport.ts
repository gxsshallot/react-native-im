export default function <T> (data: T): T {
    if (data) {
        return JSON.parse(JSON.stringify(data));
    } else {
        return data;
    }
}