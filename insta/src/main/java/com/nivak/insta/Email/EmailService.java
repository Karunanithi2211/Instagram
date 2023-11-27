package com.nivak.insta.Email;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.nivak.insta.User.User;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender javaMailSender;

    public void sendVerificationEmail(User users){
        MimeMessage message = javaMailSender.createMimeMessage();
        int token = users.getVerificationToken();
        try{
            MimeMessageHelper helper = new MimeMessageHelper(message,true);
            helper.setTo(users.getEmail());
            helper.setSubject("Email Verification");

            String emailContent = "Dear User,<br> Your OTP to verify your email with Nivak's Insta is <u><b>"+token+"</b></u>. <br> Please do not share this otp with anyone<br><br><br> Kind regards,<br>Nivak's Team";
            helper.setText(emailContent,true);
            javaMailSender.send(message);
        }
        catch(MessagingException e){
            e.printStackTrace();
        }
    }
}
