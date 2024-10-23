import { Resend } from 'resend';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends a verification email to the user
 * @param email - The recipient's email address
 * @param token - The verification token
 */
export const sendVerificationEmail = async (
  recipientEmail: string,
  token: string
) => {
  // Construct the confirmation link
  const confirmLink = `${process.env.BASE_URL}/auth/verify-email?token=${token}`;

  try {
    // Attempt to send the email using Resend
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: recipientEmail,
      subject: "Confirm your email",
      html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
    });

    // If there's an error from Resend, return it
    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    // If successful, return the data from Resend
    return Response.json(data);
  } catch (error) {
    // If there's an exception, return it as an error
    return Response.json({ error }, { status: 500 });
  }
}

/**
 * Sends a password reset email to the user
 * @param email - The recipient's email address
 * @param token - The password reset token
 */
export const sendPasswordResetEmail = async (
  email: string,
  token: string
) => {
  // Construct the password reset link
  const resetLink = `${process.env.BASE_URL}/auth/new-password?token=${token}`;

  try {
    // Attempt to send the email using Resend
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: "Reset your password",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });

    // If there's an error from Resend, return it
    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    // If successful, return the data from Resend
    return Response.json(data);
  } catch (error) {
    // If there's an exception, return it as an error
    return Response.json({ error }, { status: 500 });
  }
}

/**
 * Sends a two-factor authentication token to the user's email.
 * @param email - The recipient's email address
 * @param token - The two-factor authentication token
 * @returns A promise that resolves to the response from the email service
 */
export const sendTwoFactorTokenEmail = async (recipientEmail: string, token: string) => {
  // Construct the email content
  const subject = "Your Two-Factor Authentication Code";
  const html = `<p>Your 2FA code is: <strong>${token}</strong></p>
                <p>Use this code to complete your login process. It will expire in 5 minutes.</p>`;

  try {
    // Attempt to send the email using Resend
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: recipientEmail,
      subject,
      html,
    });
    // error response
    if (error) {
      console.error("Error sending email:", error);
      return Response.json({ error: "Failed to send email." }, { status: 500 });
    }
    // success response
    return Response.json(data);
  } catch (error) {
    console.error("Exception in sending email:", error);
    return Response.json({ error: "An error occurred while sending the email." }, { status: 500 });
  }
};
