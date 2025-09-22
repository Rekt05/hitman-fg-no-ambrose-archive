let runs = [];
fetch('runs.json')
  .then(res => res.json())
  .then(data => {
    runs = data;
    document.getElementById('trilogyBtn').click();
    nlpSelect.value = 'Hidden';
    obsoleteSelect.value = 'Hidden';
  });

const trilogyCategories = [
  "Trilogy SA/SO Pro",
  "Trilogy SA/SO Master",
  "Trilogy SA Pro",
  "Trilogy Any%",
  "Trilogy Default (NG+) SA/SO Master",
  "Trilogy Fiberwire SA/SO Pro",
  "Trilogy Accidents SA/SO Pro"
];

const s2Categories = [
  "Season 2 SA/SO Pro",
  "Season 2 SA/SO Master",
  "Season 2 SA Pro",
  "Season 2 Any%",
  "Season 2 Default (NG+) SA/SO Master",
  "Season 2 Fiberwire SA/SO Pro",
  "Season 2 Accidents SA/SO Pro",
  "Season 2 Poison SA Pro",
  "Season 2 Sniper (Ballistic) SA/SO Pro",
  "Season 2 Explosive Devices SA/SO Pro"
];

const categorySelect = document.getElementById('categorySelect');
const categoryDiv = document.getElementById('categoryDiv');
const table = document.getElementById('runsTable');
const tbody = table.querySelector('tbody');
const nlpSelect = document.getElementById('nlpSelect');
const obsoleteSelect = document.getElementById('obsoleteSelect');

document.getElementById('trilogyBtn').addEventListener('click', () => {
  populateCategories(trilogyCategories);
});

document.getElementById('s2Btn').addEventListener('click', () => {
  populateCategories(s2Categories);
});

categorySelect.addEventListener('change', displayRuns);
nlpSelect.addEventListener('change', displayRuns);
obsoleteSelect.addEventListener('change', displayRuns);

function populateCategories(categories) {
  categoryDiv.style.display = 'block';
  categorySelect.innerHTML = '';
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    categorySelect.appendChild(opt);
  });
  displayRuns();
}

function parseTimeToSeconds(time) {
  const parts = time.split(':').map(Number);
  if (parts.length === 2) return parts[0]*60 + parts[1];
  if (parts.length === 3) return parts[0]*3600 + parts[1]*60 + parts[2];
  return 0;
}

function displayRuns() {
  const category = categorySelect.value;
  const nlpFilter = nlpSelect.value;
  const obsoleteFilter = obsoleteSelect.value;

  let filtered = runs.filter(r => r.Category === category);

  filtered = filtered.filter(r => {
    const hasText = r.NLP && r.NLP !== 'N/A' && r.NLP.trim() !== '';
    if (nlpFilter === 'Hidden') return r.NLP === 'N/A';
    if (nlpFilter === 'Mixed') return true;
    if (nlpFilter === 'Exclusive') return hasText;
    return true;
  });

  if (obsoleteFilter === 'Hidden') {

    const bestTimes = {};
    filtered.forEach(r => {
      const time = parseTimeToSeconds(r.Time);
      if (!(r.Player in bestTimes) || time < bestTimes[r.Player]) {
        bestTimes[r.Player] = time;
      }
    });
    filtered = filtered.filter(r => parseTimeToSeconds(r.Time) === bestTimes[r.Player]);
  }

  filtered.sort((a, b) => parseTimeToSeconds(a.Time) - parseTimeToSeconds(b.Time));

  tbody.innerHTML = '';
filtered.forEach((r, index) => {
  const rank = index + 1;
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${rank}</td>
    <td>${r.Player}</td>
    <td>${r.Date}</td>
    <td>${r.Category}</td>
    <td>${r.Time}</td>
    <td>${r.NLP}</td>
    <td><a href="${r.Link}" target="_blank">Video</a></td>
    <td><a href="${r.TimeCalc}" target="_blank">Time Calculation</a></td>
  `;
  tbody.appendChild(tr);
});

  table.style.display = filtered.length ? 'table' : 'none';
}
