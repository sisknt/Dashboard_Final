import Venta from "./Venta";

export default class Producto {
    sku: string = '';
    nombre: string = '';
    precio: string = '';
    participacion_acumulada: string = '';
    tipologia: string = '';
    ventas: Venta[] = [];
    categoria: string = '';
    estado: string = '';

    constructor(
        sku: string,
        nombre: string,
        precio: string,
        ventas: Venta[],
        categoria: string,
        estado: string
    ) {
        this.sku = sku;
        this.nombre = nombre;
        this.precio = precio;
        this.ventas = ventas;
        this.categoria = categoria;
        this.estado = estado;
    }

    GetTotal(tipo_dato: string): number {
        var Total: number = 0;
        this.ventas.forEach(
            venta => {
                if (tipo_dato == 'Soles') {
                    Total += venta.soles
                } else {
                    Total += venta.cantidad
                }
            }
        );
        return Total;
    }

    GetPromedio(tipo_datos: string) {
        return this.GetTotal(tipo_datos) / this.ventas.length;
    }

    GetParticipacion(total_general: number, tipo_datos: string) {
        return (100 * this.GetTotal(tipo_datos)) / total_general
    }
}