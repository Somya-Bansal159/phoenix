import { ViewChild } from '@angular/core';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatMenuTrigger } from '@angular/material/menu';
import { Subscription } from 'rxjs';
import { Vector3 } from 'three';

  @ViewChild(MatMenuTrigger) gridOptionsTrigger: MatMenuTrigger;

  
  cartesianPos = new Vector3(0, 0, 0);

  originChangedSub: Subscription = null;
  stopShiftingSub: Subscription = null;


  
  shiftCartesianGridByPointer(change: MatCheckboxChange) {
    this.eventDisplay
      .getUIManager()
      .shiftCartesianGridByPointer(change.checked);
    this.gridOptionsTrigger.closeMenu();
    this.originChangedSub = this.eventDisplay
      .getThreeManager()
      .originChanged.subscribe((intersect) => {
        this.translateGrid(intersect);
      });
    this.stopShiftingSub = this.eventDisplay
      .getThreeManager()
      .stopShifting.subscribe((stop) => {
        if (stop) {
          this.originChangedSub.unsubscribe();
          this.stopShiftingSub.unsubscribe();
        }
      });
  }

  shiftCartesianGridByValues(position: Vector3) {
    this.translateGrid(position);
    this.eventDisplay.getThreeManager().originChangedEmit(position);
  }

  private translateGrid(position: Vector3) {
    const finalPos = position;
    const initialPos = this.cartesianPos;
    const difference = new Vector3();
    difference.subVectors(finalPos, initialPos);
    this.eventDisplay.getUIManager().translateCartesianGrid(difference.clone());
    this.eventDisplay
      .getUIManager()
      .translateCartesianLabels(difference.clone());
    this.cartesianPos = finalPos;
  }



    if (this.originChangedSub != null) this.originChangedSub.unsubscribe();
    if (this.stopShiftingSub != null) this.stopShiftingSub.unsubscribe();
