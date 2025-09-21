import nodemailer from "nodemailer";
import Payment from "../model/Payment_Model.js";
import User from "../model/user.js";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendPaymentReciept(email, sessionId) {
  const payment = await Payment.findOne({ session_id: sessionId });
  const user = await User.findById(payment.user_id);

  const dateOnly = payment.createdAt.toISOString().split("T")[0];

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
    <style>
        body {
        font-family: 'Arial', sans-serif;
        line-height: 1.6;
        margin: 0;
        padding: 0;
        background-color: #f5f5f5;
        color: #333333;
        }
        .container {
        max-width: 600px;
        margin: 30px auto;
        background: #ffffff;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        /* Header */
        .header {
        background: #111111; /* black */
        color: #FF0000;      /* red text */
        text-align: center;
        padding: 20px;
        }
        .header h1 {
        margin: 0;
        font-size: 26px;
        letter-spacing: 1px;
        }
        .sub-header {
        font-size: 14px;
        margin-top: 5px;
        color: #ffffff; /* white for subtitle */
        opacity: 0.85;
        }
        /* Success badge */
        .success {
        background: #FF0000;
        color: #fff;
        font-weight: bold;
        padding: 10px 20px;
        border-radius: 30px;
        display: inline-block;
        margin: 20px auto;
        }
        /* Content */
        .content {
        padding: 25px;
        text-align: center;
        }
        .content p {
        margin: 10px 0;
        }
        /* Receipt table */
        .details {
        margin: 20px 0;
        }
        .details table {
        width: 100%;
        border-collapse: collapse;
        }
        .details th {
        background: #f8f8f8;
        padding: 12px 10px;
        text-align: left;
        font-size: 14px;
        color: #111;
        }
        .details td {
        padding: 12px 10px;
        border-bottom: 1px solid #eeeeee;
        font-size: 14px;
        color: #444;
        }
        .highlight {
        color: #FF0000;
        font-weight: bold;
        }
        /* Footer */
        .footer {
        background: #111111;
        color: #bbbbbb;
        text-align: center;
        padding: 15px;
        font-size: 13px;
        }
        .footer a {
        color: #FF0000;
        text-decoration: none;
        }
    </style>
    </head>
    <body>
    <div class="container">
        <!-- Header -->
        <div class="header">
        <h1>Gettz Fitness</h1>
        <div class="sub-header">Official Payment Receipt</div>
        </div>

        <!-- Content -->
        <div class="content">
        <p>Hello Mr.<strong>${user.firstName}${" "}${
    user.lastName
  }</strong>,</p>
        <p>Your payment has been processed successfully 🎉</p>
        <div class="success">Payment Successful</div>

        <!-- Receipt -->
        <div class="details">
            <table>
            <tr>
                <th>Transaction ID</th>
                <td>#TA_${payment.payment_id}</td>
            </tr>
            <tr>
                <th>Date</th>
                <td>${dateOnly}</td>
            </tr>
            <tr>
                <th>Plan</th>
                <td>${payment.planName}</td>
            </tr>
            <tr>
                <th>Amount Paid</th>
                <td class="highlight">LKR.${payment.amount}.00</td>
            </tr>
            <tr>
                <th>Payment Method</th>
                <td>Card (Stripe)</td>
            </tr>
            <tr>
                <th>Status</th>
                <td class="highlight">Paid</td>
            </tr>
            </table>
        </div>

        <p>Thank you for your payment. Your subscription is now active.</p>
        <p><strong>Team Gettz Fitness</strong></p>
        </div>

        <!-- Footer -->
        <div class="footer">
        © 2025 Gettz Fitness. All rights reserved.<br>
        <a href="#">Visit our website</a>
        </div>
    </div>
    </body>
    </html>

  `;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: "Your Payment Receipt For Gettz Fitness",
    text: `You Payment Recipet #TA_${payment.payment_id}`, // Plain text version as fallback
    html: htmlTemplate, // HTML version
  };

  await transporter.sendMail(mailOptions);
}
