import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Post} from "../post.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {PostsService} from "../posts.service";
import {ActivatedRoute} from "@angular/router";
import {Router} from "@angular/router";
import {mimeType} from './mime-type.validator'
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.css'
})
export class PostCreateComponent implements OnInit {
  @Output() postCreated = new EventEmitter<Post>();
  private mode = 'create';
  private postId: string;
  private post: Post;
  isLoading = false;
  imagePreview: string;


  constructor(
    private postService: PostsService ,
    private route : ActivatedRoute,
    private authService : AuthService,
    private router : Router) {}

  ngOnInit() {
    this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.isLoading = false;
    })
    this.route.paramMap.subscribe(paramMap => {
      if(paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe(postData  => {
          this.isLoading = false;
          this.post = {
            id: postData.id,
            title: postData.title,
            content: postData.content ,
            imagePath: postData.imagePath ,
            creator: postData.creator
          };
          this.AddPostForm.setValue({
            title: this.post?.title,
            content: this.post?.content ,
            image: this.post?.imagePath
          });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  AddPostForm = new FormGroup({
    title: new FormControl(null, Validators.required),
    content: new FormControl(null, Validators.required) ,
    image: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
  });

  onAddPost( ) {
    if(this.mode === 'create') {
      let title = this.AddPostForm.get('title').value;
      let content =this.AddPostForm.get('content').value
      this.postService.addPost(title ,content , this.AddPostForm.get('image').value);
      this.AddPostForm.reset();
    }else{
      let title = this.AddPostForm.get('title').value;
      let content =this.AddPostForm.get('content').value
      this.postService.updatePost(this.postId, title ,content, this.AddPostForm.get('image').value);
      this.AddPostForm.reset();
    }
  }
  onPickImag(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.AddPostForm.patchValue({image: file});
    this.AddPostForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

}

