import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set, get } from 'firebase/database'

const firebaseConfig = {
  // Substitua com suas configurações do Firebase
  apiKey: "AIzaSyC9KZjAhkA0RsShHu-vktyTdvgTeWM_E7U",
  authDomain: "jogogramaticando.firebaseapp.com",
  databaseURL: "https://jogogramaticando-default-rtdb.firebaseio.com",
  projectId: "jogogramaticando",
  storageBucket: "jogogramaticando.firebasestorage.app",
  messagingSenderId: "171981053372",
  appId: "1:171981053372:web:73888d0eda7762e2139fb9",
  measurementId: "G-C94NF58ZMS"
}

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)

export { ref, set, get }