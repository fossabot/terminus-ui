import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatRippleModule } from '@angular/material/core';

import { TsTooltipModule } from './../tooltip/tooltip.module';
import { TsIconModule } from './../icon/icon.module';
import { TsCopyComponent } from './copy.component';

export * from './copy.component';


@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    TsIconModule,
    MatRippleModule,
    TsTooltipModule,
  ],
  exports: [
    TsCopyComponent,
  ],
  declarations: [
    TsCopyComponent,
  ],
})
export class TsCopyModule {}
