export default function convertTimestamp(timeStamp: number) {
    return new Date(timeStamp).toLocaleTimeString([], {
        hour12: true,
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });

}