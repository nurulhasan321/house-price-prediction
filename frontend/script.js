// Backend address. Change this if your API runs somewhere else.
const API_URL = "http://127.0.0.1:8000/predict";

// The backend returns the price in lakhs, so we convert to rupees for display.
const LAKH = 100000;

const form = document.getElementById("predictForm");
const submitBtn = document.getElementById("submitBtn");
const errorBox = document.getElementById("formError");
const resultBox = document.getElementById("result");
const resultValue = document.getElementById("resultValue");
const resultNote = document.getElementById("resultNote");
const themeToggle = document.getElementById("themeToggle");
const themeLabel = document.getElementById("themeLabel");

const TEXT_FIELDS = ["City", "Locality_Type", "Property_Type", "Furnishing_Status"];
const NUMBER_FIELDS = [
  "BHK", "Bathrooms", "Super_Area_SqFt", "Carpet_Area_SqFt", "Floor_Number",
  "Total_Floors", "Age_of_Property", "Distance_to_Metro_km", "Distance_to_City_Center_km"
];
const WHOLE_NUMBER_FIELDS = ["BHK", "Bathrooms", "Floor_Number", "Total_Floors", "Age_of_Property"];
const TOGGLE_FIELDS = ["Parking", "Lift_Available", "Gated_Community"];

/* ---------- Theme ---------- */
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeLabel.textContent = theme === "dark" ? "Light mode" : "Dark mode";
  try { localStorage.setItem("theme", theme); } catch (e) {}
}

applyTheme(document.documentElement.getAttribute("data-theme"));

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
});

/* ---------- Helpers ---------- */
function setFieldError(id, message) {
  const input = document.getElementById(id);
  if (!input) return;
  const field = input.closest(".field");
  if (!field) return;
  field.classList.toggle("invalid", Boolean(message));
  let msg = field.querySelector(".field-msg");
  if (message) {
    if (!msg) {
      msg = document.createElement("span");
      msg.className = "field-msg";
      field.appendChild(msg);
    }
    msg.textContent = message;
    input.setAttribute("aria-invalid", "true");
  } else {
    if (msg) msg.remove();
    input.removeAttribute("aria-invalid");
  }
}

function clearErrors() {
  [...TEXT_FIELDS, ...NUMBER_FIELDS].forEach((id) => setFieldError(id, ""));
  errorBox.hidden = true;
  errorBox.textContent = "";
}

function showError(message) {
  errorBox.textContent = message;
  errorBox.hidden = false;
}

// Takes the price in lakhs and returns it formatted in rupees (Indian grouping)
function formatPrice(valueInLakhs) {
  const lakhs = Number(valueInLakhs);
  if (!Number.isFinite(lakhs)) return { formatted: String(valueInLakhs), words: "" };

  const rupees = Math.round(lakhs * LAKH);
  const formatted = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(rupees);

  let words = "";
  if (rupees >= 1e7) words = (rupees / 1e7).toFixed(2) + " crore";
  else if (rupees >= 1e5) words = (rupees / 1e5).toFixed(2) + " lakh";

  return { formatted: "\u20B9" + formatted, words };
}

/* ---------- Validation ---------- */
function validate() {
  clearErrors();
  let firstBad = null;
  const fail = (id, msg) => {
    setFieldError(id, msg);
    if (!firstBad) firstBad = id;
  };

  TEXT_FIELDS.forEach((id) => {
    if (!document.getElementById(id).value) fail(id, "Please choose an option.");
  });

  NUMBER_FIELDS.forEach((id) => {
    const el = document.getElementById(id);
    const raw = el.value.trim();
    if (raw === "") return fail(id, "This field is required.");
    const n = Number(raw);
    if (!Number.isFinite(n)) return fail(id, "Enter a valid number.");
    if (n < Number(el.min || 0)) return fail(id, "Must be " + (el.min || 0) + " or more.");
    if (WHOLE_NUMBER_FIELDS.includes(id) && !Number.isInteger(n)) fail(id, "Use a whole number.");
  });

  const val = (id) => Number(document.getElementById(id).value);
  const isOk = (id) => !document.getElementById(id).closest(".field").classList.contains("invalid");

  if (isOk("Carpet_Area_SqFt") && isOk("Super_Area_SqFt") && val("Carpet_Area_SqFt") > val("Super_Area_SqFt")) {
    fail("Carpet_Area_SqFt", "Carpet area cannot be larger than super area.");
  }
  if (isOk("Floor_Number") && isOk("Total_Floors") && val("Floor_Number") > val("Total_Floors")) {
    fail("Floor_Number", "Floor number cannot be higher than total floors.");
  }

  if (firstBad) {
    showError("Please fix the highlighted fields and try again.");
    document.getElementById(firstBad).focus();
    return false;
  }
  return true;
}

/* ---------- Build payload ---------- */
function buildPayload() {
  const payload = {};
  TEXT_FIELDS.forEach((id) => { payload[id] = document.getElementById(id).value; });
  NUMBER_FIELDS.forEach((id) => { payload[id] = Number(document.getElementById(id).value); });
  TOGGLE_FIELDS.forEach((id) => { payload[id] = document.getElementById(id).checked ? 1 : 0; });
  return payload;
}

// Finds the price in common response shapes. Add your backend's key here if it differs.
function extractPrice(data) {
  if (typeof data === "number") return data;
  if (data && typeof data === "object") {
    const keys = [
      "predicted_price_in_lakhs", "predicted_price", "predicted_price_lakhs", "prediction",
      "price", "Price", "predicted_Price", "result"
    ];
    for (const k of keys) {
      if (data[k] !== undefined && data[k] !== null) {
        return Array.isArray(data[k]) ? data[k][0] : data[k];
      }
    }
  }
  return null;
}

// Turns FastAPI error bodies (string or list of field errors) into readable text
function readErrorDetail(body) {
  if (!body || body.detail === undefined) return "";
  if (typeof body.detail === "string") return body.detail;
  if (Array.isArray(body.detail)) {
    return body.detail
      .map((d) => (d.loc ? d.loc[d.loc.length - 1] + ": " : "") + d.msg)
      .join(". ");
  }
  return "";
}

/* ---------- Submit ---------- */
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  resultBox.hidden = true;
  if (!validate()) return;

  submitBtn.disabled = true;
  submitBtn.textContent = "Predicting...";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(buildPayload())
    });

    if (!response.ok) {
      let detail = "";
      try { detail = readErrorDetail(await response.json()); } catch (e) {}
      throw new Error("The server returned an error (" + response.status + "). " + detail);
    }

    const data = await response.json();
    const price = extractPrice(data);
    if (price === null) throw new Error("The server replied, but no price was found in the response.");

    const p = formatPrice(price);
    resultValue.textContent = p.formatted;
    resultNote.textContent = (p.words ? "About " + p.words + ". " : "") + "This is an estimate valuation.";
    resultBox.hidden = false;
    resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
  } catch (err) {
    const offline = err instanceof TypeError;
    showError(offline ? "Could not reach the server. Check that the backend is running and try again." : err.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Predict price";
  }
});

form.addEventListener("reset", () => {
  clearErrors();
  resultBox.hidden = true;
});

// Clear a field's error as soon as the user edits it
form.addEventListener("input", (event) => {
  if (event.target.id) setFieldError(event.target.id, "");
});
