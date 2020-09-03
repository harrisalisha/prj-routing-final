import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";

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
    .pipe(
      catchError(errorRes => {
        let errorMessage = 'An unknown error occurred!';
        if (!errorRes.error || !errorRes.error.error) {
          return throwError(errorMessage);
        }
        switch (errorRes.error.error.message) {
          case 'EMAIL_EXISTS':
            errorMessage = 'This email exists already';
        }
        return throwError(errorMessage);
      })
    );
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
  }

}//return observable
