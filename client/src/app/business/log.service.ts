import { Injectable } from '@angular/core';

@Injectable()
export class LogService {

  constructor() { }

  public error(message: string) {
    console.error(message);
  }

  public log(message: string) {
    console.log(message);
  }
}
