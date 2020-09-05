import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy{
  private userSub : Subscription;
  isAuthenticated = false;

  constructor(private dataStorageService: DataStorageService,
    private authService: AuthService,
    private router: Router){}

  ngOnInit(){
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated =  !!user;//!user ? false : true
      console.log(!user);
      console.log(!!user);
    });
  }

  onSaveData(){
    this.dataStorageService.storeRecipes();
  }
  onFetchData(){
    this.dataStorageService.fetchrecipes().subscribe();
  }

  onLogout(){
    this.authService.logout();
    this.router.navigate(['/auth']);
  }

  ngOnDestroy(){
    this.userSub.unsubscribe();
  }

}
