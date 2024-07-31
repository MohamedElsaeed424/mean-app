import {Post} from "./post.model";
import {map, Subject} from "rxjs";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

import {environment} from "../../environments/environment";
import {AuthService} from "../auth/auth.service";

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts:Post[],postCount:number}>();

  constructor(private http: HttpClient , private router : Router , private authService :AuthService) {}

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPosts(pageSize: number, currentPage: number) {
    const queryParams = `?pageSize=${pageSize}&currentPage=${currentPage}`;
    return this.http.get<{message: string, posts: any , maxPosts:number}>(
      `${environment.apiUrl}/posts/all-posts/`+ queryParams
    ).pipe(map((postData)=> {
        return {posts:postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath ,
            creator: post.creator
          };
        }) ,
          maxPosts: postData.maxPosts
        }
      })
    ).subscribe(
      (resData) => {
        this.posts = resData.posts;
        this.postsUpdated.next({posts: [...this.posts], postCount: resData.maxPosts});
      }
    )  ;
  }

  getPost(id: string) {
    return this.http.get<{message: string, post: any}>(
      `${environment.apiUrl}/posts/get-post/` + id
    ).pipe(map((postData)=> {
        return {
          title: postData.post.title,
          content: postData.post.content,
          id: postData.post._id ,
          imagePath: postData.post.imagePath ,
          creator: postData.post.creator
        };
      })
    );
  }

  updatePost(id: string, title: string, content: string ,image: File | string) {
    let post: Post | FormData;
    if(typeof(image) === 'object') {
      post = new FormData();
      post.append('id', id);
      post.append('title', title);
      post.append('content', content);
      post.append('image', image, title);
    } else {
      post = {id: id, title: title, content: content, imagePath: image , creator: null};
    }
    this.http.put<{message: string}>(
      `${environment.apiUrl}/posts/update-post/` + id,
      post
    ).subscribe(
      (responseData) => {
        // const updatedPosts = [...this.posts];
        // const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        // const post: Post = {
        //   id: id,
        //   title: title,
        //   content: content,
        //   imagePath: "responseData.imagePath"
        // };
        // updatedPosts[oldPostIndex] = post;
        // this.posts = updatedPosts;
        // this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/posts']);
      }
    )
  }


  addPost(title: string, content: string , image :File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.http.post<{message: string , post :Post}>(
      `${environment.apiUrl}/posts/add-post`,
      postData
    ).subscribe(
      (responseData) => {
        // const post: Post = {
        //   id: responseData.post.id,
        //   title: title,
        //   content: content ,
        //   imagePath: responseData.post.imagePath
        // };
        // this.posts.push(post);
        // this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/posts']);
      }
    )
  }

  deletePost(postId: string) {
    return  this.http.delete<{message: string}>(
      `${environment.apiUrl}/posts/delete-post/` + postId);
  }
}
