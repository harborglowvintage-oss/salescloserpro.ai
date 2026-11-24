# Contributing to SalesCloserPro

Thank you for your interest in contributing to SalesCloserPro! We welcome contributions from the community.

## 🤝 How to Contribute

1. **Fork the repository** and create a feature branch
2. **Make your changes** with clear, descriptive commits
3. **Test** — `npm test` and `npm run build` must pass; run `npm run test:e2e` for anything that touches a user flow
4. **Submit a pull request** with a clear description of your changes

## 📜 License Agreement

By contributing to this project, you agree that your contributions will be licensed under the Apache License 2.0.

## 🏛️ Trademark & Branding Policy

**SalesCloserPro** is a project of **LLMadvisor ai LLC**. The "SalesCloserPro" name and logo are the property of LLMadvisor ai LLC.

### For Contributors:
- You may contribute code to this project
- Your contributions will remain under the Apache 2.0 license
- You retain copyright to your contributions

### For Forks:
If you fork this project, you **must**:
- ✅ Maintain attribution to the original SalesCloserPro project
- ✅ Keep the Apache 2.0 license intact
- ✅ Include a link to the original repository
- ❌ **Remove the SalesCloserPro name and logo branding** and rebrand your fork under a different name
- ❌ Do not use "SalesCloserPro" or "LLMadvisor ai" in a way that implies endorsement of your derivative work

**Example attribution for forks:**
```
Based on SalesCloserPro by LLMadvisor ai LLC
Original: https://github.com/harborglowvintage-oss/salescloserpro.ai
Licensed under Apache-2.0
```

## 💡 Code Style

- One implementation of each thing: money goes through `src/utils/quoteMath.js`, emails through `emails.js`, uploads through `fileSafety.js`, brand elements through `components/brand/Brand.jsx`
- Colours and typefaces come from the tokens in `tailwind.config.js` — no hard-coded hex values in components
- Follow the existing formatting; keep components focused; comment the *why*, not the *what*
- Never commit real customer data, credentials, or personal information — tests and screenshots use made-up data

## 🐛 Reporting Issues

- Search existing issues first
- Provide clear reproduction steps
- Include your OS, browser, and Node version
- Screenshots help!

## 📧 Questions?

Open a discussion on GitHub or reach out via the project's contact information.

---

© 2026 LLMadvisor ai LLC
