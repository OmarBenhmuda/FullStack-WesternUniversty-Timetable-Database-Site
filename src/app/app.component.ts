import { Component, OnInit } from '@angular/core';
import { FirebaseApp } from '@angular/fire';
import { AdminService } from './services/admin.service';
import { CourseService } from './services/course.service';
import { FirebaseService } from './services/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  updateUI() {
    const userData = JSON.parse(localStorage.getItem('user'))
    if (localStorage.getItem('user') !== null) {

      this.courseService.getUser(userData.email).subscribe(res => {
        this.name = res['name']
        this.type = res['type']
        if (this.type == 'admin') {
          this.isAdmin = true;
          this.isUser = false;
        }
        if (this.type == 'user') {
          this.isUser = true;
          this.isAdmin = false;
        }
      });
      this.isSignedIn = true
    }
    else {
      this.name = "";
      this.type = "";
      this.isSignedIn = false
      this.isAdmin = false;
      this.isUser = false;
    }
  }

  name: string;
  type: string;


  isAdmin = false;
  isUser = false;
  isSignedIn = false
  constructor(public firebaseService: FirebaseService, public courseService: CourseService, public adminService: AdminService) { }
  ngOnInit() {
    this.updateUI();

    console.log(this.type)
  }

  async signup() {
    const name = sanitize((<HTMLInputElement>document.getElementById("name")).value)
    const email = sanitize((<HTMLInputElement>document.getElementById("signup_email")).value)
    const password = sanitize((<HTMLInputElement>document.getElementById("signup_password")).value)
    const repassword = sanitize((<HTMLInputElement>document.getElementById("repassword")).value)


    if (name != "") {
      console.log(name)
      if (repassword === password) {
        await this.firebaseService.signup(email, password).then(() => {
          if (this.firebaseService.isLoggedIn) {
            this.isSignedIn = true
          }
          alert("Successfully signed up")
          const user = {
            email: email,
            name: name,
            timetables: [],
            type: "user"
          }
          this.courseService.addUser(user).subscribe();

          this.updateUI();
        }).catch(e => alert(e))

      } else {
        alert("passwords must match")
      }
    } else {
      alert("Enter a name")
    }
  }

  async signin() {
    console.log(localStorage.getItem('user'))
    const email = sanitize((<HTMLInputElement>document.getElementById("email")).value)
    const password = sanitize((<HTMLInputElement>document.getElementById("password")).value)

    await this.firebaseService.signin(email, password).then(() => {
      if (this.firebaseService.isLoggedIn) {
        this.isSignedIn = true
      }
      this.updateUI();
    }).catch(e => alert(e))


  }
  logout() {
    this.isSignedIn = false
    this.firebaseService.logout();

  }

  updatePassword() {
    const newpassword = sanitize((<HTMLInputElement>document.getElementById("newpassword")).value);
    this.firebaseService.updatePass(newpassword).catch(e => console.log(e));
  }


  makeAdmin() {
    const email = sanitize((<HTMLInputElement>document.getElementById("newAdminEmail")).value);
    this.adminService.makeAdmin({ email: email }).subscribe();

  }

  changeReviewVisibility() {
    const id = sanitize((<HTMLInputElement>document.getElementById("reviewid")).value);
    this.courseService.changeReviewVisibility({ id: id }).subscribe();
  }

  changeUserAccess() {

    const email = sanitize((<HTMLInputElement>document.getElementById("accessChangeEmail")).value);
    this.adminService.changeUserAccess({ email: email }).subscribe(res => {
      alert("Privaleges updated)")
    });
  }
}

//Video 12:34



function sanitize(string) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    "/": '&#x2F;',
  };
  const reg = /[&<>"'/]/ig;
  return string.replace(reg, (match) => (map[match]));
}
