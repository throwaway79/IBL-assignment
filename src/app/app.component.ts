import { Component } from '@angular/core';
import { InputFormComponent } from './input-form/input-form.component';
import { WeatherTableComponent } from "./weather-table/weather-table.component";
import { ReportService } from './core/services/report.service';

@Component({
  selector: 'app-root',
  imports: [InputFormComponent, WeatherTableComponent],
  providers: [
    ReportService
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ibl-assignment';
}
