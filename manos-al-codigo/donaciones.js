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
  'Tu aporte mensual sostiene horas de taller, materiales compartidos y acompañamiento docente para que más jóvenes aprendan haciendo.';

const amountMessages = [
  {
    min: 150000,
    getText: (amount) => {
      const studentCount = Math.floor(amount / 150000);
      const studentText =
        studentCount === 1 ? 'un estudiante' : `${studentCount} estudiantes`;

      return `Con tu aporte mensual sostenés la beca de ${studentText}: cupo en talleres, materiales, conectividad y seguimiento docente durante su recorrido.`;
    },
  },
  {
    min: 60000,
    getText: () =>
      'Con tu aporte mensual financiás una práctica grupal completa con placas, sensores y componentes para aprender construyendo.',
  },
  {
    min: 20000,
    getText: () =>
      'Con tu aporte mensual ayudás a reponer componentes clave para que un equipo pueda armar y mejorar su primer prototipo.',
  },
  {
    min: 1,
    getText: () => defaultImpactMessage,
  },
];

const normalizeAmount = (amount) => String(amount).replace(/[^\d]/g, '');

const getCursorPositionAfterDigit = (value, digitCount) => {
  if (digitCount === 0) return 1;

  let digitsSeen = 0;

  for (let index = 0; index < value.length; index += 1) {
    if (/\d/.test(value[index])) digitsSeen += 1;
    if (digitsSeen === digitCount) return index + 1;
  }

  return value.length;
};

const formatDonationAmount = (amount) => {
  const digits = normalizeAmount(amount);

  if (!digits) return '$';

  return `$${Number(digits).toLocaleString('es-AR')}`;
};

const updateImpactMessage = (amount) => {
  const digits = normalizeAmount(amount);
  const numericAmount = Number(digits);
  const match = amountMessages.find((message) => numericAmount >= message.min);

  impactMessage.textContent = digits
    ? match?.getText(numericAmount) || defaultImpactMessage
    : '';
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

  if (formattedAmount !== amountInput.value)
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
  const cursorPosition = amountInput.selectionStart || 0;
  const digitsBeforeCursor = normalizeAmount(
    amountInput.value.slice(0, cursorPosition),
  ).length;
  const formattedAmount = formatDonationAmount(amountInput.value);

  if (formattedAmount !== amountInput.value) {
    amountInput.value = formattedAmount;
    const nextCursorPosition = getCursorPositionAfterDigit(
      formattedAmount,
      digitsBeforeCursor,
    );

    amountInput.setSelectionRange(nextCursorPosition, nextCursorPosition);
  }
  updateSelectedPreset(amountInput.value);
  updateImpactMessage(amountInput.value);
  clearThankYouMessage();
});

donationForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const amount = amountInput.value.trim();
  const amountText = normalizeAmount(amount) ? ` de ${amount}` : '';

  thankYouMessage.textContent = `Gracias por suscribirte al débito automático mensual${amountText}. Tu ayuda se transforma en talleres activos, materiales, becas y nuevas oportunidades para aprender tecnología.`;
  thankYouMessage.classList.add('active');
  thankYouMessage.scrollIntoView({ block: 'nearest' });
});

document.body.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeDonationModal();
});
