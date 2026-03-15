// Smooth scroll for nav links and CTA buttons
document.querySelectorAll("nav a, .hero-cta a").forEach(link => {
  link.addEventListener("click", e => {
    const href = link.getAttribute("href");
    if (!href.startsWith("#")) return;

    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Highlight active nav link on scroll
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll("nav a");

const navObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);

sections.forEach(section => navObserver.observe(section));

// Scroll reveal animation
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

// ── EmailJS Setup ───────────────────────────────────────────
// Replace these three values with your own from emailjs.com
const EMAILJS_PUBLIC_KEY  = "LTWFU9cYI6gOFnQRU";   // Account > API Keys
const EMAILJS_SERVICE_ID  = "service_an76wxs";   // Email Services tab
const EMAILJS_TEMPLATE_ID = "template_991x7a9";  // Email Templates tab

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

// Contact form submission
const submitBtn  = document.getElementById("submitBtn");
const formStatus = document.getElementById("formStatus");

submitBtn.addEventListener("click", () => {
  const name    = document.getElementById("name").value.trim();
  const email   = document.getElementById("email").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const message = document.getElementById("message").value.trim();

  // Validation
  if (!name || !email || !message) {
    formStatus.textContent = "Please fill in your name, email, and message.";
    formStatus.className = "form-status error";
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    formStatus.textContent = "Please enter a valid email address.";
    formStatus.className = "form-status error";
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";
  formStatus.textContent = "";
  formStatus.className = "form-status";

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
    name:     name,
    message:  message,
    time:     new Date().toLocaleString("en-GB", { dateStyle: "long", timeStyle: "short" }),
    reply_to: email,
    subject:  subject || "Portfolio enquiry",
  })
  .then(() => {
    formStatus.textContent = "Message sent! I'll get back to you soon.";
    formStatus.className = "form-status success";
    document.getElementById("name").value    = "";
    document.getElementById("email").value   = "";
    document.getElementById("subject").value = "";
    document.getElementById("message").value = "";
  })
  .catch(() => {
    formStatus.textContent = "Something went wrong. Please try emailing me directly.";
    formStatus.className = "form-status error";
  })
  .finally(() => {
    submitBtn.disabled = false;
    submitBtn.textContent = "Send Message";
  });
});