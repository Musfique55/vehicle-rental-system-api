const getDays = (start : string,end : string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const startMs = startDate.getTime();
    const endMs = endDate.getTime();

    const diff = endMs - startMs;
    const millisecondsInADay = 86400000;
    const days = Math.ceil(diff / millisecondsInADay);
    return days;
}

export default getDays;