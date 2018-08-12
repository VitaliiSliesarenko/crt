import * as moment from "moment";

export class Logger {

    constructor(private loggerName = '') {

    }

    public static log(message: string): void {
        console.log(Logger.getCurrentDate() + ': ' + message);
    }

    public static error(error: string): void {
        console.error(Logger.getCurrentDate() + ': ' + error);
    }

    private static getCurrentDate(): string {
        return moment().format('YYYY-MM-DD HH:mm:ss');
    }

    public logNamed(message: string): void {
        Logger.log(`Trader [${this.loggerName}] ${message}`);
    }

    public errorNamed(message: string): void {
        Logger.log(`Trader [${this.loggerName}] ${message}`);
    }
}
