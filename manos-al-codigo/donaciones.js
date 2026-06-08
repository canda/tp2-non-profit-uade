const modal = document.querySelector('#modal-donacion');
const amountInput = document.querySelector('#monto');
const impactMessage = document.querySelector('#mensaje-impacto');
const thankYouMessage = document.querySelector('#mensaje-agradecimiento');
const donationForm = document.querySelector('.donation-form');
const presetButtons = document.querySelectorAll('.preset-button');
const donationAmountButtons = document.querySelectorAll(
  '[data-donation-amount]',
);

const defaultImpactMessage =
  'Cada aporte suma horas de taller, materiales compartidos y más oportunidades para aprender haciendo.';

const amountMessages = [
  {
    min: 150000,
    text: 'Con ese aporte ayudás a financiar una beca para que un joven complete un ciclo de talleres con seguimiento docente.',
  },
  {
    min: 60000,
    text: 'Con ese aporte podemos comprar materiales electrónicos para una práctica grupal y que el aprendizaje sea bien concreto.',
  },
  {
    min: 20000,
    text: 'Con ese aporte podemos armar un kit inicial para que un equipo empiece a crear su primer proyecto de robótica.',
  },
  {
    min: 1,
    text: defaultImpactMessage,
  },
];

const normalizeAmount = (amount) => String(amount).replace(/[^\d]/g, '');

const formatDonationAmount = (amount) => {
  const digits = normalizeAmount(amount);

  if (!digits) return '$';

  return `$${Number(digits).toLocaleString('es-AR')}`;
};

const updateImpactMessage = (amount) => {
  const digits = normalizeAmount(amount);
  const numericAmount = Number(digits);
  const match = amountMessages.find((message) => numericAmount >= message.min);

  impactMessage.textContent = digits ? match?.text || defaultImpactMessage : '';
};

const updateSelectedPreset = (amount) => {
  presetButtons.forEach((button) => {
    const isSelected = button.dataset.donationAmount === amount;
    button.classList.toggle('active', isSelected);
    button.setAttribute('aria-pressed', String(isSelected));
  });
};

const clearThankYouMessage = () => {
  thankYouMessage.textContent = '';
  thankYouMessage.classList.remove('active');
};

const setDonationAmount = (amount) => {
  const formattedAmount = formatDonationAmount(amount);

  amountInput.value = formattedAmount;
  updateSelectedPreset(formattedAmount);
  updateImpactMessage(formattedAmount);
  clearThankYouMessage();
};

const openDonationModal = (amount) => {
  if (amount) setDonationAmount(amount);
  else clearThankYouMessage();
  modal.classList.add('active');
};

const closeDonationModal = () => modal.classList.remove('active');

document.querySelector('#abrir-modal').onclick = () => openDonationModal();

document.querySelector('#cerrar-modal').onclick = closeDonationModal;

donationAmountButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setDonationAmount(button.dataset.donationAmount);

    if (button.classList.contains('impact-option')) {
      modal.classList.add('active');
    }
  });
});

amountInput.addEventListener('input', () => {
  amountInput.value = formatDonationAmount(amountInput.value);
  amountInput.setSelectionRange(
    amountInput.value.length,
    amountInput.value.length,
  );
  updateSelectedPreset(amountInput.value);
  updateImpactMessage(amountInput.value);
  clearThankYouMessage();
});

donationForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const amount = amountInput.value.trim();
  const amountText = normalizeAmount(amount) ? ` de ${amount}` : '';

  thankYouMessage.textContent = `Gracias por tu donación${amountText}. Tu ayuda se transforma en materiales, becas y nuevas oportunidades para aprender tecnología.`;
  thankYouMessage.classList.add('active');
});

document.body.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeDonationModal();
});
