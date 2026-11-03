import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendPasswordResetEmail(to: string, token: string) {
    const resetLink = `http://localhost:3000/auth/reset-password?token=${token}`;

    const mailOptions = {
      from: `"Reservas SaaS" <${process.env.SMTP_USER}>`,
      to: to,
      subject: 'Recuperación de Contraseña',
      html: `
        <h2>Restablecimiento de Contraseña</h2>
        <p>Hola, has solicitado cambiar tu contraseña.</p>
        <p>Haz clic en el siguiente enlace para establecer una nueva. Este enlace expirará en 1 hora:</p>
        <a href="${resetLink}" style="padding: 10px 20px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 5px;">Restablecer Contraseña</a>
        <p>Si no solicitaste esto, ignora este correo.</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error enviando correo:', error);
      throw new InternalServerErrorException('Error al enviar el correo de recuperación');
    }
  }
}