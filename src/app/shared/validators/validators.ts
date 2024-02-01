import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";

function createValidatorWithMessage(
  validatorFn: ValidatorFn,
  message: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const validation = validatorFn(control);
    if (validation) {
      return { ...validation, message };
    }
    return null;
  };
}

export function customMinLength(minLength: number): ValidatorFn {
  return createValidatorWithMessage(
    Validators.minLength(minLength),
    `Minimum length should be ${minLength} characters.`
  );
}

export function required(): ValidatorFn {
  return createValidatorWithMessage(
    Validators.required,
    `This field is required.`
  );
}

export function email(): ValidatorFn {
  return createValidatorWithMessage(Validators.email, `Invalid email address.`);
}
