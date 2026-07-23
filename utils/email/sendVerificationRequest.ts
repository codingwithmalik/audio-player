import nodemailer from "nodemailer";

export async function sendVerificationRequest(params: {
  identifier: string;
  url: string;
  provider: {
    server: any;
    from?: string;
  };
}) {
  const { identifier: email, url, provider } = params;

  const transport = nodemailer.createTransport(provider.server);

  const result = await transport.sendMail({
    to: email,
    from: provider.from,
    subject: "Sign in to Audious",
    text: `Sign in to Audious:\n${url}\n\nIf you didn't request this, you can safely ignore this email.`,
    html: `
      <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #7c3aed;">Sign in to Audious</h2>
        <p>Click the button below to sign in to your account:</p>
        <a href="${url}" style="display: inline-block; padding: 12px 24px; background: #7c3aed; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600;">
          Sign in
        </a>
        <p style="margin-top: 24px; color: #666; font-size: 14px;">
          Or copy and paste this link into your browser:<br/>
          <code style="word-break: break-all; color: #7c3aed;">${url}</code>
        </p>
        <p style="color: #999; font-size: 12px; margin-top: 24px;">
          If you didn't request this email, you can safely ignore it.
        </p>
      </div>
    `,
  });

  const failed = result.rejected?.concat(result.pending || []).filter(Boolean);
  if (failed && failed.length > 0) {
    throw new Error(`Email could not be sent to: ${failed.join(", ")}`);
  }
}
