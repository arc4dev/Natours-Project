const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url = '') {
    this.user = user;
    this.url = url;
    this.from =
      process.env.NODE_ENV === 'production'
        ? process.env.SENDGRID_EMAIL_FROM
        : process.env.EMAIL_FROM;
  }

  newTransporter() {
    if (process.env.NODE_ENV === 'production') {
      //send grid tarnspoter
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    // 1) Create a template

    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.user.name,
        from: this.from,
        url: this.url,
      }
    );

    // 2) Define mail options
    const emailOptions = {
      from: this.from,
      to: this.user.email,
      subject,
      html,
      text: htmlToText.convert(html),
    };

    // 3) Send am email
    await this.newTransporter().sendMail(emailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to our Natours Family!');
  }

  async sendPasswordResetToken() {
    await this.send('passwordReset', 'Your password reset token (10min)');
  }
};
