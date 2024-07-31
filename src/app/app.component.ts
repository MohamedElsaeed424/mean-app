import {Component, OnInit} from '@angular/core';
import {Post} from "./posts/post.model";
import {AuthService} from "./auth/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor(private authService :AuthService) {}
  ngOnInit() {
    this.authService.autoAuthUser();
  }
}
