import Venta from "./Venta";

export default class Producto_resumen {
    categoria: string = '';
    ventas: Venta[] = [];

    constructor(
        categoria: string,
        ventas: Venta[],
    ) {
        this.categoria = categoria;
        this.ventas = ventas;
    }

    GetTotal() {
        var Total: number = 0;
        this.ventas.forEach(
            venta => {
                Total += venta.cantidad
            }
        );
        return Total;
    }

    GetPromedio() {
        return this.GetTotal() / this.ventas.length;
    }

    GetParticipacion(total_general: number) {
        return ( (100 * this.GetTotal()) / total_general ).toFixed(2)
    }
}