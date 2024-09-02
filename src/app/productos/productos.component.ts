import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CoreService } from '../services/core.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  constructor(private api: ApiService, public core: CoreService) { }

  // productos: {
  //   sku: string,
  //   nombre: string,
  //   categoria: string,
  //   tienda: string,
  //   precio: string,
  //   empresa: string
  // }[] = [];

  // estado_ordenamiento: string = '';
  // fileData: File = new File([], '');
  // excelDataPrecios: {sku: string, precio: string}[] = [];
  // excelDataProductos: {
  //   sku: string,
  //   nombre: string,
  //   categoria: string,
  //   tienda: string,
  //   precio: string,
  //   empresa: string
  // }[] = [];
  // busqueda_producto: string = '';

  // DescargarExcel(tabla: HTMLTableElement) {
  //   var Excel_Exportado = XLSX.utils.table_to_sheet(tabla);
  //   var libro: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(libro, Excel_Exportado, 'MAESTRO PRODUCTOS');
  //   XLSX.writeFile(libro, `Maestro de productos ${this.core.Empresa_Actual}.xlsx`);
  // }
  // LeerExcelPrecios(input_element: HTMLInputElement) {
  //   this.excelDataPrecios = [];
  //   var filereader = new FileReader();
  //   filereader.readAsArrayBuffer(input_element.files![0]);
  //   filereader.onload = () => {
  //     const workbook = XLSX.read(filereader.result, { type: 'array' });
  //     const sheetName = workbook.SheetNames[0];
  //     const worksheet = workbook.Sheets[sheetName];
  //     var excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  //     (excelData as []).forEach((precio, i) => {
  //       if (i > 0) {
  //         var linea = {
  //           sku: precio[0],
  //           precio: precio[1]
  //         }
  //         this.excelDataPrecios.push(linea)
  //       }
  //     });
  //     this.api.ListaPrecio(this.excelDataPrecios).subscribe((respuesta: any) => {
  //       alert(`${respuesta["mensaje"]}`);
  //       this.ActualizarTabla();
  //     });
  //   };
  // }
  // LeerExcelProductos(input_element: HTMLInputElement) {
  //   this.excelDataProductos = [];
  //   var filereader = new FileReader();
  //   filereader.readAsArrayBuffer(input_element.files![0]);
  //   filereader.onload = () => {
  //     const workbook = XLSX.read(filereader.result, { type: 'array' });
  //     const sheetName = workbook.SheetNames[0];
  //     const worksheet = workbook.Sheets[sheetName];
  //     var excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  //     (excelData as []).forEach((precios, i) => {
  //       if (i > 0) {
  //         var linea = {
  //           sku: precios[0],
  //           nombre: precios[1],
  //           categoria: precios[2],
  //           tienda: precios[3],
  //           precio: precios[4],
  //           empresa: precios[5]
  //         }
  //         this.excelDataProductos.push(linea)
  //       }
  //     });
  //     this.api.InsertarProductos(this.excelDataProductos).subscribe((respuesta: any) => {
  //       alert(`${respuesta["mensaje"]}`);
  //       this.ActualizarTabla();
  //     });
  //   };
  // }
  // LeerExcelActualizacion(input_element: HTMLInputElement) {
  //   this.excelDataProductos = [];
  //   var filereader = new FileReader();
  //   filereader.readAsArrayBuffer(input_element.files![0]);
  //   filereader.onload = () => {
  //     const workbook = XLSX.read(filereader.result, { type: 'array' });
  //     const sheetName = workbook.SheetNames[0];
  //     const worksheet = workbook.Sheets[sheetName];
  //     var excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  //     (excelData as []).forEach((precios, i) => {
  //       if (i > 0) {
  //         var linea = {
  //           sku: precios[0],
  //           nombre: precios[1],
  //           categoria: precios[2],
  //           tienda: precios[3],
  //           precio: precios[4],
  //           empresa: precios[5]
  //         }
  //         this.excelDataProductos.push(linea)
  //       }
  //     });
  //     this.api.ActualizarProductos(this.excelDataProductos).subscribe((respuesta: any) => {
  //       alert(`${respuesta["mensaje"]}`);
  //       this.ActualizarTabla();
  //     });
  //   };
  // }
  // Ordenar() {
  //   switch (this.estado_ordenamiento) {
  //     case '':
  //       this.productos.sort((a, b) => {
  //         if (a.precio < b.precio) { return -1 }
  //         else { return 1 }
  //       });
  //       this.estado_ordenamiento = 'descendente';
  //       break;
  //     case 'descendente':
  //       this.productos.sort((a, b) => {
  //         if (b.precio < a.precio) { return -1 }
  //         else { return 1 }
  //       });
  //       this.estado_ordenamiento = 'ascendente';
  //       break;
  //     case 'ascendente':
  //       this.productos.sort((a, b) => {
  //         if (a.precio < b.precio) { return -1 }
  //         else { return 1 }
  //       });
  //       this.estado_ordenamiento = 'descendente';
  //       break;
  //   }
  // }
  // BuscarProducto(tabla: HTMLTableElement, input_busqueda: HTMLInputElement) {
  //   this.busqueda_producto = input_busqueda.value;
  //   this.ActualizarTabla();
  // }
  // ActualizarTabla() {
  //   this.productos = [];
  //   this.api.ObtenerProductos(this.core.Empresa_Actual, this.busqueda_producto).subscribe(
  //     data => {
  //       (data as []).forEach(prod => {
  //         var p = {
  //           sku: prod["sku"],
  //           nombre: prod["nombre"],
  //           categoria: prod["categoria"],
  //           tienda: prod["tienda"],
  //           precio: prod["precio"],
  //           empresa: prod["empresa"]
  //         }
  //         this.productos.push(p);
  //       });
  //     }
  //   );
  // }

  ngOnInit(): void {
    // this.api.ObtenerProductos(this.core.Empresa_Actual, this.busqueda_producto).subscribe(
    //   data => {
    //     (data as []).forEach(prod => {
    //       var p = {
    //         sku: prod["sku"],
    //         nombre: prod["nombre"],
    //         categoria: prod["categoria"],
    //         tienda: prod["tienda"],
    //         precio: prod["precio"],
    //         empresa: prod["empresa"]
    //       }
    //       this.productos.push(p);
    //     });
    //     var spinner_carga = document.getElementById('spinner_carga') as HTMLElement;
    //     spinner_carga.classList.toggle('visually-hidden');
    //   }
    // );
  }

}
