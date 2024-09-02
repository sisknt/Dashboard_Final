import { Component, OnInit,AfterViewInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-tabla-comparativa-semana-year',
  templateUrl: './tabla-comparativa-semana-year.component.html',
  styleUrls: ['./tabla-comparativa-semana-year.component.css']
})
export class TablaComparativaSemanaYearComponent implements OnInit,AfterViewInit {
  InpAgregarProductos: string = 'inputAgregarProductos'
  selectedOption: string = '';
  constructor(private api: ApiService, public core: CoreService) { }
  ngAfterViewInit(): void {
  }
  DSemanas: string[] = [];
  getClass(index: number): string {
    return index % 2 === 0 ? 'even-group' : 'odd-group';
  }
  ngOnInit(): void {
    this.TipoDato = 'SOLES';
    this.CargarDatos();
    this.verificarEstadosBotones();
    this.obtenerFiltros();
    this.ObtenerSemanas();
  }
  SemI = 0;
  SemF = 0;
  CargarDatos() {
    this.VerificarParametros();
    console.log(this.ParametroCadena)
    if (this.core.semana_inicial !== 0 && this.core.semana_final !== 0) {
      this.ObtenerAPI(this.core.semana_inicial,this.core.semana_final)
    } else {
      this.api.ObtenerYears().subscribe((year: any) => {
        var years: string[] = year["years"]
        var yearmayor: number = 0;
        years.forEach(yer => {
          if (Number(yer) > yearmayor) {
            yearmayor = Number(yer);
          }
        });
        var semanas: number[] = [];
        this.api.ObtenerSemanas(yearmayor.toString(), this.core.Empresa_Actual, this.ParametroCadena).subscribe((response: any) => {
          (response["semanas"] as []).forEach((semana: string) => {
            semanas.push(Number(semana.split(' (')[0].split('m. ')[1]));
          });
          this.core.semana_inicial = semanas[semanas.length -1] - 8;
          this.core.semana_final = semanas[semanas.length -1];
          this.ObtenerAPI(this.core.semana_inicial,this.core.semana_final);
        });
      });
    }
  }
  ObtenerAPI(semI: number, semF: number) {
    this.MostrarOcultarTablaPlaceholder('habilite');
    this.api.ObtenerComparativoSemanalYear(this.core.Empresa_Actual, this.ParametroCadena, semI, semF).subscribe((respuesta: any) => {
      this.JLocales = respuesta["locales"];
      this.CrearSemanas(this.JLocales);
    });
  }
  CrearSemanas(MyJson: JsonLocales[]){
    this.DSemanas = [];
    MyJson.forEach(local => {
      local.ventas_actual.forEach(semana => {
        if (!this.DSemanas.includes("Semana "+semana.periodo.split(' (')[0].split('Sem. ')[1])) {
          this.DSemanas.push("Semana "+semana.periodo.split(' (')[0].split('Sem. ')[1])
        }
        if (this.YearActual !== Number(semana.periodo.split(' (')[1].split('-')[0])) {
          this.YearActual = Number(semana.periodo.split(' (')[1].split('-')[0]);
        } else {
          this.YearActual = this.YearActual;
        }
      });
    });
    this.ConstruirComparativo(MyJson);
  }
  ConstruirComparativo(MyJson: JsonLocales[]){
    this.JTotalesVentasPromart = [];
    this.JTotalesVentasSodimac = [];
    this.JTotalesVentasMaestro = [];
    for (let j = 0; j < this.DSemanas.length; j++) {
      let sumaAcumuladaActual = 0;
      let sumaAcumuladaAnterior = 0;
      let diferenciaPorcentual = 0;
      for (let i = 0; i < MyJson.length; i++) {
        sumaAcumuladaAnterior += MyJson[i].ventas_anterior[j].monto
        sumaAcumuladaActual += MyJson[i].ventas_actual[j].monto;
      }
      diferenciaPorcentual = ((sumaAcumuladaActual - sumaAcumuladaAnterior) / sumaAcumuladaActual) * 100;
      const TotalSemana: ComparativoVentas = {
        anterior: Math.floor(sumaAcumuladaAnterior),
        actual: Math.floor(sumaAcumuladaActual),
        diferencia: this.calcularDiferencia(sumaAcumuladaActual,sumaAcumuladaAnterior),
      }
      this.JTotalesVentasPromart.push(TotalSemana)
    }
    this.MostrarOcultarTablaPlaceholder('disabled');
  }
  YearActual: number = 0;
  JTotalesVentasPromart: ComparativoVentas[] = [];
  JTotalesVentasSodimac: ComparativoVentas[] = [];
  JTotalesVentasMaestro: ComparativoVentas[] = [];
  JLocales: JsonLocales[] = [];
  redondearAbajo(numero: number): number{
    return numero = Math.floor(numero)
  }
  calcularDiferencia(num1: number, num2: number): number{
    if (num1 === 0 && num2 >= 0) {
      return 100;
    }
    if (num1 >= 0 && num2 === 0){
      return -100;
    }
    num1 = Math.floor(num1)
    num2 = Math.floor(num2)
    let diferencia = 0;
    diferencia = ((num1 - num2) / num1) * 100;
    return Number(diferencia.toFixed(2))*-1;
  }
  MostrarOcultarTablaPlaceholder(estado: string){
    var TablaPrincipal = document.querySelector('#TablaPrincipal') as HTMLTableElement;
    var TablaHolder = document.querySelector('#TablaPlaceholder') as HTMLTableElement;
    if (estado === 'disabled') {
      TablaPrincipal.classList.remove('d-none')
      TablaHolder.classList.add('d-none')
    } else {
      TablaPrincipal.classList.add('d-none')
      TablaHolder.classList.remove('d-none')
    }
  }
  inputValue: string = '';
  DisposicionButtons: string = 'Activado';
  urlCadena: string[] = [];
  urlCategoria: string[] = [];
  urlZona: string[] = [];
  urlProducto: string[] = [];
  // Arrays Filtros
  FiltroCadena: string[] = [];
  FiltroCategoria: string[] = [];
  FiltroZona: string[] = [];
  // Arrays Datalist
  FiltroSku: string[] = [];
  FiltroCodigo: string[] = [];
  FiltroDescripcion: string[] = [];
  FiltroSemanas: string[] = [];
  DataListProductos: string[] = [];
  // Parametros
  ParametroGeneral: string = '';
  MiDataListProductos: FiltroProducto[] = [];
  // Parametros
  ParametroCadena: string = '';
  ParametroCategoria: string = '';
  ParametroZona: string = '';
  ParametroProducto: string = '';
  TipoDato = '';
  obtenerFiltros(){
    let Filtros: FiltroJson;
    this.api.ObtenerFiltrosComparativo(this.core.Empresa_Actual).subscribe((http: any)=>{
      Filtros = http;
      Filtros.cadenas.forEach(cadena => {
        this.urlCadena.push(cadena);
        this.FiltroCadena.push(cadena);
      });
      Filtros.categorias.forEach(categoria => {
        this.urlCategoria.push(categoria);
        this.FiltroCategoria.push(categoria);
      });
      Filtros.zonas.forEach(zona => {
        this.urlZona.push(zona);
        this.FiltroZona.push(zona);
      });
      Filtros.productos.forEach(producto => {
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
  ObtenerSemanas(){
    this.FiltroSemanas = [];
    this.api.ObtenerYears().subscribe((year: any) => {
      var years: string[] = year["years"]
      var yearmayor: number = 0;
      years.forEach(yer => {
        if (Number(yer) > yearmayor) {
          yearmayor = Number(yer);
        }
      });
      var misSemanas: number[] = [];
      this.core.Year_Actual = yearmayor.toString();
      this.api.ObtenerSemanas(this.core.Year_Actual, this.core.Empresa_Actual, this.ParametroCadena).subscribe((response: any) => {
        this.FiltroSemanas = response["semanas"];
        this.FiltroSemanas.forEach(sem => {
          misSemanas.push(Number(sem.split(' (')[0].split('m. ')[1]));
        });
        this.core.semana_inicial = misSemanas[misSemanas.length -1] - 8;
        this.core.semana_final = misSemanas[misSemanas.length -1];
      });
    });
  }
  onSelectChangeSemanaInicial(event: Event) {
    let selectedValue: string = (event.target as HTMLSelectElement).value;
    selectedValue = selectedValue.split(' (')[0].split('. ')[1];
    this.core.semana_inicial = Number(selectedValue);
    this.VerificarEstadoBtnGenerar();
  }
  onSelectChangeSemanaFinal(event: Event) {
    let selectedValue: string = (event.target as HTMLSelectElement).value;
    selectedValue = selectedValue.split(' (')[0].split('. ')[1];
    this.core.semana_final = Number(selectedValue);
    this.VerificarEstadoBtnGenerar();
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
  VerificarEstadoBtnRestablecerProducto(){
    const BtnRestablecerProducto = document.getElementById('BtnRestablecerProducto') as HTMLButtonElement;
    if (this.urlProducto.length > 0) {
      BtnRestablecerProducto.removeAttribute('disabled')
    } else {
      BtnRestablecerProducto.setAttribute('disabled', 'true');
    }
  }
  VerificarEstadoBtnGenerar(){
    const BtnGenerar = document.getElementById('BtnGenerar') as HTMLButtonElement;
    if (this.core.semana_inicial <= this.core.semana_final) {
      BtnGenerar.removeAttribute('disabled');
    } else {
      BtnGenerar.setAttribute('disabled', 'true');
    }
  }
  VerificarEstadoBtnAgregarProducto(texto?: string){
    const BtnAgregarProducto = document.getElementById('BtnAgregarProducto') as HTMLButtonElement;
    if (texto !== '') {
      BtnAgregarProducto.removeAttribute('disabled')
    } else {
      BtnAgregarProducto.setAttribute('disabled', 'true');
    }
  }
  verificarEstadosBotones(){
    this.VerificarEstadoBtnRestablecerProducto()
    this.VerificarEstadoBtnGenerar()
    this.VerificarEstadoBtnAgregarProducto()
  }
  onInputKeyup(event?: KeyboardEvent){
    let inputValue = (event?.target as HTMLInputElement).value; 
    let LblAlertProductosAgregadors = document.getElementById('LblAlertProductosAgregadors') as HTMLDivElement;
    let producto: string = (event?.target as HTMLInputElement).value;
    this.VerificarEstadoBtnAgregarProducto(producto)
    if (event) {
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
        this.selectedOption = '';
        this.VerificarEstadoBtnAgregarProducto(inputValue)
      }
    } else {
      LblAlertProductosAgregadors.innerHTML = '';
      this.ParametroProducto = '';
      if (this.selectedOption !== '') {
        if (!this.urlProducto.includes(this.selectedOption)) {
          this.urlProducto.push(this.selectedOption)
        }
      } else {
        const index = this.urlProducto.indexOf(this.selectedOption)
        if (index !== -1) {
          this.urlProducto.splice(index, 1)
        }
      }
      this.urlProducto.forEach(url => {
        this.ParametroProducto += `${url}+`;
        LblAlertProductosAgregadors.innerHTML = this.ParametroProducto;
      });
      this.selectedOption = '';
      this.VerificarEstadoBtnAgregarProducto(inputValue)
    }
    this.VerificarEstadoBtnRestablecerProducto();
    this.VerificarEstadoBtnGenerar();
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
    if (this.ParametroProducto === '') {
      this.ParametroProducto = 'TODOS_SKUS';
    }
  }
}
interface JsonLocales {
  id: number,
  codigo_local: string,
  local_tienda: string,
  zona: string,
  ventas_actual: JsonVentasActual[],
  ventas_anterior: JsonVentasAnterior[],
}
interface JsonVentasActual {
  periodo: string,
  monto: number,
  cantidad: number
}
interface JsonVentasAnterior {
  periodo: string,
  monto: number,
  cantidad: number
}
// Nuevo objeto
interface ComparativoVentas {
  anterior: number,
  actual: number,
  diferencia: number,
}
// Filtros
interface FiltroJson {
  cadenas: string[];
  categorias: string[];
  zonas: string[];
  productos: FiltroProducto[];
}
interface FiltroProducto {
  sku: string;
  codigo_interno: string;
  nombre: string;
}