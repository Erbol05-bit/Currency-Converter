const API_URL = "https://open.er-api.com/v6/latest/USD";

const amountInput = document.getElementById("amount");
const fromSelect = document.getElementById("from");
const toSelect = document.getElementById("to");
const form = document.getElementById("converter-form");
const resultEl = document.getElementById("result");
const rateInfoEl = document.getElementById("rate-info");
const errorEl = document.getElementById("error");
const swapBtn = document.getElementById("swap");

// --- Список валют ---
async function loadCurrencies() {
  try {
    clearError();
    const res = await fetch(API_URL);

    if (!res.ok) throw new Error("Ошибка сети");

    const data = await res.json();
    if (data.result !== "success") throw new Error("Ошибка API");

    const base = data.base_code;  // USD
    const rates = data.rates;     // {EUR: 0.92, ...}

    const currencies = Object.keys(rates).sort();
    if (!currencies.includes(base)) currencies.unshift(base);

    fillSelect(fromSelect, currencies, "USD");
    fillSelect(toSelect, currencies, "EUR");

    autoConvert();
  } catch (e) {
    showError("Не удалось загрузить список валют.");
    console.error(e);
  }
}

const currencyNames = {
  USD: "Доллар США",
  EUR: "Евро",
  KGS: "Кыргызский сом",
  KZT: "Казахстанский тенге",
  RUB: "Российский рубль",
  UZS: "Узбекский сум",
  CNY: "Китайский юань",
  JPY: "Японская иена",
  GBP: "Британский фунт стерлингов",
  TRY: "Турецкая лира",
  INR: "Индийская рупия",
  AED: "Дирхам ОАЭ",
  AFN: "Афганский афгани",
  ALL: "Албанский лек",
  AMD: "Армянский драм",
  ANG: "Нидерландский антильский гульден",
  AOA: "Ангольская кванза",
  ARS: "Аргентинское песо",
  AUD: "Австралийский доллар",
  AWG: "Арубанский флорин",
  AZN: "Азербайджанский манат",
  BAM: "Конвертируемая марка Боснии и Герцеговины",
  BBD: "Барбадосский доллар",
  BDT: "Бангладешская така",
  BGN: "Болгарский лев",
  BHD: "Бахрейнский динар",
  BIF: "Бурундийский франк",
  BMD: "Бермудский доллар",
  BND: "Брунейский доллар",
  BOB: "Боливийский боливиано",
  BRL: "Бразильский реал",
  BSD: "Багамский доллар",
  BTN: "Бутанский нгултрум",
  BWP: "Ботсванская пула",
  BYN: "Белорусский рубль",
  BZD: "Белизский доллар",
  CAD: "Канадский доллар",
  CDF: "Конголезский франк",
  CHF: "Швейцарский франк",
  CLF: "Условная единица развития(Чили)",
  CLP: "Чилийское песо",
  CNH: "Китайский офшорный юань (женьминьби)",
  COP: "Колумбийское песо",
  CRC: "Коста-риканский колон",
  CUP: "Кубинское песо",
  CVE: "Эскудо Кабо-Верде",
  CZK: "Чешская крона",
  DJF: "Франк Джибути",
  DKK: "Датская крона",
  DZD: "Алжирский динар",
  DOP: "Доминиканское песо",
  EGP: "Египетский фунт	",
  ERN: "Эритрейская накфа",
  ETB: "Эфиопский быр",
  FJD: "Доллар Фиджи",
  FKP: "Фунт Фолклендских островов",
  FOK: "Ферарская крона",
  GEL: "Грузинский лари",
  GGP: "Гернсийский фунт",
  GHS: "Новый ганский седи",
  GIP: "Гибралтарский фунт",
  GMD: "Гамбийский даласи",
  GNF: "Гвинейский франк",
  GTQ: "Гватемальский кетсаль",
  GYD: "Гайанский доллар",
  HKD: "Гонконгский доллар",
  HNL: "Гондурасская лемпира",
  HRK: "Хорватская куна",
  HTG: "Гаитянский гурд",
  HUF: "Венгерский форинт",
  IDR: "Индонезийская рупия",
  ILS: "Новый израильский шекель",
  IMP: "Фунт острова Мэн",
  IQD: "Иракский динар",
  IRR: "Иранский риал",
  ISK: "Исландская крона",
  JEP: "Фунт Джерси",
  JMD: "Ямайский доллар",
  JOD: "Иорданский динар",
  KES: "Кенийский шиллинг",
  KHR: "Камбоджийский риель",
  KID: "Доллар Кирибати",
  KMF: "Коморский франк",
  KRW: "Южно-корейская вона (Корея)",
  KWD: "Кувейтский динар",
  KYD: "Доллар Каймановых островов",
  LAK: "Лаосский кип",
  LBP: "Ливанский фунт",
  LKR: "Шри-ланкийская рупия",
  LRD: "Либерийский доллар",
  LSL: "Лоти Лесото",
  LYD: "Ливийский динар",
  MAD: "Марокканский дирхам",
  MDL: "Молдовский лей",
  MGA: "Малагасийский ариари",
  MKD: "Македонский денар",
  MMK: "Мьянманский кьят",
  MNT: "Монгольский тугрик",
  MOP: "Патака Макао",
  MRU: "Мавританская угия",
  MUR: "Маврикийская рупия",
  MVR: "Мальдивская руфия",
  MWK: "Малавийская квача",
  MXN: "Мексиканский песо",
  MYR: "Малайзийский ринггит",
  MZN: "Мозамбикский метикал",
  NAD: "Намибийский доллар",
  NGN: "Нигерийская наира",
  NIO: "Никарагуанская кордоба",
  NOK: "Норвежская крона",
  NPR: "Непальская рупия",
  NZD: "Ново­зеландский доллар",
  OMR: "Оманский риал",
  PAB: "Панамский бальбоа",
  PEN: "Перуанский соль",
  PGK: "Кина Папуа-Новой Гвинеи",
  PHP: "Филиппинский песо",
  PKR: "Пакистанская рупия",
  PLN: "Польский злотый",
  PYG: "Парагвайский гуарани",
  QAR: "Катарский риал",
  RON: "Новый румынский лей",
  RSD: "Сербский динар",
  RWF: "Руандийский франк",
  SAR: "Саудовский риял",
  SBD: "Доллар Соломоновых островов",
  SCR: "Сейшельская рупия",
  SDG: "Суданский фунт",
  SEK: "Шведская крона",
  SGD: "Сингапурский доллар",
  SHP: "Фунт Святой Елены",
  SLE: "Сьерра-леонский леоне(новый)",
  SLL: "Сьерра-леонский леоне(старый)",
  SOS: "Сомалийский шиллинг",
  SRD: "Суринамский доллар",
  SSP: "Южносуданский фунт",
  STN: "Добра Сан-Томе и Принсипи",
  SYP: "Сирийский фунт",
  SZL: "Свазилендский лилангени",
  THB: "Таиландский бат",
  TJS: "Таджикский сомони",
  TMT: "Туркменский манат",
  TND: "Тунисский динар",
  TOP: "Тонганская паанга",
  TRY: "Новая турецкая лира",
  TTD: "Доллар Тринидада и Тобаго",
  TVD: "Доллар Тувалу",
  TWD: "Тайваньский доллар",
  TZS: "Танзанийский шиллинг",
  UAH: "Украинская гривна",
  UGX: "Угандийский шиллинг,",
  UYU: "Уругвайский песо",
  UZS: "Узбекский сум",
  VES: "Венесуэльский суверенный боливар",
  VND: "Вьетнамский донг",
  VUV: "Вануатский вату",
  WST: "Самоанская тала",
  XAF: "Франк КФА (Центральная Африка)",
  XCD: "Восточно-Карибский доллар",
  XCG: "Карибский гульден",
  XDR: "СДР(Международный валютный фонд)",
  XOF: "Франк КФА (Западная Африка)",
  XPF: "Франк КФП",
  YER: "Йеменский риал",
  ZAR: "Южно-африканский рэнд",
  ZMW: "Замбийская квача",
  ZWG: "Зимбабвийское золото",
  ZWL: " Зимбабвийский доллар",
};


function fillSelect(select, list, defaultVal) {
  select.innerHTML = "";
  for (const code of list) {
    const opt = document.createElement("option");
    opt.value = code;
    opt.textContent = code;
    if (code === defaultVal) opt.selected = true;
    select.appendChild(opt);
  }
}

// --- Конвертация ---
async function convertCurrency(amount, from, to) {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Ошибка сети");
  const data = await res.json();

  if (data.result !== "success") throw new Error("Ошибка API");

  const rates = data.rates;

  if (!rates[from] || !rates[to]) throw new Error("Неизвестная валюта");

  const amountInUSD = amount / rates[from]; 
  const result = amountInUSD * rates[to];
  const rate = rates[to] / rates[from];

  return {
    result,
    rate,
    date: data.time_last_update_utc
  };
}

// --- Обработчик формы ---
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearError();

  const amount = parseFloat(amountInput.value);
  const from = fromSelect.value;
  const to = toSelect.value;

  if (!amount || amount <= 0) {
    showError("Введите сумму больше 0");
    return;
  }

  if (from === to) {
    showError("Выберите разные валюты");
    return;
  }

  resultEl.textContent = "Конвертация...";
  rateInfoEl.textContent = "";

  try {
    const { result, rate, date } = await convertCurrency(amount, from, to);

    resultEl.textContent = `${amount.toFixed(2)} ${from} = ${result.toFixed(2)} ${to}`;

    rateInfoEl.textContent = `Курс: 1 ${from} = ${rate.toFixed(4)} ${to} (обновлено: ${date})`;

  } catch (err) {
    showError("Ошибка при загрузке курса");
    console.error(err);
  }
});

// --- Меняем валюты местами ---
swapBtn.addEventListener("click", () => {
  const f = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = f;

  autoConvert();
});

amountInput.addEventListener("input", autoConvert);
fromSelect.addEventListener("change", autoConvert);
toSelect.addEventListener("change", autoConvert);





function showError(msg) {
  errorEl.textContent = msg;
  errorEl.classList.remove("hidden");
}

function clearError() {
  errorEl.classList.add("hidden");
  errorEl.textContent = "";
}

loadCurrencies();

async function autoConvert() {
  clearError();

  const amount = parseFloat(amountInput.value);
  const from = fromSelect.value;
  const to = toSelect.value;

  if (!amount || amount <= 0) {
    resultEl.textContent = "Введите сумму...";
    rateInfoEl.textContent = "";
    return;
  }

  if (from === to) {
    resultEl.textContent = "Выберите разные валюты";
    rateInfoEl.textContent = "";
    return;
  }

  try {
    const { result, rate, date } = await convertCurrency(amount, from, to);

    resultEl.textContent = `${amount.toFixed(2)} ${from} = ${result.toFixed(2)} ${to}`;
    const fromName = currencyNames[from] || "";
    const toName = currencyNames[to] || "";

rateInfoEl.innerHTML = `
  <div>Курс: 1 ${from} = ${rate.toFixed(4)} ${to} (обновлено: ${date})</div>
  <div class="currency-meta">
    ${from} — ${fromName} → ${to} — ${toName}
  </div>
`;


  } catch (err) {
    showError("Ошибка при загрузке курса");
    console.error(err);
  }
}





