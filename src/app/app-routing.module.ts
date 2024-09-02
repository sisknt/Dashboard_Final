import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResumenSolesComponent } from './dashboard/resumen-soles/resumen-soles.component';
import { GraficoSolesComponent } from './grafico-soles/grafico-soles.component';
import { LoginComponent } from './login/login.component';
import { ProductosComponent } from './productos/productos.component';
import { StatsProductoComponent } from './stats-producto/stats-producto.component';
import { VistaGeneralComponent } from './vista-general/vista-general.component';
import { ConsoleComponent } from './console/console.component';
import { MychartComponent } from './mychart/mychart.component';
import { TableGeneralComponent } from './dashboard/table-general/table-general.component';
import { TablaComparativaComponent } from './tabla-comparativa/tabla-comparativa.component';
import { TablaComparativaSemanaYearComponent } from './dashboard/tabla-comparativa-semana-year/tabla-comparativa-semana-year.component';
import { Resumen1Component } from './resumen1/resumen1.component';
import { TablaComparativaMesYearComponent } from './dashboard/tabla-comparativa-mes-year/tabla-comparativa-mes-year.component';
import { TagInputComponent } from './tag-input/tag-input.component';

const routes: Routes = [
  { path: '', component: VistaGeneralComponent },
  { path: 'tablas', component: ResumenSolesComponent },
  { path: 'stat1', component: StatsProductoComponent },
  { path: 'grafico-general', component: GraficoSolesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'console', component: ConsoleComponent },
  { path: 'grafico-comparativo-anual', component: MychartComponent },
  { path: 'comparativo-semanal-categorizado', component: TableGeneralComponent },
  { path: 'comparativo-semanal-agrupado', component: TablaComparativaComponent },
  { path: 'comparativo-semanal', component: TablaComparativaSemanaYearComponent },
  { path: 'comparativo-mensual', component: TablaComparativaMesYearComponent },
  { path: 'resumen1', component: Resumen1Component},
  { path: 'fetch', component: TagInputComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
