import { Pipe, PipeTransform } from '@angular/core';
import { RegisterUser } from '../models/registerUser';

@Pipe({
  name: 'userSearch'
})
export class UserSearchPipe implements PipeTransform {

  // value -> gelen data türüdür. args -> gönderilecek olan parametre türüdür.
  transform(value: RegisterUser[], searchText: string): RegisterUser[] {
    if(!searchText) {
      return value;
    } else {
      // içinde bulamazsa -1 döner. bulursa da index numarası döner.
      return value.filter(u => u.userName.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase())!==-1)
    }
  }

}
