import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http:HttpClient) {

  }

  //"los23.email@gmail.com"
  enviarMail (emailDestino:any,titulo: any,mensaje : any): Observable<any> {
    
    let data: any = {
      mensaje: {
        from: "LOS 23 - RESTO BAR <los23.email@gmail.com>",
        to: emailDestino,
        subject: titulo,
        html: mensaje
      }
    }

    return this.http.post(
      'https://los23.netlify.app/.netlify/functions/api/send-mail',data,this.httpOptions
    );
  }

  
}
