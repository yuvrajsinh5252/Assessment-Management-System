const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const reportConfig = require('../config/reportConfig');
const { resolvePath } = require('../utils/pathResolver');

function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getClassification(fieldConfig, value) {
  if (!fieldConfig.classification || value === 'N/A') {
    return null;
  }

  const ranges = reportConfig.classifications[fieldConfig.classification];
  if (!ranges) {
    return null;
  }

  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) {
    return null;
  }

  return ranges.find((range) => {
    const min = range.min ?? Number.NEGATIVE_INFINITY;
    const max = range.max ?? Number.POSITIVE_INFINITY;
    return numericValue >= min && numericValue <= max;
  }) || null;
}

function renderFieldValue(fieldConfig, data) {
  const rawValue = resolvePath(data, fieldConfig.path, fieldConfig);
  if (fieldConfig.type === 'list') {
    if (Array.isArray(rawValue)) {
      return rawValue;
    }
    return Array.isArray(rawValue?.items) ? rawValue.items : [];
  }

  const value = rawValue;
  const classification = getClassification(fieldConfig, value);
  const formattedValue = value === undefined ? 'N/A' : value;
  return {
    display: formattedValue,
    unit: fieldConfig.unit,
    classification,
  };
}

function buildListSection(section, data) {
  const itemsHtml = section.fields.map((field) => {
    const values = renderFieldValue(field, data);
    if (!Array.isArray(values) || values.length === 0) {
      return '';
    }
    const listItems = values
      .map((value) => `<li>${value}</li>`)
      .join('');
    return `<div class="section-list"><h4>${field.label}</h4><ul>${listItems}</ul></div>`;
  });

  return itemsHtml.join('');
}

function buildTableSection(section, data) {
  const rows = section.fields
    .map((field) => {
      const { display, unit, classification } = renderFieldValue(field, data);
      const badge = classification
        ? `<span class="badge" style="background:${classification.color}">${classification.label}</span>`
        : '';
      const unitLabel = unit ? `<span class="unit">${unit}</span>` : '';
      return `
        <tr>
          <td class="label">${field.label}</td>
          <td class="value">${display}${unitLabel}</td>
          <td class="badge-cell">${badge}</td>
        </tr>
      `;
    })
    .join('');
  return `<table>${rows}</table>`;
}

function buildGridSection(section, data) {
  const columns = section.columns || 3;
  const items = section.fields
    .map((field) => {
      const { display, unit, classification } = renderFieldValue(field, data);
      const badge = classification
        ? `<span class="badge" style="background:${classification.color}">${classification.label}</span>`
        : '';
      const unitLabel = unit ? `<span class="unit">${unit}</span>` : '';
      return `
        <div class="grid-item">
          <h4>${field.label}</h4>
          <p>${display}${unitLabel}</p>
          ${badge}
        </div>
      `;
    })
    .join('');

  return `<div class="grid grid-${columns}">${items}</div>`;
}

function sectionRenderer(section, data) {
  switch (section.layout) {
    case 'list':
      return buildListSection(section, data);
    case 'grid':
      return buildGridSection(section, data);
    case 'table':
    default:
      return buildTableSection(section, data);
  }
}

function buildHtmlDocument(assessment, data) {
  const sectionsHtml = assessment.sections
    .map((section) => `
      <section>
        <h3>${section.title}</h3>
        ${sectionRenderer(section, data)}
      </section>
    `)
    .join('');

  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${assessment.title}</title>
        <style>
          body {
            font-family: 'Inter', Arial, sans-serif;
            margin: 0;
            padding: 32px;
            color: #1f2937;
          }
          header {
            border-bottom: 2px solid #0ea5e9;
            padding-bottom: 16px;
            margin-bottom: 24px;
          }
          h1 {
            margin: 0;
            font-size: 28px;
            color: #0f172a;
          }
          h2 {
            font-size: 18px;
            color: #334155;
            margin-top: 8px;
          }
          section {
            margin-bottom: 24px;
            page-break-inside: avoid;
          }
          section h3 {
            font-size: 16px;
            margin-bottom: 12px;
            color: #0f172a;
            text-transform: uppercase;
            letter-spacing: 0.08em;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            background: #f8fafc;
            border-radius: 8px;
            overflow: hidden;
          }
          table tr:nth-child(even) {
            background: #f1f5f9;
          }
          td {
            padding: 12px;
            border-bottom: 1px solid #e2e8f0;
          }
          td.label {
            font-weight: 600;
            width: 35%;
          }
          td.value {
            font-weight: 500;
          }
          td .unit {
            margin-left: 4px;
            font-size: 12px;
            color: #64748b;
          }
          td.badge-cell {
            text-align: right;
            width: 25%;
          }
          .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 999px;
            font-size: 12px;
            color: #fff;
          }
          .grid {
            display: grid;
            gap: 16px;
          }
          .grid.grid-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .grid.grid-3 {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
          .grid-item {
            background: #f8fafc;
            border-radius: 8px;
            padding: 16px;
            border: 1px solid #e2e8f0;
          }
          .grid-item h4 {
            margin: 0 0 4px 0;
            font-size: 14px;
            color: #0f172a;
          }
          .grid-item p {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
          }
          .section-list {
            margin-bottom: 16px;
          }
          .section-list h4 {
            font-size: 14px;
            margin-bottom: 6px;
            color: #334155;
          }
          .section-list ul {
            margin: 0;
            padding-left: 18px;
            color: #475569;
          }
          footer {
            margin-top: 40px;
            font-size: 12px;
            color: #94a3b8;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <header>
          <h1>${assessment.title}</h1>
          <h2>${assessment.summary || ''}</h2>
        </header>
        ${sectionsHtml}
        <footer>Generated on ${new Date().toLocaleString()}</footer>
      </body>
    </html>
  `;
}

async function generateReport(data) {
  const assessment = reportConfig.assessments[data.assessment_id];
  if (!assessment) {
    throw new Error(`No report configuration found for assessment_id ${data.assessment_id}`);
  }

  ensureDirectoryExists(reportConfig.outputDir);

  const html = buildHtmlDocument(assessment, data);
  const filename = `${data.session_id}-${data.assessment_id}-${Date.now()}.pdf`;
  const filepath = path.join(reportConfig.outputDir, filename);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.pdf({
    path: filepath,
    format: 'A4',
    printBackground: true,
    margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' }
  });
  await browser.close();

  return {
    filePath: filepath,
    fileName: filename,
    html,
  };
}

module.exports = {
  generateReport,
};
