import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import { TsStyleThemeTypes } from './../utilities/types/style-theme.types';


/**
 * Define the structure of the date range object used by {@link TsDateRangeComponent}
 */
export interface TsDateRange {
  /**
   * The start date of the range
   */
  start: Date | null;

  /**
   * The end date of the range
   */
  end: Date | null;
}


/**
 * This is the date-range UI Component
 *
 * #### QA CSS CLASSES
 * - `qa-date-range`: The primary component container
 * - `qa-date-range-start-datepicker`: The start date {@link TsDatepickerComponent}
 * - `qa-date-range-end-datepicker`: The end date {@link TsDatepickerComponent}
 *
 * @example
 * <ts-date-range
 *              endMaxDate="{{ new Date(2017, 4, 30) }}"
 *              endMinDate="{{ new Date(2017, 4, 1) }}"
 *              endInitialDate="{{ new Date(2017, 4, 10) }}"
 *              separator="~"
 *              startingView="months"
 *              startMaxDate="{{ new Date(2017, 4, 30) }}"
 *              startMinDate="{{ new Date(2017, 4, 1) }}"
 *              startInitialDate="{{ new Date(2017, 4, 10) }}"
 *              [dateFormGroup]="myForm.get('dateRange')"
 *              (startSelected)="myMethod($event)"
 *              (endSelected)="myMethod($event)"
 *              (dateSelected)="myMethod($event)"
 * ></ts-date-range>
 *
 * <example-url>https://goo.gl/ieUPaG</example-url>
 */
@Component({
  selector: 'ts-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.scss'],
  host: {
    class: 'ts-date-range',
  },
  encapsulation: ViewEncapsulation.None,
})
export class TsDateRangeComponent implements OnInit {
  /**
   * Getter to return the date range as an object
   *
   * @return The current date range
   */
  private get dateRange(): TsDateRange {
    return {
      start: this.startDate || null,
      end: this.endDate || null,
    };
  }

  /**
   * Store the selected end date
   */
  public endDate!: Date;

  /**
   * Provide quick access to the endDate form control
   */
  public get endDateControl(): AbstractControl {
    const ctrl: AbstractControl | null = this.dateFormGroup.get('endDate');
    return (this.dateFormGroup && ctrl) ? ctrl : this.fallbackEndDateControl;
  }

  /**
   * Expose the minimum date for the endDate
   */
  public _endMinDate$: BehaviorSubject<Date> = new BehaviorSubject(new Date());

  /**
   * Define the end date placeholder
   */
  public endPlaceholder: string = 'Select end date';

  /**
   * Define a fallback control in case one is not passed in
   */
  private fallbackStartDateControl: FormControl = new FormControl();

  /**
   * Define a fallback control in case one is not passed in
   */
  private fallbackEndDateControl: FormControl = new FormControl();

  /**
   * Store the selected start date
   */
  public startDate!: Date;

  /**
   * Provide quick access to the startDate form control
   */
  public get startDateControl(): AbstractControl {
    const ctrl: AbstractControl | null = this.dateFormGroup.get('startDate');
    return (this.dateFormGroup && ctrl) ? ctrl : this.fallbackStartDateControl;
  }

  /**
   * Expose the maximum date for the startDate
   */
  public _startMaxDate$: BehaviorSubject<Date> = new BehaviorSubject(new Date());

  /**
   * Define the start date placeholder
   */
  public startPlaceholder: string = 'Select start date';

  /**
   * Define the max date for the end date
   */
  @Input()
  public endMaxDate!: Date;

  /**
   * Define the min date for the end date
   */
  @Input()
  public endMinDate!: Date;

  /**
   * Define the initial date for the end date
   */
  @Input()
  public endInitialDate!: Date;

  /**
   * Define the separator between the two date inputs
   */
  @Input()
  public separator: string = '-';

  /**
   * Define the starting view for both datepickers
   */
  @Input()
  public startingView: 'month' | 'year' = 'month';

  /**
   * Define the max date for the starting date
   */
  @Input()
  public startMaxDate!: Date;

  /**
   * Define the min date for the starting date
   */
  @Input()
  public startMinDate!: Date;

  /**
   * Define the initial date for the starting date
   */
  @Input()
  public startInitialDate!: Date;

  /**
   * Define the form group to attach the date range to
   */
  @Input()
  public dateFormGroup!: FormGroup | AbstractControl;

  /**
   * Output the start date when selected
   */
  @Output()
  public startSelected: EventEmitter<Date> = new EventEmitter();

  /**
   * Output the end date when selected
   */
  @Output()
  public endSelected: EventEmitter<Date> = new EventEmitter();

  /**
   * Output the selected date range as {@link TsDateRange}
   */
  @Output()
  public selectedDate: EventEmitter<TsDateRange> = new EventEmitter();

  /**
   * Define the component theme
   */
  @Input()
  public theme: TsStyleThemeTypes = 'primary';


  /**
   * Seed initial date range values
   */
  public ngOnInit(): void {
    // Seed values from @Inputs
    this.seedDateRange(this.startInitialDate, this.endInitialDate);

    // Seed values from a passed in form group
    if (this.dateFormGroup) {
      this.seedWithFormValues(this.dateFormGroup);
    }
  }


  /**
   * Seed the date range with initial values
   *
   * @param start - The initial start date
   * @param end - The initial end date
   */
  private seedDateRange(start: Date | null, end: Date | null): void {
    if (start) {
      this.startDate = start;
    }

    if (end) {
      this.endDate = end;
    }
  }


  /**
   * Seed date values from a passed in form
   *
   * @param formGroup - The date form group
   */
  private seedWithFormValues(formGroup: FormGroup | AbstractControl): void {
    if (!formGroup || !formGroup.get('startDate') || !formGroup.get('endDate')) {
      return;
    }
    const startControl: AbstractControl | null = formGroup.get('startDate');
    const endControl: AbstractControl | null = formGroup.get('endDate');
    const startValue: Date | null = startControl ? startControl.value : null;
    const endValue: Date | null = endControl ? endControl.value : null;

    // istanbul ignore else
    if (startValue) {
      this.startInitialDate = startValue;
      this._endMinDate$.next(this.startInitialDate);
    }

    // istanbul ignore else
    if (endValue) {
      this.endInitialDate = endValue;
      this._startMaxDate$.next(this.endInitialDate);
    }
  }


  /**
   * Emit the selected start date and date range
   *
   * @param datepickerEvent - The event received from the range start event
   * {@link TsDatepickerComponent}
   */
  public startDateSelected(datepickerEvent: MatDatepickerInputEvent<Date>): void {
    if (datepickerEvent && datepickerEvent.value) {
      this._endMinDate$.next(datepickerEvent.value);
      this.startDate = datepickerEvent.value;

      // Update the form value if a formGroup was passed in
      // istanbul ignore else
      if (this.dateFormGroup && this.startDateControl) {
        this.startDateControl.setValue(datepickerEvent.value);
      }

      this.startSelected.emit(datepickerEvent.value);
      this.selectedDate.emit(this.dateRange);
    } else {
      // If no startDate was selected, reset to the original endMinDate
      this._endMinDate$.next(this.endMinDate);
    }
  }


  /**
   * Emit the selected end date and date range
   *
   * @param datepickerEvent - The event received from the range end event
   * {@link TsDatepickerComponent}
   */
  public endDateSelected(datepickerEvent: MatDatepickerInputEvent<Date>): void {
    if (datepickerEvent && datepickerEvent.value) {
      this._startMaxDate$.next(datepickerEvent.value);
      this.endDate = datepickerEvent.value;

      // Update the form value if a formGroup was passed in
      // istanbul ignore else
      if (this.dateFormGroup && this.endDateControl) {
        this.endDateControl.setValue(datepickerEvent.value);
      }

      this.endSelected.emit(datepickerEvent.value);
      this.selectedDate.emit(this.dateRange);
    } else {
      // If no endDate was selected, reset to the original startMaxDate
      this._startMaxDate$.next(this.startMaxDate);
    }
  }

}
