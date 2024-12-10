"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailNotification = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmailNotification = (email, message, htmlBody, emailSubject) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(email, message, emailSubject);
    const transporter = nodemailer_1.default.createTransport({
        name: 'smtp.gmail.com',
        host: "smtp.gmail.com",
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    const mailOptions = {
        to: email,
        from: process.env.EMAIL_USER,
        subject: emailSubject,
        text: message,
        html: htmlBody
    };
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log('Email sent: ' + info.response);
        }
    });
});
exports.sendEmailNotification = sendEmailNotification;
