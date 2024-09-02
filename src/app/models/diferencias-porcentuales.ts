export interface DiferenciasPorcentuales {
    diferencia_semanal: number;
    diferencia_tienda: {
        cadena: string;
        diferencia_procentual: number;
        diferencia_cantidad: number;
    }[];
    ventas: {
        year: string;
        monto: number;
        cantidad: number;
        semana_inicial: string;
        semana_final: string;
        cadenas: {
            cadena: string;
            monto: number;
            cantidad: number;
        }[];
    }[]
}
