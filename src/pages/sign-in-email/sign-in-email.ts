import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseProvider } from '../../providers/firebase/firebasepro';
import { CommunProvider } from '../../providers/commun/commun';

import { MainPage } from '../pages'

@IonicPage()
@Component({
  selector: 'page-sign-in-email',
  templateUrl: 'sign-in-email.html',
})
export class SignInEmailPage {

  displayName;
  myForm: FormGroup;
  constructor(public app: App, public commun: CommunProvider, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public fire: FirebaseProvider, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams) {
    this.myForm = fb.group({
      'correo': [null, Validators.compose([Validators.required, Validators.minLength(6)])],
      'password': [null, Validators.compose([Validators.required, Validators.minLength(7)])],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignInPage');
  }


  SubmitForm() {
    // debugger

    const loader = this.loadingCtrl.create({
      content: 'Iniciando sesión...'
    });

    loader.present();



    const EMAIL = this.myForm.value.correo;
    const PASSWORD = this.myForm.value.password;

    this.fire.emailLogin(EMAIL, PASSWORD).then(data => {
      if (data.email) {
        const root = this.app.getRootNav();
        root.popToRoot();
        root.setRoot(MainPage).then(()=>{
          loader.dismiss();                      
        });
      } else {
        loader.dismiss();                      
        switch (data.code) {
          case 'auth/wrong-password': {
            this.commun.communAlert('Error al intentar iniciar sesión', 'La contraseña es incorrecta o el correo introducido no tiene contraseña.');
            break;
          }
          case 'auth/user-not-found': {
            this.commun.communAlert('Error al intentar iniciar sesión', 'El correo ingresado no existe o ha sido eliminado.');
            break;
          }
          default: {
            this.commun.communAlert('Error al iniciar sesión','Ha ocurrido un error al iniciar sesión intentalo nuevamente más tarde.');
          }
        }
      }
    })

  }

  resetPassword() {
    const alert = this.alertCtrl.create({
      title: 'Confirmar Acción',
      message: '¿Deseas que enviemos un correo electrónico a ' + this.myForm.value.correo + ' para restablecer tu contraseña?',
      buttons: [
        {
          text: 'Cancelar'
        },
        {
          text: 'Ok',
          role: 'ok',
          handler: () => {
            this.fire.resetPassword(this.myForm.value['correo']).then((data) => {
              if(!data){
                this.commun.communAlert('¡Formulario de recuperación de contraseña enviado!', 'Hemos enviado un correo electrónico a ' + this.myForm.value.correo + ' con un formulario para restablecer tu contraseña.');
              }else{
                switch (data.code) {
                  case 'auth/user-not-found': {
                    this.commun.communAlert('Error al enviar el correo de recuperación', 'El correo electrónico ingresado no existe o la cuenta pudo ser eliminada.');
                    break;
                  }
                  default: {
                    this.commun.communAlert('Error al intentar iniciar sesión', 'Ocurrió un error al enviar el correo electrónico de recuperación intentalo nuevamente más tarde.');
                    break;
                  }
                }
              }

            });
          } // handler
        } // button
      ]
    });
    alert.present();
  }
}

