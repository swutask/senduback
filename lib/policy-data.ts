export type BulletItem = { label: string; text: string };
export type ListItem = string;
export type InfoBlock = {
  label: string;
  paragraphs?: string[];
  rawContent?: string; // for raw html , like for tables;
  outro?: string;
};

export interface PolicySection {
  id: string;
  number: number;
  title: string;
  intro?: string;
  paragraphs?: string[] | { text: string; list?: string[] }[];
  bullets?: BulletItem[];
  listItems?: ListItem[];
  outro?: string;
  infoBlocks?: InfoBlock[];
  contactBlocks?: InfoBlock[]; // for contact block, will render only for contact section, before outro
}

export const LAST_UPDATED = "13 April 2026";

const PRIVACY_POLICY_SECTIONS: PolicySection[] = [
  {
    id: "intro",
    number: 1,
    title: "Introduction & Data Controller",
    paragraphs: [
      'This Privacy Policy explains how <strong>SendUBack</strong> ("we", "us", "our") collects, uses, stores, and protects your personal data when you use our website at <a href="https://senduback.com" class="text-blue-600 underline hover:text-blue-800">senduback.com</a> and our lost item return services.',
      "SendUBack is the <strong>data controller</strong> for the purposes of the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018. We are committed to protecting your privacy and handling your data in an open, transparent, and lawful manner.",
      'If you have questions about this policy, contact us at <a href="mailto:privacy@senduback.com" class="text-blue-600 underline hover:text-blue-800">privacy@senduback.com</a>.',
    ],
  },
  {
    id: "information",
    number: 2,
    title: "Information We Collect",
    intro:
      "We may collect and process the following categories of personal data:",
    bullets: [
      { label: "Identity data:", text: "Full name, title." },
      {
        label: "Contact data:",
        text: "Email address, telephone number, shipping/delivery address.",
      },
      {
        label: "Hotel stay data:",
        text: "Hotel name, booking reference, dates of stay, room number.",
      },
      {
        label: "Lost item data:",
        text: "Description of lost item(s), photographs or supporting details.",
      },
      {
        label: "Payment data:",
        text: "Payment card details (processed securely via our third-party payment processor — we do not store full card numbers).",
      },
      {
        label: "Technical data:",
        text: "IP address, browser type, device information, cookies, and usage data when you visit our website.",
      },
      {
        label: "Communication data:",
        text: "Records of correspondence between you and our support team.",
      },
    ],
  },
  {
    id: "legal-basis",
    number: 3,
    title: "Legal Basis for Processing",
    intro:
      "Under Article 6 of the UK GDPR, we rely on the following lawful bases to process your personal data:",
    bullets: [
      {
        label: "Performance of a contract (Article 6(1)(b)):",
        text: "Processing is necessary to fulfil our service — locating, packaging, and shipping your lost items back to you.",
      },
      {
        label: "Legitimate interests (Article 6(1)(f)):",
        text: "We may process data for fraud prevention, service improvement, and internal analytics, where our interests do not override your fundamental rights and freedoms.",
      },
      {
        label: "Consent (Article 6(1)(a)):",
        text: "Where you have given explicit consent, for example to receive marketing communications. You may withdraw consent at any time.",
      },
      {
        label: "Legal obligation (Article 6(1)(c)):",
        text: "Where we are required to process data to comply with UK law, such as tax and accounting obligations.",
      },
    ],
  },
  {
    id: "how-we-use",
    number: 4,
    title: "How We Use Your Data",
    intro: "We use your personal data for the following purposes:",
    listItems: [
      "To coordinate the return of your lost items with the relevant hotel.",
      "To arrange shipping and delivery of your belongings.",
      "To process payments for our services.",
      "To communicate with you about your request, including status updates and tracking information.",
      "To provide customer support and respond to enquiries.",
      "To improve our website, services, and user experience.",
      "To send you marketing communications (only with your explicit consent).",
      "To comply with legal and regulatory obligations.",
    ],
  },
  {
    id: "data-sharing",
    number: 5,
    title: "Data Sharing & Third Parties",
    intro:
      "We may share your personal data with the following categories of third parties, only to the extent necessary to provide our services:",
    bullets: [
      {
        label: "Hotel partners:",
        text: "We share your name, booking details, and lost item description with the hotel where you stayed so they can locate and prepare your item for return.",
      },
      {
        label: "Shipping carriers:",
        text: "Your name and delivery address are shared with our logistics partners (e.g., Royal Mail, DHL, FedEx) to fulfil shipment.",
      },
      {
        label: "Payment processors:",
        text: "Payment data is handled by Stripe, our PCI-DSS compliant payment processor. We do not store or have access to your full payment card details.",
      },
      {
        label: "IT and hosting providers:",
        text: "Our website and data are hosted on secure, reputable cloud infrastructure.",
      },
      {
        label: "Professional advisers:",
        text: "We may share data with legal, accounting, or insurance professionals as required.",
      },
    ],
    outro:
      "We do <strong>not</strong> sell your personal data to any third party.",
  },
  {
    id: "international",
    number: 6,
    title: "International Data Transfers",
    intro:
      "As SendUBack operates internationally, your personal data may be transferred to, stored, or processed in countries outside the United Kingdom. Where this occurs, we ensure appropriate safeguards are in place as required by UK GDPR, including:",
    listItems: [
      "Transfers to countries with an adequacy decision from the UK Secretary of State.",
      "Use of <strong>International Data Transfer Agreements (IDTAs)</strong> or the <strong>UK Addendum to the EU Standard Contractual Clauses.</strong>",
      "Other lawful transfer mechanisms as permitted under UK data protection law.",
    ],
  },
  {
    id: "retention",
    number: 7,
    title: "Data Retention",
    intro:
      "We retain your personal data only for as long as necessary to fulfil the purposes for which it was collected:",
    bullets: [
      {
        label: "Service records:",
        text: "Retained for 6 years after completion of your request, in line with UK limitation periods.",
      },
      {
        label: "Marketing consent records:",
        text: "Retained with you withdraw consent.",
      },
      {
        label: "Technical/analytics data:",
        text: "Retained for up to 26 months.",
      },
    ],
    outro:
      "After the retention period, data is securely deleted or anonymised.",
  },
  {
    id: "rights",
    number: 8,
    title: "Your Rights Under UK GDPR",
    intro:
      "Under the UK GDPR and the Data Protection Act 2018, you have the following rights:",
    bullets: [
      {
        label: "Right of access:",
        text: "To receive a copy of the personal data we hold about you (Subject Access Request).",
      },
      {
        label: "Right to rectification:",
        text: "Request correction of inaccurate or incomplete data.",
      },
      {
        label: "Right to erasure:",
        text: 'Request deletion of your data where there is no compelling reason for continued processing (the "right to be forgotten").',
      },
      {
        label: "Right to restrict processing:",
        text: "Request that we limit how we use your data in certain circumstances.",
      },
      {
        label: "Right to portability:",
        text: "Receive your data in a structured, commonly used, machine-readable format.",
      },
      {
        label: "Right to object:",
        text: "Object to processing based on legitimate interests or for direct marketing.",
      },
      {
        label: "Rights related to automated decision-making:",
        text: "You will not be subject to decisions based on automated processing that produce legal effects concerning you.",
      },
    ],
    outro:
      'To exercise any of these rights, please contact us at <a href="mailto:privacy@senduback.com" class="text-blue-600 underline hover:text-blue-800">privacy@senduback.com</a>. We will respond within <strong>one calendar month</strong> as required by law.',
  },
  {
    id: "cookies",
    number: 9,
    title: "Cookies & Tracking Technologies",
    intro:
      "Our website uses cookies and similar technologies to enhance your experience. We use the following types of cookies:",
    bullets: [
      {
        label: "Strictly necessary cookies:",
        text: "Required for the website to function (e.g., session management). These do not require consent.",
      },
      {
        label: "Analytics cookies:",
        text: "Help us understand how visitors use our website (e.g., Google Analytics). Placed only with your consent.",
      },
      {
        label: "Marketing cookies:",
        text: "Used to deliver relevant advertisements. Placed only with your consent.",
      },
    ],
    outro:
      'You can manage your cookie preferences through your browser settings or our cookie consent bar. For more information, see our <a href="/cookie-policy" class="text-blue-600 underline hover:text-blue-800">Cookie Policy</a>.',
  },
  {
    id: "children",
    number: 10,
    title: "Children's Privacy",
    paragraphs: [
      'Our services are not directed at individuals under the age of <strong>13</strong>. We do not knowingly collect personal data from children. If you believe we have inadvertently collected data from a child, please contact us immediately at <a href="mailto:privacy@senduback.com" class="text-blue-600 underline hover:text-blue-800">privacy@senduback.com</a> and we will take steps to delete it.',
    ],
  },
  {
    id: "security",
    number: 11,
    title: "Data Security",
    intro:
      "We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, loss, or disclosure. These measures include:",
    bullets: [
      {
        label: "SSL/TLS encryption",
        text: "for all data transmitted via our website.",
      },
      { label: "Secure, access-controlled hosting environments.", text: "" },
      {
        label: "Regular security assessments",
        text: "and vulnerability testing.",
      },
      {
        label: "Staff training",
        text: "on data protection and confidentiality.",
      },
    ],
    outro:
      "While we take every reasonable precaution, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security of your data.",
  },
  {
    id: "stripe",
    number: 12,
    title: "Secure Payments by Stripe",
    intro:
      "We use Stripe as our trusted third-party payment processor. When you make a payment through our website, your payment card details are submitted directly to Stripe's secure servers and are never stored, processed, or accessible by SendUBack.",
    bullets: [
      {
        label: "PCI DSS Level 1 certification",
        text: "— the highest level of security certification in the payments industry.",
      },
      {
        label: "End-to-end encryption",
        text: "— all payment data is encrypted using AES-256 and transmitted over TLS.",
      },
      {
        label: "Tokenisation",
        text: "— card details are replaced with secure tokens, so sensitive data never touches our servers.",
      },
      {
        label: "Fraud prevention",
        text: "— Stripe Radar uses machine learning to detect and block fraudulent transactions in real time.",
      },
    ],
    outro:
      'Stripe may collect and process limited personal data (such as your name, email, and billing address) in accordance with their own privacy policy. For more information, please refer to <a href="https://stripe.com/privacy" class="text-blue-600 underline hover:text-blue-800">Stripe\'s Privacy Policy</a>.',
  },
  {
    id: "changes",
    number: 13,
    title: "Changes to This Policy",
    paragraphs: [
      `We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last updated" date. Where changes are significant, we will notify you by email or through a prominent notice on our website.`,
      "We encourage you to review this policy periodically to stay informed about how we protect your data.",
    ],
  },
  {
    id: "contact",
    number: 14,
    title: "Contact Us & Complaints",
    intro:
      "If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your personal data, please contact:",
    contactBlocks: [
      {
        label: "SendUBack — Data Protection",
        paragraphs: [
          `Email: <a href=\"mailto:privacy@senduback.com\" class=\"text-blue-600 underline hover:text-blue-800\">privacy@senduback.com</a>`,
          `Website: <a href=\"https://senduback.com\" class=\"text-blue-600 underline hover:text-blue-800\">senduback.com</a>`,
        ],
      },
    ],
    outro:
      "If you are not satisfied with how we handle your data or your complaint, you have the right to lodge a complaint with the <strong>Information Commissioner's Office (ICO)</strong>, the UK's independent authority set up to uphold information rights:",
    infoBlocks: [
      {
        label: `Information Commissioner's Office`,
        paragraphs: [
          `Website: <a href=\"https://ico.org.uk/\" class=\"text-blue-600 underline hover:text-blue-800\">ico.org.uk</a>`,
          `Telephone: 0303 123 1113`,
          `Address: Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF`,
        ],
      },
    ],
  },
];

// ─── Add this to your existing policy-data.ts ────────────────────────────────
// Replace the existing POLICY_DATA export with the one at the bottom of this file.

const COOKIE_TABLE_STYLES = `
  <style>
    .cookie-table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px; }
    .cookie-table thead tr { border-bottom: 1px solid #e5e7eb; }
    .cookie-table th { text-align: left; padding: 6px 10px 8px; font-weight: 600; color: #374151; font-size: 12px; }
    .cookie-table td { padding: 7px 10px; color: #4b5563; border-bottom: 1px solid #f3f4f6; vertical-align: top; }
    .cookie-table tr:last-child td { border-bottom: none; }
    .cookie-table td:first-child { font-family: monospace; font-size: 12px;  }
  </style>
`;

const STRICTLY_NECESSARY_TABLE = `
  ${COOKIE_TABLE_STYLES}
  <table class="cookie-table">
    <thead><tr><th>Cookie</th><th>Purpose</th><th>Duration</th></tr></thead>
    <tbody>
      <tr><td>cookie_consent</td><td>Stores your cookie consent preference</td><td>1 year</td></tr>
      <tr><td>session_id</td><td>Maintains your session while using the service</td><td>Session</td></tr>
      <tr><td>csrf_token</td><td>Protects against cross-site request forgery attacks</td><td>Session</td></tr>
    </tbody>
  </table>
`;

const ANALYTICS_TABLE = `
  <table class="cookie-table">
    <thead><tr><th>Cookie</th><th>Purpose</th><th>Duration</th></tr></thead>
    <tbody>
      <tr><td>_ga</td><td>Google Analytics — distinguishes unique users</td><td>2 years</td></tr>
      <tr><td>_ga_*</td><td>Google Analytics 4 — maintains session state</td><td>2 years</td></tr>
      <tr><td>_gid</td><td>Google Analytics — distinguishes users</td><td>24 hours</td></tr>
    </tbody>
  </table>
`;

const MARKETING_TABLE = `
  <table class="cookie-table">
    <thead><tr><th>Cookie</th><th>Purpose</th><th>Duration</th></tr></thead>
    <tbody>
      <tr><td>_fbp</td><td>Facebook Pixel — delivers targeted advertising</td><td>3 months</td></tr>
      <tr><td>_gcl_au</td><td>Google Ads — tracks ad conversions</td><td>3 months</td></tr>
    </tbody>
  </table>
`;

const COOKIE_POLICY_SECTIONS: PolicySection[] = [
  {
    id: "what-are-cookies",
    number: 1,
    title: "What Are Cookies?",
    paragraphs: [
      "Cookies are small text files that are placed on your device (computer, tablet, or mobile phone) when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners.",
      "Cookies allow a website to recognise your device and remember information about your visit, such as your preferences and settings. Similar technologies include pixels, web beacons, and local storage.",
    ],
  },
  {
    id: "how-we-use-cookies",
    number: 2,
    title: "How We Use Cookies",
    intro: "SendUBack uses cookies for the following purposes:",
    listItems: [
      "To ensure our website functions correctly and securely.",
      "To remember your cookie consent preferences.",
      "To understand how visitors use our website so we can improve it.",
      "To deliver relevant content and measure the effectiveness of our communications.",
    ],
    outro:
      "Under the <strong>Privacy and Electronic Communications Regulations (PECR)</strong>, we are required to obtain your consent before placing any cookies on your device, except those that are <strong>strictly necessary</strong> for the operation of our website.",
  },
  {
    id: "types-of-cookies",
    number: 3,
    title: "Types of Cookies We Use",
    infoBlocks: [
      {
        label: "Strictly Necessary Cookies",
        paragraphs: [
          "These cookies are essential for the website to function. They cannot be switched off. They are usually set in response to actions you take, such as setting your privacy preferences or filling in forms.",
        ],
        rawContent: STRICTLY_NECESSARY_TABLE,
      },
      {
        label: "Analytics Cookies",
        paragraphs: [
          "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. They are only set with your consent.",
        ],
        rawContent: ANALYTICS_TABLE,
      },
      {
        label: "Marketing Cookies",
        paragraphs: [
          "These cookies are used to track visitors across websites to display relevant advertisements. They are only set with your consent.",
        ],
        rawContent: MARKETING_TABLE,
      },
    ],
  },
  {
    id: "third-party-cookies",
    number: 4,
    title: "Third-Party Cookies",
    intro:
      "Some cookies are placed by third-party services that appear on our pages. We do not control these cookies. The third parties who set these cookies include:",
    bullets: [
      {
        label: "Google Analytics",
        text: '— for website usage analysis. <a href="https://policies.google.com/privacy" class="text-blue-600 underline hover:text-blue-800">Google Privacy Policy</a>',
      },
      {
        label: "Payment processors",
        text: "— for secure payment handling (e.g., Stripe). These may set cookies necessary to process transactions securely.",
      },
      {
        label: "Social media platforms",
        text: "— if you interact with social sharing features, those platforms may set their own cookies.",
      },
    ],
    outro:
      "We recommend reviewing the privacy and cookie policies of these third parties for further information.",
  },
  {
    id: "manage-cookies",
    number: 5,
    title: "How to Manage Cookies",
    paragraphs: [
      {
        text: "You can control and manage cookies in several ways. Please note that removing or blocking cookies may impact your experience on our website.",
      },
      {
        text: "<strong>Cookie consent banner:</strong> When you first visit our website, you can accept or reject non-essential cookies using the banner at the bottom of the page.",
      },
      {
        text: `<strong>Browser settings:</strong> Most browsers allow you to manage cookies through their settings. Common browsers:`,
        list: [
          '<a href="https://support.google.com/chrome/answer/95647" class="text-blue-600 underline hover:text-blue-800">Google Chrome</a>',
          '<a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" class="text-blue-600 underline hover:text-blue-800">Mozilla Firefox</a>',
          '<a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" class="text-blue-600 underline hover:text-blue-800">Apple Safari</a>',
          '<a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" class="text-blue-600 underline hover:text-blue-800">Microsoft Edge</a>',
        ],
      },
    ],

    outro:
      '<strong>Opt-out tools:</strong> You can opt out of Google Analytics tracking by installing the <a href="https://tools.google.com/dlpage/gaoptout" class="text-blue-600 underline hover:text-blue-800">Google Analytics Opt-out Browser Add-on</a>.',
  },
  {
    id: "cookie-policy-changes",
    number: 6,
    title: "Changes to This Cookie Policy",
    paragraphs: [
      'We may update this Cookie Policy from time to time to reflect changes in our use of cookies or for legal, regulatory, or operational reasons. Any changes will be posted on this page with an updated "Last updated" date.',
    ],
  },
  {
    id: "contact",
    number: 7,
    title: "Contact Us",
    intro:
      "If you have any questions about our use of cookies, please contact us:",
    contactBlocks: [
      {
        label: "SendUBack — Data Protection",
        paragraphs: [
          'Email: <a href="mailto:privacy@senduback.com" class="text-blue-600 underline hover:text-blue-800">privacy@senduback.com</a>',
          'Website: <a href="https://senduback.com" class="text-blue-600 underline hover:text-blue-800">senduback.com</a>',
        ],
      },
    ],
    outro:
      'For more information about cookies and your rights, visit the <a href=" https://ico.org.uk/for-the-public/online/cookies/" class="text-blue-600 underline hover:text-blue-800">ICO\'s guidance on cookies</a>.',
  },
];

export type POLICY_TYPE = "cookie" | "privacy";

export const POLICY_DATA: Partial<Record<POLICY_TYPE, PolicySection[]>> = {
  privacy: PRIVACY_POLICY_SECTIONS,
  cookie: COOKIE_POLICY_SECTIONS,
};
