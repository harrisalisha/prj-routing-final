import { Directive, ViewContainerRef } from "@angular/core";
import { ViewCompiler } from "@angular/compiler";

@Directive({
  selector: '[appPlaceholder]'
})
export class PlaceholderDirective {

  constructor(public viewContainerRef: ViewContainerRef){}


}
