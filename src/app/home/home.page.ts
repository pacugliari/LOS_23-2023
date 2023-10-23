import { Component } from '@angular/core';
import { firestore, storage } from 'src/main';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor() {
    console.log(firestore)
    console.log(storage)
  }

}
