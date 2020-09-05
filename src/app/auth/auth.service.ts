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

  constructor(private http: HttpClient){}

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
    }
  }


  logout(){
    this.user.next(null);
  }

  private handleAuthentication(email: string , userId: string, token: string, expiresIn: number){
    const expirationDate = new Date(
      new Date().getTime()+ expiresIn * 1000
      );//getTime millisecond jan1970
    const user = new User( email, userId, token, expirationDate);

    this.user.next(user);
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
