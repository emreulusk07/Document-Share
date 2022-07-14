import { Pipe, PipeTransform } from '@angular/core';
import { Forum } from '../models/forum';
import { FileClass } from '../models/fileClass';

@Pipe({
  name: 'documentSearch'
})
export class DocumentSearchPipe implements PipeTransform {

  // value -> gelen data türüdür. args -> gönderilecek olan parametre türüdür.
  transform(value: Forum[], searchText: string): Forum[] {
    if(!searchText) {
      return value;
    } else {
      // içinde bulamazsa -1 döner. bulursa da index numarası döner.
      return value.filter(f => f['name'].toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase())!==-1)
    }
  }

}
