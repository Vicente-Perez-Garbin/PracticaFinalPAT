document.addEventListener('DOMContentLoaded', function() {
  const formulario = document.getElementById('contactoForm');
  const feedback = document.getElementById('contactoFeedback');

  if (!formulario || !feedback) {
    return;
  }

  formulario.addEventListener('submit', function(event) {
    event.preventDefault();

    feedback.textContent = 'Formulario enviado correctamente. Te contactaremos pronto.';
    feedback.style.color = '#51cf66';

    formulario.reset();
  });
});
