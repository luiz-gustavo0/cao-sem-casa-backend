const nodemailer = require('nodemailer')
const nodemailerSendgrid = require('nodemailer-sendgrid')
const hbs = require('handlebars')

const fs = require('fs')

class SendMailService {
  constructor() {
    this.transporter = nodemailer.createTransport(
      nodemailerSendgrid({
        apiKey: process.env.SENDGRID_API_KEY
      })
    )
  }

  async execute(to, subject, variables, path) {
    const templateFileContent = fs.readFileSync(path).toString('utf-8')

    const mailTemplateParse = hbs.compile(templateFileContent)
    const html = mailTemplateParse(variables)

    const message = await this.transporter.sendMail({
      to,
      subject,
      from: process.env.MAIL_USER,
      html
    })

    console.log('SENDMAIL SERVICE', JSON.stringify(message))
  }
}

module.exports = new SendMailService()
