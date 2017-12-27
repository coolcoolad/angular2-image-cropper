import { Component, EventEmitter } from '@angular/core';
import { ImagesService } from './image-cropper/images.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  imageFileEvent = new EventEmitter<File>();
  confirmCropEvent = new EventEmitter<any>();
  croppedImage = '';

  constructor(private imagesService: ImagesService) {}

  uploadImage(files: FileList) {
    if (files && files.length > 0) {
      this.imageFileEvent.emit(files[0]);
    }
  }

  onCropFinished($event: File) {
    if ($event) {
      this.imagesService.fileToImage($event).subscribe((img: HTMLImageElement) => {
        this.croppedImage = img.src;
      });
    }
  }

  onClick() {
    this.confirmCropEvent.emit(true);
  }
}
