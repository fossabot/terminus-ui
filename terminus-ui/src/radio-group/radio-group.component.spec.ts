import {
  FormControl,
  Validators,
} from '@angular/forms';
import { ChangeDetectorRefMock } from '@terminus/ngx-tools/testing';

import {
  TsRadioGroupComponent,
  CUSTOM_RADIO_CONTROL_VALUE_ACCESSOR,
  TsRadioOption,
  TsRadioFormatFn,
} from './radio-group.component';


describe('TsRadioGroupComponent', () => {
  let component: TsRadioGroupComponent;
  let options: TsRadioOption[];

  beforeEach(() => {
    component = new TsRadioGroupComponent(
      new ChangeDetectorRefMock(),
    );
    options = [
      {
        foo: 'foo_value',
        bar: 'Foo Display',
        bing: 'Some helper text for my item',
      },
      {
        foo: 'bar_value',
        bar: 'Bar Display',
        bing: 'Some helper text for my item',
        disabled: true,
      },
      {
        foo: 'baz_value',
        bar: 'Baz Display',
        bing: 'Some helper text for my item',
      },
    ];
    component['changeDetectorRef'].markForCheck = jest.fn();
  });


  test(`should exist`, () => {
    expect(component).toBeTruthy();
  });


  describe(`Custom radio control value accessor`, () => {

    test(`should forward a reference to this component`, () => {
      expect(CUSTOM_RADIO_CONTROL_VALUE_ACCESSOR.useExisting()).toEqual(TsRadioGroupComponent);
    });

  });


  describe(`formatUILabelFn`, () => {

    test(`should return undefined if no value is passed in`, () => {
      // tslint:disable: prefer-const
      let foo;
      // tslint:enable: prefer-const
      expect(component.formatUILabelFn = foo as any).toEqual(undefined);
    });


    test(`should set/get the uiFormatFn`, () => {
      const myFn = (v: any) => v.id;
      component.formatUILabelFn = myFn;
      expect(component.formatUILabelFn).toEqual(myFn);
    });


    test(`should throw an error in dev mode when passed a value that is not a function`, () => {
      expect(() => {component.formatUILabelFn = 3 as any; })
        .toThrowError(`TsRadioGroupComponent: 'formatUILabelFn' must be passed a 'TsRadioFormatFn'.`);
    });

  });


  describe(`formatUISubLabelFn`, () => {

    test(`should return undefined if no value is passed in`, () => {
      // tslint:disable: prefer-const
      let foo;
      // tslint:enable: prefer-const
      expect(component.formatUISubLabelFn = foo as any).toEqual(undefined);
    });


    test(`should set/get the uiFormatFn`, () => {
      const myFn = (v: any) => v.id;
      component.formatUISubLabelFn = myFn;
      expect(component.formatUISubLabelFn).toEqual(myFn);
    });


    test(`should throw an error in dev mode when passed a value that is not a function`, () => {
      expect(() => {component.formatUISubLabelFn = 3 as any; })
        .toThrowError(`TsRadioGroupComponent: 'formatUISubLabelFn' must be passed a 'TsRadioFormatFn'.`);
    });

  });


  describe(`formatModelValueFn`, () => {

    test(`should return undefined if no value is passed in`, () => {
      // tslint:disable: prefer-const
      let foo;
      // tslint:enable: prefer-const
      expect(component.formatModelValueFn = foo as any).toEqual(undefined);
    });


    test(`should set/get the uiFormatFn`, () => {
      const myFn = (v: any) => v.id;
      component.formatModelValueFn = myFn;
      expect(component.formatModelValueFn).toEqual(myFn);
    });


    test(`should throw an error in dev mode when passed a value that is not a function`, () => {
      expect(() => {component.formatModelValueFn = 3 as any; })
        .toThrowError(`TsRadioGroupComponent: 'formatModelValueFn' must be passed a 'TsRadioFormatFn'.`);
    });

  });


  describe(`isRequired`, () => {

    test(`should return true if the form group is required`, () => {
      component.formControl = new FormControl(null, Validators.required);
      expect(component.isRequired).toEqual(true);
    });

    test(`should return false if the form group is not required`, () => {
      component.formControl = new FormControl();
      expect(component.isRequired).toEqual(false);
    });

  });


  describe(`name`, () => {

    test(`should set and retrieve the name value`, () => {
      expect(component.name).toEqual(expect.stringContaining('ts-radio-group'));
      component.name = 'foo';
      expect(component.name).toEqual('foo');
    });


    test(`should not change the name if no value was passed in`, () => {
      component.name = '' as any;
      expect(component.name).toEqual(expect.stringContaining('ts-radio-group'));
    });

  });


  describe(`isVisual`, () => {

    test(`should set and retrieve the visual value`, () => {
      expect(component.isVisual).toEqual(false);
      component.isVisual = true;
      expect(component.isVisual).toEqual(true);
    });


    test(`should set a boolean even if another value was passed in`, () => {
      expect(component.isVisual).toEqual(false);
      component.isVisual = 'foo' as any;
      expect(component.isVisual).toEqual(true);
    });

  });


  describe(`options`, () => {

    test(`should set and retrieve options`, () => {
      component.options = [
        {
          foo: 'bar',
          bar: 'baz',
        },
      ];
      expect(component.options[0].foo).toEqual('bar');
    });


    test(`should return undefined if no options were passed in`, () => {
      component.options = '' as any;
      expect(component.options).toEqual(undefined);
    });

  });


  describe(`ngOnInit`, () => {
    let ctrl: FormControl;

    beforeEach(() => {
      ctrl = new FormControl('foo');
      component.formControl = ctrl;
    });


    test(`should wire up change detection to fire after form control value changes`, () => {
      component.ngOnInit();
      ctrl.setValue('bar');

      expect(component['changeDetectorRef'].markForCheck).toHaveBeenCalled();
      expect(component.value).toEqual('bar');
    });

  });


  describe(`retrieveValue`, () => {

    test(`should use a formatter to return a value`, () => {
      const fn1: TsRadioFormatFn = (v) => v.foo;
      const val1: string | TsRadioOption = component.retrieveValue(options[0], fn1);
      expect(val1).toEqual('foo_value');

      const fn2: TsRadioFormatFn = (v) => v.bar;
      const val2: string | TsRadioOption = component.retrieveValue(options[1], fn2);
      expect(val2).toEqual('Bar Display');
    });

    test(`should return the option if no formatter was passed in`, () => {
      expect(component.retrieveValue(options[0])).toEqual(options[0]);
    });

  });

});
