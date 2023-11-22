import { Injectable } from '@angular/core';
import { Mensaje } from '../models/mensaje';
import { Observable } from 'rxjs';
import {
  Firestore,
  getDocs,
  collection,
  onSnapshot,
  query,
  addDoc,
  doc,
  deleteDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  where,
  getDoc,
} from 'firebase/firestore';
import { firestore } from 'src/main';
@Injectable({
  providedIn: 'root',
})
export class ChatService {
  public mensajes: Array<Mensaje> = [];
  constructor() {}

  async crearChat(chatId: string, clienteId: string) {
    const chatRef = doc(firestore, 'chat', chatId);
    await setDoc(chatRef, {
      clienteId: clienteId,
      mensajes: [],
      atendido: false,
    });
  }

  listenToChatChanges(cliente: string) {
    this.mensajes = [];
    const q = query(
      collection(firestore, 'chat'),
      where('clienteId', '==', cliente)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      this.mensajes = [];
      querySnapshot.forEach((doc) => {
        let chat: any = doc.data();
        chat.mensajes.forEach((mensajeData: any) => {
          let mensaje: Mensaje = {
            fecha: mensajeData.fecha,
            mensaje: mensajeData.mensaje,
            nombre: mensajeData.nombre,
            tipo: mensajeData.tipo,
          };
          this.mensajes.push(mensaje);
        });
        this.mensajes = this.mensajes.sort((a, b) => {
          return parseInt(a.fecha) - parseInt(b.fecha);
        });
      });
      
    });
  }

  async docExists(
    collectionName: string,
    documentId: string
  ): Promise<boolean> {
    const docRef = doc(firestore, collectionName, documentId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  }

  async enviarMensaje(cliente: string, mensaje: Mensaje) {
    const chatExists = await this.docExists('chat', cliente);
    if (!chatExists) {
      await this.crearChat(cliente, cliente); // Puedes pasar el clienteId si es necesario
    }
    let data = {
      fecha: mensaje.fecha,
      mensaje: mensaje.mensaje,
      nombre: mensaje.nombre,
      tipo: mensaje.tipo,
    };
    const chatRef = doc(firestore, 'chat', cliente);
    await updateDoc(chatRef, {
      mensajes: arrayUnion(data),
      atendido: false, // Puedes establecerlo en true si el mozo ha atendido el chat
    });
  }
}
