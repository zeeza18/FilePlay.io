import express from 'express';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mammoth from 'mammoth';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const execPromise = promisify(exec);

const router = express.Router();

// Convert DOC/DOCX/PPT/PPTX to HTML
router.post('/convert-doc', async (req, res) => {
  const { fileId } = req.body;
  const uploadsDir = path.join(__dirname, '../uploads');
  const inputPath = path.join(uploadsDir, fileId);

  if (!fs.existsSync(inputPath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  try {
    // Check if file is DOC/DOCX/PPT/PPTX
    const ext = path.extname(inputPath).toLowerCase();

    if (ext === '.docx' || ext === '.pptx') {
      // For DOCX/PPTX, use mammoth
      const result = await mammoth.convertToHtml({ path: inputPath });
      return res.json({ html: result.value });
    } else if (ext === '.doc' || ext === '.ppt') {
      // For DOC files, we need LibreOffice or antiword
      // First, try using LibreOffice (soffice) if available
      try {
        // Try LibreOffice conversion
        await execPromise(`soffice --headless --convert-to html:HTML --outdir "${uploadsDir}" "${inputPath}"`);

        // Read the generated HTML
        const htmlPath = inputPath.replace(/\.doc$/i, '.html');
        if (fs.existsSync(htmlPath)) {
          const html = fs.readFileSync(htmlPath, 'utf8');

          // Cleanup
          fs.unlinkSync(htmlPath);

          return res.json({ html });
        }
      } catch (err) {
        console.error('LibreOffice conversion failed, trying alternative:', err);
      }

      // Fallback: Try antiword if LibreOffice is not available
      try {
        const { stdout } = await execPromise(`antiword -w 0 "${inputPath}"`);
        const html = `<div class="antiword-output"><pre>${stdout}</pre></div>`;
        return res.json({ html });
      } catch (err) {
        console.error('Antiword conversion failed:', err);
      }

      // If both fail, return error message
      return res.status(500).json({
        error: 'DOC/PPT file conversion failed. Please install LibreOffice or convert to DOCX/PPTX format.',
        html: '<div class="error-message" style="padding: 20px; border: 1px solid #ccc; border-radius: 8px; background: #f9f9f9;"><p style="color: #333; font-size: 16px;"><strong>Unable to convert DOC/PPT file.</strong></p><p>Please try:</p><ul><li>Converting to DOCX/PPTX format</li><li>Installing LibreOffice on the server</li></ul></div>'
      });
    } else {
      return res.status(400).json({ error: 'Unsupported file format. Only DOC, DOCX, PPT, PPTX are supported.' });
    }
  } catch (error) {
    console.error('Document conversion error:', error);
    res.status(500).json({
      error: 'Conversion failed',
      html: '<div class="error-message" style="padding: 20px; border: 1px solid #ccc; border-radius: 8px; background: #f9f9f9;"><p>Failed to convert document. Please try DOCX/PPTX format or PDF.</p></div>'
    });
  }
});

export default router;
