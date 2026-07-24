import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  async fileToBytes(file: File): Promise<Uint8Array> {

    const buffer = await file.arrayBuffer();

    return new Uint8Array(buffer);
  }

}