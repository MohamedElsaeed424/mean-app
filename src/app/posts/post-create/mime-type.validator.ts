import {AbstractControl, FormControl} from "@angular/forms";
import {Observable} from "rxjs";

export const mimeType =
  (control: AbstractControl): Promise<{[key: string]: any}> | Observable<{[key: string]: any}> => {
  if(typeof(control.value) === 'string') {
    return new Observable(observer => {
      observer.next(null);
      observer.complete();
    });
  }
  const file = control.value as File;
  const fileReader = new FileReader();
  const frObs = Observable.create((observer) => {
    fileReader.addEventListener('loadend', () => {
      const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
      let header = '';
      let isValid = false;
      for (let i = 0; i < arr.length; i++) {
        header += arr[i].toString(16); // hexdecimal value
      }
      switch (header) {
        case '89504e47': isValid = true; break;
        case 'ffd8ffe0':
        case 'ffd8ffe1':
        case 'ffd8ffe2':
        case 'ffd8ffe3':
        case 'ffd8ffe8': isValid = true; break;
        default : isValid = false; break;
      }
      if (isValid) {
        observer.next(null);
      } else {
        observer.next({invalidMimeType: true});
      }
      observer.complete();
    });
    fileReader.readAsArrayBuffer(file);
  });
  return frObs;
}
