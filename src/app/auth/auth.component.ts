import { Component, ComponentFactoryResolver, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService ,  AuthResponseData } from "./auth.service";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { AlertComponent} from '../shared/alert/alert.component';
import { PlaceholderDirective } from "../shared/placeholder/placeholder.directive";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  isLoginMode = true;
  error: string = null;
  isLoading = false;
  @ViewChild(PlaceholderDirective, {static: false}) alertHost : PlaceholderDirective;// we pass type

  constructor(private authService: AuthService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver){}

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm){
    //console.log(form.value);
    if(!form.valid){
      return;
    }
    const email= form.value.email;
    const password = form.value.password;

    let authObs : Observable< AuthResponseData>;

    this.isLoading = true;
    if(this.isLoginMode){
        authObs = this.authService.login(email, password);
    }else{
        authObs = this.authService.signup(email, password );
    }

    authObs.subscribe(resData => {
      console.log(resData);
      this.isLoading = false;
      this.router.navigate(['./recipes']);
    },
    errorMessage=> {
      console.log(errorMessage);
      //this.error = errorMessage;
      this.showErrorAlert(errorMessage);
      this.isLoading = false;
    });

    form.reset();
  }

  onhandleError(){
    this.error = null;
  }

  private showErrorAlert(message: string){
    //const alertCmp = new AlertComponent();//valid code not valid in angular
    //obj that knows how to create component
    const alertCmpFactory =
    this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;//obj that allow you to interact w the DOm
    hostViewContainerRef.clear();

    hostViewContainerRef.createComponent(alertCmpFactory);

  }

}
