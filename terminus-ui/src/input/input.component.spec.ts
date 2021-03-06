// tslint:disable: no-non-null-assertion
import {
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import {
  FormControl,
  Validators,
} from '@angular/forms';
import { ChangeDetectorRefMock } from '@terminus/ngx-tools/testing';

import {
  TsInputComponent,
  CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR,
} from './input.component';


describe(`TsInputComponent`, () => {
  let component: TsInputComponent;

  beforeEach(() => {
    component = new TsInputComponent(
      new ChangeDetectorRefMock(),
      /*
       *{
       *  get: jest.fn().mockReturnValue({
       *    control: {
       *      disable: jest.fn(),
       *      enable: jest.fn(),
       *    },
       *  }),
       *} as Injector,
       */
    );
    component['changeDetectorRef'].markForCheck = jest.fn();
  });


  it(`should exist`, () => {
    expect(component).toBeTruthy();
  });


  describe(`Custom select control value accessor`, () => {

    it(`should forward a reference to this component`, () => {
      expect(CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR.useExisting()).toEqual(TsInputComponent);
    });

  });


  describe(`requiredAttribute`, () => {

    test(`should return 'required' when the form control is required`, () => {
      component.formControl = new FormControl(null, Validators.required);

      expect(component.requiredAttribute).toEqual('required');
    });


    test(`should return 'required' when 'isRequired' is true`, () => {
      component.isRequired = true;

      expect(component.requiredAttribute).toEqual('required');
    });


    test(`should return null when the input is not required`, () => {
      expect(component.requiredAttribute).toEqual(null);
    });

  });


  describe(`isDisabled`, () => {

    test(`should set the control to disabled`, () => {
      jest.useFakeTimers();
      component.matInput = {
        ngControl: {
          control: {
            enable: jest.fn(),
            disable: jest.fn(),
         },
        },
      } as any;
      expect(component.matInput.ngControl).toBeTruthy();
      expect(component.isDisabled).toEqual(false);

      component.isDisabled = true;
      jest.runAllTimers();

      expect(component.isDisabled).toEqual(true);
      expect(component.matInput.ngControl.control!.disable).toHaveBeenCalled();

      // Go back to enabled
      component.isDisabled = false;
      jest.runAllTimers();

      expect(component.isDisabled).toEqual(false);
      expect(component.matInput.ngControl.control!.enable).toHaveBeenCalled();
    });

  });


  describe(`type`, () => {

    test(`should get/set the type`, () => {
      expect(component.type).toEqual('text');
      component.type = 'number';
      expect(component.type).toEqual('number');
    });


    test(`should set the autocomplete value if the type is 'email'`, () => {
      component.type = 'email';
      expect(component.type).toEqual('email');
    });


    test(`should not set the type if no value was passed in`, () => {
      component.type = '' as any;
      expect(component.type).toEqual('text');
    });

  });


  describe(`reset()`, () => {

    it(`should clear the value`, () => {
      const VALUE = 'foo';
      component.cleared.emit = jest.fn();

      component.value = VALUE;
      expect(component.value).toEqual(VALUE);

      component.reset();
      expect(component.value).toEqual(null);
      expect(component.cleared.emit).toHaveBeenCalledWith(true);
      expect(component['changeDetectorRef'].markForCheck).toHaveBeenCalled();
    });

  });


  describe(`updateInnerValue`, () => {

    test(`should set the value and call the change detector`, () => {
      component['changeDetectorRef'].detectChanges = jest.fn();
      expect(component.value).toEqual('');

      component.updateInnerValue('foo');
      expect(component.value).toEqual('foo');
      expect(component['changeDetectorRef'].detectChanges).toHaveBeenCalled();
    });
  });


  describe(`ngOnChanges`, () => {

    test(`should register an onChange function`, () => {
      const changesMock = {
        formControl: new SimpleChange(new FormControl('foo'), undefined, false),
      } as SimpleChanges;
      component['registerOnChangeFn'] = jest.fn();

      component.ngOnChanges(changesMock);
      expect(component['registerOnChangeFn']).toHaveBeenCalledWith(component.updateInnerValue);
    });
  });


  describe(`registerOnChangeFn`, () => {

    test(`should register an onChange function`, () => {
      component.formControl = new FormControl();
      component.formControl.registerOnChange = jest.fn();

      component['registerOnChangeFn'](component.updateInnerValue);
      expect(component.formControl.registerOnChange).toHaveBeenCalledWith(component.updateInnerValue);
    });

  });

});
