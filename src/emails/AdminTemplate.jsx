import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
    Button,
    Font,
    Row,
    Column,
} from "@react-email/components";
import * as React from "react";

const main = {
    backgroundColor: "#050505",
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundImage: `
    linear-gradient(#59595dff 1px, transparent 1px), 
    linear-gradient(90deg, #59595dff 1px, transparent 1px)
  `,
    backgroundSize: "40px 40px",
    backgroundPosition: "center center",
    minHeight: "100vh",
    color: "#ffffff",
    margin: "0",
    padding: "0",
    width: "100%",
};

const outerWrapper = {
    padding: "40px 20px",
};

const container = { margin: "0 auto", padding: "60px 20px 48px", maxWidth: "600px", width: "100%" };

const ticketWrapper = {
    backgroundColor: "#0a0a0b",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid #1f1f22",
    boxShadow: "0 0 40px rgba(34, 197, 94, 0.05)",
};

const topSection = {
    padding: "48px 40px",
    textAlign: "center",
    borderBottom: "1px solid #1f1f22",
    position: "relative",
};

const topGlow = {
    position: "absolute",
    top: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "200px",
    height: "100px",
    background: "radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(0,0,0,0) 70%)",
    pointerEvents: "none",
};

const badgeContainer = {
    textAlign: "center",
    marginBottom: "24px",
    position: "relative",
    zIndex: 1,
};

const badge = {
    display: "inline-block",
    backgroundColor: "rgba(34, 197, 94, 0.05)",
    border: "1px solid rgba(34, 197, 94, 0.2)",
    borderRadius: "100px",
    padding: "6px 20px",
};

const badgeText = {
    fontSize: "11px",
    fontWeight: "700",
    color: "#a1a1aa",
    letterSpacing: "0.2em",
    fontFamily: "'JetBrains Mono', monospace",
    margin: 0,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
};

const dot = {
    display: "inline-block",
    width: "8px",
    height: "8px",
    backgroundColor: "#22c55e",
    borderRadius: "50%",
    marginRight: "10px",
    boxShadow: "0 0 10px #22c55e",
};

const heading = {
    fontSize: "36px",
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: "-1px",
    lineHeight: "1.1",
    margin: "0 0 16px",
};

const dateText = {
    fontSize: "13px",
    color: "#22c55e",
    fontFamily: "'JetBrains Mono', monospace",
    margin: 0,
};

const contentSection = {
    padding: "40px",
    backgroundColor: "#0a0a0b",
};

const sectionLabel = {
    fontSize: "11px",
    fontWeight: "700",
    color: "#71717a",
    letterSpacing: "0.2em",
    fontFamily: "'JetBrains Mono', monospace",
    textTransform: "uppercase",
    marginBottom: "16px",
    display: "block",
};

const cardStyles = {
    backgroundColor: "#111113",
    border: "1px solid #1f1f22",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "32px",
};

const avatarBox = {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    backgroundColor: "rgba(34, 197, 94, 0.05)",
    border: "1px solid rgba(34, 197, 94, 0.3)",
    display: "inline-block",
    textAlign: "center",
    lineHeight: "48px",
    color: "#22c55e",
    fontSize: "20px",
    fontWeight: "bold",
    marginRight: "16px",
    verticalAlign: "middle",
};

const senderDetailsBox = {
    display: "inline-block",
    verticalAlign: "middle",
};

const senderName = {
    fontSize: "20px",
    fontWeight: "700",
    color: "#ffffff",
    margin: "0 0 4px 0",
};

const senderEmail = {
    fontSize: "14px",
    color: "#a1a1aa",
    margin: 0,
};

const payloadText = {
    fontSize: "15px",
    color: "#e4e4e7",
    lineHeight: "1.7",
    fontFamily: "'JetBrains Mono', monospace",
    margin: 0,
    whiteSpace: "pre-wrap",
};

const actionRow = {
    marginTop: "16px",
    width: "100%",
};

const primaryButton = {
    backgroundColor: "#22c55e",
    borderRadius: "8px",
    color: "#050505",
    fontSize: "15px",
    fontWeight: "700",
    textDecoration: "none",
    textAlign: "center",
    display: "inline-block",
    padding: "16px 24px",
    width: "100%",
    boxSizing: "border-box",
    transition: "all 0.2s",
};

const secondaryButton = {
    backgroundColor: "transparent",
    border: "1px solid #27272a",
    borderRadius: "8px",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "600",
    textDecoration: "none",
    textAlign: "center",
    display: "inline-block",
    padding: "16px 24px",
    width: "100%",
    boxSizing: "border-box",
};

const footerContainer = {
    backgroundColor: "#111113",
    borderTop: "1px solid #1f1f22",
    padding: "24px",
    textAlign: "center",
};

const footerText = {
    fontSize: "11px",
    color: "#52525b",
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: "0.1em",
    margin: 0,
};

export default function AdminTemplate({
    name = "",
    email = "",
    message = "",
}) {
    const displayName = name || "John Doe";
    const displayEmail = email || "john@example.com";
    const displayMessage = message || "Hi, I'd like to hire you for a secret project involving blockchain and AI. We've seen your GitHub and would love to collaborate.";
    const displayDate = new Date().toLocaleString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });

    return (
        <Html>
            <Head>
                <Font fontFamily="Inter" fallbackFontFamily="Helvetica" fontWeight={400} />
                <Font fontFamily="JetBrains Mono" fallbackFontFamily="Courier New" fontWeight={400} />
            </Head>
            <Preview>Project Inquiry from {displayName}</Preview>
            <Body style={main}>
                <Section style={outerWrapper}>
                    <Container style={container}>
                        <Section style={ticketWrapper}>
                            {/* TOP SECTION */}
                            <Section style={topSection}>
                                <div style={topGlow} />

                                <div style={badgeContainer}>
                                    <div style={badge}>
                                        <Text style={badgeText}>
                                            <span style={dot}></span> NEW SIGNAL DETECTED
                                        </Text>
                                    </div>
                                </div>

                                <Heading style={heading}>Project Inquiry</Heading>

                                <Text style={dateText}>{displayDate}</Text>
                            </Section>

                            {/* CONTENT SECTION */}
                            <Section style={contentSection}>

                                <span style={sectionLabel}>SENDER DETAILS</span>

                                <div style={cardStyles}>
                                    <div style={avatarBox}>
                                        {displayName.charAt(0).toUpperCase()}
                                    </div>
                                    <div style={senderDetailsBox}>
                                        <Text style={senderName}>{displayName}</Text>
                                        <Text style={senderEmail}>{displayEmail}</Text>
                                    </div>
                                </div>

                                <span style={sectionLabel}>MESSAGE PAYLOAD</span>

                                <div style={cardStyles}>
                                    <Text style={payloadText}>
                                        {displayMessage}
                                    </Text>
                                </div>

                                {/* ACTION BUTTONS */}
                                <Row style={actionRow}>
                                    <Column style={{ width: "48%", paddingRight: "4%" }}>
                                        <Button href={`mailto:${displayEmail}`} style={primaryButton}>
                                            Reply to Signal
                                        </Button>
                                    </Column>
                                    <Column style={{ width: "48%" }}>
                                        <Button href="https://greenhacker.in/admin" style={secondaryButton}>
                                            Open Dashboard
                                        </Button>
                                    </Column>
                                </Row>
                            </Section>

                            {/* FOOTER */}
                            <Section style={footerContainer}>
                                <Text style={footerText}>SECURE TRANSMISSION // ADMIN EYES ONLY</Text>
                            </Section>
                        </Section>
                    </Container>
                </Section>
            </Body>
        </Html>
    );
}
