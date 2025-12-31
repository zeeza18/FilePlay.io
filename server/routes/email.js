import express from 'express';
import { simpleParser } from 'mailparser';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Parse EML file
router.post('/parse', async (req, res) => {
  try {
    const { fileId } = req.body;
    const filePath = path.join(process.cwd(), 'uploads', fileId);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    const emailContent = fs.readFileSync(filePath);
    const parsed = await simpleParser(emailContent);

    const attachments = [];
    if (parsed.attachments) {
      for (const attachment of parsed.attachments) {
        const attachmentPath = path.join(process.cwd(), 'uploads', `${fileId}-${attachment.filename}`);
        fs.writeFileSync(attachmentPath, attachment.content);

        attachments.push({
          filename: attachment.filename,
          contentType: attachment.contentType,
          size: attachment.size,
          fileId: `${fileId}-${attachment.filename}`
        });
      }
    }

    res.json({
      from: parsed.from?.text,
      to: parsed.to?.text,
      cc: parsed.cc?.text,
      subject: parsed.subject,
      date: parsed.date,
      textBody: parsed.text,
      htmlBody: parsed.html,
      attachments
    });
  } catch (error) {
    console.error('Email parse error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
