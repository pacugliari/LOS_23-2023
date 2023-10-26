import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

if (environment.production) {
  enableProdMode();
}

export const firebaseConfig = {
  apiKey: "AIzaSyCKXVttkbcP0I3KU1JrxlY1nhkikTW-WFY",
  authDomain: "los-23-2023.firebaseapp.com",
  projectId: "los-23-2023",
  storageBucket: "los-23-2023.appspot.com",
  messagingSenderId: "832581136910",
  appId: "1:832581136910:web:60d075b06f1c32230d025f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

