import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Post} from "../post.model";
import {PostsService} from "../posts.service";
import {Subscription} from "rxjs";
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrl: './posts-list.component.css'
})
export class PostsListComponent implements OnInit  , OnDestroy{
  @Input() posts: Post[] = [];
  private newPostSubscription : Subscription ;
  isLoading = false;
  length = 0;
  pageSize = 2;
  pageSizeOptions = [1, 2, 5, 10];
  constructor(private postService: PostsService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.pageSize, 1);
    this.newPostSubscription = this.postService.getPostUpdateListener().subscribe(
      (postData: {posts: Post[], postCount: number}) => {
        this.isLoading = false;
        this.posts = postData.posts;
        this.length = postData.postCount;
      }
    )

  }

  onDelete(postId: string) {
    this.postService.deletePost(postId).subscribe(
      () => {
        this.postService.getPosts(this.pageSize, 1);
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
