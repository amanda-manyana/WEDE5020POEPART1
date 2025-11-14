/* js/script.js - SHISA Bakery
*/

// helpers
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initAccordion();
  initModalTriggers();
  initLightbox();
  initProductSearch();
  bindForms();
});

/* Accordion */
function initAccordion(){
  $$('.accordion').forEach(acc=>{
    acc.addEventListener('click', ()=>{
      acc.classList.toggle('open');
      const panel = acc.nextElementSibling;
      if(panel.style.display === 'block') panel.style.display = 'none';
      else panel.style.display = 'block';
    });
  });
}

/* Modal */
function initModalTriggers(){
  $$('[data-modal-target]').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      e.preventDefault();
      const sel = btn.getAttribute('data-modal-target');
      const modal = document.querySelector(sel);
      if(modal) modal.style.display = 'flex';
    });
  });
  // close buttons
  $$('.modal .close').forEach(b=>b.addEventListener('click', ()=> b.closest('.modal').style.display='none'));
  // click outside to close
  $$('.modal').forEach(m=>{
    m.addEventListener('click', e=>{
      if(e.target === m) m.style.display='none';
    });
  });
}

/* Lightbox */
function initLightbox(){
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.innerHTML = '<img src="" alt="">';
  document.body.appendChild(overlay);
  const overlayImg = overlay.querySelector('img');
  overlay.addEventListener('click', ()=> overlay.style.display='none');

  $$('.lightbox-thumb').forEach(img=>{
    img.addEventListener('click', ()=>{
      overlayImg.src = img.dataset.large || img.src;
      overlay.style.display = 'flex';
    });
  });
}

/* Dynamic product listing + search */
const PRODUCTS = [
  {id:1,title:'Classic Chocolate Cake',category:'cakes',price:450,short:'Rich chocolate sponge with ganache',img:'images/cake1.jpg'},
  {id:2,title:'Vanilla Cupcakes (6)',category:'pastries',price:120,short:'Vanilla cupcakes with buttercream',img:'images/cupcakes.jpg'},
  {id:3,title:'Wedding Tier Cake (small)',category:'cakes',price:2200,short:'Custom decorated 2-tier cake',img:'images/wedding1.jpg'},
  {id:4,title:'Assorted Pastries Box',category:'pastries',price:220,short:'6-piece assorted pastries',img:'images/pastries.jpg'}
];

function renderProducts(list,containerSel='#product-list'){
  const container = document.querySelector(containerSel);
  if(!container) return;
  container.innerHTML = list.map(p=>`
    <div class="product-card">
      <img src="${p.img}" data-large="${p.img}" alt="${p.title}" class="lightbox-thumb">
      <h3>${p.title}</h3>
      <p>${p.short}</p>
      <p><strong>From R${p.price}</strong></p>
      <button class="btn btn-enquire" data-product-id="${p.id}">Enquire</button>
    </div>
  `).join('');
  // re-init lightbox binding for thumbnails
  initLightbox();
  // bind enquire buttons
  $$('.btn-enquire').forEach(b=>{
    b.addEventListener('click', ()=>{
      const pid = b.dataset.productId;
      const prod = PRODUCTS.find(x=>x.id==pid);
      if(prod && $('#service')){
        $('#service').value = prod.category;
        $('#message').value = `Enquiring about: ${prod.title} (approx. R${prod.price})`;
        $('#message').focus();
        // navigate to form if on same page
        $('#service')?.scrollIntoView({behavior:'smooth'});
      } else {
        alert('Please visit the Enquiry page to request a quote.');
      }
    });
  });
}

function initProductSearch(){
  renderProducts(PRODUCTS);
  const search = $('#product-search');
  if(!search) return;
  search.addEventListener('input', e=>{
    const q = e.target.value.toLowerCase().trim();
    const filtered = PRODUCTS.filter(p=> p.title.toLowerCase().includes(q) || p.short.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    renderProducts(filtered);
  });
}

/* Forms binding */
function bindForms(){
  const enq = $('#enquiry-form');
  if(enq) enq.addEventListener('submit', handleEnquiry);
  const contact = $('#contact-form');
  if(contact) contact.addEventListener('submit', handleContact);
}

/* Enquiry handling - validate and show estimate (simulated AJAX) */
function handleEnquiry(e){
  e.preventDefault();
  const form = e.target;
  const name = form.querySelector('#enq-name').value.trim();
  const email = form.querySelector('#enq-email').value.trim();
  const phone = form.querySelector('#enq-phone').value.trim();
  const service = form.querySelector('#service').value;
  const message = form.querySelector('#message').value.trim();
  const errors = [];
  if(name.length<2) errors.push('Name too short.');
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Invalid email.');
  if(message.length<8) errors.push('Provide more details.');

  showErrors(form,errors);
  if(errors.length) return;

  // estimate logic (simple)
  let base = 300;
  const found = PRODUCTS.find(p=> message.toLowerCase().includes(p.title.toLowerCase()) || p.category===service);
  if(found) base = found.price;
  const urgency = /urgent|asap|tomorrow/i.test(message)?1.3:1;
  const estimate = Math.round(base*urgency);

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Processing...';
  setTimeout(()=>{
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Enquiry';
    // show result
    const res = document.createElement('div');
    res.className = 'result-box';
    res.innerHTML = `<h3>Enquiry Received</h3><p>Hi <strong>${escapeHtml(name)}</strong>, estimated starting price: <strong>R${estimate}</strong>. We will contact you at <strong>${escapeHtml(email)}</strong>.</p>`;
    // remove old result
    const old = form.parentNode.querySelector('.result-box');
    if(old) old.remove();
    form.parentNode.appendChild(res);
    form.reset();
  },900);
}

/* Contact form - uses Formspree endpoint (replace YOUR_ENDPOINT) */
function handleContact(e){
  e.preventDefault();
  const form = e.target;
  const name = form.querySelector('#contact-name').value.trim();
  const email = form.querySelector('#contact-email').value.trim();
  const type = form.querySelector('#message-type').value;
  const message = form.querySelector('#contact-message').value.trim();
  const errors = [];
  if(name.length<2) errors.push('Please enter a valid name.');
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Please enter a valid email.');
  if(!type) errors.push('Select message type.');
  if(message.length<5) errors.push('Message too short.');

  showErrors(form,errors);
  if(errors.length) return;

  // Submit via fetch to Formspree (uncomment and set endpoint when ready)
  const endpoint = form.dataset.endpoint || ''; // e.g., https://formspree.io/f/XXXX
  if(endpoint){
    fetch(endpoint, {
      method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json'},
      body:JSON.stringify({
        name, email, type, message
      })
    }).then(r=>{
      if(r.ok){
        const res = document.createElement('div');
        res.className='result-box';
        res.textContent='Message sent successfully. Thank you!';
        form.parentNode.appendChild(res);
        form.reset();
      } else {
        alert('Submission failed. Please try again or email chef29mm@gmail.com');
      }
    }).catch(err=>{alert('Network error. Please try again later.')});
  } else {
    // fallback: open mailto as supported
    const recipient = 'chef29mm@gmail.com';
    const subj = encodeURIComponent(`Website message: ${type} - ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nType: ${type}\n\n${message}`);
    if(confirm('Open your mail app to send this message?')) window.location.href = `mailto:${recipient}?subject=${subj}&body=${body}`;
  }
}

/* helpers */
function showErrors(form, errors){
  const old = form.querySelector('.form-errors');
  if(old) old.remove();
  if(!errors.length) return;
  const div = document.createElement('div');
  div.className='form-errors';
  div.style.color='red';
  div.innerHTML = '<ul>' + errors.map(e=>`<li>${escapeHtml(e)}</li>`).join('') + '</ul>';
  form.insertBefore(div, form.firstChild);
}
function escapeHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
