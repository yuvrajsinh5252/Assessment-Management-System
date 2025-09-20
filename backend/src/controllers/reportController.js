const fs = require('fs');
const path = require('path');
const assessments = require('../../data/assessments');
const reportConfig = require('../config/reportConfig');
const { generateReport } = require('../services/reportGenerator');

function buildFileUrl(req, fileName) {
  return `${req.protocol}://${req.get('host')}/reports/${fileName}`;
}

function parseTimestampFromName(fileName) {
  const baseName = path.basename(fileName, path.extname(fileName));
  const segments = baseName.split('-');
  const possibleTimestamp = Number(segments[segments.length - 1]);
  return Number.isFinite(possibleTimestamp) ? possibleTimestamp : null;
}

function getLatestReportMeta(sessionId, assessmentId) {
  if (!fs.existsSync(reportConfig.outputDir)) {
    return null;
  }

  const prefix = `${sessionId}-${assessmentId}`;
  const candidateFiles = fs
    .readdirSync(reportConfig.outputDir)
    .filter((file) => file.startsWith(prefix));

  if (candidateFiles.length === 0) {
    return null;
  }

  const ranked = candidateFiles
    .map((fileName) => {
      const absolutePath = path.join(reportConfig.outputDir, fileName);
      const stats = fs.statSync(absolutePath);
      const inferredTimestamp = parseTimestampFromName(fileName);
      return {
        fileName,
        generatedAt: stats.mtime.toISOString(),
        rank: inferredTimestamp ?? stats.mtimeMs,
      };
    })
    .sort((a, b) => b.rank - a.rank);

  return ranked[0];
}

async function generate(req, res) {
  try {
    const sessionId = req.body.session_id || req.query.session_id;
    if (!sessionId) {
      return res.status(400).json({ message: 'session_id is required' });
    }

    const assessmentData = assessments.find((item) => item.session_id === sessionId);
    if (!assessmentData) {
      return res.status(404).json({ message: `No assessment found for session_id ${sessionId}` });
    }

    const result = await generateReport(assessmentData);
    const fileUrl = buildFileUrl(req, result.fileName);

    res.json({
      message: 'Report generated successfully',
      filePath: result.filePath,
      fileName: result.fileName,
      fileUrl,
    });
  } catch (error) {
    console.error('Failed to generate report', error);
    res.status(500).json({ message: 'Failed to generate report', details: error.message });
  }
}

async function listSessions(req, res) {
  try {
    const sessions = assessments.map((entry) => {
      const config = reportConfig.assessments[entry.assessment_id] || {};
      const latestReport = getLatestReportMeta(entry.session_id, entry.assessment_id);

      return {
        session_id: entry.session_id,
        assessment_id: entry.assessment_id,
        assessment_title: config.title || entry.assessment_id,
        summary: config.summary || null,
        recorded_at: entry.timestamp ? new Date(entry.timestamp).toISOString() : null,
        metrics: {
          accuracy: entry.accuracy ?? null,
          wellness_score: entry.vitalsMap?.wellness_score ?? null,
          heart_rate: entry.vitalsMap?.vitals?.heart_rate ?? null,
        },
        latestReport: latestReport
          ? {
              fileName: latestReport.fileName,
              generatedAt: latestReport.generatedAt,
              fileUrl: buildFileUrl(req, latestReport.fileName),
            }
          : null,
      };
    });

    res.json({ sessions });
  } catch (error) {
    console.error('Failed to load sessions', error);
    res.status(500).json({ message: 'Unable to load sessions', details: error.message });
  }
}

module.exports = {
  generate,
  listSessions,
};
