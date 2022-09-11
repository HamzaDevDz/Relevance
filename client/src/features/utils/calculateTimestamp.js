import humanizeDuration from 'humanize-duration';

const calculateTime = time => {
    const [dateComponent, timeComponent] = time.split("T");
    const [year, month, day] = dateComponent.split("-");
    const [hour, minute, second] = timeComponent.split(".")[0].split(":");
    const durationMilliseconds = new Date().getTime() - new Date(year, month - 1, day, hour, minute, second).getTime();
    return humanizeDuration(durationMilliseconds, {round: true});
}

export default calculateTime;