// tslint:disable: use-input-property-decorator triple-equals
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  isDevMode,
  OnDestroy,
  OnInit,
  Optional,
  ViewEncapsulation,
} from '@angular/core';
import { CanDisable, mixinDisabled } from '@angular/material/core';
import { coerceBooleanProperty } from '@terminus/ngx-tools/coercion';
import { untilComponentDestroyed } from '@terminus/ngx-tools';
import { CdkColumnDef } from '@angular/cdk/table';
import {
  merge,
} from 'rxjs';

import { TsSortDirective } from './sort.directive';
import { TsSortableItem } from './sort.directive';
import { TsSortHeaderIntl } from './sort-header-intl';
import { getSortHeaderNotContainedWithinSortError } from './sort-errors';
import { tsSortAnimations } from './sort-animations';


// Boilerplate for applying mixins to the sort header.
export class TsSortHeaderBase {}
export const _TsSortHeaderMixinBase = mixinDisabled(TsSortHeaderBase);


/**
 * Applies sorting behavior (click to change sort) and styles to an element, including an
 * arrow to display the current sort direction.
 *
 * Must be provided with an id and contained within a parent TsSortDirective.
 *
 * If used on header cells in a CdkTable, it will automatically default its id from its containing
 * column definition.
 */
@Component({
  // NOTE(B$): This component needs to be added to another component so we need a non-element
  // selector
  // tslint:disable: component-selector
  selector: '[ts-sort-header]',
  // tslint:enable: component-selector
  exportAs: 'tsSortHeader',
  templateUrl: './sort-header.component.html',
  styleUrls: ['./sort-header.component.scss'],
  host: {
    class: 'ts-sortable',
    '[class.ts-sort-header-sorted]': '_isSorted()',
    '[class.ts-sort-header-disabled]': '_isDisabled()',
    '(click)': '_handleClick()',
  },
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['disabled'],
  animations: [
    tsSortAnimations.indicator,
    tsSortAnimations.leftPointer,
    tsSortAnimations.rightPointer,
    tsSortAnimations.indicatorToggle,
  ],
})
export class TsSortHeaderComponent extends _TsSortHeaderMixinBase implements TsSortableItem, CanDisable, OnInit, OnDestroy  {
  /**
   * ID of this sort header. If used within the context of a CdkColumnDef, this will default to
   * the column's name.
   */
  // NOTE(B$): Renaming input so that we can pull a value from the primary directive
  // tslint:disable: no-input-rename
  @Input('ts-sort-header')
  id!: string;
  // tslint:enable: no-input-rename

  /**
   * Sets the position of the arrow that displays when sorted
   */
  @Input()
  arrowPosition: 'before' | 'after' = 'after';

  /**
   * Overrides the sort start value of the containing TsSort for this TsSortable
   */
  @Input()
  start!: 'asc' | 'desc';

  /**
   * Overrides the disable clear value of the containing TsSort for this TsSortable
   */
  @Input()
  get disableClear(): boolean {
    return this._disableClear;
  }
  set disableClear(v: boolean) {
    this._disableClear = coerceBooleanProperty(v);
  }
  private _disableClear!: boolean;


  /**
   * Check for _sort and set up auto-change-detection
   */
  constructor(
    public _intl: TsSortHeaderIntl,
    changeDetectorRef: ChangeDetectorRef,
    @Optional() public _sort: TsSortDirective,
    @Optional() public _cdkColumnDef: CdkColumnDef,
  ) {
    super();

    if (!_sort && isDevMode()) {
      throw getSortHeaderNotContainedWithinSortError();
    }

    // Mark directive for change detection after any of these changes
    merge(_sort.sortChange, _sort._stateChanges, _intl.changes)
      .pipe(
        untilComponentDestroyed(this),
      )
      .subscribe(() => changeDetectorRef.markForCheck());
  }


  /**
   * Default to cdk column name
   */
  public ngOnInit(): void {
    if (!this.id && this._cdkColumnDef) {
      this.id = this._cdkColumnDef.name;
    }

    this._sort.register(this);
  }


  /**
   * Deregister sort and unsubscribe from observables
   */
  public ngOnDestroy(): void {
    this._sort.deregister(this);
  }


  /**
   * Handles click events on the header
   */
  public _handleClick() {
    if (!this._isDisabled()) {
      this._sort.sort(this);
    }
  }


  /**
   * Whether this TsSortHeader is currently sorted in either ascending or descending order
   */
  public _isSorted() {
    return this._sort.active == this.id &&
        (this._sort.direction === 'asc' || this._sort.direction === 'desc');
  }


  /**
   * Whether this TsSortHeader is disabled
   */
  public _isDisabled() {
    return this._sort.disabled || this.disabled;
  }
}
