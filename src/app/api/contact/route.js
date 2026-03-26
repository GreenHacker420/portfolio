
import { sendMail } from "@/lib/mail";
import { render } from "@react-email/render";
import ContactReplyEmail from "@/emails/ContactTemplate";
import AdminTemplate from "@/emails/AdminTemplate";
import { createContactRecord } from "@/repositories/contact.repository";
import { withApiHandler, apiOk } from "@/lib/apiResponse";
import { getClientIp, requireRateLimit } from "@/lib/guard";

export const POST = withApiHandler(async (req) => {
    const ip = await getClientIp();
    await requireRateLimit(`contact:${ip}`, 5, 60_000);

    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
        throw new Error("Missing required fields");
    }

    // Save to Database via Repository
    const contact = await createContactRecord({
        name,
        email,
        subject: subject || "No Subject",
        message,
        source: "website",
    });

    const adminEmail = process.env.EMAIL_USER;

    // 1. Send Notification to Admin
    const adminHtml = await render(
        <AdminTemplate
            name={name}
            email={email}
            subject={subject || "No Subject"}
            message={message}
            date={new Date().toLocaleString()}
        />
    );

    await sendMail({
        to: adminEmail,
        subject: `[New Contact] ${subject || "No Subject"}`,
        html: adminHtml,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    });

    // 2. Send Acknowledgment to User
    const userHtml = await render(
        <ContactReplyEmail
            customerName={name}
        />
    );

    await sendMail({
        to: email,
        subject: "Transmission Received // GreenHacker",
        html: userHtml,
        text: "We have received your message. Stand by."
    });

    return apiOk({ success: true, contactId: contact.id });
});
