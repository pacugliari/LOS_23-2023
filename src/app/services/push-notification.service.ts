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
import { callback } from 'chart.js/dist/helpers/helpers.core';
@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  constructor(
    private platform: Platform,
    private http: HttpClient,
    private router: Router
  ) {}

  sendPushNotification(req: any): Observable<any> {
    return this.http.post<Observable<any>>(pushConfig.fcmUrl, req, {
      headers: {
        Authorization: `key=${pushConfig.fcmServerKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async generarToken(): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      await PushNotifications.addListener(
        'registration',
        async (token: Token) => {
          //Acá deberiamos asociar el token a nuestro usario en nuestra bd
          console.log('Registration token: ', token.value);
          resolve(token.value);
        }
      );

      //Ocurre cuando el registro de las push notifications finaliza con errores
      await PushNotifications.addListener('registrationError', (err) => {
        console.error('Registration error: ', err.error);
        reject(err);
      });

      await PushNotifications.register();
    });
  }

  async escucharNotificaciones(callback: (respuesta: any) => any) {
    await this.silenciarNotificaciones();

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

        let ruta = notification.notification.data.ruta
        console.log(ruta);
        if (ruta == 'chatMozo') {
          const chatId = notification.notification.data.chatId; // ID del chat
          if (chatId) {
            console.log(chatId);
            this.router.navigate([ruta, chatId], { replaceUrl: true });
          }
        } else if (ruta === 'homeEmpleado'){//metre//administrarPedidosCocina
          callback(5)
        } else if (ruta === 'metre'){//metre
          callback(1)
        }else{
          this.router.navigate([ruta], { replaceUrl: true });
        }

  
      }
    );

    //Ocurre cuando se realiza una accion sobre la notificacion local
    await LocalNotifications.addListener(
      'localNotificationActionPerformed',
      (notificationAction) => {
        console.log('action local notification', notificationAction);

        //console.log(notificationAction.notification);

        let ruta = notificationAction.notification.extra.data.ruta
        console.log(JSON.stringify(notificationAction))
        console.log(ruta);
        if (ruta === 'chatMozo') {
          const chatID = notificationAction.notification.extra.data.chatId; // ID del chat
          if (chatID) {
            console.log(chatID);
            this.router.navigate([ruta, chatID], { replaceUrl: true });
          }
        } else if (ruta === 'homeEmpleado'){
          callback(5)
        } else if (ruta === 'metre'){//metre
          callback(1)
        }else {
          this.router.navigate([ruta], { replaceUrl: true });
        }
      }
    );

    /*if (this.platform.is('capacitor') ) {//&& token
      const result = await PushNotifications.requestPermissions();
      if (result.receive === 'granted') {
        await PushNotifications.register();
      }
    }*/
  }

  async silenciarNotificaciones() {
    await PushNotifications.removeAllListeners();
    await LocalNotifications.removeAllListeners();
  }
}
