import { Component, OnInit } from '@angular/core';
import Locales from 'src/app/models/locales';
import TotalCategorias from 'src/app/models/Total_categoria';
import TotalGrafico from 'src/app/models/Total_grafico';
import { ApiService } from 'src/app/services/api.service';
import { CoreService } from 'src/app/services/core.service';
import { datos } from './datos';
import * as XLSX from 'xlsx';
import { TableComponent } from '../table/table.component';

@Component({
  selector: 'app-resumen-soles',
  templateUrl: './resumen-soles.component.html',
  styleUrls: ['./resumen-soles.component.css']
})
export class ResumenSolesComponent implements OnInit {

  constructor(private dato: datos, private api: ApiService, public core: CoreService) { }
  arreglo_resumen: any[] = [];

  hosting: string = `${this.core.host}/grafico-general`;
  arreglo_total_datos_yaxis: number[] = [];
  arrayTipologias: string[] = ["Tipologia 1 al 1 (50%)", "Tipologia 1 al 2 (80%)", "Tipologia 1 al 3 (95%)", "Tipología 1 al 4 (100%)"];
  arrayTipologiasValores: string[] = ["50", "80", "95", "100"];

  arreglo_total_daros_xaxis: string[] = [];

  Totales_Semanas: TotalGrafico[] = [];

  Totales_categorias: TotalCategorias[] = [];
  Total_todas_categorias: number = 0;

  years: string[] = [];

  categorias_empresa: string[] = [];
  sku_seleccionados: string[] = [];

  ObtenerListaCategorias(empresa: string) {
    this.api.ObtenerListaCategorias(empresa).subscribe(
      (data: any) => {
        this.categorias_empresa = data["categorias"];
      }
    );
  }

  AplicarFiltroBusqueda(filtros_div: HTMLDivElement, table?: TableComponent) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Cookie", "frontend_lang=es_PE; session_id=4d1a8ed5607cb3523492e06517dded690742bba1");

    const raw = JSON.stringify({
      "jsonrpc": "2.0",
      "id": 10,
      "params": {
        "empresa": this.core.Empresa_Actual,
        "cadena": this.core.Tienda_Actual,
        "lista_nombres": this.core.ArraySKUsFiltros
      }
    });

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("https://odoo17.ceramicaskantu.com/obtener/sku/post", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result["result"]["skus"].length == 0) {
          this.core.busqueda_actual = "TODOS_PRODUCTOS";
        } else {
          this.core.ArraySKUsFiltros = result["result"]["skus"];
          var skus_string = "";
          this.core.ArraySKUsFiltros.forEach((b) => {
            skus_string += `${b}+`
          });
          skus_string = skus_string.slice(0, -1);
          this.core.busqueda_actual = skus_string;
          table?.ActualizarTabla();
          filtros_div.innerHTML = "Boton verde para agregar productos al filtro...";
        }
      })
      .catch((error) => console.error(error));
  }

  AgregarFiltro(contendor_filtros: HTMLDivElement, input_buscar: HTMLInputElement) {
    if(String(contendor_filtros.innerHTML.trim()) === "Boton verde para agregar productos al filtro...") {
      contendor_filtros.innerHTML = "";
    }
    contendor_filtros.innerHTML += `<div> <i class="bi bi-caret-right-square-fill"></i> ${input_buscar.value}</div>`;
    this.core.ArraySKUsFiltros.push(input_buscar.value);
    input_buscar.value = "";
  }

  LimpiarFiltro(contendor_filtros: HTMLDivElement) {
    contendor_filtros.innerHTML = "Boton verde para agregar productos al filtro...";
    this.core.ArraySKUsFiltros.length = 0;
  }

  AplicarSeleccion() {
    var linea_seleccion_array = document.querySelectorAll('.linea_seleccion');
    linea_seleccion_array.forEach(linea => {
      var lineas_sku = linea.getElementsByTagName('td');
      this.sku_seleccionados.push(lineas_sku[1].innerHTML);
    });
    console.log(this.sku_seleccionados);
    // this.sku_seleccionados = this.sku_seleccionados.substring(0, this.sku_seleccionados.length - 1);
    // console.log(this.sku_seleccionados);
    // this.core.busqueda_actual = this.sku_seleccionados;
  }

  Cambiar_analisis(tipo_calculo: string) {
    switch (tipo_calculo) {
      case '50':
        this.core.busqueda_actual = this.core.busqueda_50_50;
        break;
      case '80':
        this.core.busqueda_actual = this.core.busqueda_80_20;
        break;
      case '95':
        this.core.busqueda_actual = this.core.busqueda_95_5;
        break;
      case '100':
        this.core.busqueda_actual = 'TODOS_PRODUCTOS';
        break;
    }
  }

  CambiarCategoria(categoria: string, tabla: TableComponent) {
    this.core.Categoria_actual = categoria;
    this.core.botonActivoDecor = categoria;
    this.core.botonActivoKantu = categoria;
    console.log("Esta categoria: " + this.core.Categoria_actual)
    tabla.ngOnInit();
  }

  //locales agregado el 06 2023
  toggleSpinner() {
    var spinner = document.getElementById('spinner_carga_tabla_detallada') as HTMLDivElement;
    spinner.classList.toggle('visually-hidden');
  }

  EstablecerSemanas(seleccion_html: HTMLSelectElement) {
    let valorSeleccionado = seleccion_html.value;
    this.core.Year_Actual = valorSeleccionado;
    this.api.ObtenerSemanas(this.core.Year_Actual, this.core.Empresa_Actual, this.core.Tienda_Actual).subscribe(
      (data: any) => {
        this.core.DT_Semanas = data["semanas"];
      }
    );

  }
  Construir_breadcump(bc2: string, bc3?: string, bc4?: string) {
    this.core.breadcump2 = bc2;
    this.core.breadcump3 = bc3 || '';
    this.core.breadcump4 = bc4 || '';
  }
  EstablecerLocales() {
    this.core.locales_actuales = [];
    this.api.ObtenerLocales(this.core.Empresa_Actual, this.core.Tienda_Actual).subscribe((data: any) => {
      (data["locales"] as []).forEach(
        local => {
          var local_modelo: Locales = new Locales(
            local["locales"],
            local["ubicacion"]
          );
          this.core.locales_actuales.push(local_modelo);
        }
      );
    });
  }

  CambiarLocal(local: string, ubicacion: string) {
    var ruta: string = "";
    if (local == 'TODOS_LOCALES') {
      this.core.locales_url = 'TODOS_LOCALES';
    } else {
      this.core.codigo_local = local;
      this.core.ubicacion_local = ubicacion;
      var html_locales = Array.from(document.querySelectorAll<HTMLInputElement>("#html_locales"));
      html_locales.forEach((element, i) => {
        if (element.checked) {
          ruta += element.value + "+";
        }
      });
      this.core.locales_url = ruta.substring(0, ruta.length - 1);
    }
  }
  VerificarLocales() {
    var html_locales = Array.from(document.querySelectorAll<HTMLInputElement>("#html_locales"));
    var no_seleccionados: string[] = [];
    html_locales.forEach((element, i) => {
      if (!element.checked) {
        no_seleccionados.push(element.value);
      }
    });
    if (no_seleccionados.length == 0) {
      this.core.locales_url = 'TODOS_LOCALES';
    }
  }
  // Categoria_actual
  CambiarCategorias() {
    var html_categorias = Array.from(document.querySelectorAll<HTMLInputElement>("#html_categorias"));
    var seleccion_categorias: string = '';
    html_categorias.forEach(html_categoria => {
      if (html_categoria.checked) {
        seleccion_categorias += `${html_categoria.value}+`;
      }
    });
    seleccion_categorias = seleccion_categorias.substring(0, seleccion_categorias.length - 1);
    this.core.Categoria_actual = seleccion_categorias;
    console.log("Esta categoria 2: " + this.core.Categoria_actual)
  }
  AplicarFiltro() {
    var TxbBuscar = document.getElementById('TxbBuscar') as HTMLInputElement;
    TxbBuscar.value == '' ? this.core.busqueda_actual = 'TODOS_PRODUCTOS' : this.core.busqueda_actual = TxbBuscar.value;
  }
  EventoTecla(event?: any, tabla?: TableComponent) {
    if (event.key == "Enter" || event.type == "click") {
      this.AplicarFiltro();
      tabla?.ActualizarTabla();
    }
  }
  EventoTeclaFiltroSkus(filtros_div: HTMLDivElement, tabla?: TableComponent) {
    this.AplicarFiltroBusqueda(filtros_div, tabla);
  }

  RestablecerBusqueda() {
    this.core.busqueda_actual = 'TODOS_PRODUCTOS';
  }

  DescargarExcel(TipoTabla: string, tabla: HTMLTableElement) {
    var Excel_Exportado: XLSX.WorkSheet = XLSX.utils.table_to_sheet(tabla);

    var libro: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, Excel_Exportado, 'Ventas - Soles');
    if (this.core.codigo_local == 'NO') {
      if (this.core.Empresa_Actual == 'DECOR') {
        XLSX.writeFile(libro, `${TipoTabla} - DSB - ${this.core.Categoria_actual} - S(${this.core.semana_inicial} - ${this.core.semana_final}) - General.xlsx`);
      } else {
        XLSX.writeFile(libro, `${TipoTabla} - KNT - ${this.core.Categoria_actual} - S(${this.core.semana_inicial} - ${this.core.semana_final}) - General.xlsx`);
      }
    } else {
      if (this.core.Empresa_Actual == 'DECOR') {
        XLSX.writeFile(libro, `${TipoTabla} - DSB - ${this.core.Categoria_actual} - S(${this.core.semana_inicial} - ${this.core.semana_final}) - ${this.core.ubicacion_local}.xlsx`);
      } else {
        XLSX.writeFile(libro, `${TipoTabla} - KNT - ${this.core.Categoria_actual} - S(${this.core.semana_inicial} - ${this.core.semana_final}) - ${this.core.ubicacion_local}.xlsx`);
      }
    }
  }

  CambiarYear(html_seleccion_year: HTMLSelectElement) {
    this.core.Year_Actual = html_seleccion_year.value;
  }
  CambiarSemanaRangos(html_semana_inicial: HTMLSelectElement, html_semana_final: HTMLSelectElement) {
    this.core.semana_inicial = Number(html_semana_inicial.value);
    this.core.semana_final = Number(html_semana_final.value);
  }
  invertirArray(arr: any[]) {
    const longitud = arr.length;
    const arrayInvertido = [];

    for (let i = longitud - 1; i >= 0; i--) {
      arrayInvertido.push(arr[i]);
    }
    return arrayInvertido;
  }
  Construir_breadcump_empresa() {
    if (this.core.Empresa_Actual == 'KANTU') {
      this.Construir_breadcump('Soles', 'Tienda Promart', 'Listelo');
    } else {
      this.Construir_breadcump('Soles', 'Tienda Promart', 'Perfiles');
    }
  }
  ngOnInit(): void {
    this.ObtenerListaCategorias(this.core.Empresa_Actual);
    this.Construir_breadcump_empresa();
    this.years = [];
    var years_none: string[] = [];
    this.api.ObtenerYears().subscribe((data: any) => {
      (data["years"] as []).forEach(year => {
        years_none.push(year)
      })
      this.years = this.invertirArray(years_none);
      this.core.Year_Actual = this.years[0];
      this.api.ObtenerSemanas(this.core.Year_Actual, this.core.Empresa_Actual, this.core.Tienda_Actual).subscribe(
        (data: any) => {
          this.core.DT_Semanas = data["semanas"]
          this.core.semana_inicial = this.core.DT_Semanas.length - 8;
          this.core.semana_final = this.core.DT_Semanas.length;
        }
      );
    });

    var BtnDescargarResumen = document.getElementById('BtnDescargarResumen') as HTMLElement;
    var BtnDescargarDatos = document.getElementById('BtnDescargarDatos') as HTMLElement;

    BtnDescargarResumen.addEventListener('click', () => {
      this.DescargarExcel('R', document.getElementById('tabla_resumen') as HTMLTableElement);
    });
    BtnDescargarDatos.addEventListener('click', () => {
      this.DescargarExcel('D', document.getElementById('tabla_detallada') as HTMLTableElement);
    });

    this.EstablecerLocales();

    var html_tienda_soles = document.querySelectorAll('#html_tienda_soles');

    var html_tienda_cantidad = document.querySelectorAll('#html_tienda_cantidad');
    if (this.core.tipo_dato == 'Soles') {
      html_tienda_soles.forEach(
        (html_tienda, i) => {
          if (this.core.Tienda_Actual == html_tienda.innerHTML) {
            !html_tienda.classList.contains('active') ? html_tienda.classList.toggle('active') : '';
          } else {
            html_tienda.classList.contains('active') ? html_tienda.classList.toggle('active') : '';
          }
        }
      );
    }
    if (this.core.tipo_dato == 'Piezas') {
      html_tienda_cantidad.forEach(
        (html_tienda, i) => {
          if (this.core.Tienda_Actual == html_tienda.innerHTML) {
            !html_tienda.classList.contains('active') ? html_tienda.classList.toggle('active') : '';
          } else {
            html_tienda.classList.contains('active') ? html_tienda.classList.toggle('active') : '';
          }
        }
      );
    }

    var BtnSeleccion = document.getElementById('BtnSeleccion') as HTMLButtonElement;
    BtnSeleccion.addEventListener('click', () => {
      var cuadros: NodeListOf<HTMLInputElement> = document.querySelectorAll('#html_locales');
      if (BtnSeleccion.innerHTML == 'Desmarcar todo') {
        cuadros.forEach((cuadro: HTMLInputElement) => {
          cuadro.checked = false;
        });
        BtnSeleccion.innerHTML = 'Marcar todo';
      } else {
        cuadros.forEach((cuadro: HTMLInputElement) => {
          cuadro.checked = true;
        });
        BtnSeleccion.innerHTML = 'Desmarcar todo';
      }
    })
  }

  CambiarTienda(tienda: string, tipo_dato: string) {
    this.core.Tienda_Actual = tienda;
    this.core.tipo_dato = tipo_dato;
    this.core.Categoria_actual = 'TODO_CATEGORIAS';

    var html_tienda_soles = document.querySelectorAll('#html_tienda_soles');
    var html_tienda_cantidad = document.querySelectorAll('#html_tienda_cantidad');


    if (this.core.tipo_dato == 'Soles') {
      html_tienda_cantidad.forEach(
        html_tienda => {
          html_tienda.classList.contains('active') ? html_tienda.classList.toggle('active') : '';
        }
      );
      html_tienda_soles.forEach(
        (html_tienda, i) => {
          if (this.core.Tienda_Actual == html_tienda.innerHTML) {
            !html_tienda.classList.contains('active') ? html_tienda.classList.toggle('active') : '';
          } else {
            if (this.core.Tienda_Actual == 'TODAS_TIENDAS' && i == 0) {
              !html_tienda.classList.contains('active') ? html_tienda.classList.toggle('active') : '';
            } else {
              html_tienda.classList.contains('active') ? html_tienda.classList.toggle('active') : '';
            }
          }
        }
      );
    }
    if (this.core.tipo_dato == 'Piezas') {
      html_tienda_soles.forEach(
        html_tienda => {
          html_tienda.classList.contains('active') ? html_tienda.classList.toggle('active') : '';
        }
      );
      html_tienda_cantidad.forEach(
        (html_tienda, i) => {
          if (this.core.Tienda_Actual == html_tienda.innerHTML) {
            !html_tienda.classList.contains('active') ? html_tienda.classList.toggle('active') : '';
          } else {
            if (this.core.Tienda_Actual == 'TODAS_TIENDAS' && i == 0) {
              !html_tienda.classList.contains('active') ? html_tienda.classList.toggle('active') : '';
            } else {
              html_tienda.classList.contains('active') ? html_tienda.classList.toggle('active') : '';
            }
          }
        }
      );
    }
  }
  activarBotonUltimaCategoria() {
    var contador = 0;
    var botones = document.getElementById('allCategories') as HTMLDivElement;
    this.core.botonActivoDecor = 'TODO_CATEGORIAS';
    this.core.botonActivoKantu = 'TODO_CATEGORIAS';
    /* Array.from(botones.querySelectorAll('button')).forEach((boton:HTMLButtonElement,index: number) => {
      boton.classList.remove('active')
      const ultimoBoton = botones.querySelector('button:last-child');
      ultimoBoton?.classList.add('active');
    }); */
    this.destargetearBotonesTipologias();
  }
  destargetearBotonesTipologias() {
    var filtroTipologias: NodeListOf<HTMLInputElement> = document.querySelectorAll('.tipologia');
    filtroTipologias.forEach(element => {
      element.checked = false;
    });
  }
}
