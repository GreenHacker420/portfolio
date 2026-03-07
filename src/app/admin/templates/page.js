import { render } from "@react-email/render";
import AdminTemplate from "@/emails/AdminTemplate";
import ContactReplyEmail from "@/emails/ContactTemplate";
import TemplateClientPreview from "./TemplateClientPreview";

export default async function TemplatesPage() {
    let adminHtml = "";
    let userHtml = "";

    try {
        adminHtml = await render(
            <AdminTemplate
                name="John Doe"
                email="john@example.com"
                subject="Project Inquiry"
                message="Hi, I'd like to hire you for a secret project involving blockchain and AI. We've seen your GitHub and would love to collaborate."
                date={new Date().toLocaleString()}
            />
        );

        userHtml = await render(
            <ContactReplyEmail
                customerName="John Doe"
            />
        );
    } catch (error) {
        console.error("Failed to render email templates:", error);
    }

    return (
        <TemplateClientPreview adminHtml={adminHtml} userHtml={userHtml} />
    );
}
