import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { ImageCropperComponent } from './image-cropper.component';
import { ImagesService } from './images.service';

describe('Component: image cropper component', () => {

  beforeEach(() => {

    const imagesServiceStub = {
      dataUrlToFile: (dataUrl: string) => {
        return null;
      },
      resize: (image: File, width: number, height: number) => {
        return Observable.of(null);
      },
      fileToImage: (file: File) => {
        return Observable.of(null);
      }
    };


    TestBed.configureTestingModule({
      declarations: [
        ImageCropperComponent
      ],
      imports: [
        FormsModule
      ],
      providers: [
        { provide: ImagesService, useValue: imagesServiceStub }
      ]
    });
  });

  it('confirmCrop() should emit a file event', done => {
    let fixture = TestBed.createComponent(ImageCropperComponent);
    let component: ImageCropperComponent = fixture.debugElement.componentInstance;

    component.ngAfterViewInit();
    component.cropFinished.subscribe(event => {
      expect(event).toBe(null);
      done();
    });
    component.confirmCrop();
  });

  it('mouseMove() should trigger updateCanvas() correctly', async(() => {
    let fixture = TestBed.createComponent(ImageCropperComponent);
    let component: ImageCropperComponent = fixture.debugElement.componentInstance;

    let mockEvent = new MouseEvent('');

    spyOn(component, 'updateCanvas');
    component.mouseDownFlag = true;
    component.mouseMove(mockEvent);
    expect(component['updateCanvas']).toHaveBeenCalled();
  }));

  it('mouseWheel() should trigger updateCanvas() correctly', async(() => {
    let fixture = TestBed.createComponent(ImageCropperComponent);
    let component: ImageCropperComponent = fixture.debugElement.componentInstance;

    let mockEvent = new WheelEvent('');

    spyOn(component, 'updateCanvas');
    component.mouseDownFlag = false;
    component.mouseWheel(mockEvent);
    expect(component['updateCanvas']).toHaveBeenCalled();
  }));

  it('mouseWheel() should trigger updateCanvas() correctly', async(() => {
    let fixture = TestBed.createComponent(ImageCropperComponent);
    let component: ImageCropperComponent = fixture.debugElement.componentInstance;

    spyOn(component, 'updateCanvas');
    component.mouseDownFlag = false;
    component.resize();
    expect(component['updateCanvas']).toHaveBeenCalled();
  }));

  it('updatePostionAndScale() should update the value correctly', async(() => {
    let fixture = TestBed.createComponent(ImageCropperComponent);
    let component: ImageCropperComponent = fixture.debugElement.componentInstance;

    component.minScale = 0.5;
    component.maxScale = 2;
    component.wheelSpeed = 1 / 1200.0;

    component.updatePostionAndScale(0, 0, 1200);
    expect(component.scale).toBe(2);

    component.updatePostionAndScale(0, 0, -1801);
    expect(component.scale).toBe(2);

    component.updatePostionAndScale(0, 0, 1);
    expect(component.scale).toBe(2);

    component.updatePostionAndScale(1, 1, 0);
    expect(component.posX).toBe(0.5);
    expect(component.posY).toBe(0.5);
  }));

  it('should return false when the file is not an image', async(() => {
    let fixture = TestBed.createComponent(ImageCropperComponent);
    let component: ImageCropperComponent = fixture.debugElement.componentInstance;

    let blob = new Blob([''], { type: 'text/html' });
    blob['lastModifiedDate'] = '';
    blob['name'] = 'filename.html';
    let fakeF = <File>blob;

    expect(component.isValidImageFile(null)).toBeFalsy();
    expect(component.isValidImageFile(fakeF)).toBeFalsy();
  }));

  it('should return false when the image file is not jpg or png format', async(() => {
    let fixture = TestBed.createComponent(ImageCropperComponent);
    let component: ImageCropperComponent = fixture.debugElement.componentInstance;

    let blob = new Blob([''], { type: 'image/gif' });
    blob['lastModifiedDate'] = '';
    blob['name'] = 'filename.gif';
    let fakeF = <File>blob;

    expect(component.isValidImageFile(fakeF)).toBeFalsy();
  }));

  it('should return true when the image file is jpg or png format', async(() => {
    let fixture = TestBed.createComponent(ImageCropperComponent);
    let component: ImageCropperComponent = fixture.debugElement.componentInstance;

    let blob = new Blob([''], { type: 'image/png' });
    blob['lastModifiedDate'] = '';
    blob['name'] = 'filename.png';
    let fakeF = <File>blob;
    expect(component.isValidImageFile(fakeF)).toBeTruthy();

    blob = new Blob([''], { type: 'image/jpg' });
    blob['lastModifiedDate'] = '';
    blob['name'] = 'filename.jpg';
    fakeF = <File>blob;
    expect(component.isValidImageFile(fakeF)).toBeTruthy();

    blob = new Blob([''], { type: 'image/jpeg' });
    blob['lastModifiedDate'] = '';
    blob['name'] = 'filename.jpeg';
    fakeF = <File>blob;

    expect(component.isValidImageFile(fakeF)).toBeTruthy();
  }));

});


