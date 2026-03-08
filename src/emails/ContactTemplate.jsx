import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
    Font,
    Row,
    Column,
} from "@react-email/components";
import * as React from "react";

const main = {
    backgroundColor: "#050505",
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundImage: `
    linear-gradient(#303031ff 1px, transparent 1px), 
    linear-gradient(90deg, #303031ff 1px, transparent 1px)
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
    color: "#a1a1aa", // Grey for the text to match screenshot
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

const payloadText = {
    fontSize: "15px",
    color: "#e4e4e7",
    lineHeight: "1.7",
    fontFamily: "'JetBrains Mono', monospace",
    margin: 0,
    whiteSpace: "pre-wrap",
};

const etaBox = {
    backgroundColor: "rgba(34, 197, 94, 0.05)",
    border: "1px solid rgba(34, 197, 94, 0.2)",
    borderRadius: "8px",
    padding: "16px 20px",
    color: "#22c55e",
    fontSize: "14px",
    fontFamily: "'JetBrains Mono', monospace",
    margin: 0,
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

export default function ContactTemplate({
    name = "",
    email = "",
}) {
    const displayName = name || "John Doe";
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
            <Preview>Transmission Received - GreenHacker Protocol</Preview>
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
                                            <span style={dot}></span> SYSTEM PROTOCOL ACTIVE
                                        </Text>
                                    </div>
                                </div>

                                <Heading style={heading}>
                                    Green<span style={{ color: "#22c55e" }}>Hacker</span>
                                </Heading>

                                <Text style={dateText}>{displayDate}</Text>
                            </Section>

                            {/* CONTENT SECTION */}
                            <Section style={contentSection}>

                                <span style={sectionLabel}>➜ ~/contact/init</span>

                                <div style={cardStyles}>
                                    <Text style={{ ...payloadText, color: "#ffffff", fontWeight: "600", marginBottom: "16px" }}>
                                        Hey {displayName},
                                    </Text>
                                    <Text style={payloadText}>
                                        We have received your transmission. Our systems are analyzing your request. Stand by for a handshake.
                                    </Text>
                                </div>

                                <div style={etaBox}>
                                    <Text style={{ margin: 0 }}>
                                        <span style={{ fontWeight: "700" }}>ETA:</span> Expect a response within one Earth rotation (24h).
                                    </Text>
                                </div>
                            </Section>

                            {/* FOOTER */}
                            <Section style={footerContainer}>
                                <Text style={footerText}>SECURE CONNECTION ESTABLISHED // HANDSHAKE PENDING</Text>
                            </Section>
                        </Section>
                    </Container>
                </Section>
            </Body>
        </Html>
    );
}
