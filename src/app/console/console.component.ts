import { Component, ViewChild, OnInit } from '@angular/core';
import TotalGrafico from '../models/Total_grafico';
import { ApiService } from '../services/api.service';
import { CoreService } from '../services/core.service';
import { grafics } from '../dashboard/resumen-soles/graficos';
import { ConsoleService } from '../console.service';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ChartType,
} from "ng-apexcharts";
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.css']
})
export class ConsoleComponent implements OnInit {
  //@ViewChild('chart') chart!: ChartComponent;
  data_html: number[] = [10, 41, 35, 51, 49, 62, 69, 91, 148];
  TiposDeGrafico: ChartType[] = [
    'bar',
    'line',
    'area',
    'boxPlot',
    'bubble',
    'candlestick',
    'donut',
    'heatmap',
    'pie',
    'polarArea',
    'radar',
    'radialBar',
    'rangeArea',
    'rangeBar',
    'scatter',
    'treemap',
  ]
  cambiarDatos() {
    var datos: number[] = [];
    this.data_html.forEach(data => {
      datos.push(Math.floor(Math.random() * 100));
    });
    this.data_html = datos;
    this.updateSeries(this.data_html);
  }
  public updateSeries(yaxis: number[]) {
    this.chartOptions.series = [{
      data: yaxis
    }];
  }
  public updateXaxis(xaxis: string[]) {
    this.chartOptions.xaxis = {
      categories: xaxis
    }
  }
  public cambiarGrafico(tipoGrafico: ChartType) {
    this.chartOptions.chart = {
      type: tipoGrafico,
    }
  }
  agregarTendenciaLineal() {
    var puntosLineaTendencia = this.obtenerLineaTendenciaLineal(this.nuevoYaxis);
    var serie = [{
      name: 'Desktops',
      data: this.nuevoYaxis,
      type: 'bar'
    }, {
      name: 'Tendencia',
      data: puntosLineaTendencia,
      type: 'line'
    }]
    this.chartOptions.series = serie;
  }
  agregarTendenciaExponencial() {
    var puntosLineaTendencia = this.obtenerLineaTendenciaExponencial(this.nuevoYaxis);
    var serie = [{
      name: 'Desktops',
      data: this.nuevoYaxis,
      type: 'bar'
    }, {
      name: 'Tendencia',
      data: puntosLineaTendencia,
      type: 'line'
    }]
    console.log(puntosLineaTendencia)
    this.chartOptions.series = serie;
  }
  agregarTendenciaLogaritmica() {
    var puntosLineaTendencia = this.obtenerLineaTendenciaLogaritmica(this.nuevoYaxis);
    var serie = [{
      name: 'Desktops',
      data: this.nuevoYaxis,
      type: 'bar'
    }, {
      name: 'Tendencia',
      data: puntosLineaTendencia,
      type: 'line'
    }]
    console.log(puntosLineaTendencia)
    this.chartOptions.series = serie;
  }
  public chartOptions: ChartOptions = {
    series: [
      {
        name: "Desktops",
        data: this.data_html,
      },
    ],
    chart: {
      type: "line",
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [0]
    },
    stroke: {
      width: [0, 4],
      curve: "straight"
    },
    title: {
      text: "Product Trends by Month",
      align: "left"
    },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
        opacity: 0.5
      }
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep"
      ]
    }
  };

  constructor(private grafic: grafics, private api: ApiService, private core: CoreService, private console_service: ConsoleService) { }

  nuevoYaxis: number[] = [];
  nuevoXaxis: string[] = [];
  CargarDatosGrafico() {
    interface Datos {
      totales_semanales: {
        tienda: string;
        empresa: string;
        periodo: string;
        semana: number;
        total_cantidad: number;
        total_soles: number;
        categorias: {
          monto: number;
          cantidad: number;
          categoria: string;
        }[];
        lista_categorias: string[];
      }[];
    }
    var jData: Datos;

    this.api.ObtenertotalSemana(this.year_actual, 'DECOR', 1, 23, 'TODOS_LOCALES').subscribe(
      (data: any) => {
        jData = data;
        jData.totales_semanales.forEach(semanas => {
          this.nuevoYaxis.push(Math.floor(semanas.total_soles));
          this.nuevoXaxis.push(semanas.periodo);
        });
        this.updateXaxis(this.nuevoXaxis);
        this.updateSeries(this.nuevoYaxis);
      }
    );
  }
  year_actual = String(2023);
  ngOnInit(): void {
    this.year_actual = String(new Date().getFullYear());
  }
  obtenerLineaTendenciaLineal(y: number[]): number[] {
    const n = y.length;

    const sumX = n * (n + 1) / 2; // Sumatoria de los valores de x
    const sumY = y.reduce((acc, val) => acc + val, 0); // Sumatoria de los valores de y
    const sumXY = y.reduce((acc, val, i) => acc + (i + 1) * val, 0); // Sumatoria de los productos x*y
    const sumX2 = y.reduce((acc, _, i) => acc + (i + 1) ** 2, 0); // Sumatoria de los valores de x^2

    const pendiente = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX ** 2);
    const intercepto = (sumY - pendiente * sumX) / n;

    const lineaTendencia: number[] = [];

    for (let i = 0; i < n; i++) {
      const x = i + 1;
      const y = pendiente * x + intercepto;
      lineaTendencia.push(Number(y.toFixed(0)));
    }

    return lineaTendencia;
  }
  obtenerLineaTendenciaExponencial(datos: number[]): number[] {
    const puntos: number[] = [];
    // Calcular los valores X e Y para cada punto
    for (let i = 0; i < datos.length; i++) {
      const x = i + 1;
      const y = Math.log(datos[i]); // Aplicar logaritmo natural a los datos

      puntos.push(Math.floor(y));
    }

    return puntos;
  }
  obtenerLineaTendenciaLogaritmica(y: number[]): number[] {
    const n = y.length;

    // Calcular las sumatorias de ln(y) y x^2
    const sumLnY = y.reduce((acc, val) => acc + Math.log(val), 0);
    const sumX2 = y.reduce((acc, _, i) => acc + (i + 1) ** 2, 0);

    // Calcular la media de ln(y) y x^2
    const mediaLnY = sumLnY / n;
    const mediaX2 = sumX2 / n;

    // Calcular la pendiente (b) y el intercepto (a) de la línea de tendencia logarítmica
    const b = (sumLnY - n * mediaLnY) / sumX2;
    const a = Math.exp(mediaLnY - b * mediaX2);

    const lineaTendencia: number[] = [];

    for (let i = 0; i < n; i++) {
      const x = i + 1;
      const y = a * Math.log(x) + b;
      lineaTendencia.push(Number(y.toFixed(0)));
    }

    return lineaTendencia;
  }
}
