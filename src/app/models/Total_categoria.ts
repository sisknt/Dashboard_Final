export default class TotalCategorias {
    categoria: string = '';
    total_soles: number = 0;
    tienda: string = '';

    constructor(
        categoria: string,
        total_soles: number,
        tienda: string,
    ) {
        this.categoria = categoria;
        this.total_soles = total_soles;
        this.tienda = tienda;
    }
}