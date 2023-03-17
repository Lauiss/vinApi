export class Util {
    dateToString(date: Date): String{
        console.log("on est dans la fonction là => ", date.toLocaleDateString('en-GB'))
        return date.toLocaleDateString('en-GB');
    }

    createDateString(year: number, month: number, day: number): String {
        return new Date(year, month, day).toLocaleDateString('en-GB');
    }

    stringToDate(s: String): Date {
        let sParse = s.split("/");
        return new Date(parseInt(sParse[0]), parseInt(sParse[1]), parseInt(sParse[2]));
    }
}