import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { ImagesService } from './images.service';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.css']
})

export class ImageCropperComponent implements AfterViewInit {
  @Input() width = 500;
  @Input() height = 500;
  @Input() minScale = 0.4;
  @Input() maxScale = 4;
  @Input() wheelSpeed = 1 / 1200.0;
  @Input() croppedWidth = 200;
  @Input() croppedHeight = 200;
  @Input() supportedImageTypes = ['jpg', 'png', 'jpeg'];
  @Input() imageFileEvent = new EventEmitter<File>();
  @Input() confirmCropEvent = new EventEmitter<any>();
  @Output() cropFinished = new EventEmitter<File>();
  @ViewChild('cropperCanvas') cropperCanvas: ElementRef;

  private srcImage = new Image();
  canvasContext: CanvasRenderingContext2D;
  posX = 0;
  posY = 0;
  scale = 1;
  mouseDownFlag = false;
  dstDataUrl = '';

  constructor(private imagesService: ImagesService) { }

  ngAfterViewInit() {
    this.canvasContext = <CanvasRenderingContext2D>this.cropperCanvas.nativeElement.getContext('2d');

    this.imageFileEvent.subscribe(file => {
      if (this.isValidImageFile(file)) {
        this.imagesService.fileToImage(file).subscribe(img => {
          if (img) {
            this.srcImage = img;
            this.posX = 0;
            this.posY = 0;
            this.scale = 1;
            this.updateCanvas(0, 0, 0);
          }
        });
      }
    });

    this.confirmCropEvent.subscribe(x => {
      this.confirmCrop();
    });
  }

  confirmCrop() {
    let canvas = <HTMLCanvasElement>this.cropperCanvas.nativeElement;
    this.dstDataUrl = canvas.toDataURL();
    let that = this;
    let file = this.imagesService.dataUrlToFile(this.dstDataUrl);
    that.imagesService.resize(file, that.croppedWidth, that.croppedHeight).subscribe(fileResized => {
      that.cropFinished.emit(fileResized);
    });
  }

  mouseMove(event: MouseEvent) {
    if (this.mouseDownFlag) {
      this.updateCanvas(event.movementX, event.movementY, 0);
    }
  }

  mouseWheel(event: WheelEvent) {
    if (!this.mouseDownFlag) {
      this.updateCanvas(0, 0, event.wheelDelta);
    }
  }

  @HostListener('window:resize')
  resize() {
    if (!this.mouseDownFlag) {
      this.updateCanvas(0, 0, 0);
    }
  }

  updatePostionAndScale(deltaX: number, deltaY: number, deltaWheel: number) {
    let deltaW = deltaWheel * this.wheelSpeed;
    if (this.scale + deltaW >= this.minScale && this.scale + deltaW <= this.maxScale) {
      this.scale += deltaW;
    }
    this.posX += deltaX / this.scale;
    this.posY += deltaY / this.scale;
  }

  updateCanvas(deltaX: number, deltaY: number, deltaWheel: number) {
    this.updatePostionAndScale(deltaX, deltaY, deltaWheel);

    let cxt = this.canvasContext;
    let canvas = <HTMLCanvasElement>this.cropperCanvas.nativeElement;
    let img = this.srcImage;

    cxt.save();
    cxt.clearRect(0, 0, canvas.width, canvas.height);
    cxt.translate(canvas.width / 2, canvas.height / 2);
    cxt.scale(this.scale, this.scale);
    cxt.translate(-img.width / 2, -img.height / 2);
    cxt.translate(this.posX, this.posY);
    cxt.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
    cxt.restore();
  }

  isValidImageFile(file: File) {
    if (!file || !file.type || !file.name) {
      return false;
    }

    if (file.type.indexOf('image/') === -1) {
      return false;
    }

    let fileName = file.name.toLowerCase();
    let filtered = this.supportedImageTypes.filter(x => fileName.endsWith('.' + x));
    if (filtered.length === 0) {
      return false;
    }

    return true;
  }

}
