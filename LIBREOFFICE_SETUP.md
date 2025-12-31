# LibreOffice Setup for Production-Level DOCX Viewing

## Why LibreOffice?

For **PRODUCTION-LEVEL** DOCX viewing with **100% formatting preservation**, we convert DOCX/PPTX files to PDF on the server using LibreOffice. This ensures:

✅ **Perfect formatting** - All colors, fonts, styles preserved
✅ **All images** - Charts, graphs, pictures display correctly
✅ **Exact layout** - Page breaks, margins, spacing match Word
✅ **Universal compatibility** - Works for ANY DOCX file
✅ **No client limitations** - Server-side conversion is robust

## Installation Instructions

### Windows:

1. **Download LibreOffice:**
   - Visit: https://www.libreoffice.org/download/download/
   - Download the Windows x64 version
   - Current stable version: 24.8.x

2. **Install LibreOffice:**
   - Run the installer (LibreOffice_x.x.x_Win_x64.msi)
   - Use default installation path: `C:\Program Files\LibreOffice`
   - Complete the installation

3. **Add to System PATH:**
   - Open System Properties (Win + Pause/Break)
   - Click "Advanced system settings" → "Environment Variables"
   - Under "System variables", find and edit "Path"
   - Click "New" and add: `C:\Program Files\LibreOffice\program`
   - Click OK to save

4. **Verify Installation:**
   ```cmd
   soffice --version
   ```
   Should output: `LibreOffice 24.x.x.x`

### macOS:

1. **Install via Homebrew:**
   ```bash
   brew install --cask libreoffice
   ```

2. **Verify:**
   ```bash
   /Applications/LibreOffice.app/Contents/MacOS/soffice --version
   ```

3. **Add to PATH (if needed):**
   ```bash
   echo 'export PATH="/Applications/LibreOffice.app/Contents/MacOS:$PATH"' >> ~/.zshrc
   source ~/.zshrc
   ```

### Linux (Ubuntu/Debian):

```bash
sudo apt update
sudo apt install libreoffice
```

### Linux (RHEL/CentOS):

```bash
sudo yum install libreoffice
```

## How It Works

1. **User uploads DOCX/PPTX** → Frontend sends to server
2. **Server converts to PDF** → LibreOffice preserves ALL formatting
3. **PDF sent back** → Displayed using our PDF viewer
4. **Perfect quality** → Exactly as it looks in Microsoft Word

## Testing

After installing LibreOffice:

1. Restart your terminal/command prompt
2. Restart the FilePlay server:
   ```bash
   cd server
   npm start
   ```
3. Upload a DOCX file with colors, images, formatting
4. **Result:** Should display PERFECTLY with all styling intact!

## Troubleshooting

### "LibreOffice not found" error:

**Solution:** Verify LibreOffice is in your PATH:
```cmd
# Windows
where soffice

# Mac/Linux
which soffice
```

If not found, add it to PATH following the instructions above.

### Conversion takes too long:

**Solution:** Large DOCX files (>10MB) may take 5-10 seconds to convert. This is normal for high-quality conversion.

### "soffice is already running" error:

**Solution:** Kill existing LibreOffice processes:
```cmd
# Windows
taskkill /F /IM soffice.exe /T

# Mac/Linux
killall soffice.bin
```

## Alternative: Without LibreOffice

If you cannot install LibreOffice, you have these options:

1. **Upload as PDF directly** - Export your DOCX to PDF in Microsoft Word, then upload the PDF
2. **Use online converters** - Convert DOCX to PDF online before uploading
3. **Client-side only (limited)** - The app will use Mammoth.js but with reduced formatting quality

## Production Deployment

For production servers (AWS, Azure, Heroku, etc.):

### Docker:
```dockerfile
FROM node:20-alpine

# Install LibreOffice
RUN apk add --no-cache libreoffice

# Your app setup
COPY . /app
WORKDIR /app
RUN npm install
CMD ["npm", "start"]
```

### AWS EC2 / Ubuntu Server:
```bash
sudo apt update
sudo apt install -y libreoffice
```

### Heroku:
Add buildpack:
```bash
heroku buildpacks:add https://github.com/ello-ai/heroku-buildpack-libreoffice.git
```

## Performance Tips

- **File size limit:** Keep DOCX files under 50MB for fast conversion
- **Caching:** Consider caching converted PDFs to avoid re-conversion
- **Queue system:** For high traffic, implement a job queue (Bull, BullMQ)
- **Cleanup:** The server auto-deletes temporary PDFs after 5 seconds

---

**Ready to test?** Upload a DOCX file with colors, images, and complex formatting!
