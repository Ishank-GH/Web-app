//helper function to format the date
const formatDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)

    //Extract year, month, day for comparison
    const isSameDay = (d1, d2) => 
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();

    //format time as hh:mm
    const timeString = date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
    })


    if(isSameDay(date, today)){
        return `Today, ${timeString}`;
    }else if(isSameDay(date, yesterday)){
        return `Yesterday, ${timeString}`;
    }else{
        //Format older dates
        const formattedDate = date.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        return `${formattedDate}, ${timeString}`;
    }
}

export default formatDate;