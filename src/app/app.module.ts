import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { LoginPageComponent } from './login-page/login-page.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { PMRChartComponent } from './pmr-chart/pmr-chart.component';
import { NgChartsModule } from 'ng2-charts';
import { LabelingComponent } from './labeling/labeling.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    SignupComponent,
    DashboardComponent,
    PMRChartComponent,
    LabelingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
