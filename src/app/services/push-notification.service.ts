import { Injectable } from '@angular/core';
import {
  ActionPerformed,
  PushNotifications,
  PushNotificationSchema,
  Token,
} from '@capacitor/push-notifications';
import { Platform } from '@ionic/angular';
import { LocalNotifications } from '@capacitor/local-notifications';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { pushConfig } from 'src/main';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  constructor(
    private platform: Platform,
    private http: HttpClient,
    private router:Router
  ) {
  }


  sendPushNotification(req:any): Observable<any> {
    return this.http.post<Observable<any>>(pushConfig.fcmUrl, req, {
      headers: {
        Authorization: `key=${pushConfig.fcmServerKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async generarToken(){
    //Ocurre cuando el registro de las push notifications finaliza sin errores
    await PushNotifications.addListener(
      'registration',
      async (token: Token) => {
        localStorage.setItem("token",token.value)
        console.log(token.value)
      }
    );

    //Ocurre cuando el registro de las push notifications finaliza con errores
    await PushNotifications.addListener('registrationError', (err) => {
      console.error('Registration error: ', err.error);
    });
    
    await this.silenciarNotificaciones();
    const token = localStorage.getItem("token");
    console.log(token)
    return token;
  }

  async escucharNotificaciones(ruta:any){
    //Ocurre cuando el dispositivo recive una notificacion push
    await PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        //Este evento solo se activa cuando tenemos la app en primer plano
        console.log('Push notification received: ', notification);
        console.log('data: ', notification.data);
        //Esto se hace en el caso de que querramos que nos aparezca la notificacion en la task bar del celular ya que por
        //defecto las push en primer plano no lo hacen, de no ser necesario esto se puede sacar.
        LocalNotifications.schedule({
          notifications: [
            {
              title: notification.title || '',
              body: notification.body || '',
              id: new Date().getMilliseconds(),
              extra: {
                data: notification.data,
              },
            },
          ],
        });
      }
    );
    
    //Ocurre cuando se realiza una accion sobre la notificacion push
    await PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        //Este evento solo se activa cuando tenemos la app en segundo plano y presionamos sobre la notificacion
        console.log(
          'Push notification action performed',
          notification.actionId,
          notification.notification
        );
        console.log(ruta);
        this.router.navigate([ruta]);
      }
    );

    //Ocurre cuando se realiza una accion sobre la notificacion local
    await LocalNotifications.addListener(
      'localNotificationActionPerformed',
      (notificationAction) => {
        console.log('action local notification', notificationAction);
        this.router.navigate([ruta]);
      }
    );

    if (this.platform.is('capacitor') ) {//&& token
      const result = await PushNotifications.requestPermissions();
      if (result.receive === 'granted') {
        await PushNotifications.register();
      }
    }
  }

  async silenciarNotificaciones(){
    await PushNotifications.removeAllListeners();
    await LocalNotifications.removeAllListeners();
  }

}