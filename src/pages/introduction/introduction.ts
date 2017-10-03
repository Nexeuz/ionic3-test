import { Component } from '@angular/core';
import { IonicPage,MenuController, NavController, NavParams } from 'ionic-angular';


export interface Slide {
  img: string;
  title: string;
  description: string;
}
@IonicPage()
@Component({
  selector: 'page-introduction',
  templateUrl: 'introduction.html',
})
export class IntroductionPage {

  slides: Slide[];
  showSkip = true;  
  constructor(public navCtrl: NavController, public menu: MenuController, public navParams: NavParams) {
    this.slides = [
      {
        img: 'assets/img/ica-slidebox-img-1.png',
        title: 'Lee las últimas novedades de Google',
        description: 'Descubre lo último de Google en una sola aplicación.',
      },
      {
        img: 'assets/img/ica-slidebox-img-2.png',
        title: 'Marca las tarjetas para leerlas despues.',
        description: 'Marca las tarjetas que quieras para leerlas cuando quieras',
      },
    ];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IntroductionPage');
  }

  startApp() {
    this.navCtrl.setRoot('WelcomePage', {}, {
      animate: true,
      direction: 'forward'
    });
  }
  onSlideChangeStart(slider) {
    this.showSkip = !slider.isEnd();
  }

  // ionViewDidEnter() {
  //   // the root left menu should be disabled on the tutorial page
  //   this.menu.enable(false);
  // }

  // ionViewWillLeave() {
  //   // enable the root left menu when leaving the tutorial page
  //   this.menu.enable(true);
  // }

}
