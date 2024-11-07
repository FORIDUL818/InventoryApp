 const nodemailer =require("nodemailer");

 const SendEmailUtility=async(emailTo,emailText,emailSubject)=>{
 
    const transporter = nodemailer.createTransport({
        service:"Gmail",
        auth:{
          user: "foridulislamdise880@gmail.com",
          pass: "jxcs swke gkoh widq",
        },
      });
    
      let mailOptions={
      from:" Todo planner <foridulislamdise880@gmail.com>",
      to:emailTo,
      subject:emailSubject,
      text:emailText,
    };
    return await transporter.sendMail(mailOptions)
};

module.exports=SendEmailUtility;

