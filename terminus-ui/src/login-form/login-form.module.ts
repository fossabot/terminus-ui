import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { TsValidatorsService } from './../validators/validators.service';
import { TsInputModule } from './../input/input.module';
import { TsCheckboxModule } from './../checkbox/checkbox.module';
import { TsButtonModule } from './../button/button.module';
import { TsSpacingModule } from './../spacing/spacing.module';
import { TsLinkModule } from './../link/link.module';
import { TsLoginFormComponent } from './login-form.component';

export * from './login-form.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    TsInputModule,
    TsCheckboxModule,
    TsSpacingModule,
    TsButtonModule,
    TsLinkModule,
  ],
  providers: [
    TsValidatorsService,
  ],
  exports: [
    TsLoginFormComponent,
  ],
  declarations: [
    TsLoginFormComponent,
  ],
})
export class TsLoginFormModule {}
