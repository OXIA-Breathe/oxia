
import { WellnessPDFData } from "./wellnessPdfTypes";

const BRAND_BLUE = "#1D3557";
const BRAND_LIGHT = "#77A9E8";
const BRAND_BG = "#e0edf5";
const GREEN = "#22c55e";
const AMBER = "#f59e0b";
const RED = "#ef4444";

export const createWellnessStyles = (): HTMLStyleElement => {
  const style = document.createElement("style");
  style.textContent = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background: linear-gradient(160deg, #77A9E8 0%, #e0edf5 100%);
      color: ${BRAND_BLUE};
    }
    .page {
      max-width: 820px;
      margin: 30px auto;
      background: #fff;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 8px 40px rgba(29,53,87,0.12);
    }

    /* ─── Header ─── */
    .report-header {
      background: linear-gradient(135deg, ${BRAND_BLUE} 0%, #2d6aad 100%);
      color: #fff;
      padding: 36px 40px 28px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .report-header-left h1 {
      font-size: 26px;
      font-weight: 700;
      letter-spacing: -0.5px;
      margin-bottom: 4px;
    }
    .report-header-left .subtitle {
      font-size: 14px;
      opacity: 0.8;
      font-style: italic;
    }
    .report-header-right {
      text-align: right;
      font-size: 13px;
      opacity: 0.85;
    }
    .report-header-right .period {
      font-size: 15px;
      font-weight: 600;
      margin-bottom: 2px;
    }
    .logo-img { height: 36px; margin-bottom: 8px; }

    /* ─── Body ─── */
    .report-body { padding: 36px 40px; }

    /* ─── Section title ─── */
    .section-title {
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      color: ${BRAND_LIGHT};
      margin-bottom: 14px;
      padding-bottom: 6px;
      border-bottom: 2px solid ${BRAND_BG};
    }

    /* ─── Stats grid ─── */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
      margin-bottom: 36px;
    }
    .stat-box {
      background: ${BRAND_BG};
      border-radius: 14px;
      padding: 18px 14px;
      text-align: center;
    }
    .stat-value {
      font-size: 26px;
      font-weight: 800;
      color: ${BRAND_BLUE};
      line-height: 1;
      margin-bottom: 4px;
    }
    .stat-label {
      font-size: 11px;
      color: #5a7a9e;
      font-weight: 500;
    }

    /* ─── Insight boxes ─── */
    .insight-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
      margin-bottom: 36px;
    }
    .insight-box {
      border-radius: 14px;
      padding: 18px 16px;
      border-left: 4px solid ${BRAND_LIGHT};
    }
    .insight-box.positive { border-color: ${GREEN}; background: #f0fdf4; }
    .insight-box.neutral  { border-color: ${AMBER}; background: #fffbeb; }
    .insight-box.negative { border-color: ${RED};   background: #fef2f2; }
    .insight-box.info     { border-color: ${BRAND_LIGHT}; background: ${BRAND_BG}; }
    .insight-label { font-size: 11px; font-weight: 600; color: #5a7a9e; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 4px; }
    .insight-value { font-size: 22px; font-weight: 800; color: ${BRAND_BLUE}; margin-bottom: 2px; }
    .insight-sub   { font-size: 11px; color: #5a7a9e; }

    /* ─── Exercise ranking ─── */
    .exercise-list { margin-bottom: 36px; }
    .exercise-row {
      display: flex;
      align-items: center;
      padding: 12px 14px;
      border-radius: 10px;
      margin-bottom: 8px;
      background: ${BRAND_BG};
      gap: 12px;
    }
    .exercise-rank { font-size: 18px; width: 28px; flex-shrink: 0; }
    .exercise-name { flex: 1; font-size: 13px; font-weight: 600; color: ${BRAND_BLUE}; }
    .exercise-sessions { font-size: 11px; color: #5a7a9e; flex-shrink: 0; }
    .exercise-bar-wrap { width: 140px; background: #c9ddf0; border-radius: 999px; height: 8px; flex-shrink: 0; }
    .exercise-bar { height: 8px; border-radius: 999px; }
    .exercise-pct { font-size: 13px; font-weight: 800; flex-shrink: 0; width: 48px; text-align: right; }

    /* ─── Session table ─── */
    .session-table { width: 100%; border-collapse: collapse; margin-bottom: 36px; font-size: 12px; }
    .session-table th {
      background: ${BRAND_BG};
      padding: 10px 12px;
      text-align: left;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      color: #5a7a9e;
    }
    .session-table td { padding: 9px 12px; border-bottom: 1px solid #e8f0f8; }
    .session-table tr:last-child td { border-bottom: none; }

    /* ─── Activity heatmap ─── */
    .heatmap-wrap { margin-bottom: 36px; }
    .heatmap-grid { display: flex; flex-wrap: wrap; gap: 4px; }
    .heatmap-cell { width: 18px; height: 18px; border-radius: 4px; }

    /* ─── Mood section ─── */
    .mood-summary { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 36px; }
    .mood-box {
      background: ${BRAND_BG};
      border-radius: 14px;
      padding: 18px;
    }
    .mood-box-title { font-size: 12px; font-weight: 700; color: #5a7a9e; text-transform: uppercase; margin-bottom: 10px; letter-spacing: 0.6px; }
    .mood-row { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
    .mood-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
    .mood-name { font-size: 12px; color: ${BRAND_BLUE}; flex: 1; }
    .mood-count { font-size: 12px; font-weight: 700; color: ${BRAND_BLUE}; }

    /* ─── Footer ─── */
    .report-footer {
      background: ${BRAND_BG};
      padding: 20px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: #5a7a9e;
    }
    .report-footer .tagline { font-style: italic; }
  `;
  return style;
};

const MOOD_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: "Irritated", color: "#f87171" },
  2: { label: "Sad",       color: "#60a5fa" },
  3: { label: "Tired",     color: "#94a3b8" },
  4: { label: "Anxious",   color: "#c084fc" },
  5: { label: "Calm",      color: "#4ade80" },
  6: { label: "Happy",     color: "#fbbf24" },
  7: { label: "Excited",   color: "#fb923c" },
};

const fmtTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  if (m === 0) return `${sec}s`;
  if (sec === 0) return `${m}m`;
  return `${m}m ${sec}s`;
};

const medal = (i: number) => {
  if (i === 0) return "🥇";
  if (i === 1) return "🥈";
  if (i === 2) return "🥉";
  return `${i + 1}.`;
};

const barColor = (pct: number) => {
  if (pct >= 20) return GREEN;
  if (pct >= 5)  return "#86efac";
  if (pct >= 0)  return AMBER;
  return RED;
};

// ─── Assemble the full report HTML ───────────────────────────────────────────
export const assembleWellnessHtml = (data: WellnessPDFData): HTMLElement => {
  const { sessions, exerciseEffectiveness, emotionRecords, streakData, reportMonth, reportPeriod, userName } = data;

  const container = document.createElement("div");
  container.appendChild(createWellnessStyles());

  const page = document.createElement("div");
  page.className = "page";

  // ── Header ──────────────────────────────────────────────────────────────
  const header = document.createElement("div");
  header.className = "report-header";

  const headerLeft = document.createElement("div");
  headerLeft.className = "report-header-left";
  headerLeft.innerHTML = `
    <h1>Monthly Wellness Report</h1>
    <div class="subtitle">Every breath counts.</div>
  `;

  const headerRight = document.createElement("div");
  headerRight.className = "report-header-right";
  const logoImg = document.createElement("img");
  logoImg.src = "/lovable-uploads/e5ed9dd5-4566-4dea-bba3-30fe6009fd4f.png";
  logoImg.alt = "OXIA";
  logoImg.className = "logo-img";

  const periodDiv = document.createElement("div");
  periodDiv.className = "period";
  periodDiv.textContent = reportMonth;

  const userDiv = document.createElement("div");
  if (userName) userDiv.textContent = userName;

  const generatedDiv = document.createElement("div");
  generatedDiv.textContent = `Generated ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`;

  headerRight.appendChild(logoImg);
  headerRight.appendChild(periodDiv);
  if (userName) headerRight.appendChild(userDiv);
  headerRight.appendChild(generatedDiv);

  header.appendChild(headerLeft);
  header.appendChild(headerRight);
  page.appendChild(header);

  // ── Body ────────────────────────────────────────────────────────────────
  const body = document.createElement("div");
  body.className = "report-body";

  // ── 1. Summary stats ─────────────────────────────────────────────────
  const totalSessions = sessions.length;
  const totalTime = sessions.reduce((a, s) => a + s.totalDuration, 0);
  const totalBreaths = sessions.reduce((a, s) => a + s.breathCount, 0);
  const avgDuration = totalSessions ? Math.round(totalTime / totalSessions) : 0;

  body.innerHTML += `<div class="section-title">Breathing Summary</div>`;

  const statsGrid = document.createElement("div");
  statsGrid.className = "stats-grid";

  const stats = [
    { label: "Sessions", value: totalSessions.toString() },
    { label: "Total Time", value: fmtTime(totalTime) },
    { label: "Total Breaths", value: totalBreaths.toString() },
    { label: "Avg Duration", value: fmtTime(avgDuration) },
  ];

  stats.forEach(s => {
    statsGrid.innerHTML += `
      <div class="stat-box">
        <div class="stat-value">${s.value}</div>
        <div class="stat-label">${s.label}</div>
      </div>`;
  });
  body.appendChild(statsGrid);

  // ── 2. Key insights ──────────────────────────────────────────────────
  const preStress = emotionRecords.map(r => r.pre_arousal).filter((v): v is number => v !== null);
  const postStress = emotionRecords.map(r => r.post_arousal).filter((v): v is number => v !== null);
  const preMood = emotionRecords.map(r => r.pre_valence).filter((v): v is number => v !== null);
  const postMood = emotionRecords.map(r => r.post_valence).filter((v): v is number => v !== null);

  const avgPreStress = preStress.length ? preStress.reduce((a, b) => a + b, 0) / preStress.length : null;
  const avgPostStress = postStress.length ? postStress.reduce((a, b) => a + b, 0) / postStress.length : null;
  const stressReductionPct = (avgPreStress && avgPostStress && avgPreStress > 0)
    ? Math.round(((avgPreStress - avgPostStress) / avgPreStress) * 100) : null;

  const avgPreMood = preMood.length ? preMood.reduce((a, b) => a + b, 0) / preMood.length : null;
  const avgPostMood = postMood.length ? postMood.reduce((a, b) => a + b, 0) / postMood.length : null;
  const moodShift = (avgPreMood !== null && avgPostMood !== null) ? Math.round((avgPostMood - avgPreMood) * 10) / 10 : null;

  if (stressReductionPct !== null || moodShift !== null || streakData) {
    const insightTitle = document.createElement("div");
    insightTitle.className = "section-title";
    insightTitle.textContent = "Key Insights";
    body.appendChild(insightTitle);

    const insightGrid = document.createElement("div");
    insightGrid.className = "insight-grid";

    if (stressReductionPct !== null) {
      const cls = stressReductionPct >= 10 ? "positive" : stressReductionPct >= 0 ? "neutral" : "negative";
      insightGrid.innerHTML += `
        <div class="insight-box ${cls}">
          <div class="insight-label">Avg. Stress Reduction</div>
          <div class="insight-value">${stressReductionPct >= 0 ? "−" : "+"}${Math.abs(stressReductionPct)}%</div>
          <div class="insight-sub">per session this month</div>
        </div>`;
    }

    if (moodShift !== null) {
      const cls = moodShift >= 0.5 ? "positive" : moodShift >= 0 ? "neutral" : "negative";
      insightGrid.innerHTML += `
        <div class="insight-box ${cls}">
          <div class="insight-label">Mood Improvement</div>
          <div class="insight-value">${moodShift >= 0 ? "+" : ""}${moodShift} pts</div>
          <div class="insight-sub">avg. before vs after</div>
        </div>`;
    }

    if (streakData) {
      insightGrid.innerHTML += `
        <div class="insight-box info">
          <div class="insight-label">Breathing Streak</div>
          <div class="insight-value">${streakData.currentBreathStreak} days</div>
          <div class="insight-sub">longest: ${streakData.longestBreathStreak} days</div>
        </div>`;
    }

    body.appendChild(insightGrid);
  }

  // ── 3. Exercise Effectiveness Ranking ────────────────────────────────
  if (exerciseEffectiveness.length > 0) {
    const exTitle = document.createElement("div");
    exTitle.className = "section-title";
    exTitle.textContent = "Top Exercises by Stress Reduction";
    body.appendChild(exTitle);

    const exList = document.createElement("div");
    exList.className = "exercise-list";

    const maxPct = Math.max(...exerciseEffectiveness.map(e => e.avgStressReductionPercent), 1);

    exerciseEffectiveness.slice(0, 6).forEach((ex, i) => {
      const pct = ex.avgStressReductionPercent;
      const barWidth = Math.max(0, Math.round((pct / Math.max(maxPct, 1)) * 100));
      exList.innerHTML += `
        <div class="exercise-row">
          <div class="exercise-rank">${medal(i)}</div>
          <div class="exercise-name">${ex.exerciseTitle}</div>
          <div class="exercise-sessions">${ex.sessionCount} sessions</div>
          <div class="exercise-bar-wrap">
            <div class="exercise-bar" style="width:${barWidth}%;background:${barColor(pct)}"></div>
          </div>
          <div class="exercise-pct" style="color:${barColor(pct)}">${pct >= 0 ? "−" : "+"}${Math.abs(pct)}%</div>
        </div>`;
    });

    body.appendChild(exList);
  }

  // ── 4. Mood breakdown ────────────────────────────────────────────────
  if (emotionRecords.length > 0) {
    const moodTitle = document.createElement("div");
    moodTitle.className = "section-title";
    moodTitle.textContent = "Mood Breakdown";
    body.appendChild(moodTitle);

    const moodSummary = document.createElement("div");
    moodSummary.className = "mood-summary";

    const countMoods = (type: "pre" | "post") => {
      const counts: Record<number, number> = {};
      emotionRecords.forEach(r => {
        const v = type === "pre" ? r.pre_valence : r.post_valence;
        if (v !== null) counts[v] = (counts[v] || 0) + 1;
      });
      return Object.entries(counts)
        .map(([k, c]) => ({ mood: parseInt(k), count: c }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    };

    const renderMoodBox = (label: string, items: { mood: number; count: number }[]) => {
      const box = document.createElement("div");
      box.className = "mood-box";
      box.innerHTML = `<div class="mood-box-title">${label}</div>`;
      items.forEach(({ mood, count }) => {
        const m = MOOD_LABELS[mood] || { label: "Unknown", color: "#94a3b8" };
        box.innerHTML += `
          <div class="mood-row">
            <div class="mood-dot" style="background:${m.color}"></div>
            <div class="mood-name">${m.label}</div>
            <div class="mood-count">${count}×</div>
          </div>`;
      });
      return box;
    };

    moodSummary.appendChild(renderMoodBox("Before Breathing", countMoods("pre")));
    moodSummary.appendChild(renderMoodBox("After Breathing", countMoods("post")));
    body.appendChild(moodSummary);
  }

  // ── 5. Session history table ─────────────────────────────────────────
  const histTitle = document.createElement("div");
  histTitle.className = "section-title";
  histTitle.textContent = "Session History";
  body.appendChild(histTitle);

  const table = document.createElement("table");
  table.className = "session-table";
  table.innerHTML = `
    <thead>
      <tr>
        <th>Date</th>
        <th>Exercise</th>
        <th>Breaths</th>
        <th>Duration</th>
      </tr>
    </thead>`;

  const tbody = document.createElement("tbody");
  const displaySessions = sessions.slice(0, 30); // cap at 30 rows

  if (displaySessions.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:20px;color:#5a7a9e">No sessions in this period.</td></tr>`;
  } else {
    displaySessions.forEach(s => {
      const d = new Date(s.date);
      tbody.innerHTML += `
        <tr>
          <td>${d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
          <td>${s.exerciseTitle || "Breathing Exercise"}</td>
          <td>${s.breathCount}</td>
          <td>${fmtTime(s.totalDuration)}</td>
        </tr>`;
    });
  }

  table.appendChild(tbody);
  body.appendChild(table);

  page.appendChild(body);

  // ── Footer ───────────────────────────────────────────────────────────
  const footer = document.createElement("div");
  footer.className = "report-footer";
  footer.innerHTML = `
    <span class="tagline">Every breath is a step toward your best self.</span>
    <span>OXIA Wellness · ${reportMonth}</span>
  `;
  page.appendChild(footer);

  container.appendChild(page);
  return container;
};
