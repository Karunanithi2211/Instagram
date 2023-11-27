package com.nivak.insta;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.nivak.insta.Email.EmailService;
import com.nivak.insta.User.Comment;
import com.nivak.insta.User.Post;
import com.nivak.insta.User.User;
import com.nivak.insta.User.UserRepository;
import com.nivak.insta.User.UserService;

@Controller
// @CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/nivak/insta")
public class InstaController {
    @Autowired
    private EmailService emailService;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    public static int generateOTP() {
        
        int min = 100000;
        int max = 999999;

        
        Random random = new Random();
        return random.nextInt(max - min + 1) + min;
    }

    @PostMapping("/register")
    public ResponseEntity<String> Register(@RequestParam("number") long number,@RequestParam("email") String email,@RequestParam("fullname") String fullname,@RequestParam("username") String username,@RequestParam("password") String password){
        try{
            User users = new User();
            int token = generateOTP();
            users.setMobilenumber(number);
            users.setEmail(email);
            users.setFullname(fullname);
            users.setUsername(username);
            users.setPassword(password);
            users.setVerificationToken(token);
            users.setVerified(false);

            userRepository.save(users);
            CompletableFuture.supplyAsync(()->{
                User saveUsers = userRepository.save(users);
                emailService.sendVerificationEmail(saveUsers);
                return saveUsers;
            });
            return ResponseEntity.ok("Data saved");

        }
        catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Data not saved");

        }
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verifyOtp(@RequestParam("email") String email){
        try {
            User users = userService.getUserByEmail(email);
            if(users != null){
                users.setVerified(true);
                userRepository.save(users);
                return ResponseEntity.ok("Email is verified");
            }
            else{
                return ResponseEntity.ok("Email not has verified");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Email not verified");
        }
    }

    @GetMapping("/userbyemail/{email}")
    public ResponseEntity<Optional<User>> singleUser(@PathVariable("email") String email){
        return new ResponseEntity<Optional<User>>(userService.showOneUser(email), HttpStatus.OK);
    }

    @GetMapping("/userbyname/{user}")
    public ResponseEntity<Optional<User>> singleUsername(@PathVariable("user") String username){
        return new ResponseEntity<Optional<User>>(userRepository.findByUsername(username), HttpStatus.OK);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> showAllUser(){
        return new ResponseEntity<List<User>>(userService.showAllUsers(), HttpStatus.OK);
    }

    @GetMapping("/login/{login}")
    public ResponseEntity<Optional<User>> loginUser(@PathVariable("login") String login){
        return new ResponseEntity<Optional<User>>(userService.getUserByLogin(login),HttpStatus.OK);
    }

    @PostMapping("/uploadprofilepic")
    public ResponseEntity<String> uploadProfile(@RequestParam("email") String email, @RequestParam("profile") MultipartFile profile){
        try {
            userService.storeProfile(email, profile);
            return ResponseEntity.ok("Image Uploaded");
        } catch (Exception e) {
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading "+e);
        }
    }

    @PostMapping("/followstatus")
    public ResponseEntity<String> followStatus(@RequestParam("email") String email, @RequestParam(value = "follow", required = false) String followEmail,@RequestParam(value = "unfollow", required = false) String unfollowEmail){
        try {
            Optional<User> users= userRepository.findByEmail(email);
            User user = users.get();
            if (followEmail != null) {
                Optional<User> userfollow= userRepository.findByEmail(followEmail);
                User followstatus = userfollow.get();

                List<String> following = user.getFollowing();
                if (following == null) {
                    following = new ArrayList<>();
                }
                following.add(followEmail);
                user.setFollowing(following);
                userRepository.save(user);

                List<String> follower = followstatus.getFollowers();
                if (follower == null) {
                    follower = new ArrayList<>(); // Initialize if null
                }
                follower.add(email);
                followstatus.setFollowers(follower);
                userRepository.save(followstatus);
                return ResponseEntity.ok("Follow Process successful");
            }
            if (unfollowEmail != null) {
                Optional<User> userunfollow= userRepository.findByEmail(unfollowEmail);
                User unfollowstatus = userunfollow.get();

                List<String> following = user.getFollowing();
                if (following == null) {
                    following = new ArrayList<>();
                }
                following.remove(unfollowEmail);
                user.setFollowing(following);
                userRepository.save(user);

                List<String> follower = unfollowstatus.getFollowers();
                if (follower == null) {
                    follower = new ArrayList<>(); // Initialize if null
                }
                follower.remove(email);
                unfollowstatus.setFollowers(follower);
                userRepository.save(unfollowstatus);
                

                return ResponseEntity.ok("Unfollow Process successful");
            }
            return ResponseEntity.ok("Process unsuccessful");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error in process "+e);
        }
    }

    @PostMapping("/uploadpost")
    public ResponseEntity<String> uploadPost(@RequestParam("email") String email,@RequestParam("media") MultipartFile media,@RequestParam("description") String description){
        try {
            userService.uploadPost(email, media, description);
            return ResponseEntity.ok("Post Uploaded");
        } catch (Exception e) {
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading Post "+e);
        }
    }

    @PostMapping("/likepost")
    public ResponseEntity<String> likePost(@RequestParam("email") String email,@RequestParam("postemail") String postemail,@RequestParam("postid") int postid){
        try {
            Optional<User> user = userRepository.findByEmail(postemail);
            User postuser = user.get();
            List<Post> posts = postuser.getPosts();
            for(Post post:posts){
                if (post.getId() == postid) {
                    List<String> likes = post.getLike();
                    likes.add(email);
                    post.setLike(likes);
                }
            }
            postuser.setPosts(posts);
            userRepository.save(postuser);

            return ResponseEntity.ok("Liked the post");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error in like the post "+e);
        }
    }

    @PostMapping("/unlikepost")
    public ResponseEntity<String> unlikePost(@RequestParam("email") String email,@RequestParam("postemail") String postemail,@RequestParam("postid") int postid){
        try {
            Optional<User> user = userRepository.findByEmail(postemail);
            User postuser = user.get();
            List<Post> posts = postuser.getPosts();
            for(Post post:posts){
                if (post.getId() == postid) {
                    List<String> likes = post.getLike();
                    likes.remove(email);
                    post.setLike(likes);
                }
            }
            postuser.setPosts(posts);
            userRepository.save(postuser);

            return ResponseEntity.ok("UnLiked the post");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error in unlikeing the post "+e);
        }
    }

    @PostMapping("/commentpost")
    public ResponseEntity<String> commentPost(@RequestParam("email") String email,@RequestParam("comment") String postcomment,@RequestParam("postemail") String postemail,@RequestParam("postid") int postid){
        try {
            Optional<User> user = userRepository.findByEmail(postemail);
            User postuser = user.get();
            List<Post> posts = postuser.getPosts();
            for(Post post:posts){
                if (post.getId() == postid) {
                    List<Comment> comments = post.getComments();
                    Comment postComment = new Comment();
                    postComment.setCommentemail(email);
                    postComment.setComment(postcomment);
                    comments.add(postComment);
                    post.setComments(comments);;
                }
            }
            postuser.setPosts(posts);
            userRepository.save(postuser);

            return ResponseEntity.ok("Commented the post");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error in commenting the post "+e);
        }
    }

}
