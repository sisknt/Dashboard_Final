import { Component, OnInit } from '@angular/core';
import { grafics } from './graficos';

@Component({
  selector: 'app-stats-producto',
  templateUrl: './stats-producto.component.html',
  styleUrls: ['./stats-producto.component.css']
})
export class StatsProductoComponent implements OnInit {

  constructor(private grafic: grafics) { }

  pseudo_datos_cantidad: number[] = [33,25,18,26,6,40,43,-38,50,67,15,23,25,35,51,53,43,34,34,22,41,40,59,22,20,-17,41,46,28,47,60,30,54,128,21,32,11,31,30,78,43,-18,32,25,56,63,53,94,65,53,58,36,80]
  pseudo_datos_semanas: string[] = ['Sem. 1','Sem. 2','Sem. 3','Sem. 4','Sem. 5','Sem. 6','Sem. 7','Sem. 8','Sem. 9','Sem. 10','Sem. 11','Sem. 12','Sem. 13','Sem. 14','Sem. 15','Sem. 16','Sem. 17','Sem. 18','Sem. 19','Sem. 20','Sem. 21','Sem. 22','Sem. 23','Sem. 24','Sem. 25','Sem. 26','Sem. 27','Sem. 28','Sem. 29','Sem. 30','Sem. 31','Sem. 32','Sem. 33','Sem. 34','Sem. 35','Sem. 36','Sem. 37','Sem. 38','Sem. 39','Sem. 40','Sem. 41','Sem. 42','Sem. 43','Sem. 44','Sem. 45','Sem. 46','Sem. 47','Sem. 48','Sem. 49','Sem. 50','Sem. 51','Sem. 52','Sem. 53']
  datos_tienda_temporal_yaxis: number [] = [20, 40, 66, 78]
  datos_tienda_temporal_xaxis: string [] = ['Cassinelli','Sodimac','Maestro','Promart']

  ngOnInit(): void {
    this.randerizar_graficos();
  }

  randerizar_graficos() {
    this.grafic.barra_negativa_producto(this.pseudo_datos_cantidad,this.pseudo_datos_semanas);
    this.grafic.sparkline_resumen_porcentaje_tiendas(this.datos_tienda_temporal_yaxis, this.datos_tienda_temporal_xaxis);
  }

  actualizar_grafico() {
    var grafico_estadistica_producto_anual = document.getElementById('grafico_estadistica_producto_anual') as HTMLDivElement;
    grafico_estadistica_producto_anual.innerHTML = "";
    this.randerizar_graficos();
  }

  mostrar_ocultar_xaxis(){
    var HTML_mostrar_xaxis = document.getElementById('HTML_mostrar_xaxis') as HTMLDivElement;
    var HTML_mostrar_yaxis = document.getElementById('HTML_mostrar_yaxis') as HTMLDivElement;
    var HTML_btn_mostrar_ocultar_coordenada = document.getElementById('HTML_btn_mostrar_ocultar_coordenada') as HTMLButtonElement;
    HTML_mostrar_xaxis.classList.toggle('opacity-0')
    HTML_mostrar_yaxis.classList.toggle('opacity-0')
    if (HTML_btn_mostrar_ocultar_coordenada.innerHTML == 'Mostrar Coordenadas') {
      HTML_btn_mostrar_ocultar_coordenada.innerHTML = 'Ocultar Coordenadas';
    } else {
      HTML_btn_mostrar_ocultar_coordenada.innerHTML = 'Mostrar Coordenadas';
    }
  }
}
