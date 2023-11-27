package com.nivak.insta.User;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Post {
    private int id;
    private String path;
    private String description;
    private String date;
    private String time;
    private List<String> like;
    private List<Comment> comments;
}
