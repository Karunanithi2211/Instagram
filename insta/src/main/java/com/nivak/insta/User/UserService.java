package com.nivak.insta.User;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public List<User> showAllUsers(){
        return userRepository.findAll();
    }
    public Optional<User> showOneUser(String email){
        return userRepository.findByEmail(email);
    }

    public User getUserByEmail(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        return userOptional.orElse(null);
    }

    public static boolean isValidEmail(String email) {
        String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
        Pattern pattern = Pattern.compile(emailRegex);
        Matcher matcher = pattern.matcher(email);
        return matcher.matches();
    }

    public static boolean isNumber(String input) {
        try {
            Long.parseLong(input);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    public Optional<User> getUserByLogin(String login){
        if(isValidEmail(login)){
            return userRepository.findByEmail(login);
        }
        else if(isNumber(login)){
            return userRepository.findByMobilenumber(Long.parseLong(login));
        }
        else{
            return userRepository.findByUsername(login);
        }
    }

    public User storeProfile(String email,MultipartFile profile) throws IOException{
        Optional<User> users = userRepository.findByEmail(email);
        User user = users.get();

        String[] emailParts = email.split("@");
        String desiredName = emailParts[0];
        String UPLOAD_DIR = new ClassPathResource("static/images/imageUser").getFile().getAbsolutePath();
        String directoryPath = UPLOAD_DIR +"/";
        String filePath = directoryPath+desiredName + ".png";
        String pathstored = "/images/imageUser/"+desiredName + ".png";
        System.out.println(pathstored);
        user.setProfilepic(pathstored);
        try {
            File directory = new File(directoryPath);
            if (!directory.exists()) {
                if (directory.mkdirs()) {

                    File file = new File(filePath);
                    profile.transferTo(file);
    
                    if (file.exists()) {
                        return userRepository.save(user);
                    }
                }
            } else {
                File file = new File(filePath);
                profile.transferTo(file);
    
                if (file.exists()) {
                    return userRepository.save(user);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public static String getFileExtension(MultipartFile file) {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        int dotIndex = fileName.lastIndexOf('.');
        if (dotIndex > 0 && dotIndex < fileName.length() - 1) {
            return fileName.substring(dotIndex + 1).toLowerCase();
        }
        return "";
    }

    public static int generateNumbers() {
        
        int min = 10000000;
        int max = 99999999;

        
        Random random = new Random();
        return random.nextInt(max - min + 1) + min;
    }


    public User uploadPost(String email,MultipartFile media,String description) throws IOException{
        Optional<User> users = userRepository.findByEmail(email);
        User user = users.get();
        String[] emailParts = email.split("@");
        String desiredName = emailParts[0];
        int fileName = generateNumbers();
        String UPLOAD_DIR = new ClassPathResource("static/images/postUser").getFile().getAbsolutePath();
        String directoryPath = UPLOAD_DIR +"/"+desiredName+"/"+LocalDate.now().toString()+"/";
        String filePath = directoryPath+fileName +"."+ getFileExtension(media);
        String pathstored = "/images/postUser/"+desiredName+"/"+LocalDate.now().toString()+"/"+fileName +"."+ getFileExtension(media);
        System.out.println(pathstored);

        try {

            List<Post> postlist = user.getPosts();
            if (postlist == null) {
                postlist = new ArrayList<>();
            }
            Post newPost = new Post();

            int id = postlist.size();
            
            newPost.setId(id+1);
            newPost.setPath(pathstored);
            newPost.setDescription(description);
            newPost.setDate(LocalDate.now().toString());
            newPost.setTime(LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss")).toString());
            newPost.setLike(new ArrayList<>());

            List<Comment> comments = newPost.getComments();
            if (comments == null) {
                comments = new ArrayList<>();
            }
            newPost.setComments(comments);


            postlist.add(0,newPost);
            user.setPosts(postlist);
            System.out.println(user);
            userRepository.save(user);

            File directory = new File(directoryPath);
            if (!directory.exists()) {
                if (directory.mkdirs()) {

                    File file = new File(filePath);
                    media.transferTo(file);
                    if (file.exists()) {
                        
                    }
                }
            } else {
                File file = new File(filePath);
                media.transferTo(file);

                if (file.exists()) {
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        

        return null;
    }
}
