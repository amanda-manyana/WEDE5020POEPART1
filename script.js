// Helper selectors
const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

document.addEventListener("DOMContentLoaded", () => {
  initAccordions();
  initModals();
  initLightbox();
  loadProducts(PRODUCTS);
  initSearch();
  setupForms();
});

/* ------------------------------
   Accordion
------------------------------ */
function initAccordions() {
  $$(".accordion").forEach((acc) => {
    acc.addEventListener("click", () => {
      const panel = acc.nextElementSibling;
      if (!panel) return;
      panel.style.display = panel.style.display === "block" ? "none" : "block";
    });
  });
}

/* ------------------------------
   Modal
------------------------------ */
function initModals() {
  $$("[data-modal-target]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const id = btn.getAttribute("data-modal-target");
      const modal = document.querySelector(id);
      if (modal) modal.style.display = "flex";
    });
  });

  $$(".modal .close").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.closest(".modal").style.display = "none";
    });
  });

  $$(".modal").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.style.display = "none";
    });
  });
}

/* ------------------------------
   Lightbox
------------------------------ */
function initLightbox() {
  let overlay = document.querySelector(".lightbox-overlay");

  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "lightbox-overlay";
    overlay.innerHTML = `<img src="" alt="">`;
    document.body.appendChild(overlay);

    overlay.addEventListener("click", () => {
      overlay.style.display = "none";
    });
  }

  const overlayImg = overlay.querySelector("img");

  $$(".lightbox-thumb").forEach((img) => {
    img.addEventListener("click", () => {
      overlayImg.src = img.dataset.large || img.src;
      overlay.style.display = "flex";
    });
  });
}

/* ------------------------------
   Dynamic product loading
------------------------------ */
const PRODUCTS = [
  { id: 1, title: "Classic Chocolate Cake", category: "cakes", price: 450, short: "Rich chocolate sponge with ganache", img: "images/cake1.jpg" },
  { id: 2, title: "Vanilla Cupcakes (6)", category: "cupcakes", price: 120, short: "Soft vanilla cupcakes with buttercream", img: "images/cupcakes.jpg" },
  { id: 3, title: "Wedding Tier Cake", category: "cakes", price: 2200, short: "Two-tier custom wedding cake", img: "images/wedding1.jpg" },
  { id: 4, title: "Assorted Pastries Box", category: "pastries", price: 220, short: "Box of mixed pastries", img: "images/pastries.jpg" },
];

function loadProducts(list) {
  const container = $("#product-list");
  if (!container) return;

  container.innerHTML = list
    .map((p) => {
      return `
        <div class="product-card">
          <img class="lightbox-thumb" src="${p.img}" data-large="${p.img}" alt="${p.title}">
          <h3>${p.title}</h3>
          <p>${p.short}</p>
          <p><strong>From R${p.price}</strong></p>
          <button class="btn btn-enquire" data-id="${p.id}">Enquire</button>
        </div>
      `;
    })
    .join("");

  initLightbox();

  $$(".btn-enquire").forEach((btn) => {
    btn.addEventListener("click", handleProductEnquiry);
  });
}

/* ------------------------------
   Search bar for products
------------------------------ */
function initSearch() {
  const search = $("#product-search");
  if (!search) return;

  search.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase().trim();
    const filtered = PRODUCTS.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.short.toLowerCase().includes(q)
    );
    loadProducts(filtered);
  });
}

/* ------------------------------
   Enquire from product button
------------------------------ */
function handleProductEnquiry(e) {
  const id = e.target.dataset.id;
  const item = PRODUCTS.find((p) => p.id == id);

  if (!item) return;

  if ($("#service")) {
    $("#service").value = item.category;
    $("#message").value = `I would like to enquire about: ${item.title} (starting at R${item.price}).`;
    $("#message").scrollIntoView({ behavior: "smooth" });
  } else {
    if (confirm("Open the enquiry page?")) {
      location.href = "enquiry.html";
    }
  }
}

/* ------------------------------
   Form validation + handling
------------------------------ */
function setupForms() {
  const enquiryForm = $("#enquiry-form");
  if (enquiryForm) enquiryForm.addEventListener("submit", handleEnquirySubmit);

  const contactForm = $("#contact-form");
  if (contactForm) contactForm.addEventListener("submit", handleContactSubmit);
}

/* ------------------------------
   Enquiry form
------------------------------ */
function handleEnquirySubmit(e) {
  e.preventDefault();
  const form = e.target;

  const name = form.querySelector("#enq-name").value.trim();
  const email = form.querySelector("#enq-email").value.trim();
  const phone = form.querySelector("#enq-phone").value.trim();
  const message = form.querySelector("#message").value.trim();
  const service = form.querySelector("#service").value;

  const errors = [];

  if (name.length < 2) errors.push("Please enter your full name.");
  if (!validateEmail(email)) errors.push("Enter a valid email.");
  if (message.length < 10) errors.push("Message must be at least 10 characters.");

  showErrors(form, errors);
  if (errors.length) return;

  let base = 250;
  const match = PRODUCTS.find((p) =>
    message.toLowerCase().includes(p.title.toLowerCase())
  );
  if (match) base = match.price;

  const urgent = /urgent|asap/i.test(message) ? 1.25 : 1;
  const estimate = Math.round(base * urgent);

  const result = document.createElement("div");
  result.className = "result-box";
  result.innerHTML = `
    <h3>Enquiry Received</h3>
    <p>Thank you <strong>${name}</strong>.</p>
    <p>Estimated price: <strong>R${estimate}</strong></p>
    <p>We will get back to you at <strong>${email}</strong>.</p>
  `;

  const old = form.parentNode.querySelector(".result-box");
  if (old) old.remove();

  form.parentNode.appendChild(result);
  form.reset();
}

/* ------------------------------
   Contact form
------------------------------ */
function handleContactSubmit(e) {
  e.preventDefault();

  const form = e.target;

  const name = form.querySelector("#contact-name").value.trim();
  const email = form.querySelector("#contact-email").value.trim();
  const type = form.querySelector("#message-type").value.trim();
  const message = form.querySelector("#contact-message").value.trim();
  const phone = form.querySelector("#contact-phone").value.trim();

  const errors = [];

  if (name.length < 2) errors.push("Enter your name.");
  if (!validateEmail(email)) errors.push("Enter a valid email address.");
  if (!type) errors.push("Select a message type.");
  if (message.length < 5) errors.push("Your message is too short.");

  showErrors(form, errors);
  if (errors.length) return;

  const endpoint = form.dataset.endpoint;

  if (endpoint) {
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ name, email, phone, type, message }),
    })
      .then((res) => {
        if (res.ok) {
          const done = document.createElement("div");
          done.className = "result-box";
          done.textContent = "Message sent successfully. Thank you!";
          form.parentNode.appendChild(done);
          form.reset();
        } else {
          alert("There was an error sending your message.");
        }
      })
      .catch(() => {
        alert("Network error. Please try again.");
      });
  } else {
    const to = "chef29mm@gmail.com";
    const subject = encodeURIComponent(type + " - " + name);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\n${message}`
    );
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  }
}

/* ------------------------------
   Utility
------------------------------ */
function validateEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

function showErrors(form, errors) {
  const box = form.querySelector(".form-errors");
  if (box) box.remove();

  if (!errors.length) return;

  const list = document.createElement("div");
  list.className = "form-errors";
  list.innerHTML = "<ul>" + errors.map((e) => `<li>${e}</li>`).join("") + "</ul>";

  form.prepend(list);
}

