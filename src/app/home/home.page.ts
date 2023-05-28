import { Component } from '@angular/core';
import { ServicesService } from '../services/services.service';
import { Location } from '@angular/common';
import { Share } from '@capacitor/share';
import { AlertController, Platform } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource,Photo} from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';


import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  //vamos a crear un arreglo de fotos antes del contsuctor
  photos:string[]=[];
  selectedImage:any=false;
  base64bd:any;
  urlGet:any;

  USER_id="";

  constructor
  ( 
    private location: Location,
    private Services:ServicesService, // importamos los servicios y creamos un objeto de la clase
    private platform: Platform,
    private router: Router,
    private alertController: AlertController
  ) 
    {
      this.photos=this.Services.photos;// damos el valor a l arrelgo al mismo de la sel servicio
    }
    
    ngOnInit(): void {
      const navigation = this.router.getCurrentNavigation();
      if (navigation && navigation.extras && navigation.extras.state) {
        this.USER_id = navigation.extras.state['id'];
      }
  
      console.log("USER: ",this.USER_id);
    }

    goBack()
    {
      this.location.back();
    }

    reload()
     {
      location.reload();
     }


      openWhatsApp() {
        const phoneNumber = '4433953778';
        const message = 'Hola Juan';
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
    
        window.open(whatsappUrl, '_system');
      }


      checkPlatformWeb()
      {
        if(Capacitor.getPlatform() == 'web' && Capacitor.getPlatform() == 'ios')
        {
          return true;
        }
        else
        {
          return false;
        }
      }

      private async readAsBase64(photo: any) {
        if (Capacitor.getPlatform() === 'ios' || Capacitor.getPlatform() === 'android') {
          const response = await Filesystem.readFile({
            path: photo.path
          });
          return response.data;
        } else {
          const response = await fetch(photo.webPath);
          const blob = await response.blob();
          return await this.convertBlobToBase64(blob) as string;
        }
      }
      

      private async readAsBase642(photo: Photo) {
        if (this.platform.is('hybrid')) {
          const file = await Filesystem.readFile({
            path: photo.path || ''
          });
    
          return file.data;
        }
        else {
          // Fetch the photo, read as a blob, then convert to base64 format
          const response = await fetch(photo.webPath || '');
          const blob = await response.blob();
    
          return await this.convertBlobToBase64(blob) as string;
        }
      }

       // Helper function
    convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
      const reader = new FileReader;
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });

    

        async getPicture()
        {

          this.selectedImage=null;

           const image = await Camera.getPhoto({
            quality: 90,
            source: CameraSource.Prompt,
            width: 600,
            resultType: CameraResultType.DataUrl,
          });
        
          console.log(image);
          this.selectedImage = image;
          
          //const base64Data = image.dataUrl;

          //alert(this.selectedImage.dataUrl);
          //console.log(image.dataUrl);

         /* const image = await Camera.getPhoto
          (
            {
              quality:90, 
              source:CameraSource.Prompt,
              width: 600,
              resultType: this.checkPlatformWeb() ? CameraResultType.DataUrl : CameraResultType.Uri,
              
            }
          );

          console.log(image);

          this.selectedImage = image;

          const base64Data = await this.readAsBase64(image);*/
          //const imageFile=new File ([base64Data], 'file.jpg', {type:'image/jpeg'});
        
          //console.log("Base 64: "+base64Data);
          //console.log("image file: ", imageFile);
        
          //const formData = new FormData();
          //formData.append('file', imageFile, imageFile.name);
          
          //console.log("Form Data: ", formData);

          /*

          if(this.checkPlatformWeb()) 
          {
            this.selectedImage.webPath = image.dataUrl;
          }
          
          if(Capacitor.getPlatform()=='android' || Capacitor.getPlatform()=='ios')
          {
            this.base64bd=`data:image/png.base64,`+base64Data;
          }
          else
          {
            this.base64bd=base64Data;
          }
          
        const alert = await this.alertController.create({
            header: 'Base64',
            message:this.base64bd,
            buttons: ['OK']
          });

          await alert.present();*/

          //this.crearImg();

         // this.crearImg(formData);
        }

        crearImg2(imageFile: FormData) {
          this.Services.crearImg("1", imageFile)
            .subscribe(
              (response) => {
                console.log('Imagen enviada exitosamente', response);
              },
              (error) => {
                console.error('Error al enviar la imagen', error);
              }
            );
        }

        crearImg() {
          
          this.Services.crearImg(this.USER_id, this.selectedImage.dataUrl)
            .subscribe(
              (response) => {
                console.log('Imagen enviada exitosamente', response);
                this.router.navigate(['/dashboard']);
              },
              (error) => {
                console.error('Error al enviar la imagen', error);
              }
            );
        }

        async share() 
        {
          //alert(this.selectedImage.path);
           await Share.share({
            title: 'Enviar Imagen via Whatsapp',
            text: 'Enviar imagen',
            url: this.selectedImage.path,
            dialogTitle: 'Enviar con whatsapp',
           });
        }
      
       metodoGet()
       {
        this.Services.getImg("1")
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
