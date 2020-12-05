import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'
import { AngularFireModule } from '@angular/fire'


import { AppComponent } from './app.component';
import { appRoutingModule } from './app-routing.module';
import { CourseComponent } from './components/course/course.component';
import { HomeComponent } from './components/home/home.component';
import { UserhomeComponent } from './components/userhome/userhome.component';
import { TimetableuiComponent } from './components/timetableui/timetableui.component'
import { AdminhomeComponent } from './components/adminhome/adminhome.component';
import { FirebaseService } from './services/firebase.service';

@NgModule({
  declarations: [
    AppComponent,
    CourseComponent,
    HomeComponent,
    UserhomeComponent,
    AdminhomeComponent,
    TimetableuiComponent

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    appRoutingModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyDlR4AZ2C60_M4kqrlVbpsglffzwsrJgeM",
      authDomain: "se3316lab5-594f3.firebaseapp.com",
      projectId: "se3316lab5-594f3",
      storageBucket: "se3316lab5-594f3.appspot.com",
      messagingSenderId: "738063438524",
      appId: "1:738063438524:web:9b2be7a7e45b05566ab6b9"
    })
  ],
  providers: [FirebaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
