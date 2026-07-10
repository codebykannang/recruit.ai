import { jsPDF } from 'jspdf';

// Builds a plain-text, single-column PDF — no tables, no text boxes, no images.
// That's what lets ATS parsers (Workday, Greenhouse, Taleo, etc.) read every
// field correctly instead of scrambling a two-column or graphic layout.

const PAGE_W = 210; // A4 mm
const PAGE_H = 297;

function layoutFor(template) {
  const compact = !!template.compact;
  return {
    margin: compact ? 14 : 18,
    nameSize: compact ? 17 : 19,
    titleSize: compact ? 10.5 : 11,
    sectionSize: compact ? 11 : 11.5,
    bodySize: compact ? 9.5 : 10,
    lineGap: compact ? 4.4 : 5,
    sectionGapBefore: compact ? 5.5 : 7,
    sectionGapAfter: compact ? 2.5 : 3.5,
  };
}

function addPageIfNeeded(doc, y, margin, needed = 10) {
  if (y + needed > PAGE_H - margin) {
    doc.addPage();
    return margin;
  }
  return y;
}

function sectionHeader(doc, text, y, L, template, contentWidth) {
  y = addPageIfNeeded(doc, y, L.margin, L.sectionGapBefore + 8);
  y += L.sectionGapBefore;
  doc.setFont(template.font, 'bold');
  doc.setFontSize(L.sectionSize);
  doc.setTextColor(20, 20, 23);
  doc.text(text.toUpperCase(), L.margin, y);

  if (template.headerStyle === 'underline') {
    doc.setDrawColor(20, 20, 23);
    doc.setLineWidth(0.4);
    doc.line(L.margin, y + 1.3, L.margin + contentWidth, y + 1.3);
  } else if (template.headerStyle === 'rule') {
    const [r, g, b] = hexToRgb(template.accent);
    doc.setDrawColor(r, g, b);
    doc.setLineWidth(0.8);
    doc.line(L.margin, y + 1.6, L.margin + 14, y + 1.6);
  }
  return y + L.sectionGapAfter + 3;
}

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function bodyText(doc, text, y, L, contentWidth, opts = {}) {
  doc.setFont(opts.font || 'default', opts.style || 'normal');
  doc.setFontSize(opts.size || L.bodySize);
  doc.setTextColor(...(opts.color || [40, 40, 45]));
  const lines = doc.splitTextToSize(text, contentWidth - (opts.indent || 0));
  lines.forEach((line) => {
    y = addPageIfNeeded(doc, y, L.margin);
    doc.text(line, L.margin + (opts.indent || 0), y);
    y += L.lineGap;
  });
  return y;
}

function bulletList(doc, bullets, y, L, template, contentWidth) {
  const indent = 4.5;
  doc.setFont(template.font, 'normal');
  doc.setFontSize(L.bodySize);
  doc.setTextColor(40, 40, 45);
  bullets.filter((b) => b && b.trim()).forEach((b) => {
    const lines = doc.splitTextToSize(b.trim(), contentWidth - indent);
    lines.forEach((line, i) => {
      y = addPageIfNeeded(doc, y, L.margin);
      const prefix = i === 0 ? '\u2022  ' : '   ';
      doc.text(prefix + line, L.margin + (i === 0 ? 0 : indent), y);
      y += L.lineGap;
    });
  });
  return y;
}

export function generateResumePDF(data, template) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const L = layoutFor(template);
  const contentWidth = PAGE_W - L.margin * 2;
  let y = L.margin;

  // Name
  doc.setFont(template.font, 'bold');
  doc.setFontSize(L.nameSize);
  doc.setTextColor(20, 20, 23);
  doc.text((data.fullName || 'Your Name').toUpperCase(), PAGE_W / 2, y, { align: 'center' });
  y += L.nameSize / 3.6;

  // Title
  if (data.title) {
    doc.setFont(template.font, 'normal');
    doc.setFontSize(L.titleSize);
    doc.setTextColor(60, 60, 66);
    doc.text(data.title, PAGE_W / 2, y + 5, { align: 'center' });
    y += 5;
  }

  // Contact line
  const contactParts = [data.phone, data.email, data.portfolio, data.github, data.linkedin, data.location].filter(Boolean);
  if (contactParts.length) {
    y += 6;
    doc.setFont(template.font, 'normal');
    doc.setFontSize(9);
    doc.setTextColor(70, 70, 76);
    const line = contactParts.join('   |   ');
    const wrapped = doc.splitTextToSize(line, contentWidth);
    wrapped.forEach((ln) => {
      doc.text(ln, PAGE_W / 2, y, { align: 'center' });
      y += 4.4;
    });
  } else {
    y += 8;
  }

  // Summary
  if (data.summary && data.summary.trim()) {
    y = sectionHeader(doc, 'Professional Summary', y, L, template, contentWidth);
    y = bodyText(doc, data.summary.trim(), y, L, contentWidth, { font: template.font });
  }

  // Skills
  const skillRows = (data.skills || []).filter((s) => s.value && s.value.trim());
  if (skillRows.length) {
    y = sectionHeader(doc, 'Technical Skills', y, L, template, contentWidth);
    skillRows.forEach((s) => {
      y = addPageIfNeeded(doc, y, L.margin);
      doc.setFont(template.font, 'bold');
      doc.setFontSize(L.bodySize);
      doc.setTextColor(20, 20, 23);
      const label = `${s.label}: `;
      doc.text(label, L.margin, y);
      const labelW = doc.getTextWidth(label);
      doc.setFont(template.font, 'normal');
      doc.setTextColor(40, 40, 45);
      const wrapped = doc.splitTextToSize(s.value.trim(), contentWidth - labelW);
      doc.text(wrapped[0] || '', L.margin + labelW, y);
      y += L.lineGap;
      for (let i = 1; i < wrapped.length; i++) {
        y = addPageIfNeeded(doc, y, L.margin);
        doc.text(wrapped[i], L.margin + labelW, y);
        y += L.lineGap;
      }
    });
  }

  // Projects
  const projects = (data.projects || []).filter((p) => p.title && p.title.trim());
  if (projects.length) {
    y = sectionHeader(doc, 'Projects', y, L, template, contentWidth);
    projects.forEach((p, idx) => {
      y = addPageIfNeeded(doc, y, L.margin, 10);
      doc.setFont(template.font, 'bold');
      doc.setFontSize(L.bodySize + 0.5);
      doc.setTextColor(20, 20, 23);
      doc.text(p.title.trim(), L.margin, y);
      if (p.tech) {
        doc.setFont(template.font, 'italic');
        doc.setFontSize(L.bodySize - 0.5);
        doc.setTextColor(80, 80, 86);
        const techLabel = `  (${p.tech.trim()})`;
        doc.text(techLabel, L.margin + doc.getTextWidth(p.title.trim()), y);
      }
      y += L.lineGap;
      if (p.link) {
        y = bodyText(doc, p.link.trim(), y, L, contentWidth, { size: L.bodySize - 0.5, color: [90, 90, 96], font: template.font });
      }
      y = bulletList(doc, p.bullets || [], y, L, template, contentWidth);
      if (idx !== projects.length - 1) y += 1.5;
    });
  }

  // Experience / Internship
  const exp = (data.experience || []).filter((e) => e.role && e.role.trim());
  if (exp.length) {
    y = sectionHeader(doc, 'Experience', y, L, template, contentWidth);
    exp.forEach((e, idx) => {
      y = addPageIfNeeded(doc, y, L.margin, 10);
      doc.setFont(template.font, 'bold');
      doc.setFontSize(L.bodySize + 0.5);
      doc.setTextColor(20, 20, 23);
      const roleLine = e.company ? `${e.role.trim()} - ${e.company.trim()}` : e.role.trim();
      doc.text(roleLine, L.margin, y);
      if (e.duration) {
        doc.setFont(template.font, 'normal');
        doc.setFontSize(L.bodySize - 0.5);
        doc.setTextColor(80, 80, 86);
        doc.text(e.duration.trim(), L.margin + contentWidth, y, { align: 'right' });
      }
      y += L.lineGap;
      y = bulletList(doc, e.bullets || [], y, L, template, contentWidth);
      if (idx !== exp.length - 1) y += 1.5;
    });
  }

  // Education
  const edu = (data.education || []).filter((ed) => ed.degree && ed.degree.trim());
  if (edu.length) {
    y = sectionHeader(doc, 'Education', y, L, template, contentWidth);
    edu.forEach((ed) => {
      y = addPageIfNeeded(doc, y, L.margin, 9);
      doc.setFont(template.font, 'bold');
      doc.setFontSize(L.bodySize);
      doc.setTextColor(20, 20, 23);
      doc.text(ed.degree.trim(), L.margin, y);
      if (ed.duration) {
        doc.setFont(template.font, 'normal');
        doc.setFontSize(L.bodySize - 0.5);
        doc.setTextColor(80, 80, 86);
        doc.text(ed.duration.trim(), L.margin + contentWidth, y, { align: 'right' });
      }
      y += L.lineGap;
      const line2 = [ed.institution, ed.score].filter(Boolean).join('   |   ');
      if (line2) {
        y = bodyText(doc, line2, y, L, contentWidth, { font: template.font, color: [60, 60, 66] });
      }
      y += 1;
    });
  }

  // Certifications
  const certs = (data.certifications || []).filter((c) => c && c.trim());
  if (certs.length) {
    y = sectionHeader(doc, 'Certifications', y, L, template, contentWidth);
    y = bulletList(doc, certs, y, L, template, contentWidth);
  }

  return doc;
}

export function downloadResumePDF(data, template) {
  const doc = generateResumePDF(data, template);
  const safeName = (data.fullName || 'resume').trim().replace(/\s+/g, '_');
  doc.save(`${safeName}_Resume.pdf`);
}
