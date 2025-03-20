import { Component, OnDestroy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder, ValidationErrors } from '@angular/forms';
import { ReportService } from '../core/services/report.service';
import { HttpClientModule } from '@angular/common/http';
import { FilterQuery, MessageTypes, ReportResponseBody } from '../core/models/report.model';

@Component({
  standalone: true,
  selector: 'app-input-form',
  imports: [
    MatCardModule, 
    MatCheckboxModule, 
    HttpClientModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './input-form.component.html',
  styleUrl: './input-form.component.scss'
})
export class InputFormComponent implements OnDestroy {

  filterForm: FormGroup;
  messageTypes: string[] = Object.values(MessageTypes); 
  airports: string[] = ['LZIB', 'LKPR', 'EGLL']; //example values
  countries: string[] = ['SW', 'SZ', 'UN', 'JP', 'IY', 'SQ', 'PL', 'CZ'];
  selectedMessageTypes: string[] = [];

  constructor(private reportService: ReportService, private formBuilder: FormBuilder) {
    this.filterForm = this.formBuilder.group({
      messageTypes: new FormControl<string[]>([], Validators.required),
      airports: new FormControl<string[]>([]),
      countries: new FormControl<string[]>([]),
    }, { validator: [this.validateForm] });
  }

  validateForm(group: FormGroup): ValidationErrors | null {
    let formValue = group.value;
    if(!formValue.messageTypes?.length || (!formValue.airports?.length && !formValue.countries?.length)) {
      return { required: true };
    }
    return null;
  } 

  messageTypeChecked(event: any, item: string): void {
    if(event.checked) {
      this.selectedMessageTypes.push(item);
    } else {
      this.selectedMessageTypes = this.selectedMessageTypes.filter(type => type !== item);
    }
    this.filterForm.get('messageTypes')?.patchValue(this.selectedMessageTypes);
  }

  submitForm(): void {
    if(this.filterForm.invalid) {
      return;
    }
    this.reportService.dataChanged.next({});
    this.reportService.dataLoading.next(true);

    this.reportService.getReport(this.filterForm.value as FilterQuery).subscribe((report: ReportResponseBody) => {
      let payload = this.reportService.groupById(report.result);
      this.reportService.dataChanged.next(payload);
    })
  }

  ngOnDestroy(): void {
    this.reportService.dataChanged.unsubscribe();
    this.reportService.dataLoading.unsubscribe();
  }
}
