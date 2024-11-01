import { Injectable } from '@angular/core';
import {
  DocumentData,
  QueryDocumentSnapshot,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { firestore } from 'src/main';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  encuestasCollection = collection(firestore, 'encuestas');
  encuestasSuperCollection = collection(firestore, 'encuestasSuper');
  encuestasEmpleadosCollection = collection(firestore, 'encuestasEmpleados');


 async obtenerEncuestasSupervisor(): Promise<any[]> {
    const querySnapshot = await getDocs(this.encuestasSuperCollection);
    const encuestass: any[] = [];

    querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
      encuestass.push({
        id: doc.id,
        data: doc.data(),
      });
    });

    return encuestass;
  }
  
  async obtenerEncuestasEmpleados(): Promise<any[]> {
    const querySnapshot = await getDocs(this.encuestasEmpleadosCollection);
    const encuestas: any[] = [];

    querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
      encuestas.push({
        id: doc.id,
        data: doc.data(),
      });
    });

    return encuestas;
  }
  
  async obtenerEncuestas(): Promise<any[]> {
    const querySnapshot = await getDocs(this.encuestasCollection);
    const encuestas: any[] = [];

    querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
      encuestas.push({
        id: doc.id,
        data: doc.data(),
      });
    });

    return encuestas;
  }

  escucharCambios(ruta: string, callback: (data: any[]) => void) {
    let datos: any[] = [];
    const q = query(collection(firestore, ruta));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      datos = [];
      querySnapshot.forEach((doc: any) => {
        let data = {
          id: doc.id,
          data: doc.data(),
        };
        datos.push(data);
      });
      callback(datos);
    });
    return datos;
  }

  guardar(data: any, ruta: string) {
    const colRef = collection(firestore, ruta);
    return addDoc(colRef, data);
  }

  async obtenrUno(ruta: string, uid: string) {
    const docSnap = await getDoc(doc(firestore, ruta, uid));
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        data: docSnap.data(),
      };
    }else{
      return null;
    }
  }

  async obtener(ruta: string) {
    let array: any[] = [];
    const querySnapshot = await getDocs(collection(firestore, ruta));
    querySnapshot.forEach((doc) => {
      let data = {
        id: doc.id,
        data: doc.data(),
      };
      array.push(data);
    });
    return array;
  }

  async getWhere(path: string, condicion: string, condicion2: string) {
    let array: any[] = [];
    const Collection = collection(firestore, path);
    const Query = query(Collection, where(condicion, '==', condicion2));
    const Snapshot = await getDocs(Query);
    Snapshot.forEach((doc) => {
      let data = {
        id: doc.id,
        data: doc.data(),
      };
      array.push(data);
    });
    return array;
  }

  async modificar(data: any, ruta: string) {
    let retorno = false;
    const usuarioRef = collection(firestore, ruta);
    const documento = doc(usuarioRef, data.id);
    await updateDoc(documento, data.data)
      .then((respuesta) => {
        retorno = true;
      })
      .catch((error) => {});
    return retorno;
  }

  async borrar(data: any, ruta: string) {
    let retorno = false;
    const usuarioRef = collection(firestore, ruta);
    const documento = doc(usuarioRef, data.id);
    await deleteDoc(documento)
      .then((respuesta) => {
        retorno = true;
      })
      .catch((error) => {});
    return retorno;
  }

  public async traerActoresBd() {
    const actoresCollection = collection(firestore, 'mesas');
    const query = await getDocs(actoresCollection);
    const actores = query.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    return actores;
  }
  public async traerProductosBd() {
    const productosCollection = collection(firestore, 'productos');
    const query = await getDocs(productosCollection);
    const productos = query.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    return productos; // Cambia el nombre del arreglo a 'producto'
  }
}
