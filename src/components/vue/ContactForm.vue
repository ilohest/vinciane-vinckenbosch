<template>
  <form class="cform" @submit.prevent="onSubmit" novalidate>
    <!-- Honeypot anti-spam : caché visuellement -->
    <div class="cform__hp" aria-hidden="true">
      <label
        >Company<input
          v-model="form.company"
          type="text"
          tabindex="-1"
          autocomplete="off"
      /></label>
    </div>

    <div class="cform__row">
      <div class="cform__field">
        <label :for="`cf-name-${uid}`" class="cform__label">{{ t.name }}</label>
        <input
          :id="`cf-name-${uid}`"
          v-model="form.name"
          type="text"
          class="cform__input"
          :class="{ 'cform__input--error': errors.name }"
          required
          maxlength="100"
          autocomplete="name"
        />
      </div>

      <div class="cform__field">
        <label :for="`cf-email-${uid}`" class="cform__label">{{
          t.email
        }}</label>
        <input
          :id="`cf-email-${uid}`"
          v-model="form.email"
          type="email"
          class="cform__input"
          :class="{ 'cform__input--error': errors.email }"
          required
          maxlength="150"
          autocomplete="email"
        />
      </div>
    </div>

    <div class="cform__field">
      <label :for="`cf-message-${uid}`" class="cform__label">{{
        t.message
      }}</label>
      <textarea
        :id="`cf-message-${uid}`"
        v-model="form.message"
        class="cform__input cform__textarea"
        :class="{ 'cform__input--error': errors.message }"
        required
        rows="5"
        maxlength="5000"
      ></textarea>
    </div>

    <div class="cform__footer">
      <button
        type="submit"
        class="btn-pill cform__submit"
        :disabled="status === 'sending'"
      >
        <span v-if="status === 'sending'">{{ t.sending }}</span>
        <span v-else>{{ t.submit }}</span>
      </button>

      <Transition name="cform-msg">
        <p v-if="status === 'success'" class="cform__msg cform__msg--ok">
          {{ t.success }}
        </p>
        <p v-else-if="status === 'error'" class="cform__msg cform__msg--err">
          {{ t.error }}
        </p>
      </Transition>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from "vue";

const props = defineProps<{ lang: "fr" | "en" | "de" }>();

const uid = Math.random().toString(36).slice(2, 8);

const form = reactive({ name: "", email: "", message: "", company: "" });
const errors = reactive({ name: false, email: false, message: false });
const status = ref<"idle" | "sending" | "success" | "error">("idle");

const i18n = {
  fr: {
    name: "Nom",
    email: "Email",
    message: "Message",
    submit: "Envoyer",
    sending: "Envoi…",
    success: "Merci, votre message a bien été envoyé.",
    error:
      "Une erreur est survenue. Réessayez ou écrivez directement par mail à contact@vincianevinckenbosch.com.",
  },
  en: {
    name: "Name",
    email: "Email",
    message: "Message",
    submit: "Send",
    sending: "Sending…",
    success: "Thank you, your message has been sent.",
    error:
      "Something went wrong. Please try again or email directly at contact@vincianevinckenbosch.com.",
  },
  de: {
    name: "Name",
    email: "Email",
    message: "Nachricht",
    submit: "senden",
    sending: "Wird gesendet…",
    success: "Vielen Dank, Ihre Nachricht wurde gesendet.",
    error:
      "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut oder schreiben Sie direkt an contact@vincianevinckenbosch.com.",
  },
} as const;

const t = computed(() => i18n[props.lang] ?? i18n.fr);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(): boolean {
  errors.name = !form.name.trim();
  errors.email = !EMAIL_RE.test(form.email.trim());
  errors.message = form.message.trim().length < 5;
  return !errors.name && !errors.email && !errors.message;
}

async function onSubmit() {
  if (status.value === "sending") return;
  if (!validate()) {
    status.value = "error";
    return;
  }

  status.value = "sending";
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, lang: props.lang }),
    });
    const data = await res.json();
    if (res.ok && data.ok) {
      status.value = "success";
      form.name = "";
      form.email = "";
      form.message = "";
    } else {
      status.value = "error";
    }
  } catch {
    status.value = "error";
  }
}
</script>

<style scoped>
.cform {
  display: flex;
  flex-direction: column;
  gap: clamp(1.25rem, 2.5vw, 1.75rem);
  width: 100%;
}

/* Honeypot : invisible pour humains, visible pour bots */
.cform__hp {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.cform__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(1rem, 2vw, 1.5rem);
}

.cform__field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.cform__label {
  font-family: "Ortica Linear", Georgia, serif;
  font-weight: 300;
  font-size: clamp(0.75rem, 1vw, 0.875rem);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #bcb7a9;
}

.cform__input {
  font-family: "Ortica Linear", Georgia, serif;
  font-weight: 300;
  font-size: clamp(0.9375rem, 1.4vw, 1.0625rem);
  color: #f7f5f3;
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(247, 245, 243, 0.25);
  padding: 0.5rem 0;
  outline: none;
  transition: border-color 0.25s ease;
}

.cform__input::placeholder {
  color: rgba(247, 245, 243, 0.3);
}

.cform__input:focus {
  border-bottom-color: #da7f52;
}

.cform__input--error {
  border-bottom-color: #da7f52;
}

.cform__textarea {
  resize: vertical;
  min-height: 7rem;
  line-height: 1.6;
}

.cform__footer {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.cform__submit {
  /* btn-pill gère l'apparence — on surcharge uniquement l'état disabled */
  transition:
    background-color 0.25s ease,
    color 0.25s ease,
    opacity 0.2s ease;
}

.cform__submit:disabled {
  opacity: 0.5;
  cursor: default;
  pointer-events: none;
}

.cform__msg {
  font-family: "Ortica Linear", Georgia, serif;
  font-weight: 300;
  font-size: clamp(0.8125rem, 1.2vw, 0.9375rem);
  margin: 0;
}

.cform__msg--ok {
  color: #da7f52;
}
.cform__msg--err {
  color: #d98a7a;
}

.cform-msg-enter-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
.cform-msg-enter-from {
  opacity: 0;
  transform: translateY(4px);
}

@media (max-width: 640px) {
  .cform__row {
    grid-template-columns: 1fr;
  }
}
</style>
