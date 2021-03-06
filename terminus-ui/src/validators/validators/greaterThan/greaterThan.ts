import {
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { coerceNumberProperty } from '@terminus/ngx-tools/coercion';
import { isAbstractControl } from './../../../utilities/type-coercion/is-abstract-control';


/**
 * Return a validator function to verify the value is above a minimum value
 *
 * @param greaterThan - The minimum value
 * @return The validator function
 */
export function greaterThanValidator(minimum: number | AbstractControl = 0): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // Allow optional controls by not validating empty values
    if (!control || isNaN(control.value)) {
      return null;
   }

    if (isAbstractControl(minimum)) {
      return getValidationResult(minimum.value, control);
    } else {
      return getValidationResult(minimum, control);
    }
  };
}


/**
 * Return the validation result
 *
 * @param minimum - The minimum value
 * @param control - The control containing the current value
 * @return The difference in time
 */
function getValidationResult(minimum: number | undefined, control: AbstractControl): ValidationErrors | null {
  minimum = coerceNumberProperty(minimum);
  const invalidResponse: ValidationErrors = {
    greaterThan: {
      valid: false,
      greaterThan: minimum,
      actual: control.value,
    },
  };

  return (control.value > minimum) ? null : invalidResponse;
}
