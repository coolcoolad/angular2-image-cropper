import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ImageCropperComponent } from './image-cropper.component';

@NgModule({
  declarations: [
    ImageCropperComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ImageCropperComponent,
  ],
})

export class ImageCropperModule { }
