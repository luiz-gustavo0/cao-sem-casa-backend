import nodemailer from 'nodemailer'
import hbs from 'handlebars'

import fs from 'fs'

class SendMailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.MAIL_SERVICE,
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: process.env.MAIL_SECURE,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    })
  }

  async execute(to, subject, variables, path) {
    const templateFileContent = fs.readFileSync(path).toString('utf-8')

    const mailTemplateParse = hbs.compile(templateFileContent)
    const html = mailTemplateParse(variables)

    const message = await this.transporter.sendMail({
      to,
      subject,
      html,
      from: process.env.MAIL_USER
    })

    console.log('SENDMAIL SERVICE', message)

    console.log('Mensgaem enviada: %s', message.messageId)
  }
}

export default new SendMailService()
