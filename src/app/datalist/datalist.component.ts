import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-datalist',
  templateUrl: './datalist.component.html',
  styleUrls: ['./datalist.component.css']
})
export class DatalistComponent implements OnInit, OnChanges {
  @Input() Radio!: boolean;
  @Input() ProductosRecibidos!: FiltroProducto[];
  @Output() ProductosRetornados: EventEmitter<string[]> = new EventEmitter<string[]>();
  ProductosFiltrados: FiltroProducto[] = [];
  ArrayProductosRetornarnos: string[] = [];
  Buscador: string = '';

  constructor() {}

  BuscarProducto() {
    const Termino: string = this.Buscador.toLowerCase();
    this.ProductosFiltrados = this.ProductosRecibidos.filter(producto => {
      const nombre = producto.nombre || '';
      const codigo = producto.codigo_interno || '';
      const sku = producto.sku || '';
      return  nombre.toLowerCase().includes(Termino) ||
              codigo.toLowerCase().includes(Termino) ||
              sku.toLowerCase().includes(Termino)
    });
  }
  SeleccionarProductos(sku: string) {
    if (this.ArrayProductosRetornarnos.includes(sku)) {
      this.ArrayProductosRetornarnos.splice(this.ArrayProductosRetornarnos.indexOf(sku), 1)
    } else {
      this.ArrayProductosRetornarnos.push(sku)
    }
  }
  FiltrarRadioProductos(sku: string) {
    this.ArrayProductosRetornarnos = []
    this.ArrayProductosRetornarnos.push(sku)
  }
  RetornarProductos() {
    // Emitir los productos filtrados si es necesario
    this.ProductosRetornados.emit(this.ArrayProductosRetornarnos);
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ProductosRecibidos']  && this.ProductosRecibidos) {
      this.ProductosFiltrados = this.ProductosRecibidos;
    }
  }
}

interface FiltroProducto {
  sku: string;
  codigo_interno: string;
  nombre: string;
}
