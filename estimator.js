(function () {
  'use strict';
  function calculateEstimate(input) {
    const keys = ['laborRate', 'partsLow', 'partsHigh', 'hoursLow', 'hoursHigh'];
    for (const key of keys) {
      if (typeof input[key] !== 'number' || !Number.isFinite(input[key]) || input[key] < 0) throw new Error('Enter a valid non-negative number for each pricing assumption.');
    }
    if (input.partsHigh < input.partsLow || input.hoursHigh < input.hoursLow) throw new Error('Each high value must be at least as large as its low value.');
    const laborLow = input.laborRate * input.hoursLow;
    const laborHigh = input.laborRate * input.hoursHigh;
    return { partsLow: input.partsLow, partsHigh: input.partsHigh, laborLow, laborHigh, low: input.partsLow + laborLow, high: input.partsHigh + laborHigh };
  }
  window.CABRERA_CALCULATE_ESTIMATE = calculateEstimate;
  const form = document.querySelector('#repair-estimate-form');
  if (!form) return;
  const config = window.CABRERA_ESTIMATOR_CONFIG;
  const serviceSelect = form.elements.service;
  const result = document.querySelector('#estimate-result');
  const empty = document.querySelector('#estimate-placeholder');
  const error = document.querySelector('#estimate-error');
  const status = document.querySelector('#estimate-status');
  const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  const moneyRange = (low, high) => currency.format(Math.floor(low)) + ' – ' + currency.format(Math.ceil(high));
  const yearSelect = form.elements.year;
  for (let year = new Date().getFullYear() + 1; year >= 1940; year--) { const option = document.createElement('option'); option.value = String(year); option.textContent = String(year); yearSelect.append(option); }
  config.services.forEach(service => { const option = document.createElement('option'); option.value = service.id; option.textContent = service.name; serviceSelect.append(option); });
  function setDefaults() {
    const selected = config.services.find(s => s.id === serviceSelect.value);
    form.elements.laborRate.value = config.laborRate;
    for (const [key, value] of Object.entries({ partsLow: selected?.parts[0] ?? '', partsHigh: selected?.parts[1] ?? '', hoursLow: selected?.hours[0] ?? '', hoursHigh: selected?.hours[1] ?? '' })) form.elements[key].value = value;
    document.querySelector('#service-scope').textContent = selected?.scope || 'Choose a repair to see what the sample calculation includes.';
  }
  function invalidate() {
    result.hidden = true; empty.hidden = false; error.hidden = true;
    status.textContent = 'Enter your details and select Generate estimate to see the updated calculation.';
  }
  serviceSelect.addEventListener('change', () => { setDefaults(); invalidate(); });
  form.addEventListener('input', invalidate);
  form.addEventListener('change', invalidate);
  form.addEventListener('submit', event => {
    event.preventDefault(); error.hidden = true;
    if (!form.reportValidity()) return;
    const service = config.services.find(s => s.id === serviceSelect.value);
    try {
      if (!service) throw new Error('Choose a repair service.');
      if (!form.elements.make.value.trim() || !form.elements.model.value.trim()) throw new Error('Enter a vehicle make and model.');
      const numbers = {};
      for (const key of ['laborRate','partsLow','partsHigh','hoursLow','hoursHigh']) {
        if (form.elements[key].value.trim() === '') throw new Error('Complete each pricing assumption.');
        numbers[key] = Number(form.elements[key].value);
      }
      const estimate = calculateEstimate(numbers);
      const vehicle = [form.elements.year.value, form.elements.make.value.trim(), form.elements.model.value.trim()].join(' ');
      document.querySelector('#estimate-total').textContent = moneyRange(estimate.low, estimate.high);
      document.querySelector('#estimate-vehicle').textContent = vehicle;
      document.querySelector('#estimate-service').textContent = service.name;
      document.querySelector('#estimate-parts').textContent = moneyRange(estimate.partsLow, estimate.partsHigh);
      document.querySelector('#estimate-labor').textContent = moneyRange(estimate.laborLow, estimate.laborHigh);
      document.querySelector('#estimate-rate').textContent = currency.format(numbers.laborRate) + '/hour × ' + numbers.hoursLow + '–' + numbers.hoursHigh + ' hours';
      document.querySelector('#estimate-scope').textContent = service.scope;
      result.hidden = false; empty.hidden = true;
      status.textContent = 'Sample calculation ready: ' + moneyRange(estimate.low, estimate.high) + ' for ' + service.name + '.';
      result.focus({ preventScroll: true });
      if (window.matchMedia('(max-width: 760px)').matches) result.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    } catch (e) { error.textContent = e.message; error.hidden = false; error.focus(); }
  });
  document.querySelector('#new-estimate').addEventListener('click', () => { form.reset(); setDefaults(); invalidate(); yearSelect.focus(); form.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
  setDefaults();
})();
