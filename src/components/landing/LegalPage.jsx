/**
 * SalesCloserPro - Legal & Compliance Page
 * Copyright (c) 2026 Brent Girolimon / llmadvisor.ai
 * Powered by highsignal™
 * Licensed under Apache-2.0
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Shield,
  FileText,
  Lock,
  Globe,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Scale,
  Eye,
  CreditCard,
  Bot,
  Package,
  Gavel,
} from 'lucide-react'

const LAST_UPDATED = 'February 26, 2026'
const APP_VERSION  = '1.0.0'
const CONTACT_EMAIL = 'legal@llmadvisor.ai'

/* ── collapsible section ── */
function Section({ id, icon: Icon, title, color = 'text-blue-400', children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div id={id} className="border border-white/[0.07] rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-white/[0.03] transition-colors"
      >
        <span className={`flex-shrink-0 ${color}`}><Icon className="w-5 h-5" /></span>
        <span className="flex-1 font-semibold text-white text-base">{title}</span>
        {open
          ? <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
          : <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
        }
      </button>
      {open && (
        <div className="px-6 pb-7 pt-1 space-y-4 text-sm text-slate-400 leading-relaxed border-t border-white/[0.05]">
          {children}
        </div>
      )}
    </div>
  )
}

/* ── sub-heading ── */
const H = ({ children }) => (
  <h4 className="text-white font-semibold mt-5 mb-1.5 text-[13px] uppercase tracking-wider">{children}</h4>
)

/* ── inline highlight ── */
const Hi = ({ children }) => <strong className="text-slate-200">{children}</strong>

/* ── anchor link ── */
const Ext = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer"
    className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-0.5 transition-colors">
    {children} <ExternalLink className="w-3 h-3 opacity-70" />
  </a>
)

/* ── toc item ── */
const TocItem = ({ href, children }) => (
  <a href={href} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors py-0.5">
    <ChevronRight className="w-3 h-3 text-slate-600 flex-shrink-0" />
    {children}
  </a>
)

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 antialiased">

      {/* ── header nav ── */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-slate-950/90 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logos/salescloserprologo.png" alt="" className="h-7 w-auto" />
            <span className="font-bold text-white text-sm">SalesCloserPro</span>
          </Link>
          <Link to="/" className="text-sm text-slate-400 hover:text-white transition-colors">← Back to Home</Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-14">

        {/* ── hero ── */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <Scale className="w-5 h-5 text-blue-400" />
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Legal &amp; Compliance</h1>
          </div>
          <p className="text-slate-400 text-base leading-relaxed max-w-2xl">
            Policies, disclosures, and compliance information for SalesCloserPro — the free, open-source sales quoting
            and CRM platform. Please read these documents before using the software.
          </p>
          <div className="flex flex-wrap gap-4 mt-5">
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20">
              Last updated: {LAST_UPDATED}
            </span>
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/[0.05] text-slate-400 border border-white/[0.08]">
              App version: {APP_VERSION}
            </span>
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-green-500/10 text-green-300 border border-green-500/20">
              Open-source · Apache-2.0
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-[220px_1fr] gap-10">

          {/* ── table of contents ── */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Contents</p>
              <nav className="space-y-0.5">
                <TocItem href="#terms">Terms of Use</TocItem>
                <TocItem href="#privacy">Privacy Policy</TocItem>
                <TocItem href="#data">Data Storage</TocItem>
                <TocItem href="#ai">AI &amp; ChatGPT Usage</TocItem>
                <TocItem href="#payments">Payments &amp; Crypto</TocItem>
                <TocItem href="#affiliate">Affiliate Disclosure</TocItem>
                <TocItem href="#gdpr">GDPR (EU)</TocItem>
                <TocItem href="#ccpa">CCPA (California)</TocItem>
                <TocItem href="#coppa">COPPA (Children)</TocItem>
                <TocItem href="#export">Export &amp; Sanctions</TocItem>
                <TocItem href="#dmca">DMCA &amp; IP</TocItem>
                <TocItem href="#opensource">Open-Source License</TocItem>
                <TocItem href="#disclaimer">Disclaimer &amp; Liability</TocItem>
                <TocItem href="#changes">Policy Changes</TocItem>
                <TocItem href="#contact">Contact</TocItem>
              </nav>
            </div>
          </aside>

          {/* ── policy sections ── */}
          <div className="space-y-3">

            {/* ── 1. TERMS OF USE ── */}
            <Section id="terms" icon={FileText} title="Terms of Use" color="text-blue-400" defaultOpen={true}>
              <p>
                By downloading, installing, or using SalesCloserPro ("the Software"), you agree to these Terms of Use.
                If you do not agree, do not use the Software.
              </p>
              <H>Permitted Use</H>
              <p>
                SalesCloserPro is <Hi>free software licensed under Apache-2.0</Hi>. You may use it for personal,
                commercial, and internal business purposes. You may modify, distribute, and sublicense the software
                in accordance with the Apache-2.0 License terms.
              </p>
              <H>Prohibited Activities</H>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>Using the Software to engage in fraud, misrepresentation, or illegal activity</li>
                <li>Rebranding and selling the Software while misrepresenting it as originally authored by you</li>
                <li>Using the Software to send unsolicited commercial messages (spam) in violation of CAN-SPAM, CASL, or GDPR</li>
                <li>Attempting to reverse-engineer third-party integrations (MoonPay, Google, etc.) beyond their published APIs</li>
                <li>Using the Software in violation of any applicable local, national, or international law</li>
              </ul>
              <H>No Warranties</H>
              <p>
                SalesCloserPro is provided <Hi>"AS IS"</Hi> without warranty of any kind. Use at your own risk. The authors
                make no guarantees of uptime, data integrity, accuracy of tax calculations, or fitness for any particular purpose.
                Always verify financial figures independently.
              </p>
              <H>Governing Law</H>
              <p>
                These terms are governed by the laws of the State of Delaware, United States, without regard to conflict of
                law provisions. Any disputes shall be resolved in binding arbitration rather than litigation, except where
                prohibited by law.
              </p>
            </Section>

            {/* ── 2. PRIVACY POLICY ── */}
            <Section id="privacy" icon={Lock} title="Privacy Policy" color="text-green-400">
              <p>
                SalesCloserPro is built around a <Hi>privacy-first architecture</Hi>. It does not collect, transmit,
                or sell personal data to any third party. No account is required to use the software.
              </p>
              <H>What We Do NOT Collect</H>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>No analytics, tracking pixels, or cookies from us</li>
                <li>No user accounts or cloud profiles</li>
                <li>No telemetry or crash reporting sent to our servers</li>
                <li>No email addresses, names, or payment details</li>
                <li>No behavioral profiling</li>
              </ul>
              <H>Developer Contact Data</H>
              <p>
                If you contact us voluntarily (e.g., via GitHub Issues or email at{' '}
                <Hi>{CONTACT_EMAIL}</Hi>), your message and contact details are used solely to respond
                to your inquiry and are not shared with third parties.
              </p>
              <H>Third-Party Services</H>
              <p>
                When you use integrations (MoonPay Commerce, Google Workspace, Namecheap, Cloudflare, Gemini, etc.),
                those services' own privacy policies govern data you submit to them. We encourage you to review:
              </p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li><Ext href="https://www.moonpay.com/legal/privacy_policy">MoonPay Privacy Policy</Ext></li>
                <li><Ext href="https://policies.google.com/privacy">Google Privacy Policy</Ext></li>
                <li><Ext href="https://www.namecheap.com/legal/general/privacy-policy/">Namecheap Privacy Policy</Ext></li>
                <li><Ext href="https://www.cloudflare.com/privacypolicy/">Cloudflare Privacy Policy</Ext></li>
                <li><Ext href="https://www.gemini.com/legal/privacy-policy">Gemini Privacy Policy</Ext></li>
              </ul>
            </Section>

            {/* ── 3. DATA STORAGE ── */}
            <Section id="data" icon={Shield} title="Data Storage &amp; Security" color="text-cyan-400">
              <p>
                All application data — quotes, clients, pipeline, settings, company logo, and purchase orders — is
                stored exclusively in your browser's <Hi>localStorage</Hi> (web app) or in the Electron app's local
                data directory (desktop). No data is transmitted to any server operated by SalesCloserPro or
                llmadvisor.ai.
              </p>
              <H>Data Portability</H>
              <p>
                The built-in Backup &amp; Restore feature lets you export a complete JSON snapshot of all your data
                at any time. You own your data fully and may delete it by clearing localStorage or uninstalling the app.
              </p>
              <H>Security Responsibilities</H>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>Protect your device with appropriate physical and software security measures</li>
                <li>Do not store the app on shared or publicly accessible computers if data is sensitive</li>
                <li>Encrypt your drive if the database contains personally identifiable information (PII) of clients</li>
                <li>Regularly back up your data; we cannot recover lost localStorage data</li>
              </ul>
              <H>MoonPay API Key Security</H>
              <p>
                Your MoonPay <Hi>publishable API key</Hi> (pk_live_ / pk_test_) is stored in localStorage. Publishable
                keys are designed for client-side use and cannot access funds. Never enter your MoonPay secret key
                in any frontend application. Rotate keys immediately if you suspect compromise.
              </p>
              <H>Electron Desktop App</H>
              <p>
                The desktop build uses Electron with <Hi>contextIsolation: true</Hi> and <Hi>nodeIntegration: false</Hi>.
                The preload script exposes a minimal, scoped API surface. Auto-update is not enabled; updates are distributed
                manually through GitHub Releases.
              </p>
            </Section>

            {/* ── 4. AI USAGE ── */}
            <Section id="ai" icon={Bot} title="AI &amp; ChatGPT Usage Disclosure" color="text-violet-400">
              <p>
                SalesCloserPro was <Hi>developed with assistance from AI tools</Hi> including OpenAI ChatGPT (GPT-4o),
                Anthropic Claude, and GitHub Copilot. This section discloses how AI is involved in the product and
                what users should know.
              </p>
              <H>AI-Assisted Development</H>
              <p>
                Code, UI copy, documentation, and this policy document were drafted with AI co-authorship and subsequently
                reviewed and edited by a human developer. AI-generated content has been audited for accuracy but may
                contain errors. You should not rely solely on any in-app guidance for legal, tax, or financial decisions.
              </p>
              <H>No AI Processing of Your Data</H>
              <p>
                SalesCloserPro does <Hi>not</Hi> send your data (quotes, client names, amounts, etc.) to any AI service.
                There are no AI APIs called by the application at runtime. Your business data stays on your device.
              </p>
              <H>OpenAI Usage Policy Compliance</H>
              <p>
                Development use of ChatGPT complied with OpenAI's{' '}
                <Ext href="https://openai.com/policies/usage-policies">Usage Policies</Ext>. No prohibited use cases
                (deception, harm, illegal activities) were involved in building this software. The software does not
                wrap or re-sell OpenAI's API.
              </p>
              <H>Future AI Features</H>
              <p>
                If AI-powered features are added in future versions (e.g., quote drafting assistance), this policy will
                be updated before release. Any AI feature will be opt-in with explicit disclosure of what data is
                transmitted and to which provider.
              </p>
              <H>User Responsibility</H>
              <p>
                Tax rate lookups, quote calculations, and business recommendations provided by the app are for
                informational purposes only. Always consult a qualified accountant, attorney, or financial advisor
                before making business, tax, or legal decisions.
              </p>
            </Section>

            {/* ── 5. PAYMENTS ── */}
            <Section id="payments" icon={CreditCard} title="Payments, Crypto &amp; MoonPay Disclosure" color="text-purple-400">
              <p>
                SalesCloserPro integrates with <Hi>MoonPay Commerce</Hi> to enable optional crypto payment acceptance.
                This section discloses the nature of that integration and important legal considerations.
              </p>
              <H>Nature of Integration</H>
              <p>
                SalesCloserPro is a <Hi>software tool</Hi>, not a payment processor, money transmitter, or financial
                institution. The MoonPay integration constructs a payment URL using your API key and wallet address.
                All payment processing, KYC/AML verification, and fund custody are handled solely by MoonPay.
              </p>
              <p>
                MoonPay USA LLC is a registered money service business (NMLS ID: 2071245) and is regulated in multiple
                jurisdictions. Learn more at{' '}
                <Ext href="https://www.moonpay.com/legal">moonpay.com/legal</Ext>.
              </p>
              <H>No Money Transmission License Required from Users</H>
              <p>
                When using MoonPay Commerce to accept payments, you are a <Hi>merchant</Hi> receiving funds into your
                own wallet — not a money transmitter. However, depending on your jurisdiction and business model, you
                may have obligations under tax law, MSB regulations, or securities law. Consult a legal professional.
              </p>
              <H>Cryptocurrency Risks</H>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li><Hi>Price volatility:</Hi> Non-stablecoin crypto (ETH, BTC, SOL) can change value rapidly. You bear all volatility risk.</li>
                <li><Hi>Irreversibility:</Hi> On-chain transactions cannot be reversed. Verify all wallet addresses before sharing with clients.</li>
                <li><Hi>Regulatory uncertainty:</Hi> Crypto regulations vary by country and evolve frequently. Check local law before accepting crypto payments commercially.</li>
                <li><Hi>Tax obligations:</Hi> Receiving cryptocurrency may be a taxable event in your jurisdiction. The app does not provide tax advice.</li>
                <li><Hi>Wallet security:</Hi> You are solely responsible for securing your private keys and wallet.</li>
              </ul>
              <H>Stablecoins (USDC, USDT)</H>
              <p>
                USDC is issued by Circle Internet Financial and is regulated as an e-money product in some jurisdictions.
                USDT is issued by Tether Operations Limited. These assets aim for 1:1 USD parity but are not guaranteed
                by any government or deposit insurance scheme.
              </p>
              <H>AML / Sanctions Compliance</H>
              <p>
                MoonPay performs identity verification and AML screening on transaction counterparties per applicable law.
                You must not use this integration to receive funds from sanctioned individuals, entities, or countries
                as defined by OFAC, HM Treasury, or equivalent authorities.
              </p>
            </Section>

            {/* ── 6. AFFILIATE ── */}
            <Section id="affiliate" icon={Globe} title="Affiliate &amp; Referral Disclosure" color="text-amber-400">
              <p>
                SalesCloserPro's landing page contains affiliate and referral links. In compliance with the{' '}
                <Hi>FTC's Endorsement Guides (16 CFR Part 255)</Hi>, ASA (UK), and equivalent advertising standards
                bodies globally, we disclose all material connections.
              </p>
              <H>Identified Affiliate Relationships</H>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="text-slate-500 border-b border-white/[0.06]">
                      <th className="text-left py-2 pr-4 font-semibold uppercase tracking-wider">Partner</th>
                      <th className="text-left py-2 pr-4 font-semibold uppercase tracking-wider">Relationship</th>
                      <th className="text-left py-2 font-semibold uppercase tracking-wider">Compensation</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-1">
                    {[
                      ['Namecheap', 'Affiliate (Commission Junction)', 'Commission on qualifying purchases'],
                      ['Gemini Credit Card', 'Referral link', 'Referral bonus if approved'],
                      ['Zoho Mail', 'Affiliate link', 'Commission on qualifying purchases'],
                      ['Buy Me a Coffee', 'Direct support', 'Voluntary tips to developer'],
                      ['MoonPay Commerce', 'Integration partner', 'No direct compensation; used in-app'],
                      ['Cloudflare', 'Non-affiliate link', 'No compensation'],
                      ['Google Workspace', 'Non-affiliate link', 'No compensation'],
                    ].map(([p, r, c]) => (
                      <tr key={p} className="border-b border-white/[0.04]">
                        <td className="py-2 pr-4 text-slate-300 font-medium">{p}</td>
                        <td className="py-2 pr-4 text-slate-400">{r}</td>
                        <td className="py-2 text-slate-400">{c}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3">
                Affiliate relationships do not influence product recommendations. All linked services are used by or
                recommended to the developer independently of compensation. Users are never required to use any
                linked service — all are optional.
              </p>
            </Section>

            {/* ── 7. GDPR ── */}
            <Section id="gdpr" icon={Shield} title="GDPR — European Union / EEA Compliance" color="text-blue-300">
              <p>
                The General Data Protection Regulation (GDPR) (EU) 2016/679 applies to personal data of EU/EEA data subjects.
                Because SalesCloserPro does not collect or process personal data on behalf of users, many GDPR obligations
                are not directly triggered. However, <Hi>you as a user</Hi> may be subject to GDPR as a data controller
                if you use SalesCloserPro to store personal data about your clients.
              </p>
              <H>Our Role (Data Processor / Controller)</H>
              <p>
                We are <Hi>not</Hi> a data processor in the GDPR sense because no personal data is transmitted to our
                systems. All processing happens locally on your device. You are the sole data controller for any
                personal data stored within the app.
              </p>
              <H>Your Obligations as a User-Controller</H>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>Have a legal basis for storing EU client data (legitimate interest or consent)</li>
                <li>Honor data subject access requests (export a client's data from the Clients section)</li>
                <li>Honor erasure requests by deleting the client's record from the app</li>
                <li>Implement appropriate technical measures (encrypted drive recommended for EU client data)</li>
                <li>Do not store special-category data (health, religion, etc.) in the app without explicit consent</li>
              </ul>
              <H>Data Transfers</H>
              <p>
                Storing client data in an Electron app on your device does not constitute a cross-border data transfer.
                If you use cloud backup (e.g., copying the exported JSON to cloud storage), ensure that the cloud provider
                offers GDPR-adequate protections (standard contractual clauses or adequacy decision).
              </p>
              <H>Right to Erasure (Right to Be Forgotten)</H>
              <p>
                To delete all application data: clear your browser's localStorage under the key{' '}
                <code className="bg-white/[0.06] px-1.5 py-0.5 rounded text-xs font-mono">salescloserpro-data</code>{' '}
                or run{' '}
                <code className="bg-white/[0.06] px-1.5 py-0.5 rounded text-xs font-mono">localStorage.clear()</code>{' '}
                in DevTools. Individual records can be deleted by their respective Delete buttons in the UI.
              </p>
            </Section>

            {/* ── 8. CCPA ── */}
            <Section id="ccpa" icon={Shield} title="CCPA — California Consumer Privacy Act" color="text-indigo-400">
              <p>
                The California Consumer Privacy Act (CCPA / CPRA) grants California residents specific rights regarding
                their personal information.
              </p>
              <H>Sale of Personal Information</H>
              <p>
                <Hi>We do not sell personal information.</Hi> SalesCloserPro does not collect or sell any personal
                information belonging to users or their clients. No third-party advertising networks receive data
                from this application.
              </p>
              <H>California Rights (as applicable)</H>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li><Hi>Right to Know:</Hi> What personal information is collected — none by us; your data stays local.</li>
                <li><Hi>Right to Delete:</Hi> Delete all data via localStorage.clear() or the app's Backup section.</li>
                <li><Hi>Right to Opt-Out:</Hi> Not applicable — no selling or sharing of data occurs.</li>
                <li><Hi>Right to Non-Discrimination:</Hi> Exercising your privacy rights will not affect your ability to use the free software.</li>
              </ul>
              <H>Contact for CCPA Requests</H>
              <p>Email: <Hi>{CONTACT_EMAIL}</Hi></p>
            </Section>

            {/* ── 9. COPPA ── */}
            <Section id="coppa" icon={AlertTriangle} title="COPPA — Children's Online Privacy" color="text-orange-400">
              <p>
                The Children's Online Privacy Protection Act (COPPA) prohibits collecting personal information from
                children under age 13 without verifiable parental consent.
              </p>
              <H>Age Restriction</H>
              <p>
                SalesCloserPro is intended for use by <Hi>business professionals aged 18 and older</Hi> (or the age
                of majority in your jurisdiction). The software is not directed at children and we do not knowingly
                collect any information from children under 13. If you believe a child has submitted information,
                contact us at <Hi>{CONTACT_EMAIL}</Hi> for immediate deletion assistance.
              </p>
            </Section>

            {/* ── 10. EXPORT / SANCTIONS ── */}
            <Section id="export" icon={Globe} title="Export Controls &amp; Sanctions" color="text-red-400">
              <p>
                SalesCloserPro is subject to U.S. export control laws, including the Export Administration Regulations
                (EAR) administered by the Bureau of Industry and Security (BIS), and OFAC sanctions programs.
              </p>
              <H>Export Classification</H>
              <p>
                The Software is classified as <Hi>EAR99</Hi> — it contains no cryptographic functionality beyond
                standard TLS provided by the OS/runtime and is not subject to Commerce Control List restrictions.
              </p>
              <H>Sanctions Compliance</H>
              <p>
                You may not use, download, or distribute SalesCloserPro if you are:
              </p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>Located in, or a national of, a comprehensively sanctioned country (currently: Cuba, Iran, North Korea, Syria, Russia-occupied regions of Ukraine, as updated by OFAC)</li>
                <li>Listed on the OFAC SDN list, the BIS Denied Persons List, or any equivalent list</li>
                <li>Acting on behalf of any entitylisted above</li>
              </ul>
              <p>
                Open-source software is generally authorized for export under License Exception TSU but the above
                restrictions still apply where mandated by law. Consult{' '}
                <Ext href="https://www.bis.gov">bis.gov</Ext> for the latest guidance.
              </p>
            </Section>

            {/* ── 11. DMCA ── */}
            <Section id="dmca" icon={Gavel} title="DMCA &amp; Intellectual Property" color="text-rose-400">
              <H>Copyright</H>
              <p>
                SalesCloserPro source code is copyright © 2026 Brent Girolimon / llmadvisor.ai and is released under
                the <Hi>Apache License 2.0</Hi>. Third-party dependencies retain their respective licenses (see NOTICE file).
              </p>
              <H>Trademarks &amp; Logos</H>
              <p>
                All third-party logos displayed in SalesCloserPro (MoonPay, Namecheap, Cloudflare, Gemini, Zoho,
                Google Workspace, Buy Me a Coffee) are trademarks of their respective owners and are used solely for
                identification/referential purposes under nominative fair use. No endorsement by these brands is implied.
              </p>
              <H>DMCA Takedown Notices</H>
              <p>
                If you believe the Software infringes your copyright, send a written notice compliant with 17 U.S.C. § 512(c)(3)
                to <Hi>{CONTACT_EMAIL}</Hi>. Please include: identification of the copyrighted work, location of the
                infringing material, your contact information, a good-faith statement, and your signature.
              </p>
              <H>Counter-Notices</H>
              <p>
                To file a counter-notice under 17 U.S.C. § 512(g)(3), send the required information to the same address.
              </p>
            </Section>

            {/* ── 12. OPEN SOURCE ── */}
            <Section id="opensource" icon={Package} title="Open-Source License (Apache-2.0)" color="text-emerald-400">
              <p>
                SalesCloserPro is free, open-source software. Source code is available at{' '}
                <Ext href="https://github.com/harborglowvintage-oss/salescloserpro.ai">
                  github.com/harborglowvintage-oss/salescloserpro.ai
                </Ext>.
              </p>
              <H>Apache License 2.0 Summary</H>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>✅ Free to use commercially</li>
                <li>✅ Free to modify and distribute</li>
                <li>✅ Free to sublicense</li>
                <li>✅ Patent grant included</li>
                <li>❗ Must include copyright notice and the NOTICE file</li>
                <li>❗ Must state changes made to original files</li>
                <li>❌ Cannot use author's trademarks without permission</li>
                <li>❌ Authors provide no warranty; liability limited to maximum extent permitted by law</li>
              </ul>
              <p>
                Full license text:&nbsp;
                <Ext href="https://www.apache.org/licenses/LICENSE-2.0">apache.org/licenses/LICENSE-2.0</Ext>
              </p>
              <H>Third-Party Dependencies</H>
              <p>
                This application bundles third-party open-source packages including React (MIT), Vite (MIT), Tailwind CSS (MIT),
                Lucide React (ISC), jsPDF (MIT), Zustand (MIT), and others. A complete list of dependencies and their licenses
                is available in the <code className="bg-white/[0.06] px-1.5 py-0.5 rounded text-xs font-mono">NOTICE</code> and{' '}
                <code className="bg-white/[0.06] px-1.5 py-0.5 rounded text-xs font-mono">package.json</code> files in the
                repository.
              </p>
              <H>Contributing</H>
              <p>
                Contributions to the project are welcome and governed by the{' '}
                <Ext href="https://github.com/harborglowvintage-oss/salescloserpro.ai/blob/main/CONTRIBUTING.md">
                  Contributor Guidelines
                </Ext>. By submitting a pull request, you agree to license your contribution under Apache-2.0.
              </p>
            </Section>

            {/* ── 13. DISCLAIMER ── */}
            <Section id="disclaimer" icon={AlertTriangle} title="Disclaimer &amp; Limitation of Liability" color="text-yellow-400">
              <H>Financial &amp; Tax Disclaimer</H>
              <p>
                SalesCloserPro is a <Hi>sales and quoting tool</Hi>, not a tax, accounting, or legal system.
                Tax rates in the included tax database are provided for convenience and may be outdated, incomplete,
                or incorrect. Always verify applicable tax rates with a licensed accountant or tax authority before
                issuing binding invoices or remitting taxes.
              </p>
              <H>No Professional Advice</H>
              <p>
                Nothing in this software or its documentation constitutes legal, financial, tax, or professional advice.
                All content is for informational purposes only.
              </p>
              <H>Limitation of Liability</H>
              <p>
                To the maximum extent permitted by applicable law, the authors and contributors of SalesCloserPro shall
                not be liable for any indirect, incidental, special, exemplary, or consequential damages including but
                not limited to: loss of profits, loss of data, loss of goodwill, service interruption, or any other
                commercial damages arising from your use of the Software, even if advised of the possibility of such damages.
              </p>
              <H>Indemnification</H>
              <p>
                You agree to indemnify, defend, and hold harmless llmadvisor.ai, Brent Girolimon, and contributors from
                any claims, liabilities, damages, or expenses (including legal fees) arising from: your use of the
                Software, your violation of these Terms, or your violation of any third-party rights.
              </p>
            </Section>

            {/* ── 14. CHANGES ── */}
            <Section id="changes" icon={Eye} title="Policy Changes &amp; Versioning" color="text-slate-400">
              <p>
                We may update these policies as the software evolves or as legal requirements change. Changes are tracked
                in the repository commit history. The "Last Updated" date at the top of this page reflects the most
                recent revision.
              </p>
              <p>
                Material changes (scope of data collection, new integrations, licensing changes) will be announced
                via a GitHub Release note. Continued use of the Software after policy changes constitutes acceptance
                of the revised terms.
              </p>
              <p>
                Historical versions of this policy are available in the{' '}
                <Ext href="https://github.com/harborglowvintage-oss/salescloserpro.ai/commits/main">
                  commit history
                </Ext>.
              </p>
            </Section>

            {/* ── 15. CONTACT ── */}
            <Section id="contact" icon={FileText} title="Contact &amp; Legal Requests" color="text-blue-400">
              <p>For legal inquiries, DMCA notices, GDPR/CCPA requests, or security disclosures:</p>
              <div className="mt-3 rounded-xl bg-white/[0.03] border border-white/[0.07] p-4 space-y-2">
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-slate-500 w-32 flex-shrink-0">Legal email</span>
                  <Hi>{CONTACT_EMAIL}</Hi>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-slate-500 w-32 flex-shrink-0">Security</span>
                  <Ext href="https://github.com/harborglowvintage-oss/salescloserpro.ai/security">GitHub Security Advisory</Ext>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-slate-500 w-32 flex-shrink-0">Bug reports</span>
                  <Ext href="https://github.com/harborglowvintage-oss/salescloserpro.ai/issues">GitHub Issues</Ext>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-slate-500 w-32 flex-shrink-0">Publisher</span>
                  <Ext href="https://llmadvisor.ai">llmadvisor.ai</Ext>
                </div>
              </div>
              <p className="mt-4 text-xs text-slate-500">
                Response time for legal requests: up to 30 days. For urgent security matters, use the GitHub Security Advisory.
              </p>
            </Section>

          </div>{/* end policy sections */}
        </div>{/* end grid */}

        {/* ── bottom bar ── */}
        <div className="mt-14 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 SalesCloserPro · Brent Girolimon / llmadvisor.ai · Apache-2.0</p>
          <Link to="/" className="hover:text-white transition-colors">← Back to SalesCloserPro</Link>
        </div>

      </main>
    </div>
  )
}
