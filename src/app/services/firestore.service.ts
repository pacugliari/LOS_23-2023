import { Injectable } from '@angular/core';
import { addDoc, collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { firestore } from 'src/main';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor() {}

  guardar(data: any, ruta: string) {
    const colRef = collection(firestore, ruta);
    return addDoc(colRef, data);
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

  async modificar (data: any,ruta:string){
    let retorno = false;
    const usuarioRef = collection(firestore,ruta);
      const documento = doc(usuarioRef,data.id)
      await updateDoc(documento,data.data)
        .then((respuesta)=>{
          retorno = true;
        })
        .catch((error) => {
      });
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
