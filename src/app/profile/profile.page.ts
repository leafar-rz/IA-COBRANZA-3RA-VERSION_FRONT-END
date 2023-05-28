import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { ServicesService } from '../services/services.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user: any;
  id_user: any;
  password:any;
  urlGet:any;
  mostrarFormulario=false;

  constructor(private router: Router, private Service: ServicesService,
    private alertController: AlertController,private navCtrl: NavController) { }

  
    goBack() {
      this.navCtrl.pop();
    }

  ionViewWillEnter() {
    
  }
  
  ngOnInit() {
    this.id_user = localStorage.getItem('id_user')
    if (this.Service.isLoggedIn()) 
    {
      this.Service.getCurrentUser(this.id_user).subscribe(
        (response) => {
          this.user = response.data;
          console.log('El usuario logeado es>',this.user)
          //console.log('El usuario logeado es>',this.user.id)
          this.metodoGet(this.user.id);
        },
        (error) => {
          console.log(error);
        }
      );

    } 
    else 
    {
      this.router.navigate(['/']);
    }
  }


  onLogout() {
    this.Service.logout().subscribe(
      response => {
        console.log(response);
       this.user=null;
       this.urlGet=null;
        this.router.navigate(['/']);
        // Aquí puedes redirigir al usuario a la página de inicio de sesión o hacer cualquier otra acción necesaria.
      },
      error => {
        console.log(error);
        this.router.navigate(['/profile']);
      }
    );
  }

  changePassword()
  {
    this.mostrarFormulario=!this.mostrarFormulario;
  }

  cancel()
  {
    this.mostrarFormulario=false;
    this.password=null;
  }

  changePasswordMethod()
  {
    this.Service.actualizarPassword(this.id_user,this.password).subscribe(
      async(response) => {
        console.log(response.message);   
        this.mostrarFormulario=false;
        this.password=null;
        const alert = await this.alertController.create({
          header: 'Informacion',
          message: response.message,
          buttons: ['OK']
        });
        await alert.present(); 
      },
      async(error) => {
        console.log(error);
        const alert = await this.alertController.create({
          header: 'Error',
          message: error.error.message,
          buttons: ['OK']
        });
        await alert.present(); 
        this.mostrarFormulario=false;
        this.password=null;
      }
    );
  }

  metodoGet(user_id: string)
       {
        this.Service.getImg(user_id)
        .subscribe(
          (response) => {
            //console.log(response.IMAGENES[0].imagen);
            this.urlGet=response.IMAGENES[0].imagen;
          },
          (error) => {
            console.error('Error al enviar la imagen', error);
          }
        );
       }


}
