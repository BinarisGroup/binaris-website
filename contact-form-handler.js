(function () {
  'use strict';

  const ENDPOINT = 'https://api.web3forms.com/submit';
  const ACCESS_KEY = '6b7e9236-bbc3-4e12-9c69-9c981d30895b';

  document.addEventListener('submit', async function (event) {
    const form = event.target;
    if (!(form instanceof HTMLFormElement) || !form.classList.contains('contact-form')) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    if (!form.reportValidity()) return;

    const button = form.querySelector('.modal-submit, [type="submit"]');
    const status = form.querySelector('.form-status');
    const originalLabel = button ? button.textContent : '';
    const data = new FormData(form);

    data.set('access_key', ACCESS_KEY);
    data.set('subject', data.get('_subject') || 'New BINARIS website enquiry');
    data.delete('_subject');
    data.set('from_name', 'BINARIS Website');

    if (button) {
      button.disabled = true;
      button.textContent = 'Sending…';
    }
    if (status) {
      status.className = 'form-status';
      status.textContent = '';
    }

    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || 'Submission failed');

      form.reset();
      if (status) {
        status.innerHTML = 'Thank you. Your enquiry has been sent successfully.<br><span class="binaris-contact-response-time">We will contact you within 1&ndash;2 business days.</span>';
        status.className = 'form-status success';
      }
      if (button) button.textContent = 'Message Sent ✓';
    } catch (error) {
      if (status) {
        status.textContent = 'We could not send your enquiry. Please try again or email info@binaris.com.au.';
        status.className = 'form-status error';
      }
      if (button) button.textContent = originalLabel;
    } finally {
      if (button) button.disabled = false;
    }
  }, true);
}());
