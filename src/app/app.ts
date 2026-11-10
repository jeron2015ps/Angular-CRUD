import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  nombre = 'jeronimo';
  usuario: string = '';
  clave: string = '';
  mensaje = '';
  sesionIniciada = false; 
  listaUsuarios: any[] = [];
  http = inject(HttpClient); 
  productos: any[] = [];
  nuevoProducto: string = '';
  mensajeCrud: string = '';

  registrar() {
    this.listaUsuarios.push({ u: this.usuario, c: this.clave });
    this.mensaje = '¡Registrado! Ahora dale a Entrar.';
  }

  iniciar() {
    const existe = this.listaUsuarios.find(
      user => user.u === this.usuario && user.c === this.clave
    );

    if (existe) {
      this.sesionIniciada = true; 
      this.obtenerProductos(); 
    } else {
      this.mensaje = 'Datos incorrectos o usuario no registrado.';
    }
  }

  cerrarSesion() {
    this.sesionIniciada = false;
    this.usuario = '';
    this.clave = '';
    this.mensaje = '';
    this.productos = []; 
  }
  obtenerProductos() {
    this.http.get<any>('https://dummyjson.com/products?limit=10').subscribe(respuesta => {
      this.productos = respuesta.products; // Guardamos la copia local
      this.mensajeCrud = '10 productos cargados desde la API';
    });
  }
  crearProducto() {
    const nuevoId = Date.now(); 

    const nuevo = {
      id: nuevoId,
      title: this.nuevoProducto
    };

    this.productos.unshift(nuevo); 
    this.mensajeCrud = 'Producto creado localmente';
    this.nuevoProducto = ''; 
  }
  actualizarProducto(id: number) {
    const nuevoNombre = prompt('Escribe el nuevo nombre del producto:');
    
    if (!nuevoNombre) return; 
    const index = this.productos.findIndex(p => p.id === id);
    
    if (index !== -1) {
      this.productos[index].title = nuevoNombre; 
      this.mensajeCrud = `Producto actualizado`;
    }
  }
  eliminarProducto(id: number) {
    this.productos = this.productos.filter(p => p.id !== id);
    this.mensajeCrud = `Producto eliminado`;
  }
}