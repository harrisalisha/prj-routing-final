import { Router } from '@angular/router';
import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, tap } from "rxjs/operators";
import { throwError, BehaviorSubject } from "rxjs";
import { User } from "./user.model";

export interface AuthResponseData{
  kind: string;
  email: string;
  idToken: string;
  refreshToken:	string;
  expiresIn: string;
  localId: string;
  registered ?: boolean;
}//? is optimal

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<User>(null);//give immediate access
  token : string = null;
  private tokenExpirationTimer : any;

  constructor(private http: HttpClient,
    private router: Router){}


  signup(email: string, password: string){
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDiPfOutCzXePpJwHVWHO895MvmTFlgJqQ',
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    )
    .pipe(catchError(this.handleError), tap(resData => {
      this.handleAuthentication(
        resData.email,
        resData.localId,
        resData.idToken,
        +resData.expiresIn
      );
    }));
  }

  login(email: string, password: string){
    return this.http.post<AuthResponseData>(
     'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDiPfOutCzXePpJwHVWHO895MvmTFlgJqQ',
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    )
    .pipe(catchError(this.handleError), tap(resData => {
      this.handleAuthentication(
        resData.email,
        resData.localId,
        resData.idToken,
        +resData.expiresIn
      );
    }));
  }

  autoLogin(){
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } =JSON.parse(localStorage.getItem('userData'));//parse json obj and confort to js obj
    if(!userData){
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );
    if(loadedUser.token){
      this.user.next(loadedUser);//this is login user
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }


  logout(){
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if( this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number){
    this.tokenExpirationTimer = setTimeout(()=> {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(email: string , userId: string, token: string, expiresIn: number){
    const expirationDate = new Date(
      new Date().getTime()+ expiresIn * 1000
      );//getTime millisecond jan1970
    const user = new User( email, userId, token, expirationDate);

    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));//confort jsobject to string
  }

  private handleError(errorRes: HttpErrorResponse){
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND' :
        errorMessage = 'This email does not exist';
        break;
      case 'INVALID_PASSWORD':
      errorMessage = 'Please enter valid password!';
      break;
    }
    return throwError(errorMessage);
  }

}//return observable
//tap aloow us to perform operators with out changing the response
//Subject is .next() is emit data call or create data n log user in
//session life time before expires,authentication in localStorage in the browser or cookie
//getTime() to miliseconds
