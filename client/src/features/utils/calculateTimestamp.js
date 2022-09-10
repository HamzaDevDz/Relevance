const calculateTime = time => {
    const [dateComponent, timeComponent] = time.split("T");
    const [year, month, day] = dateComponent.split("-");
    const [hour, minute, second] = timeComponent.split(".")[0].split(":");
    let myDate = (new Date().getTime() - new Date(year, month - 1, day, hour, minute, second).getTime()) / 1000;
    if(myDate <= 60) {
        return  `${Math.round(myDate)} ${Math.round(myDate) <= 1 ? 'second' : 'seconds'}`;
    }
    if(myDate < 60 * 60){
        myDate = myDate / 60;
        return `${Math.round(myDate)} ${Math.round(myDate) <= 1 ? 'minute' : 'minutes'}`;
    }
    if(myDate < 60 * 60 * 24){
        myDate = myDate / (60 * 60);
        return `${Math.round(myDate)} ${Math.round(myDate) <= 1 ? 'hour' : 'hours'}`;
    }
    if(myDate < 60 * 60 * 24 * 30){
        myDate = myDate / (60 * 60 * 24);
        return `${Math.round(myDate)} ${Math.round(myDate) <= 1 ? 'day' : 'days'}`;
    }
    if(myDate < 60 * 60 * 24 * 30 * 12){
        myDate = myDate / (60 * 60 * 24 * 30);
        return `${Math.round(myDate)} ${Math.round(myDate) <= 1 ? 'month' : 'months'}`;
    }
    myDate = myDate / (60 * 60 * 24 * 30 * 12);
    return `${Math.round(myDate)} ${Math.round(myDate) <= 1 ? 'year' : 'years'}`;
}

export default calculateTime;