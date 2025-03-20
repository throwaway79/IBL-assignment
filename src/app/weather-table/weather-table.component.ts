import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ReportService } from '../core/services/report.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ReportCollection } from '../core/models/report.model';

@Component({
  standalone: true,
  selector: 'app-weather-table',
  imports: [
    MatCardModule,
    CommonModule,
  ],
  providers: [
    DatePipe
  ],
  templateUrl: './weather-table.component.html',
  styleUrl: './weather-table.component.scss'
})
export class WeatherTableComponent implements OnInit, OnDestroy {

  constructor(private reportService: ReportService) {}

  tableData: ReportCollection = {};
  tableIds: string[] = [];
  loading: boolean = false;
  firstSearch: boolean = true;

  ngOnInit(): void {
    this.reportService.dataLoading.subscribe(() => {
      this.loading = true;
      this.firstSearch = false;
    })
    this.reportService.dataChanged.subscribe((reports) => {
      this.tableData = reports;
      this.tableIds = Object.keys(reports);
      this.loading = false;
    })
  }


  ngOnDestroy(): void {
    this.reportService.dataLoading.unsubscribe();
    this.reportService.dataChanged.unsubscribe();
  }
}
