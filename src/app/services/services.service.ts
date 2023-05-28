import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})

export class ServicesService {

// agregamos esto para conectar
//baseurl = 'http://127.0.0.1:8000';
baseurl = 'https://IACOBRANZA.shop';

httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
//httpHeaders = new HttpHeaders({'Content-Type': 'multipart/form-data'});
  
  photos:string[]=[];

  constructor(private http: HttpClient) {}


  resgister(name: string, email: string, password: string): Observable<any>
{
   // vamos a retornar el http porque es un post
  return this.http.post(
    `${this.baseurl}/api/register`,
    { name, email, password},
    { headers: this.httpHeaders }
  );
}

//creamos el metodo de log in
login(email: string, password: string): Observable<any>
{
   // vamos a retornar el http porque es un post
  return this.http.post(
    `${this.baseurl}/api/login`,
    {email, password},
    { headers: this.httpHeaders }
  );
  //http://127.0.0.1:8000/api/login
}




  //metodo del usuario corriendo ahora, headers es el id y el token
  getCurrentUser(id:any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`
    });

    return this.http.get(`${this.baseurl}/api/users/show/`+id, { headers });
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token;
  }
    
 

    actualizarRandomPassword(email: string): Observable<any>
    {
      // vamos a retornar el http porque es un put
      return this.http.put(
        //ponemos la ip base y le sumamos la ip del servicio de laravel y le sumamos el email de parametro del metodo para que le actualice a el la contraseña
        `${this.baseurl}/api/updateRandom/${email}`,{});
        // //http://127.0.0.1:8000/api/updateRandom/1@gmail.com
    }

    logout(): Observable<any>
    {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      });
  
      return this.http.delete(
        `${this.baseurl}/api/logout`,
        { headers }
      );
    }


 /* crearImg(USER_id: string, selectedImage: FormData) {
    console.log(selectedImage)
    return this.http.post(`${this.baseurl}/api/crearImg/${USER_id}`, selectedImage,{headers:this.httpHeaders});//se hace un json de la imagen
  }*/

  crearImg2(USER_id: string, selectedImage: FormData) {
    console.log("En el servicio: ",selectedImage);
    return this.http.post(`${this.baseurl}/api/crearImg2/${USER_id}`, selectedImage,{headers:this.httpHeaders});//se hace un json de la imagen
  }

  crearImg(USER_id: string, selectedImage: any):Observable<any> {
    console.log("En el servicio: ",selectedImage);
    return this.http.post<any>(`${this.baseurl}/api/crearImg/${USER_id}`, {selectedImage});//se hace un json de la imagen
  }
  

  getImg(USER_id: string):Observable<any> {
    return this.http.get<any>(`${this.baseurl}/api/getImg/${USER_id}`, {});
                              //http://127.0.0.1:8000/api/getImg/1;

    //Route::get('/getImg/{USER_id}', [ConsultaController::class, 'getImg']);
  }

  subirImagen(USER_id: any, File: any)
  {
    return this.http.post(`${this.baseurl}/api/crearImg/${USER_id}`, {"imagen": File });//se hace un json de la imagen
  }
      
  actualizarPassword(id: string, password: string): Observable<any>
    {
      // vamos a retornar el http porque es un put
      return this.http.put(
        //ponemos la ip base y le sumamos la ip del servicio de laravel y le sumamos el email de parametro del metodo para que le actualice a el la contraseña
        `${this.baseurl}/api/updateManualPassword/${id}/${password}`,{});
    }
  


























  
  /*async addNewPhoto()
  {
    const photo=await Camera.getPhoto
    (
      {
        resultType:CameraResultType.Uri,
        source:CameraSource.Camera,
        quality:100
      }
    );
    if(photo.webPath)
    {
      this.photos.unshift(photo.webPath);
    }
  }*/

}
