import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { CoreService } from 'src/app/services/core.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tabla-comparativa-mes-year',
  templateUrl: './tabla-comparativa-mes-year.component.html',
  styleUrls: ['./tabla-comparativa-mes-year.component.css']
})
export class TablaComparativaMesYearComponent implements OnInit, AfterViewInit {

  constructor(public api: ApiService, public core: CoreService) { }
  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.obtenerFiltros();
    this.VerificarParametros();
    this.cargar_semana();
    this.TipoDeDato = 'SOLES';
    /* this.VerificarEstadoBtnGenerar(); */
    this.VerificarEstadoBtnAgregarProducto('');
    this.VerificarEstadoBtnRestablecerProducto();
  }

  escribir(valor :string){
    //console.log(valor)
  }
  Filtros: FiltroJson = {
    cadenas: [],
    categorias: [],
    zonas: [],
    ubicaciones:[],
    productos:[]
  };
  mes_inicial = '2000-01'
  mes_final = '2000-12'
  MesI: string = '00';
  MesF: string = '00';
  FiltroCadena: string[] = [];
  inputValue: string = '';
  DisposicionButtons: string = 'Activado';
  CheckBoxLocales: boolean = true;
  urlCadena: string[] = [];
  urlCategoria: string[] = [];
  urlZona: string[] = [];
  urlLocal: string[] = [];
  urlProducto: string[] = [];
  // Arrays Filtros
  FiltroCategoria: string[] = [];
  FiltroZona: string[] = [];
  FiltroLocales: string[] = [];
  FiltroSku: string[] = [];
  FiltroCodigo: string[] = [];
  FiltroDescripcion: string[] = [];
  // Arrays Datalist
  DataListProductos: string[] = [];
  // Parametros
  ParametroGeneral: string = '';
  MiDataListProductos: FiltroProducto[] = [];
  // Parametros
  ParametroCadena: string = '';
  ParametroCategoria: string = '';
  ParametroZona: string = '';
  ParametroLocal: string = '';
  ParametroProducto: string = '';
  TipoDeDato: string = '';
  YearActual: number = 0;
  Meses: number[] = [];
  PeriodosActual: string[] = [];
  PeriodosAnterior: string[] = [];
  TotalesDeVentasActual: number[] = [];
  TotalesDeVentasAnterior: number[] = [];
  cargar_semana(){
    this.VerificarParametros();
    if (this.MesI > this.MesF) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "La fecha inicial no puede ser mayor que la fecha final",
      });
    } else {
      if (this.MesI !== '00' && this.MesF !== '00') {
        this.ObtenerAPI(this.MesI,this.MesF)
      } else {
        this.api.ObtenerYears().subscribe((year: any) => {
          var years: string[] = year["years"];
          var yearmayor: number = 0;
          years.forEach(yer => {
            if (Number(yer) > yearmayor) {
              yearmayor = Number(yer);
            }
          });
          var semanas: number[] = [];
          this.core.Year_Actual = yearmayor.toString();
          this.YearActual = yearmayor;
          this.api.ObtenerSemanas(this.core.Year_Actual, this.core.Empresa_Actual, this.ParametroCadena).subscribe((response: any) => {
            this.MesI = response["semanas"][0].split(' al')[0].split('-')[1]
            this.mes_inicial = `${response["semanas"][0].split(' al')[0].split('(')[1].split('-')[0]}-${response["semanas"][0].split(' al')[0].split('(')[1].split('-')[1]}`
            this.MesF = response["semanas"][response["semanas"].length -1].split(' al')[0].split('-')[1];
            this.mes_final = `${response["semanas"][response["semanas"].length -1].split('al ')[1].split('-')[0]}-${response["semanas"][response["semanas"].length -1].split('al ')[1].split('-')[1]}`
            this.ObtenerAPI(this.MesI,this.MesF);
          });
        });
      } 
    }
  }
  ComparativoVentas?: VentasData;
  ObtenerAPI(MesI: string, MesF: string) {
    var numMesI: number = Number(MesI);
    var numMesF: number = Number(MesF);
    var newMesI: string = this.core.ConvertirMesTexto2(numMesI);
    var newMesF: string = this.core.ConvertirMesTexto2(numMesF);
    this.api.ObtenerComparativoMensualYear(this.core.Empresa_Actual, this.core.Year_Actual, newMesI, newMesF, this.ParametroLocal).subscribe((respuesta: any) => {
      //console.log(MesI, MesF);
      this.ComparativoVentas = respuesta["ventas"];
      this.construirMesesPeriodos(this.ComparativoVentas);
      this.contruirComparativo(this.ComparativoVentas);
    });
  }
  contruirComparativo(Json?: VentasData){
    this.TotalesDeVentasActual = [];
    this.TotalesDeVentasAnterior = [];
    this.PeriodosActual.forEach((periodo,i) => {
      var acumuladoActual: number = 0;
      var acumuladoAnterior: number = 0;
      acumuladoActual += Json!.year_actual.maestro[i].monto;
      acumuladoActual += Json!.year_actual.promart[i].monto;
      acumuladoActual += Json!.year_actual.sodimac[i].monto;
      this.TotalesDeVentasActual.push(acumuladoActual);
      
      acumuladoAnterior += Json!.year_anterior.maestro[i].monto;
      acumuladoAnterior += Json!.year_anterior.promart[i].monto;
      acumuladoAnterior += Json!.year_anterior.sodimac[i].monto;
      this.TotalesDeVentasAnterior.push(acumuladoAnterior);
    });
  }
  construirMesesPeriodos(Json?: VentasData){
    this.Meses = [];
    this.PeriodosActual = [];
    this.PeriodosAnterior = [];
    Json?.year_actual.maestro.forEach(meses => {
      if (!this.Meses.includes(Number(meses.mes))) {
        this.Meses.push(Number(meses.mes));
      }
      if (!this.PeriodosActual.includes(meses.rango_mes)) {
        this.PeriodosActual.push(meses.rango_mes);
      }
    });
    Json?.year_actual.promart.forEach(meses => {
      if (!this.Meses.includes(Number(meses.mes))) {
        this.Meses.push(Number(meses.mes));
      }
      if (!this.PeriodosActual.includes(meses.rango_mes)) {
        this.PeriodosActual.push(meses.rango_mes);
      }
    });
    Json?.year_actual.sodimac.forEach(meses => {
      if (!this.Meses.includes(Number(meses.mes))) {
        this.Meses.push(Number(meses.mes));
      }
      if (!this.PeriodosActual.includes(meses.rango_mes)) {
        this.PeriodosActual.push(meses.rango_mes)
      }
    });
    Json?.year_anterior.maestro.forEach(meses => {
      if (!this.PeriodosAnterior.includes(meses.rango_mes)) {
        this.PeriodosAnterior.push(meses.rango_mes)
      }
    });
    Json?.year_anterior.promart.forEach(meses => {
      if (!this.PeriodosAnterior.includes(meses.rango_mes)) {
        this.PeriodosAnterior.push(meses.rango_mes)
      }
    });
    Json?.year_anterior.sodimac.forEach(meses => {
      if (!this.PeriodosAnterior.includes(meses.rango_mes)) {
        this.PeriodosAnterior.push(meses.rango_mes)
      }
    });
  }
  funcionSuma(num1:number | undefined,num2:number | undefined,num3:number | undefined){
    num1 = Number(num1!.toFixed(2))
    num2 = Number(num2!.toFixed(2))
    num3 = Number(num3!.toFixed(2))
    return Number(num1+num2+num3);
  }
  VerificarParametros() {
    if (this.ParametroCadena === '') {
      this.ParametroCadena = 'TODAS_TIENDAS';
    }
    if (this.ParametroCategoria === '') {
      this.ParametroCategoria = 'TODAS_CATEGORIAS';
    }
    if (this.ParametroZona === '') {
      this.ParametroZona = 'TODAS_ZONAS';
    }
    if (this.ParametroLocal === '') {
      this.ParametroLocal = 'TODOS_LOCALES';
    }
    if (this.ParametroProducto === '') {
      this.ParametroProducto = 'TODOS_SKUS';
    }
  }
  BuscarProductos() {
    const ArrayProductos: string[] = this.core.SepararElementosDesdeTexto(this.ParametroProducto);
    const ParametroSKU: string[] = [];
    this.MiDataListProductos.forEach(producto => {
      if (ArrayProductos.includes(producto.sku) || ArrayProductos.includes(producto.codigo_interno) || ArrayProductos.includes(producto.nombre)) {
        if (!ParametroSKU.includes(producto.sku)) {
          ParametroSKU.push(producto.sku)
        }
      }
    });
    this.ParametroProducto = '';
    ParametroSKU.forEach(url => {
      this.ParametroProducto += `${url}+`;
    });
    this.ParametroProducto = this.ParametroProducto.slice(0, -1);
  }
  onCheckBoxChangeCadenas(event: any, cadena: string) {
    cadena = cadena.toUpperCase();
    this.ParametroCadena = '';
    if (event.target.checked) {
      if (!this.urlCadena.includes(cadena)) {
        this.urlCadena.push(cadena);
      }
    } else {
      const index = this.urlCadena.indexOf(cadena);
      if (index !== -1) {
        this.urlCadena.splice(index, 1);
      }
    }
    this.urlCadena.forEach(url => {
      this.ParametroCadena += `${url}+`;
    })
    this.ParametroCadena = this.ParametroCadena.slice(0, -1);
    this.VerificarEstadoBtnGenerar();
  }
  onCheckboxChangeCategorias(event: any, categoria: string) {
    categoria = categoria.toUpperCase();
    this.ParametroCategoria = '';
    if (event.target.checked) {
      if (!this.urlCategoria.includes(categoria)) {
        this.urlCategoria.push(categoria)
      }
    } else {
      const index = this.urlCategoria.indexOf(categoria);
      if (index !== -1) {
        this.urlCategoria.splice(index, 1)
      }
    }
    this.urlCategoria.forEach(url => {
      this.ParametroCategoria += `${url}+`
    })
    this.ParametroCategoria = this.ParametroCategoria.slice(0, -1);
    //console.log(this.ParametroCategoria)
    this.VerificarEstadoBtnGenerar();
  }
  onCheckboxChangeLocales(event: any, local: string) {
    local = local.toUpperCase();
    this.ParametroLocal = '';
    if (event.target.checked) {
      if (!this.urlLocal.includes(local)) {
        this.urlLocal.push(local)
      }
    } else {
      const index = this.urlLocal.indexOf(local);
      if (index !== -1) {
        this.urlLocal.splice(index, 1)
      }
    }
    this.urlLocal.forEach(url => {
      this.ParametroLocal += `${url}+`
    })
    this.ParametroLocal = this.ParametroLocal.slice(0, -1);
    this.VerificarEstadoBtnGenerar();
  }
  DeseleccionarCheckBoxLocales() {
    if (this.CheckBoxLocales == true) {
      this.urlLocal = []
      this.ParametroLocal = '';
      this.CheckBoxLocales = false
    } else {
      this.CheckBoxLocales = true;
      this.Filtros.ubicaciones.forEach(local => {
        this.urlLocal.push(local.codigo)
      })
      this.ParametroLocal = 'TODOS_LOCALES';
    }
  }
  onCheckboxChangeZonas(event: any, zona: string) {
    zona = zona.toUpperCase();
    this.ParametroZona = '';
    if (event.target.checked) {
      if (!this.urlZona.includes(zona)) {
        this.urlZona.push(zona)
      }
    } else {
      const index = this.urlZona.indexOf(zona);
      if (index !== -1) {
        this.urlZona.splice(index, 1)
      }
    }
    this.urlZona.forEach(url => {
      this.ParametroZona += `${url}+`;
    });
    this.ParametroZona = this.ParametroZona.slice(0, -1);
    //console.log(this.ParametroZona);
    this.VerificarEstadoBtnGenerar();
  }
  LimpiarParametroProductos(){
    var InpAgregarProductos = document.getElementById('InpAgregarProductos') as HTMLButtonElement;
    var LblAlertProductosAgregadors = document.getElementById('LblAlertProductosAgregadors') as HTMLDivElement;
    InpAgregarProductos.value = '';
    this.ParametroProducto = '';
    this.urlProducto = [];
    LblAlertProductosAgregadors.innerHTML = 'Click en "Agregar" para añadir productos a buscar...';
    this.VerificarEstadoBtnRestablecerProducto();
    this.VerificarEstadoBtnGenerar();
  }
  onSelectChangeSemanaInicial(event: Event) {
    const selectedValue: string = (event.target as HTMLInputElement).value;
    const yearMonthParts = selectedValue.split('-');
    const selectedYear = yearMonthParts[0];
    const selectedMonth = yearMonthParts[1].padStart(2, '0'); // Asegura dos dígitos para el mes
    this.MesI = selectedMonth;
    //console.log(this.MesI);
  }
  
  onSelectChangeSemanaFinal(event: Event) {
    let selectedValue: string = (event.target as HTMLInputElement).value;
    this.MesF = selectedValue.split('-')[1];
    //console.log(this.MesF);
  }
  VerificarEstadoBtnRestablecerProducto(){
    /* const BtnRestablecerProducto = document.getElementById('BtnRestablecerProducto') as HTMLButtonElement;
    if (this.urlProducto.length > 0) {
      BtnRestablecerProducto.removeAttribute('disabled')
    } else {
      BtnRestablecerProducto.setAttribute('disabled', 'true');
    } */
  }
  onInputKeyup(event?: KeyboardEvent){
    let inputValue = document.getElementById('InpAgregarProductos') as HTMLInputElement; 
    let LblAlertProductosAgregadors = document.getElementById('LblAlertProductosAgregadors') as HTMLDivElement;
    let producto: string = (event?.target as HTMLInputElement).value;
    if (event) {
      this.VerificarEstadoBtnAgregarProducto(producto)
      if (event.key === 'Enter') {
        this.ParametroProducto = '';
        LblAlertProductosAgregadors.innerHTML = '';
        if (producto !== '') {
          if (!this.urlProducto.includes(producto)) {
            this.urlProducto.push(producto)
          }
        } else {
          const index = this.urlProducto.indexOf(producto)
          if (index !== -1) {
            this.urlProducto.splice(index, 1)
          }
        }
        this.urlProducto.forEach(url => {
          this.ParametroProducto += `${url}+`;
          LblAlertProductosAgregadors.innerHTML = this.ParametroProducto;
        });
        inputValue.value = ''
        this.VerificarEstadoBtnAgregarProducto(inputValue.value)
      }
    } else {
      LblAlertProductosAgregadors.innerHTML = '';
      this.ParametroProducto = '';
      if (producto !== '') {
        if (!this.urlProducto.includes(inputValue.value)) {
          this.urlProducto.push(inputValue.value)
        }
      } else {
        const index = this.urlProducto.indexOf(inputValue.value)
        if (index !== -1) {
          this.urlProducto.splice(index, 1)
        }
      }
      this.urlProducto.forEach(url => {
        this.ParametroProducto += `${url}+`;
        LblAlertProductosAgregadors.innerHTML = this.ParametroProducto;
      });
      inputValue.value = ''
      this.VerificarEstadoBtnAgregarProducto(inputValue.value)
    }
    this.VerificarEstadoBtnRestablecerProducto();
    this.VerificarEstadoBtnGenerar();
  }
  VerificarEstadoBtnAgregarProducto(texto?: string){
    /* const BtnAgregarProducto = document.getElementById('BtnAgregarProducto') as HTMLButtonElement;
    if (texto !== '') {
      BtnAgregarProducto.removeAttribute('disabled')
    } else {
      BtnAgregarProducto.setAttribute('disabled', 'true');
    } */
  }
  VerificarEstadoBtnGenerar(){
    const BtnGenerar = document.getElementById('BtnGenerar') as HTMLButtonElement;
    if (this.urlCadena.length > 0) {
      BtnGenerar.removeAttribute('disabled');
    } else {
      BtnGenerar.setAttribute('disabled', 'true');
    }
  }
  obtenerFiltros(){
    this.api.ObtenerFiltrosComparativo(this.core.Empresa_Actual).subscribe((http: any)=>{
      this.Filtros = http;
      this.Filtros.cadenas.forEach(cadena => {
        this.urlCadena.push(cadena);
        this.FiltroCadena.push(cadena);
      });
      this.Filtros.categorias.forEach(categoria => {
        this.urlCategoria.push(categoria);
        this.FiltroCategoria.push(categoria);
      });
      this.Filtros.ubicaciones.forEach(local => {
        this.urlLocal.push(local.local_tienda);
      });
      this.Filtros.productos.forEach(producto => {
        this.FiltroSku.push(producto.sku);
        this.FiltroCodigo.push(producto.codigo_interno);
        this.FiltroDescripcion.push(producto.nombre);
        const miproducto: FiltroProducto = {
          sku: producto.sku,
          codigo_interno: producto.codigo_interno,
          nombre: producto.nombre
        };
        this.MiDataListProductos.push(miproducto)
      });
      this.FiltroDescripcion.forEach(uni => {
        this.DataListProductos.push(uni)
      });
      this.FiltroSku.forEach(uni => {
        this.DataListProductos.push(uni);
      })
      this.FiltroCodigo.forEach(uni => {
        this.DataListProductos.push(uni)
      });
    });
  }
  calcularDiferencia(num1: number, num2: number): number{
    if (num1 === 0 && num2 >= 0) {
      return 100;
    }
    if (num1 >= 0 && num2 === 0){
      return -100;
    }
    num1 = Number(num1.toFixed(2));
    num2 = Number(num2.toFixed(2));
    let diferencia = 0;
    diferencia = ((num1 - num2) / num1) * 100;
    return Number(diferencia.toFixed(2))*-1;
  }
}
interface ComparativoVentas{
  cadena: string,
  mes: string,

}
interface FiltroProducto {
  sku: string;
  codigo_interno: string;
  nombre: string;
}
interface FiltroJson {
  cadenas: string[];
  categorias: string[];
  zonas: string[];
  ubicaciones: ubicaciones[];
  productos: FiltroProducto[];
}
interface ubicaciones {
  cadena: string;
  codigo: string;
  local_tienda: string;
  zona: string;
}
interface VentaItem {
  rango_mes: string;
  mes: string;
  monto: number;
  cantidad: number;
}

interface VentasData {
  year_actual: {
    promart: VentaItem[],
    sodimac: VentaItem[],
    maestro: VentaItem[],
  },
  year_anterior: {
    promart: VentaItem[],
    sodimac: VentaItem[],
    maestro: VentaItem[],
  }
}

// Nuevo objeto
interface ComparativoVentas {
  anterior: number,
  actual: number,
  diferencia: number,
}
