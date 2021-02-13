import { AbstractControl, FormGroup } from '@angular/forms';

export class FormsHelper {
  static setDisabledFormGroupControlsState(formGroup: FormGroup, disabled: boolean, exceptKeys: string[] = []): void {
    this.setDisabledControlsState(formGroup.controls, disabled, exceptKeys);
  }

  static setDisabledControlsState(controls: {[key: string]: AbstractControl}, disabled: boolean, exceptKeys: string[] = []): void {
    for (const controlKey in controls) {
      if (exceptKeys.includes(controlKey)) {
        continue;
      }

      const control = controls[controlKey];

      if (disabled && !control.disabled) {
        control.disable();
        continue;
      }

      if (!disabled && !control.enabled) {
        control.enable();
      }
    }
  }
}
