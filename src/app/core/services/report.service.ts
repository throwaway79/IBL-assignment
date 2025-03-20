import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { FilterQuery, ReportCollection, ReportResponseItem } from '../models/report.model';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient) {}

  dataLoading = new Subject<boolean>();
  dataChanged = new Subject<ReportCollection>();

  getReport(filters: FilterQuery): Observable<any> {
    return this.http.post(environment.apiUrl, {
      id: "id",
      method: 'query',
      params: [
        {
          reportTypes: filters.messageTypes,
          stations: filters.airports,
          countries: filters.countries
        }
      ]
    })
  }

  /**
  * Create key-value pairs of place IDs and their corresponding reports
  */
  groupById(report: ReportResponseItem[]): ReportCollection {
    let output: ReportCollection = {};
    report.forEach(reportEntry => {
      let id = reportEntry.placeId.split(':')[1];
      let newEntry = {type: reportEntry.queryType, time: reportEntry.reportTime, body: ReportService.getHighlightedText(reportEntry.text)};
      if(output[id]) {
        output[id].push(newEntry);
      } else {
        output[id] = [newEntry]
      }
    })
    return output;
  }

  /**
  * Search for strings starting with 'BKN', 'FEW' or 'SCT' and highlight them based on the value of the following 3 digits
  */
  static getHighlightedText(body: string): string {
    let newBody = '';
    const greater = /\b(BKN|FEW|SCT)(3[1-9]|[4-9][0-9]|\d{3})\b/g;
    const lesserEqual = /\b(BKN|FEW|SCT)0?(?:[0-2][0-9]|30)\b/g;
    body.split(' ').forEach(word => {
      if(word.match(lesserEqual)) {
        newBody += ` <font color=\"blue\">${word}</font>`;
      } else if (word.match(greater)) {
        newBody += ` <font color=\"red\">${word}</font>`;
      } else {
        newBody += ` ${word}`;
      }
    })
    return newBody;
  }

}

