import { Injectable} from "@nestjs/common";
import * as nodemailer from "nodemailer"
import * as crypto from "crypto";

@Injectable()
export class NodemailerServices {
    createTransport(){
        return nodemailer.createTransport(
            {
                host:"smtp.mailtrap.io",
                port:2525,
                auth:{
                    user:"c5ee5aac939502",
                    pass: "254ccd3148f88c"
                }
            }
        )
    };
    sendWelcome( body : { email:string; resetCode:string; }){
        const to=body.email;
        const subject='welcome to our ecommerce website';
        const text=`your reset code to vertify your email is ${body.resetCode}`;
        const from='e-shop';
        return this.send({from,to,subject,text});
    };
    sendChangeingPasswordCode( body : { email:string; resetCode:string; }){
        const to=body.email;
        const subject='reset code to change your password';
        const text=`your reset code to change your passsword is ${body.resetCode}`;
        const from='e-shop';
        return this.send({from,to,subject,text});
    };
    send( opts: { from:string; to:string; subject:string; text:string; }){
        this.createTransport().sendMail(opts);
    };
    resetCode(){
        return crypto?.randomBytes(3)?.toString('hex');
    };
};