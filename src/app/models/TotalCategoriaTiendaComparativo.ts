export interface TotalCategoriaTiendaComparativo {
    year: string;
    monto: number;
    cantidad: number;
    semanas_cabeceras: string[];
    categorias: {
        categoria: string;
        monto: number;
        cantidad: number;
        participacion: number;
        participacion_cantidad: number;
        semanas: {
            periodo: string;
            monto: number;
            cantidad: number;
        }[]
        tiendas: {
            tienda: string;
            monto: number;
            cantidad: number;
            participacion: number;
            participacion_cantidad: number;
            semanas: {
                periodo: string;
                monto: number;
                cantidad: number;
            }[]
        }[]
    }[]
}