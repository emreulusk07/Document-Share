import { Pipe, PipeTransform } from '@angular/core';
import { FileClass } from '../models/fileClass';

@Pipe({
  name: 'fileSearch'
})
export class FileSearchPipe implements PipeTransform {

  transform(value: FileClass[], searchText: string): FileClass[] {
    if(!searchText) {
      return value;
    } else {
      // içinde bulamazsa -1 döner. bulursa da index numarası döner.
      return value.filter(f => f['name'].toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase())!==-1)
    }
  }

}
