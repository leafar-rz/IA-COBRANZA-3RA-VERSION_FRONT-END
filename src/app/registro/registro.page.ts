import { Component, OnInit } from '@angular/core';
//importacion de los formgroup
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
//importamos el router
import { Router } from '@angular/router';
//importamos las alertas
import { AlertController } from '@ionic/angular';
import { ServicesService } from '../services/services.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  formReg: FormGroup;
  formReg2: FormGroup;
  myCheckboxControl = new FormControl(false);
  mostrarCodigoAtenticacion=false;
  mostrarRegistro=true;
  codigoAutenticacion:string="";
  uno:any;
  dos:any;
  tres:any;
  cuatro:any;
  camposLlenos= false;

  user_id:any;
  
  constructor
  (
    //objeto de la autenticacion
    private Services: ServicesService,
    //objeto del router
    private router: Router,
    //importacion del form builder
    private formBuilder: FormBuilder,
    //Objeto para usar alertas con el AlertController
    private alertController: AlertController,
    private navCtrl: NavController
  ) 
  //validacion del metodo para que si se registre
  {
    this.formReg = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.formReg2 = new FormGroup({
      uno: new FormControl('', Validators.required),
      dos: new FormControl('', Validators.required),
      tres: new FormControl('', Validators.required),
      cuatro: new FormControl('', Validators.required),
    });
  }
  
ionViewWillEnter() {
  this.formReg.reset();
  this.formReg2.reset();
  this.myCheckboxControl.reset();
}
  
  isFormValid(): boolean {
    if(this.formReg.valid && this.myCheckboxControl.value) {
      return true;
    } else {
      return false;
    }
  }

  ngOnInit() 
  {
  }

  goBack() {
    this.navCtrl.pop();
  }

// se agrego el metodo de register

async register()
{

   
  
  if(this.formReg2.get('uno')?.value==this.codigoAutenticacion[0] && this.formReg2.get('dos')?.value==this.codigoAutenticacion[1] && this.formReg2.get('tres')?.value==this.codigoAutenticacion[2] && this.formReg2.get('cuatro')?.value==this.codigoAutenticacion[3])
  {
    /*const alert = await this.alertController.create({
      header: 'Informacion',
      message: `Codigo de autenticacion correcto!`,
      buttons: ['OK']
    });*/
    //Ejecutamos la alerta
    // await alert.present();

    console.log(this.formReg2.get('uno')?.value+this.formReg2.get('dos')?.value+this.formReg2.get('tres')?.value+this.formReg2.get('cuatro')?.value);
    
  if(this.formReg.valid)

  {
    //asignacion de las variables a los valores del formulario
    const {name, email, password}=this.formReg.value;
    //llamamos al metodo de registro de la pagina se servicios en la de registro (asigancion de las 3 variables a las consantes que tenemos arriba)
    // suscribe: lo que espera de respuesta de lo que consume el servicio
    // response es lo que se espera del metodo, es como lo que regresa una consulta en mysql( es lo que nos da de respuesta)
    // En el response es donde se consume el servicio
    this.Services.resgister(name, email, password).subscribe(async (response: any)  => 
    {
      console.log("Respone: ",response);
      if(response.data=='User already exists!')
      {
        const alert = await this.alertController.create({
          header: 'Registro fallido',
          message: `User already exists!`,
          buttons: ['OK']
        });
        //Ejecutamos la alerta
        await alert.present();
        this.router.navigate(['/registro']);
        this.mostrarCodigoAtenticacion=false;
        this.mostrarRegistro=true;
        this.formReg2.reset();
      }
      else
      {
        const alert = await this.alertController.create({
          header: 'Registro exitoso',
          message: `Bienvenido: `+name,
          buttons: ['OK']
        });
        //Ejecutamos la alerta
        await alert.present();

        //console.log("User id ",response.data.id);
        this.user_id=response.data.id;
        

        this.Services.login(this.formReg.get('email')?.value, this.formReg.get('password')?.value).subscribe(
          async (response: any)  => {
            localStorage.setItem('access_token',response.token)
            localStorage.setItem('id_user',response.data.id)
           // this.router.navigate(['/dashboard']);
            this.router.navigate(['/home'], { state: {id: this.user_id } });
            this.mostrarCodigoAtenticacion=false;
            this.mostrarRegistro=false;
          }
        );
        
      }
     
    },
    //Creamos esta alerta que indica que el login no fue exitoso y mostramos el error en un mensaje
    async (error) => {
      const alert = await this.alertController.create({
        header: 'Error',
        message: error.error.message,
        buttons: ['OK']
      });
      //Ejecutamos la alerta
      await alert.present();
      //redireccionamos al login para que borre los datos incorrectos del formulario
      this.router.navigate(['/registro']);
    }
    
    )
  }
  }
  else
  {
    const alert = await this.alertController.create({
      header: 'Error',
      message: `Codigo de autenticacion incorrecto!`,
      buttons: ['OK']
    });
    //Ejecutamos la alerta
    await alert.present();
  }

}

onSubmit(){
}

Autenticar()
{
  if(this.formReg.valid)
  {
  this.mostrarRegistro=false;
  this.mostrarCodigoAtenticacion=true;
  this.codigoAutenticacion = this.generateRandomString(4);
 /* this.uno=this.codigoAutenticacion[0];
  this.dos=this.codigoAutenticacion[1];
  this.tres=this.codigoAutenticacion[2];
  this.cuatro=this.codigoAutenticacion[3];*/
  
  const emailUrl = "mailto:" + this.formReg.get('password')?.value + "?subject=Codigo de autenticacion&body=Tu codigo de autenticacion es: " + this.codigoAutenticacion;
            
  window.open(emailUrl, '_system');

  let email = {
    to:this.formReg.get('password')?.value,
    subject: 'Codigo de autenticacion',
    body: `Tu codigo de autenticacion es: `+this.codigoAutenticacion
  };
 
  // Enviar el correo electrónico
  //this.emailComposer.open(email);
  console.log('Email enviado ');
 // console.log(this.codigoAutenticacion+"="+this.uno+this.dos+this.tres+this.cuatro+this.cinco+this.seis);
 console.log(this.codigoAutenticacion);
}

}

generateRandomString(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


}
