import Moment from "moment/moment";
import { extendMoment } from "moment-range";


export function isUserOnline(last_lognedin) {
    let isOnline = false;
    if(last_lognedin && last_lognedin != null && last_lognedin != "")

    {
        var current_date = new Date().toISOString();
        const moment = extendMoment(Moment);

        const diff_dates = moment.range(last_lognedin, current_date);
        if(diff_dates.diff('minutes') <= 5)
        {
            isOnline = true
        } 
    }

    return isOnline
}