package com.nivak.insta.User;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "Users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    private ObjectId id;
    private long mobilenumber;
    private String username;
    private String fullname;
    private String email;
    private String password;
    private int verificationToken;
    private boolean verified;
    private String profilepic;
    private List<String> following;
    private List<String> followers;
    private List<Post> posts;

}
