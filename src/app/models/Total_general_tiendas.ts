export default class TotalGeneralTiendas {
    tienda: string = '';
    total: number = 0;

    constructor(
        tienda: string,
        total: number
    ) {
        this.tienda = tienda;
        this.total = total;
    }

    GetPorcentaje(total_tiendas:number): number {
        return (this.total * 100) / total_tiendas;
    }
}