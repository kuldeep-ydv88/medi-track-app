import moment from "moment"

export const FormatDate=(timestamp)=>{
    return new Date(timestamp);
}

export const formatDateForText=(date)=>{
    return moment(date).format('ll')
}

export const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${minutes} ${period}`;
};


export const getDatesRanges=(startDate, endDate)=>{
    const start =  moment(new Date(startDate),'MM/DD/YYYY')
    const end =  moment(new Date(endDate),'MM/DD/YYYY')
    const dates=[];
    while(start.isSameOrBefore(end)){
        dates.push(start.format('MM/DD/YYYY'))
        start.add(1,'days')
    }
    return dates;
}


export const GetDateRangeToDisplay=()=>{
    const dateList=[];
    for(let i=0;i<=7;i++){
        dateList.push({
            date:moment().add(i,'days').format('DD'),
            day:moment().add(i,'days').format('dd'),
            formattedDate:moment().add(i,'days').format('L') 
        })
    }
    return dateList;
}


export const GetPrevDateRangeToDisplay = () => {
    const dates = [];
    for (let i = 1; i <= 7; i++) {
        const date = moment().subtract(i, 'days');
        dates.push({
            date: date.format('DD'),
            day: date.format('ddd'),
            formattedDate: date.format('MM/DD/YYYY')
        });
    }
    return dates;
};







