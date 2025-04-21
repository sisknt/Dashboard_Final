import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class grafics {
    constructor() {

    }
    barra_negativa_producto(P_datos: number[], P_meses: string[]) {
        var options = {
            series: [{
                name: '',
                data: P_datos
            }],
            chart: {
                type: 'bar',
                height: '100%',
                width: '100%',
                offsetX: -14,
                animations: {
                    enabled: true,
                    easing: 'easeout',
                    speed: 800,
                    animateGradually: {
                        enabled: true,
                        delay: 1000
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 350
                    }
                }
            },
            plotOptions: {
                bar: {
                    columnWidth: '40%',
                    borderRadius: 5,
                    colors: {
                        ranges: [{
                            from: -1000,
                            to: -0,
                            // rojo
                            color: '#F14F87',
                        }],
                    },
                }
            },
            colors: ['#504BFF'],
            markers: {
                colors: ["#FFFFFF"]
            },
            fill: {
                opacity: 1,
            },
            dataLabels: {
                enabled: false,
            },
            xaxis: {
                categories: P_meses,
                labels: {
                    style: {
                        colors: ['#383874'],
                        fontSize: '12px',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 400,
                        cssClass: 'apexcharts-yaxis-label',
                    },
                    rotate: -90
                },
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                },
            },
            yaxis: {
                labels: {
                    show: true,
                    align: 'right',
                    minWidth: 0,
                    maxWidth: 160,
                    style: {
                        colors: [],
                        fontSize: '12px',
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        fontWeight: 400,
                        cssClass: 'apexcharts-yaxis-label',
                    },
                    offsetX: 10,
                    offsetY: 0,
                    rotate: 0,
                },
            },
            grid: {
                borderColor: 'transparent'
            },
        };

        // var chart = new ApexCharts(document.querySelector("#grafico_estadistica_producto_anual"), options);
        // chart.render();
    }

    sparkline_resumen_porcentaje_tiendas(P_yaxis: number[], P_xaxis: string[]) {
        var options6 = {
            series: [{
                data: P_yaxis
            }],
            chart: {
                type: 'bar',
                height: '100%',
                with: '100%',
                sparkline: {
                    enabled: true
                },
                animations: {
                    enabled: true,
                    easing: 'linear',
                    speed: 800,
                    animateGradually: {
                        enabled: true,
                        delay: 1000
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 350
                    }
                }
            },
            plotOptions: {
                bar: {
                    barHeight: '30%',
                    horizontal: true,
                    borderRadius: 2,
                    distributed: true,
                }
            },
            xaxis: {
                categories: P_xaxis,
                crosshairs: {
                    width: 1
                },
            },
            colors: ['#00B929', '#669AFF', '#FE7E7D', '#FF9065'],
            tooltip: {
                fixed: {
                    enabled: false
                },
                x: {
                    show: false
                },
                y: {
                    title: {
                        formatter: function () {
                            return ''
                        }
                    }
                },
                marker: {
                    show: false
                }
            }
        };

        var chart6 = new ApexCharts(document.querySelector("#grafic_resumen_producto_anual"), options6);
        chart6.render();
    }
}