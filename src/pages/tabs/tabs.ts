import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';

import { Tab1Root } from '../pages';
import { Tab2Root } from '../pages';

@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root =  Tab1Root;
  tab2Root = Tab2Root;

  categoria: any;

  constructor(public params: NavParams) {
  
  }
}
