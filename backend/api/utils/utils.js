//require = require('esm')(module);
export class Util {
    dateToString(date){
        console.log("on est dans la fonction là => ", date.toLocaleDateString('en-GB'))
        return date.toLocaleDateString('en-GB');
    }

    createDateString(year, month, day){
        return new Date(year, month, day).toLocaleDateString('en-GB');
    }

    stringToDate(s) {
        let sParse = s.split("/");
        return new Date(parseInt(sParse[0]), parseInt(sParse[1]), parseInt(sParse[2]));
    }
}