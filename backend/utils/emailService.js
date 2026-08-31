import nodemailer from 'nodemailer';

let transporterPromise = null;

const getTransporter = async () => {
  if (!transporterPromise) {
    transporterPromise = (async () => {
      // Nodemailer Ethereal test hesabı oluştur
      const testAccount = await nodemailer.createTestAccount();
      console.log('\n📧 [Nodemailer] Ethereal Test Hesabı Başlatıldı:');
      console.log(`   👤 Kullanıcı: ${testAccount.user}`);

      return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    })();
  }
  return transporterPromise;
};

/**
 * Sipariş onay e-postası gönderir ve Ethereal test linkini terminale basar
 * @param {Object} orderData - Sipariş detayları (id, customerName, totalPrice, shippingAddress, cartItems vb.)
 * @param {string} userEmail - Alıcı e-posta adresi
 */
export const sendOrderConfirmationEmail = async (orderData, userEmail) => {
  try {
    const recipient = userEmail || orderData?.customerEmail || orderData?.customer_email || orderData?.email;
    if (!recipient) {
      console.warn('⚠️ E-posta gönderilemedi: Alıcı e-posta adresi bulunamadı.');
      return null;
    }

    const transporter = await getTransporter();

    const orderId = orderData?.id || orderData?.orderId || 'N/A';
    const customerName = orderData?.customerName || orderData?.customer_name || 'Değerli Müşterimiz';
    const totalPrice = orderData?.totalPrice || orderData?.total_price || 0;
    const shippingAddress = orderData?.shippingAddress || orderData?.shipping_address || 'Belirtilmedi';
    const items = orderData?.cartItems || orderData?.items || [];

    // Sipariş edilen ürünleri HTML tablo satırlarına dönüştür
    const itemsRows = items.map(item => {
      const name = item.product?.name || item.product_name || item.name || 'Ürün';
      const quantity = item.quantity || 1;
      const price = item.selectedOption?.price || item.price || 0;
      const volume = item.selectedOption?.volume || item.volume || '';
      const itemTotal = (Number(price) * Number(quantity)).toFixed(2);

      return `
        <tr style="border-bottom: 1px solid #eeeeee;">
          <td style="padding: 12px; font-size: 14px; color: #333333;">
            <strong>${name}</strong> ${volume ? `<span style="color: #777777; font-size: 12px;">(${volume})</span>` : ''}
          </td>
          <td style="padding: 12px; font-size: 14px; color: #555555; text-align: center;">
            ${quantity} adet
          </td>
          <td style="padding: 12px; font-size: 14px; color: #00796b; font-weight: bold; text-align: right;">
            ₺${itemTotal}
          </td>
        </tr>
      `;
    }).join('');

    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sipariş Onayı - GNC Şarküteri</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f7f6; margin: 0; padding: 24px; color: #333333;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #00796b 0%, #004d40 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 0.5px;">GNC Şarküteri</h1>
            <p style="margin: 8px 0 0 0; font-size: 15px; opacity: 0.9;">Siparişiniz Başarıyla Alındı!</p>
          </div>

          <!-- Content -->
          <div style="padding: 28px 24px;">
            <p style="font-size: 16px; margin-top: 0;">Merhaba <strong>${customerName}</strong>,</p>
            <p style="font-size: 14px; color: #555555; line-height: 1.6;">
              GNC Şarküteri'yi tercih ettiğiniz için teşekkür ederiz. <strong>#${orderId}</strong> numaralı siparişiniz başarıyla alındı ve hazırlanma aşamasına geçti.
            </p>

            <!-- Order Summary Box -->
            <div style="background-color: #f9fbfb; border: 1px solid #e0f2f1; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <h3 style="margin: 0 0 12px 0; font-size: 15px; color: #004d40;">📦 Sipariş Detayları</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #e0f2f1; text-align: left;">
                    <th style="padding: 8px 12px; font-size: 12px; color: #004d40;">Ürün</th>
                    <th style="padding: 8px 12px; font-size: 12px; color: #004d40; text-align: center;">Adet</th>
                    <th style="padding: 8px 12px; font-size: 12px; color: #004d40; text-align: right;">Tutar</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsRows || '<tr><td colspan="3" style="padding: 12px; text-align: center; color: #777;">Sipariş içeriği</td></tr>'}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="2" style="padding: 14px 12px 6px 12px; font-weight: bold; font-size: 15px; text-align: right;">Toplam Tutar:</td>
                    <td style="padding: 14px 12px 6px 12px; font-weight: bold; font-size: 16px; color: #00796b; text-align: right;">₺${Number(totalPrice).toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <!-- Shipping Info -->
            <div style="margin-top: 20px; font-size: 13px; color: #666666; border-top: 1px solid #eeeeee; padding-top: 16px;">
              <p style="margin: 0 0 6px 0;"><strong>📍 Teslimat Adresi:</strong></p>
              <p style="margin: 0; color: #444444; line-height: 1.4;">${shippingAddress}</p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f4f7f6; padding: 20px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #eaeaea;">
            <p style="margin: 0 0 6px 0;">Bu e-posta otomatik olarak gönderilmiştir. Sorularınız için bizimle iletişime geçebilirsiniz.</p>
            <p style="margin: 0;">© 2024 GNC Şarküteri. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: '"GNC Şarküteri" <siparis@gncsarkuteri.com>',
      to: recipient,
      subject: `Siparişiniz Alındı! (Sipariş #${orderId}) - GNC Şarküteri`,
      html: htmlTemplate,
    };

    const info = await transporter.sendMail(mailOptions);
    const testUrl = nodemailer.getTestMessageUrl(info);

    console.log(`\n========================================`);
    console.log(`✅ [Nodemailer] Sipariş Onay E-postası Gönderildi!`);
    console.log(`📬 Alıcı: ${recipient}`);
    console.log(`📦 Sipariş ID: #${orderId}`);
    console.log(`🔗 E-posta Önizleme URL: ${testUrl}`);
    console.log(`========================================\n`);

    return {
      success: true,
      messageId: info.messageId,
      previewUrl: testUrl,
    };
  } catch (error) {
    console.error('❌ Sipariş onay e-postası gönderilirken hata oluştu:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Kullanıcı e-posta doğrulama bağlantısını gönderir ve Ethereal test linkini terminale basar
 * @param {string} userEmail - Alıcı e-posta adresi
 * @param {string} token - Doğrulama token'ı
 */
export const sendVerificationEmail = async (userEmail, token) => {
  try {
    if (!userEmail || !token) {
      console.warn('⚠️ E-posta doğrulama gönderilemedi: E-posta veya token eksik.');
      return null;
    }

    const transporter = await getTransporter();
    const frontendUrl = process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? 'https://gnchol.com' : 'http://localhost:5173');
    const verificationUrl = `${frontendUrl}/verify/${token}`;

    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>E-posta Doğrulama - GNC Şarküteri</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f7f6; margin: 0; padding: 24px; color: #333333;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #00796b 0%, #004d40 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 0.5px;">GNC Şarküteri</h1>
            <p style="margin: 8px 0 0 0; font-size: 15px; opacity: 0.9;">E-posta Adresinizi Doğrulayın</p>
          </div>

          <!-- Content -->
          <div style="padding: 32px 24px; text-align: center;">
            <p style="font-size: 16px; color: #333333; margin-top: 0;">Aramıza hoş geldiniz!</p>
            <p style="font-size: 14px; color: #555555; line-height: 1.6; margin-bottom: 24px;">
              GNC Şarküteri hesabınızı aktifleştirmek ve güvenli bir şekilde alışverişe başlamak için lütfen aşağıdaki butona tıklayarak e-posta adresinizi doğrulayın:
            </p>

            <!-- Verification Button -->
            <div style="margin: 28px 0;">
              <a href="${verificationUrl}" target="_blank" style="background: linear-gradient(135deg, #00796b 0%, #004d40 100%); color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-size: 15px; font-weight: 600; display: inline-block; box-shadow: 0 4px 12px rgba(0, 121, 107, 0.3);">
                Hesabımı Doğrula
              </a>
            </div>

            <p style="font-size: 13px; color: #777777; line-height: 1.5; margin-top: 24px;">
              Butona tıklayamıyorsanız, aşağıdaki bağlantıyı tarayıcınızın adres çubuğuna kopyalayıp yapıştırabilirsiniz:
            </p>
            <p style="font-size: 12px; color: #00796b; word-break: break-all;">
              <a href="${verificationUrl}" style="color: #00796b;">${verificationUrl}</a>
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f4f7f6; padding: 20px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #eaeaea;">
            <p style="margin: 0 0 6px 0;">Bu işlemi siz yapmadıysanız lütfen bu e-postayı dikkate almayınız.</p>
            <p style="margin: 0;">© 2024 GNC Şarküteri. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: '"GNC Şarküteri" <dogrulama@gncsarkuteri.com>',
      to: userEmail,
      subject: 'Hesabınızı Doğrulayın - GNC Şarküteri',
      html: htmlTemplate,
    };

    const info = await transporter.sendMail(mailOptions);
    const testUrl = nodemailer.getTestMessageUrl(info);

    console.log(`\n========================================`);
    console.log(`✅ [Nodemailer] E-posta Doğrulama Maili Gönderildi!`);
    console.log(`📬 Alıcı: ${userEmail}`);
    console.log(`🔑 Doğrulama Linki: ${verificationUrl}`);
    console.log(`🔗 E-posta Önizleme URL: ${testUrl}`);
    console.log(`========================================\n`);

    return {
      success: true,
      messageId: info.messageId,
      previewUrl: testUrl,
      verificationUrl,
    };
  } catch (error) {
    console.error('❌ E-posta doğrulama maili gönderilirken hata oluştu:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export default {
  sendOrderConfirmationEmail,
  sendVerificationEmail,
};
