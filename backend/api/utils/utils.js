"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Util = void 0;
class Util {
    dateToString(date) {
        return date.toLocaleDateString('en-GB');
    }
    createDateString(year, month, day) {
        return new Date(year, month, day).toLocaleDateString('en-GB');
    }
    stringToDate(s) {
        let sParse = s.split("/");
        return new Date(parseInt(sParse[0]), parseInt(sParse[1]), parseInt(sParse[2]));
    }
}
exports.Util = Util;
