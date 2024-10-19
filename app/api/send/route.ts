import { Resend } from 'resend';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends a verification email to the user
 * @param email - The recipient's email address
 * @param token - The verification token
 */
export async function sendVerificationEmail(
  email: string,
  token: string
) {
  // Construct the confirmation link
  const confirmLink = `${process.env.BASE_URL}/auth/verify-email?token=${token}`;
  
  try {
    // Attempt to send the email using Resend
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
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
