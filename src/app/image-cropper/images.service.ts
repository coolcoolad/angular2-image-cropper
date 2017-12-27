import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

@Injectable()
export class ImagesService {

  dataURLtoBlob(dataUrl: string) {
    let arr = dataUrl.split(','), mime = arr[0].match(/:(.*?);/)[1];
    let bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  dataUrlToFile(dataUrl: string) {
    if (!dataUrl || dataUrl.length === 0) {
      return null;
    }

    let blob = this.dataURLtoBlob(dataUrl);
    let fileName = blob.type.replace('/', '.').replace('jpeg', 'jpg');
    let b: any = blob;
    b.lastModifiedDate = new Date();
    b.name = fileName;
    let file = <File>b;
    return file;
  }

  resize(image: File, width: number, height: number): Observable<File> {
    if (!image || width <= 0 || height <= 0) {
      return Observable.of(null);
    }

    let imageEvent = this.fileToImage(image);
    let fileEvent = imageEvent.map(img => {
      let c = document.createElement('canvas');
      c.width = width;
      c.height = height;
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      let dataUrl = c.toDataURL();
      return this.dataUrlToFile(dataUrl);
    });
    return fileEvent;
  }

  fileToImage(file: File): Observable<HTMLImageElement> {
    if (!file) {
      return Observable.of(null);
    }

    let ob = new Observable<HTMLImageElement>(observer => {
      let reader = new FileReader();
      reader.onloadend = function (loadResult: any) {
        let img = new Image();
        img.onload = function () {
          observer.next(img);
          observer.complete();
        };
        img.src = loadResult.target.result;
      };
      reader.readAsDataURL(file);
    });
    return ob;
  }
}
