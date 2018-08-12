import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { WebSocketService } from './business/web-socket.service';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './ui/dashboard/dashboard.component';
import { LogService } from './business/log.service';
import { DashboardService } from './ui/dashboard/dashboard.service';
import { CryptTableComponent } from './ui/crypt-table/crypt-table.component';
import { NewOrderFormComponent } from './ui/forms/new-order-form/new-order-form.component';
import { NewOrderFormService } from './ui/forms/new-order-form/new-order-form.service';
import { TimeoutPoolService } from './business/timeout-pool.service';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CryptTableComponent,
    NewOrderFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
  ],
  providers: [WebSocketService, LogService, DashboardService, NewOrderFormService, TimeoutPoolService],
  bootstrap: [AppComponent]
})
export class AppModule { }
