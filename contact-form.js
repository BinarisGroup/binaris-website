(function () {
  'use strict';

  const ACCESS_KEY = '6b7e9236-bbc3-4e12-9c69-9c981d30895b';
  const ENDPOINT = 'https://api.web3forms.com/submit';

  const services = [
    'AI & Machine Learning',
    'AI Agents & Automation',
    'Computer Vision & Imaging',
    'Scientific & Engineering Software',
    'Other / Not sure yet'
  ];

  function addStyles() {
    if (document.getElementById('binaris-contact-styles')) return;
    const style = document.createElement('style');
    style.id = 'binaris-contact-styles';
    style.textContent = `
      .binaris-contact-overlay{position:fixed;inset:0;z-index:9999;display:none;align-items:center;justify-content:center;padding:20px;background:rgba(0,20,55,.76);backdrop-filter:blur(7px)}
      .binaris-contact-overlay.open{display:flex}
      .binaris-contact-dialog{position:relative;width:min(620px,100%);max-height:calc(100vh - 40px);overflow:auto;padding:34px;border:1px solid rgba(17,191,220,.3);border-radius:20px;background:#fff;box-shadow:0 28px 80px rgba(0,26,70,.35);color:#0b3155}
      .binaris-contact-close{position:absolute;top:14px;right:16px;width:40px;height:40px;border:0;border-radius:50%;background:#edf6fb;color:#0b3155;font-size:20px;cursor:pointer}
      .binaris-contact-dialog h2{margin:0 44px 8px 0;font-size:clamp(1.55rem,4vw,2.15rem);line-height:1.15;color:#07345c}
      .binaris-contact-intro{margin:0 0 24px;color:#526b81;line-height:1.55}
      .binaris-contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
      .binaris-contact-field{display:flex;flex-direction:column;gap:7px;margin-bottom:16px}
      .binaris-contact-field label{font-size:.9rem;font-weight:700;color:#123b5f}
      .binaris-contact-field input,.binaris-contact-field select,.binaris-contact-field textarea{width:100%;box-sizing:border-box;border:1px solid #cbdbe7;border-radius:10px;padding:12px 13px;background:#fff;color:#102f4a;font:inherit;outline:none;transition:border-color .2s,box-shadow .2s}
      .binaris-contact-field input:focus,.binaris-contact-field select:focus,.binaris-contact-field textarea:focus{border-color:#00bddd;box-shadow:0 0 0 3px rgba(0,189,221,.14)}
      .binaris-contact-field textarea{min-height:125px;resize:vertical}
      .binaris-contact-submit{width:100%;border:0;border-radius:10px;padding:14px 18px;background:linear-gradient(135deg,#00c8db,#0788dd);color:#001f38;font:inherit;font-weight:800;cursor:pointer}
      .binaris-contact-submit:hover{filter:brightness(1.04)}
      .binaris-contact-submit:disabled{cursor:wait;opacity:.7}
      .binaris-contact-status{min-height:24px;margin:12px 0 0;font-weight:700;text-align:center}
      .binaris-contact-status.success{color:#087a45}.binaris-contact-status.error{color:#b42318}
      .binaris-contact-response-time{display:inline-block;margin-top:5px;font-size:.9rem;font-weight:600;color:#526b81}
      .binaris-contact-privacy{margin:10px 0 0;color:#718397;font-size:.78rem;text-align:center}
      @media(max-width:600px){.binaris-contact-dialog{padding:28px 20px}.binaris-contact-grid{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  function buildModal() {
    const oldModal = document.getElementById('contactModal');
    if (oldModal) oldModal.remove();

    const overlay = document.createElement('div');
    overlay.id = 'binarisContactModal';
    overlay.className = 'binaris-contact-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = `
      <div class="binaris-contact-dialog" role="dialog" aria-modal="true" aria-labelledby="binarisContactTitle">
        <button class="binaris-contact-close" type="button" aria-label="Close contact form">&#10005;</button>
        <h2 id="binarisContactTitle">Let&rsquo;s Talk About Your Project</h2>
        <p class="binaris-contact-intro">Tell us what you are working on. We will reply within 1&ndash;2 business days.</p>
        <form id="binarisContactForm">
          <input type="hidden" name="access_key" value="${ACCESS_KEY}">
          <input type="hidden" name="subject" value="New BINARIS website enquiry">
          <input type="hidden" name="from_name" value="BINARIS Website">
          <input type="checkbox" name="botcheck" tabindex="-1" autocomplete="off" style="display:none">
          <div class="binaris-contact-grid">
            <div class="binaris-contact-field"><label for="contactName">Full name *</label><input id="contactName" name="name" type="text" autocomplete="name" required></div>
            <div class="binaris-contact-field"><label for="contactEmail">Business email *</label><input id="contactEmail" name="email" type="email" autocomplete="email" required></div>
          </div>
          <div class="binaris-contact-grid">
            <div class="binaris-contact-field"><label for="contactCompany">Company</label><input id="contactCompany" name="company" type="text" autocomplete="organization"></div>
            <div class="binaris-contact-field"><label for="contactService">Service required *</label><select id="contactService" name="service" required><option value="">Select a service</option>${services.map(service => `<option>${service}</option>`).join('')}</select></div>
          </div>
          <div class="binaris-contact-field"><label for="contactMessage">How can we help? *</label><textarea id="contactMessage" name="message" placeholder="Briefly describe your challenge, goals or project." required></textarea></div>
          <button class="binaris-contact-submit" type="submit">Send Enquiry &rarr;</button>
          <p class="binaris-contact-status" role="status" aria-live="polite"></p>
          <p class="binaris-contact-privacy">Your details will only be used to respond to your enquiry.</p>
        </form>
      </div>`;
    document.body.appendChild(overlay);

    const closeButton = overlay.querySelector('.binaris-contact-close');
    const form = overlay.querySelector('form');
    const status = overlay.querySelector('.binaris-contact-status');
    const submit = overlay.querySelector('.binaris-contact-submit');

    closeButton.addEventListener('click', closeModal);
    overlay.addEventListener('click', event => {
      if (event.target === overlay) closeModal();
    });

    form.addEventListener('submit', async event => {
      event.preventDefault();
      status.className = 'binaris-contact-status';
      status.textContent = '';
      submit.disabled = true;
      submit.textContent = 'Sending…';

      try {
        const response = await fetch(ENDPOINT, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.message || 'Submission failed');
        form.reset();
        status.className = 'binaris-contact-status success';
        status.innerHTML = 'Thank you. Your enquiry has been sent successfully.<br><span class="binaris-contact-response-time">We will contact you within 1&ndash;2 business days.</span>';
        submit.textContent = 'Message Sent ✓';
      } catch (error) {
        status.className = 'binaris-contact-status error';
        status.textContent = 'We could not send your enquiry. Please email info@binaris.com.au.';
        submit.disabled = false;
        submit.textContent = 'Try Again';
      }
    });
  }

  function openModal(event) {
    if (event) event.preventDefault();
    const modal = document.getElementById('binarisContactModal');
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    window.setTimeout(() => document.getElementById('contactName')?.focus(), 50);
  }

  function closeModal() {
    const modal = document.getElementById('binarisContactModal');
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.addEventListener('DOMContentLoaded', () => {
    addStyles();
    buildModal();
    window.openModal = openModal;
    window.closeModal = closeModal;
    window.closeModalOnOverlay = event => {
      if (event.target === document.getElementById('binarisContactModal')) closeModal();
    };
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeModal();
    });
  });
})();
