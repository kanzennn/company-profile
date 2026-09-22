export const contactPage = {
  title: "Tell us what you're building.",
  /** Shown under the form as a plain alternative to filling it in. */
  directEmail: "kervzentstudio@gmail.com",
};

export const inquiryCategories = [
  "New project",
  "Ongoing work or support",
  "Partnership",
  "Careers",
  "Something else",
];

export const contactFields = {
  name: { label: "Name", placeholder: "Your name", required: true },
  email: { label: "Email", placeholder: "you@company.com", required: true },
  company: { label: "Company", placeholder: "Optional", required: false },
  category: { label: "What's this about?", required: true },
  message: {
    label: "Message",
    placeholder: "What are you trying to build, and what's in the way?",
    required: true,
  },
};
