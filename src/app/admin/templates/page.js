import { render } from "@react-email/render";
import AdminTemplate from "@/emails/AdminTemplate";
import ContactReplyEmail from "@/emails/ContactTemplate";
import ColdEmailTemplate from "@/emails/ColdEmailTemplate";
import FollowupTemplate from "@/emails/FollowupTemplate";
import TemplateClientPreview from "./TemplateClientPreview";

export default async function TemplatesPage() {
    let adminHtml = "";
    let userHtml = "";
    let coldHtml = "";
    let followupHtml = "";

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

        coldHtml = await render(
            <ColdEmailTemplate
                recipientName="Sarah"
                companyName="TechNova"
                bodyContent={"I saw your recent work at TechNova and was really impressed. Our team is building a decentralized compute network, and we're looking for talented engineers.\n\nWould you be open to a quick 10-minute chat next week to discuss potential synergies?"}
            />
        );

        followupHtml = await render(
            <FollowupTemplate
                recipientName="Sarah"
                subjectReference="our previous email"
                bodyContent="I'm following up on my previous message. Are you still interested in talking?"
            />
        );
    } catch (error) {
        console.error("Failed to render email templates:", error);
    }

    return (
        <TemplateClientPreview
            adminHtml={adminHtml}
            userHtml={userHtml}
            coldHtml={coldHtml}
            followupHtml={followupHtml}
        />
    );
}
