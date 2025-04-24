import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class grafics {
    constructor() {

    }
    sparkline_resumen_categoria(P_periodo: number[]) {
        //console.log(P_periodo)
        var altura: number = 0;
        if (P_periodo.length == 3) {
            altura = 130;
        } else {
            altura = 170;
        }
        var Array: number[] = P_periodo;
        var options = {
            series: [{
                name: ['Soles'],
                data: Array
            }],
            chart: {
                height: altura,
                with: '100%',
                type: 'bar',
                background: "transparent",
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
                },
                sparkline: {
                    enabled: true
                },
            },
            grid: {
                borderColor: "#FFFFFF"
            },
            colors: ['#5E47FF', '#5E47FF', '#5E47FF'],
            plotOptions: {
                bar: {
                    barHeight: '30%',
                    distributed: true,
                    horizontal: true,
                    borderRadius: 5,
                }
            },
            dataLabels: {
                enabled: false,
                background: {
                    enabled: true,
                    foreColor: '#383874',
                    padding: 4,
                    borderRadius: 2,
                    borderWidth: 1,
                    borderColor: '#fff',
                    opacity: 0.9,
                    dropShadow: {
                        enabled: false,
                        top: 1,
                        left: 1,
                        blur: 1,
                        color: '#FFFFFF',
                        opacity: 0.45
                    },
                },
            },
            legend: {
                show: false
            },
            markers: {
                colors: ["#FFFFFF"]
            },
            xaxis: {
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                },
                categories: [
                    'Categoria 1', 'Categoria 2', 'Categoria 3',
                ],
                labels: {
                    style: {
                        colors: ['#5E47FF', '#5E47FF', '#5E47FF'],
                        fontSize: '12px'
                    }
                }
            },
            yaxis: {
                labels: {
                    show: false,
                    offsetX: 10,
                    style: {
                        colors: ['#8484A0'],
                        fontSize: '12px',
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        fontWeight: 300,
                        cssClass: 'apexcharts-yaxis-label',
                    },
                }
            },
        };

        var chart = new ApexCharts(document.querySelector("#grafic_resumen_categoria"), options);
        chart.render();
    }

    grafico_total_datos(P_n_periodo_datos_yaxis: number[], P_n_periodo_datos_xaxis: string[]) {
        var options = {
            series: [
                {
                    data: P_n_periodo_datos_yaxis
                }
            ],
            chart: {
                type: "bar",
                width: '100%',
                height: '100%',
                background: "#FFFFFF",
                zoom: {
                    enabled: false
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
                    columnWidth: '40%',
                    borderRadius: 5,
                }
            },
            dataLabels: {
                enabled: false
            },
            markers: {
                colors: ["#FFFFFF"]
            },
            fill: {
                type: "gradient",
                gradient: {
                    type: "vertical",
                    colorStops: [
                        [
                            {
                                offset: 0,
                                color: "#8676FF",
                                opacity: 1.0
                            },
                            {
                                offset: 100,
                                color: "#7D40FF",
                                opacity: 1.0
                            },
                        ]
                    ]
                }
            },
            xaxis: {
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                },
                labels: {
                    style: {
                        colors: "#aaa"
                    }
                },
                categories: P_n_periodo_datos_xaxis,
            },
            yaxis: {
                labels: {
                    show: true,
                    offsetX: -10,
                    style: {
                        colors: ['#8484A0'],
                        fontSize: '12px',
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        fontWeight: 300,
                        cssClass: 'apexcharts-yaxis-label',
                    },
                }
            },
            grid: {
                borderColor: "#FFFFFF"
            },
            tooltip: {
                enabled: true,
                custom: function ({ series, seriesIndex, dataPointIndex, w }: any) {
                    return (
                        `<div class="card-tooltip-general">
                            <div class="grafico-contenedor-tooltip d-flex ms-auto">
                                <div class="">
                                    <div class="row">
                                        <span class="grafic-tooltip-titulo">${w.globals.labels[dataPointIndex]}</span>
                                    </div>
                                    <div class="row">
                                        <span class="grafic-tooltip-descripcion">S/. ${series[seriesIndex][dataPointIndex]}</span>
                                    </div>
                                </div>
                            </div>
                        </div>`
                    );
                }
            },
        };

        var chart = new ApexCharts(document.querySelector("#grafico_total_datos"), options);
        chart.render();
    }
}