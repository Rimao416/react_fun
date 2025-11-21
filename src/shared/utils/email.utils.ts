import nodemailer from 'nodemailer';
import { env } from '@config/env';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: false,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

interface UserInfo {
  firstName: string;
  lastName: string;
}

const baseEmailTemplate = (
  title: string,
  intro: string,
  message: string,
  actionUrl: string,
  actionText: string,
  expiration: string,
  closingNote?: string
) => `
  <html lang="fr">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        body {
          font-family: 'DM Sans', sans-serif;
          background-color: #f6f8fa;
          margin: 0;
          padding: 0;
          color: #222;
        }
        .container {
          max-width: 640px;
          margin: 40px auto;
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #e2e5e9;
          overflow: hidden;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
        }
        .header {
          background-color: #1F4B3F;
          padding: 28px;
          text-align: center;
        }
        .header span {
          font-size: 26px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 0.5px;
        }
        .content {
          padding: 40px 32px;
        }
        h1 {
          font-size: 22px;
          color: #1F4B3F;
          margin-bottom: 16px;
        }
        h2 {
          font-size: 18px;
          font-weight: 600;
          color: #222;
          margin-bottom: 10px;
        }
        p {
          line-height: 1.7;
          font-size: 15px;
          color: #333;
          margin-bottom: 22px;
        }
        .cta {
          text-align: center;
          margin: 36px 0;
        }
        .button {
          display: inline-block;
          background-color: #5bbb7b;
          color: #ffffff;
          text-decoration: none;
          font-weight: 600;
          padding: 14px 28px;
          border-radius: 10px;
          font-size: 15px;
          transition: background 0.3s ease;
        }
        .button:hover {
          background-color: #4ea56d;
        }
        .divider {
          border-top: 1px solid #e2e5e9;
          margin: 36px 0;
        }
        .tips {
          background-color: #f1f5f3;
          border-left: 4px solid #5bbb7b;
          padding: 18px 20px;
          border-radius: 8px;
          font-size: 14px;
          color: #1F4B3F;
          margin-bottom: 24px;
        }
        .footer {
          background-color: #f9fafb;
          text-align: center;
          font-size: 13px;
          color: #6B7177;
          padding: 28px;
          border-top: 1px solid #e5e7eb;
        }
        @media (max-width: 480px) {
          .content { padding: 28px; }
          h1 { font-size: 20px; }
          .button { padding: 12px 22px; font-size: 14px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <span>Siye Platform</span>
        </div>
        <div class="content">
          <h1>${title}</h1>
          <p>${intro}</p>
          <p>${message}</p>

          <div class="cta">
            <a href="${actionUrl}" class="button">${actionText}</a>
          </div>

          <div class="divider"></div>

          <h2>Pourquoi cette étape est importante</h2>
          <p>Chez <strong>Siye</strong>, nous veillons à ce que chaque compte soit authentifié pour
          garantir la sécurité, la confiance et la qualité de notre communauté.  
          Cette étape permet de vérifier que vous êtes bien le propriétaire de cette adresse e-mail et de protéger votre compte contre toute utilisation non autorisée.</p>

          <div class="tips">
            💡 <strong>Astuce :</strong> Si vous n'avez pas initié cette demande, vous pouvez ignorer ce message en toute sécurité.
          </div>

          <p style="font-size: 14px; color: #6B7177;">Ce lien expirera dans <strong>${expiration}</strong> pour des raisons de sécurité.</p>

          ${
            closingNote
              ? `<p style="margin-top: 32px; color: #1F4B3F;">${closingNote}</p>`
              : ''
          }
        </div>
        <div class="footer">
          © ${new Date().getFullYear()} Siye. Tous droits réservés.<br />
          <span>Conçu avec passion en Afrique 🌍 | <a href="${env.FRONTEND_URL}" style="color:#1F4B3F; text-decoration:none;">www.siye.com</a></span>
        </div>
      </div>
    </body>
  </html>
`;

// ===== VERIFICATION EMAIL =====
export const sendVerificationEmail = async (
  email: string, 
  token: string,
  userInfo: UserInfo
) => {
  const verificationUrl = `${env.FRONTEND_URL}/verify-email/${token}`;
  const html = baseEmailTemplate(
    `Bienvenue ${userInfo.firstName} 🎉`,
    `Merci de rejoindre la plateforme Siye, la communauté où les talents africains collaborent, créent et grandissent ensemble.`,
    `Avant de commencer, nous devons simplement confirmer votre adresse e-mail. Cela ne prend qu'un instant, et cela vous permettra d'accéder à toutes les fonctionnalités de la plateforme : publier, collaborer et créer sans limites.`,
    verificationUrl,
    'Vérifier mon adresse e-mail',
    '1 heure',
    `Une fois votre adresse vérifiée, vous pourrez configurer votre profil, rejoindre des projets, ou encore proposer vos services sur le Marketplace Siye.`
  );

  await transporter.sendMail({
    from: '"Siye Platform" <noreply@siye.com>',
    to: email,
    subject: 'Confirmez votre adresse e-mail - Siye Platform',
    html,
  });
};

// ===== PASSWORD RESET EMAIL =====
export const sendPasswordResetEmail = async (
  email: string, 
  token: string,
  userInfo: UserInfo
) => {
  const resetUrl = `${env.FRONTEND_URL}/reset-password/${token}`;
  const html = baseEmailTemplate(
    `Réinitialisation de votre mot de passe 🔒`,
    `Bonjour ${userInfo.firstName}, nous avons reçu une demande de réinitialisation de mot de passe pour votre compte Siye.`,
    `Si vous êtes à l'origine de cette demande, cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe.  
    Si vous n'êtes pas à l'origine de cette action, ne vous inquiétez pas : votre compte reste sécurisé tant que vous ne cliquez pas sur le lien.`,
    resetUrl,
    'Réinitialiser mon mot de passe',
    '30 minutes',
    `Par mesure de sécurité, ne partagez jamais ce lien ni votre mot de passe avec qui que ce soit.  
    Si vous rencontrez un problème, notre équipe est toujours disponible pour vous aider à <a href="${env.FRONTEND_URL}/support" style="color:#5bbb7b;text-decoration:none;">support@siye.com</a>.`
  );

  await transporter.sendMail({
    from: '"Siye Platform" <noreply@siye.com>',
    to: email,
    subject: 'Réinitialisez votre mot de passe - Siye Platform',
    html,
  });
};

// ===== WELCOME EMAIL (après vérification) =====
export const sendWelcomeEmail = async (
  email: string,
  userInfo: UserInfo
) => {
  const dashboardUrl = `${env.FRONTEND_URL}/dashboard`;
  
  const html = `
    <html lang="fr">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Bienvenue sur Siye!</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
          body {
            font-family: 'DM Sans', sans-serif;
            background-color: #f6f8fa;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 640px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
          }
          .header {
            background: linear-gradient(135deg, #1F4B3F 0%, #2d7a5f 100%);
            padding: 40px 28px;
            text-align: center;
            color: white;
          }
          .header h1 {
            margin: 0;
            font-size: 32px;
            font-weight: 700;
          }
          .content {
            padding: 40px 32px;
          }
          h2 {
            color: #1F4B3F;
            font-size: 22px;
            margin-bottom: 16px;
          }
          p {
            color: #333;
            line-height: 1.7;
            font-size: 15px;
            margin-bottom: 20px;
          }
          .features {
            background-color: #f1f5f3;
            border-radius: 12px;
            padding: 24px;
            margin: 28px 0;
          }
          .feature-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 16px;
          }
          .feature-item:last-child {
            margin-bottom: 0;
          }
          .feature-icon {
            font-size: 24px;
            margin-right: 12px;
            flex-shrink: 0;
          }
          .feature-text {
            color: #1F4B3F;
            font-size: 15px;
            line-height: 1.6;
          }
          .cta {
            text-align: center;
            margin: 36px 0;
          }
          .button {
            display: inline-block;
            background-color: #5bbb7b;
            color: #ffffff;
            text-decoration: none;
            font-weight: 600;
            padding: 16px 32px;
            border-radius: 10px;
            font-size: 16px;
            transition: background 0.3s ease;
          }
          .button:hover {
            background-color: #4ea56d;
          }
          .footer {
            background-color: #f9fafb;
            text-align: center;
            font-size: 13px;
            color: #6B7177;
            padding: 28px;
            border-top: 1px solid #e5e7eb;
          }
          @media (max-width: 480px) {
            .header h1 { font-size: 26px; }
            .content { padding: 28px; }
            .button { padding: 14px 24px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎊 Félicitations ${userInfo.firstName}!</h1>
            <p style="margin: 8px 0 0 0; font-size: 16px; color: rgba(255,255,255,0.9);">
              Votre compte est maintenant actif
            </p>
          </div>
          <div class="content">
            <h2>Bienvenue dans la communauté Siye 🌍</h2>
            <p>
              Votre email a été vérifié avec succès ! Vous faites maintenant partie d'une communauté 
              dynamique de talents africains qui collaborent, innovent et grandissent ensemble.
            </p>

            <div class="features">
              <div class="feature-item">
                <span class="feature-icon">✅</span>
                <span class="feature-text">
                  <strong>Créez votre profil professionnel</strong> et mettez en valeur vos compétences
                </span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">🎯</span>
                <span class="feature-text">
                  <strong>Trouvez des missions</strong> adaptées à votre expertise
                </span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">💰</span>
                <span class="feature-text">
                  <strong>Recevez des paiements sécurisés</strong> via Mobile Money et autres moyens
                </span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">🎓</span>
                <span class="feature-text">
                  <strong>Accédez aux formations</strong> et obtenez des certifications
                </span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">⭐</span>
                <span class="feature-text">
                  <strong>Construisez votre réputation</strong> et gagnez la confiance des clients
                </span>
              </div>
            </div>

            <div class="cta">
              <a href="${dashboardUrl}" class="button">
                🚀 Accéder à mon Dashboard
              </a>
            </div>

            <p style="text-align: center; font-size: 14px; color: #6B7177; margin-top: 32px;">
              Besoin d'aide pour démarrer ? Consultez notre 
              <a href="${env.FRONTEND_URL}/guide" style="color: #5bbb7b; text-decoration: none;">
                guide de démarrage rapide
              </a>
            </p>
          </div>
          <div class="footer">
            © ${new Date().getFullYear()} Siye. Tous droits réservés.<br />
            <span>
              Conçu avec passion en Afrique 🌍 | 
              <a href="${env.FRONTEND_URL}" style="color:#1F4B3F; text-decoration:none;">
                www.siye.com
              </a>
            </span>
          </div>
        </div>
      </body>
    </html>
  `;

  await transporter.sendMail({
    from: '"Siye Platform" <noreply@siye.com>',
    to: email,
    subject: '🎉 Bienvenue sur Siye Platform!',
    html,
  });
};