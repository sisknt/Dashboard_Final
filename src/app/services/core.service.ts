import { Injectable } from '@angular/core';
import Locales from '../models/locales';
import TotalCategorias from '../models/Total_categoria';
import TotalGeneralTiendas from '../models/Total_general_tiendas';
import TotalGrafico from '../models/Total_grafico';
import Ventas from '../models/Ventas';
import VentasResumen from '../models/Ventas_resumen';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  constructor(private api: ApiService) { }


  DT_Semanas: string[] = [];

  token: string = "";

  Empresa_Actual: string = 'KANTU';
  Logo_actual: string = '../../assets/svg/logo-kantu.svg';
  Year_Actual: string = '0';
  Tienda_Actual: string = 'PROMART';
  tipo_dato: string = 'Soles';
  Categoria_actual: string = 'TODO_CATEGORIAS';

  //codigo_local: string = 'NO'; //sql
  codigo_local: string = 'TODOS_LOCALES'; //odoo
  ubicacion_local: string = '';
  locales_actuales: Locales[] = [];
  locales_url: string = 'TODOS_LOCALES';
  //busqueda_actual: string = 'NADA'; //sql
  busqueda_actual: string = 'TODOS_PRODUCTOS'; //odoo

  busqueda_50_50: string = '';
  busqueda_80_20: string = '';
  busqueda_95_5: string = '';


  usuario_actual: string = '';

  semana_inicial: number = 0;
  semana_final: number = 0;
  semana_inicial_primera_carga_resumen: number = 0;
  semana_final_primera_carga_resumen: number = 0;
  semana_inicial_primera_carga_principal: number = 0;
  semana_final_primera_carga_principal: number = 0;

  host: string = 'https://dashboard.ceramicaskantu.com';
  // host: string = 'http://localhost:10000';
  /* NUEVO CODIGO */
  botonActivoDecor: string = 'TODO_CATEGORIAS';
  botonActivoKantu: string = 'TODO_CATEGORIAS';
  breadcump1: string = 'Venta semanal en';
  breadcump2: string = '';
  breadcump3: string = '';
  breadcump4: string = '';
  paginaActiva: string = 'Activo';
  primeraCargaResumen: string = 'Cargado';
  primeraCargaPrincipal: string = 'Cargado';
  colores_categorias_eliminable: string[] = ["#614051", "#4aa201", "#019aa2", "#8f3d38", "#bd701f", "#335fbb", "#5300b0", "#7a5c3c", "#b21f57"];
  colores_categorias_estatico: string[] = ["#614051", "#4aa201", "#019aa2", "#8f3d38", "#bd701f", "#335fbb", "#5300b0", "#7a5c3c", "#b21f57"];
  ArrayDeProductosBuscar: string[] = [];
  ArraySKUsFiltros: string[] = [];
  /* host: string = 'http://192.168.1.119:10200'; */

  ConvertirMesTexto(numeroMes: number) {
    const meses = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Setiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    if (numeroMes >= 1 && numeroMes <= 12) {
      return meses[numeroMes - 1];
    } else {
      return "Número de mes inválido. Debe estar entre 1 y 12.";
    }
  }
  ConvertirMesTexto2(numeroMes: number) {
    const meses = ["01","02","03","04","05","06","07","08","09","10","11","12",];
    if (numeroMes >= 1 && numeroMes <= 12) {
      return meses[numeroMes - 1];
    } else {
      return "Número de mes inválido. Debe estar entre 1 y 12.";
    }
  }

  SetCategorias(data: any[], total_categorias: TotalCategorias[]) {
    data.forEach(
      total => {
        var total_periodo = new TotalCategorias(
          total["categoria"],
          total["total_soles"],
          total["tienda"]
        );
        total_categorias.push(total_periodo)
      }
    );
  }

  SetTotalesGrafico(data: any[], totales: TotalGrafico[]) {
    data.forEach(
      total => {
        var total_periodo = new TotalGrafico(
          total["semana"],
          total["precio_total"],
          total["cantidad_total"],
          total["periodo"]
        );
        totales.push(total_periodo)
      }
    );
  }

  SetTotalesGeneralTiendas(data: any[], totales: TotalGeneralTiendas[]) {
    data.forEach(
      total => {
        var total_tienda = new TotalGeneralTiendas(
          total["tienda"],
          total["total"],
        );
        totales.push(total_tienda)
      }
    );
  }

  GetTotalTiendas(totales: TotalGeneralTiendas[]) {
    var total_general: number = 0;
    totales.forEach(
      total => {
        total_general += Number(total);
      }
    );
    return total_general;
  }

  GetTotalGraficoPeriodos(totales: TotalGrafico[]) {
    var Periodos: string[] = [];
    totales.forEach(
      total => {
        Periodos.push(total.periodo)
      }
    );
  }
  GetTotalGraficoSemanas(totales: TotalGrafico[]) {
    var Periodos: string[] = [];
    totales.forEach(
      total => {
        Periodos.push(total.semana)
      }
    );
  }
  GetTotalGraficoVentas(totales: TotalGrafico[]) {
    var Periodos: string[] = [];
    totales.forEach(
      total => {
        Periodos.push(total.precio_total)
      }
    );
  }

  SetVentas(data: any[], Ventas_p: Ventas[]) {
    data.forEach(
      (venta, i) => {
        var Venta: Ventas = new Ventas(
          venta["sku"],
          venta["nombre"],
          venta["categoria"],
          venta["precio"],
          venta["fecha_inicial"],
          venta["fecha_final"],
          venta["semana"],
          venta["cantidad"],
          String(Math.floor(venta["soles"])),
          venta["periodo"],
          venta["tienda_venta"],
          venta["local"],
          venta["empresa"],
          venta["estado"]
        );
        Ventas_p.push(Venta);
      }
    );
  }

  SetVentasResumen(data: any[], Ventas_p: VentasResumen[]) {
    data.forEach(
      venta => {
        var Venta: VentasResumen = new VentasResumen(
          venta["cantidad"],
          venta["categoria"],
          venta["periodo"],
          venta["semana"],
          venta["tienda"],
        );
        Ventas_p.push(Venta)
      }
    );
  }

  SetSemanas(data: any[], DT_Semanas: string[], DT_SemanasNumeracion: string[]) {
    data.forEach(
      semana => {
        DT_Semanas.push(semana["periodo"]);
        DT_SemanasNumeracion.push(semana["semana"]);
      }
    );
  }

  ComaMiles(numero: number): string {
    return Intl.NumberFormat('es-MX').format(Number(numero.toFixed(0)));
  }

  CalcularPorcentaje(valor_porcentual: number, total: number) {
    return ((valor_porcentual * 100) / total).toFixed(2);
  }
  ordenarArrayAlfabeticamente(array: string[]): string[] {
    var sku: string[] = [];
    var name: string[] = [];
    var ArrayOrdenado: string[] = [];
    array.forEach(item => {
      if (!isNaN(Number(item))) {
        sku.push(item)
      } else {
        name.push(item)
      }
    })
    this.ordenarAlfabeticamente(name)
    this.ordenarAlfabeticamente(sku)
    return name.concat(sku);
  }
  ordenarAlfabeticamente(array: string[]): string[] {
    return array.sort();
  }
  Convertir2Decimales(numero: number) {
    return numero.toFixed(2)
  }
  ConvertirNumero(numero: string) {
    return Number(numero)
  }
  public FormatearNombrePropio(nombreCompleto: string) {
    if (typeof nombreCompleto !== 'string' || !nombreCompleto) {
      return "No es un String"
    } else {
      var nombrePropio = nombreCompleto.charAt(0).toUpperCase() + nombreCompleto.slice(1).toLowerCase();
      return nombrePropio;
    }
  }
  SepararElementosDesdeTexto(texto: string): string[] {
    const elementos: string[] = texto.split('+');
    return elementos.filter(elemento => elemento.trim() !== '');
  }
  SimplificarSemanasANumeros(texto: string) {
    const elemento1 = String(texto).split('. ')[1]
    const elementoFinal = String(elemento1).split(' (')[0]
    return elementoFinal;
  }
  SimplificarSemanas(semana_inicial: string, semana_final: string) {
    var simplificacion_semana: string = `Sem. ${semana_inicial.split(' ')[1]} - ${semana_final.split(' ')[1]}`;
    return simplificacion_semana;
  }
  SimplificarFechas(semana_inicial: string, semana_final: string) {
    var dia_mes_string_inicial = `${semana_inicial.split(' ')[2].split('(')[1].split('-')[2]}-${this.ConvertirMesTexto(Number(semana_inicial.split(' ')[2].split('(')[1].split('-')[1]))}`
    var dia_mes_string_final = `${semana_final.split(' ')[4].split(')')[0].split('-')[2]}-${this.ConvertirMesTexto(Number(semana_final.split(' ')[4].split(')')[0].split('-')[1]))}`
    var simplificacion_semana: string = `${dia_mes_string_inicial} - ${dia_mes_string_final}`;
    return simplificacion_semana
  }
  SimplificarSemana_columna(periodo: string): string[] {
    var fechas: string = periodo.split(' (')[1].split(')')[0];
    var fecha_inicial: string = `${fechas.split(' al ')[0].split('-')[2]} ${this.ConvertirMesTexto(Number(fechas.split(' al ')[0].split('-')[1]))}`;
    var fecha_final: string = `${fechas.split(' al ')[1].split('-')[2]} ${this.ConvertirMesTexto(Number(fechas.split(' al ')[0].split('-')[1]))}`;
    var salida: string[] = [periodo.split(' (')[0], `${fecha_inicial} - ${fecha_final}`];;
    return salida;
  }
  ConvertirMayuscula(texto: string) {
    if (typeof texto === 'string') {
      var mayus = String(texto)
      mayus = mayus.toUpperCase()
      return mayus;
    } else {
      return '';
    }
  }
}
