import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const SENDGRID_FROM = process.env.SENDGRID_FROM_EMAIL || 'noreply@trianainsider.com';

export async function sendSampleMapEmail(email, firstName) {
  try {
    await sgMail.send({
      to: email,
      from: SENDGRID_FROM,
      subject: 'Your Tirana Insider Sample Map is Ready',
      html: `
        <h2>Welcome to Tirana Insider!</h2>
        <p>Hi ${firstName},</p>
        <p>We've sent you a sample of our curated Tirana map with 10 amazing spots.</p>
        <p><strong>What's included in the sample:</strong></p>
        <ul>
          <li>Komiteti - legendary raki bar & coffee</li>
          <li>Mullixhiu - best farm-to-table Albanian food</li>
          <li>Era - old-school Albanian cooking</li>
          <li>Radio Bar - hidden rooftop gem</li>
          <li>And 6 more local favorites...</li>
        </ul>
        <p>Ready for the full 37-spot map? <a href="https://trianainsider.com/checkout">Unlock it for just €4</a></p>
        <p>Cheers,<br>The Tirana Insider Team</p>
      `,
    });
    console.log(`✅ Sample map email sent to ${email}`);
  } catch (error) {
    console.error('❌ Error sending sample map email:', error);
    throw error;
  }
}

export async function sendPurchaseReceiptEmail(email, firstName, downloadLink) {
  try {
    await sgMail.send({
      to: email,
      from: SENDGRID_FROM,
      subject: 'Your Tirana Insider Map is Ready to Download',
      html: `
        <h2>Thank you for your purchase!</h2>
        <p>Hi ${firstName},</p>
        <p>Your payment has been received. The full Tirana Insider map with all 37 curated spots is ready to use!</p>
        <p><strong><a href="${downloadLink}" style="background-color: #C8583A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 100px; display: inline-block;">Download Your Map</a></strong></p>
        <p>The map works directly in Google Maps. Once downloaded, you can save it offline and access it anytime.</p>
        <p>Have questions? Reply to this email!</p>
        <p>Enjoy exploring,<br>The Tirana Insider Team</p>
      `,
    });
    console.log(`✅ Purchase receipt email sent to ${email}`);
  } catch (error) {
    console.error('❌ Error sending purchase receipt email:', error);
    throw error;
  }
}

export async function sendReviewApprovalEmail(email, firstName) {
  try {
    await sgMail.send({
      to: email,
      from: SENDGRID_FROM,
      subject: 'Your Review Has Been Published',
      html: `
        <h2>Thank you for your review!</h2>
        <p>Hi ${firstName},</p>
        <p>Your review has been approved and is now visible on the Tirana Insider map.</p>
        <p>Thanks for helping other travelers discover the real Tirana!</p>
        <p>Best regards,<br>The Tirana Insider Team</p>
      `,
    });
    console.log(`✅ Review approval email sent to ${email}`);
  } catch (error) {
    console.error('❌ Error sending review approval email:', error);
    throw error;
  }
}
