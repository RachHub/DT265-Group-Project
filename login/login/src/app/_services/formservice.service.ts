import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
  export class FormService {
    onFormSubmitted = new EventEmitter<any>();
  }
