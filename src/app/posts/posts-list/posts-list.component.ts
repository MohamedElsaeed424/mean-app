import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Post} from "../post.model";
import {PostsService} from "../posts.service";
import {Subscription} from "rxjs";
import {PageEvent} from "@angular/material/paginator";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrl: './posts-list.component.css'
})
export class PostsListComponent implements OnInit  , OnDestroy{
  @Input() posts: Post[] = [];
  private newPostSubscription : Subscription ;
  userId:string;
  isLoading = false;
  length = 0;
  pageSize = 2;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  constructor(private postService: PostsService , private authService :AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.pageSize, 1);
    this.userId = this.authService.getUserId();
    this.newPostSubscription = this.postService.getPostUpdateListener().subscribe(
      (postData: {posts: Post[], postCount: number}) => {
        this.isLoading = false;
        this.posts = postData.posts;
        this.length = postData.postCount;
      }
    )
    this.userIsAuthenticated = this.authService.getAuthStatus();
  }

  onDelete(postId: string) {
    this.postService.deletePost(postId).subscribe(
      () => {
        this.postService.getPosts(this.pageSize, 1);
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.postService.getPosts(pageData.pageSize, pageData.pageIndex + 1);
  }

  ngOnDestroy() {
    this.newPostSubscription.unsubscribe();
  }




}
