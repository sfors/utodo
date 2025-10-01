import {sendEmail} from "./graphClient.js";
import {randomInt} from "crypto";



export function verificationCodeTemplate(verificationCode: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email Address</title>
</head>
<body style="margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto;">
    
    <div style="padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0; border: 1px solid black;">
      <h1 style="margin: 0; font-size: 28px; font-weight: 600;">utodo</h1>
    </div>
    
    <div style="padding: 30px; border-left: 1px solid black; border-right: 1px solid black;">
      <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">
        Email Verification Required
      </h2>
      <p style="margin: 0 0 25px 0; font-size: 16px;">
        Please enter this verification code to complete the sign in
      </p>
      
      <div style="background: lightblue; border: 2px solid black; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
        <div style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: bold; color: black; letter-spacing: 4px;">
          ${verificationCode}
        </div>
      </div>
      
      <p style="font-size: 14px; margin: 15px 0">
        This code will expire in 10 minutes.
      </p>
    </div>
   
    <div style="padding: 20px; border-bottom: 1px solid black; border-left: 1px solid black; border-right: 1px solid black; border-radius: 0 0 8px 8px;"/>
  </div>
</body>
</html>
  `.trim();
}

export function generateCode() {
  return randomInt(100000, 1000000).toString();
}

export async function sendVerificationCode(email: string, code: string) {
  await sendEmail({
    recipients: [email],
    subject: "Utodo Verification Code",
    body: verificationCodeTemplate(code),
    contentType: "HTML"
  });
}