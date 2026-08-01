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
      <body style="margin: 0; padding: 0; background-color: #0a0118;">
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 440px; margin: 0 auto; padding: 40px 32px; background: linear-gradient(135deg, #0f172a 0%, #4a044e 60%, #083344 100%); border-radius: 16px; margin-top: 24px;">

          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; width: 48px; height: 48px; background: linear-gradient(135deg, #a855f7, #7c3aed); border-radius: 14px; line-height: 48px; font-size: 22px; font-weight: 700; color: #fff;">
              A
            </div>
          </div>

          <h1 style="color: #ffffff; font-size: 22px; font-weight: 700; text-align: center; margin: 0 0 12px;">
            Sign in to Audious
          </h1>
          <p style="color: rgba(255,255,255,0.6); font-size: 14px; text-align: center; margin: 0 0 32px; line-height: 1.5;">
            Click the button below to verify it's you and continue.
          </p>

          <div style="text-align: center; margin-bottom: 32px;">
            <a href="${url}" style="display: inline-block; padding: 14px 36px; background: linear-gradient(135deg, #a855f7, #7c3aed); color: #ffffff; text-decoration: none; border-radius: 999px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 16px rgba(124, 58, 237, 0.4);">
              Continue to Audious
            </a>
          </div>

          <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; margin-top: 8px;">
            <p style="color: rgba(255,255,255,0.4); font-size: 12px; line-height: 1.6; margin: 0 0 8px;">
              Or copy and paste this link into your browser:
            </p>
            <code style="display: block; word-break: break-all; color: #c084fc; font-size: 12px; background: rgba(255,255,255,0.05); padding: 10px 12px; border-radius: 8px;">
              ${url}
            </code>
          </div>

          <p style="color: rgba(255,255,255,0.3); font-size: 12px; text-align: center; margin-top: 28px;">
            If you didn't request this email, you can safely ignore it.
          </p>
        </div>
      </body>
    `,
  });

  const failed = result.rejected?.filter(Boolean);
  if (failed && failed.length > 0) {
    throw new Error(`Email could not be sent to: ${failed.join(", ")}`);
  }
}
