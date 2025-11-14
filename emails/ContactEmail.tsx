import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Hr,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from '@react-email/components';

interface ContactEmailProps {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message: string;
}

export default function ContactEmail({
  firstName,
  lastName,
  email,
  phone,
  message,
}: ContactEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New contact form message from {firstName} {lastName}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with brand color */}
          <Section style={header}>
            <Heading style={h1}>GArts Education</Heading>
            <Text style={subtitle}>New Contact Form Submission</Text>
          </Section>

          {/* Contact Information Card */}
          <Section style={infoCard}>
            <Row>
              <Column style={columnLeft}>
                <Text style={label}>Contact Name</Text>
                <Text style={text}>
                  {firstName} {lastName}
                </Text>
              </Column>
            </Row>

            <Hr style={divider} />

            <Row>
              <Column style={columnLeft}>
                <Text style={label}>Email Address</Text>
                <Text style={text}>
                  <a href={`mailto:${email}`} style={link}>
                    {email}
                  </a>
                </Text>
              </Column>
            </Row>

            {phone && (
              <>
                <Hr style={divider} />
                <Row>
                  <Column style={columnLeft}>
                    <Text style={label}>Phone Number</Text>
                    <Text style={text}>
                      <a href={`tel:${phone}`} style={link}>
                        {phone}
                      </a>
                    </Text>
                  </Column>
                </Row>
              </>
            )}
          </Section>

          {/* Message Section */}
          <Section style={messageSection}>
            <Text style={label}>Message</Text>
            <Section style={messageBox}>
              <Text style={messageText}>{message}</Text>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footerSection}>
            <Hr style={hr} />
            <Text style={footer}>
              This message was sent from the GArts Education contact form
            </Text>
            <Text style={footerSmall}>
              Please respond within 24 hours for the best customer experience
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f3f4f6',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  padding: '20px 0',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  borderRadius: '12px',
  overflow: 'hidden',
  maxWidth: '600px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
};

const header = {
  backgroundColor: '#ff8500',
  padding: '32px 40px',
  textAlign: 'center' as const,
};

const h1 = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
  letterSpacing: '-0.5px',
};

const subtitle = {
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0',
  opacity: 0.95,
};

const infoCard = {
  backgroundColor: '#f9fafb',
  margin: '32px 40px',
  padding: '24px',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
};

const columnLeft = {
  width: '100%',
};

const label = {
  color: '#6b7280',
  fontSize: '11px',
  fontWeight: '700',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: '0 0 6px',
};

const text = {
  color: '#1f2937',
  fontSize: '16px',
  fontWeight: '500',
  margin: '0',
  lineHeight: '24px',
};

const divider = {
  borderColor: '#e5e7eb',
  margin: '16px 0',
};

const messageSection = {
  padding: '0 40px',
  marginBottom: '32px',
};

const messageBox = {
  backgroundColor: '#f9fafb',
  border: '2px solid #e5e7eb',
  borderRadius: '8px',
  padding: '20px',
  marginTop: '12px',
};

const messageText = {
  color: '#1f2937',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
};

const link = {
  color: '#ff8500',
  textDecoration: 'none',
  fontWeight: '500',
};

const footerSection = {
  padding: '0 40px 32px',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '0 0 24px 0',
};

const footer = {
  color: '#6b7280',
  fontSize: '13px',
  margin: '0 0 8px',
  textAlign: 'center' as const,
};

const footerSmall = {
  color: '#9ca3af',
  fontSize: '11px',
  margin: '0',
  textAlign: 'center' as const,
  fontStyle: 'italic' as const,
};
