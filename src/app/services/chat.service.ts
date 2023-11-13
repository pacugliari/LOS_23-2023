import { Injectable } from '@angular/core';
import { Mensaje } from '../models/mensaje';
import { Observable } from 'rxjs';
import { Firestore,getDocs, collection, onSnapshot, query, addDoc,doc,deleteDoc } from 'firebase/firestore';
import { firestore } from 'src/main';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public mensajes : Array<Mensaje> = [];
  constructor() { }

  listenToChatChanges(cliente: string) {
    this.mensajes = [];
    const q = query(collection(firestore, cliente));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      this.mensajes = [];
      querySnapshot.forEach((doc) => {
        let chat = doc.data() as Mensaje;
        this.mensajes.push(chat);
      });
      this.mensajes = this.mensajes.sort((a,b)=> Number(b.fecha)-Number(a.fecha));
    });    
  }

  async enviarMensaje(cliente: string, mensaje: Mensaje) {
    let data = { 
      fecha:mensaje.fecha, 
      mensaje: mensaje.mensaje, 
      nombre: mensaje.nombre,
      tipo: mensaje.tipo
    }
    console.log(data);
    const cargasRef = collection(firestore,cliente);
    await addDoc(cargasRef,data); 
  }

}
