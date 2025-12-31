# GitHub Setup Guide

Your project is now GitHub-ready! Follow these steps to push to GitHub.

## Step 1: Configure Git (First Time Only)

Open a terminal and run these commands with your GitHub information:

```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

**Note**: Use the same email as your GitHub account.

## Step 2: Create Initial Commit

After configuring your identity, create the initial commit:

```bash
git commit -m "Initial commit: FilePlay - Full-stack file management platform

Features:
- Preview module with 15+ file format support
- Smart PDF scanned detection
- OCR text extraction with Tesseract.js
- Progressive loading for large files
- Convert module with video/audio/document conversion
- FFmpeg integration for media processing
- Full-stack architecture with Express backend
- React + TypeScript + Vite frontend
- Tailwind CSS styling"
```

## Step 3: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `fileplay` (or your preferred name)
3. Description: "Full-stack file management platform with intelligent preview, conversion, and OCR capabilities"
4. Choose Public or Private
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 4: Push to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
git remote add origin https://github.com/YOUR-USERNAME/fileplay.git
git branch -M main
git push -u origin main
```

**Replace `YOUR-USERNAME`** with your actual GitHub username.

## Step 5: Verify

Visit your repository on GitHub to verify all files are uploaded:
- ✅ README.md should display on the repository homepage
- ✅ Check that node_modules and uploads folders are NOT uploaded (they're ignored)
- ✅ All source code should be visible

## What's Already Set Up

✅ **`.gitignore`** - Comprehensive ignore rules for:
   - node_modules (frontend and backend)
   - Build outputs (dist, build)
   - Environment files (.env)
   - Server uploads directory
   - OS-specific files
   - IDE files
   - Cache and temp files

✅ **`server/.gitignore`** - Server-specific ignores

✅ **`server/uploads/.gitkeep`** - Ensures uploads folder exists but stays empty

✅ **`server/temp/.gitkeep`** - Ensures temp folder exists but stays empty

✅ **`README.md`** - Complete documentation with:
   - Installation instructions
   - API documentation
   - Feature list
   - Tech stack details
   - Deployment guides

## Future Commits

After the initial setup, use this workflow for changes:

```bash
# Check what changed
git status

# Stage all changes
git add .

# Or stage specific files
git add path/to/file

# Commit with a message
git commit -m "Your commit message"

# Push to GitHub
git push
```

## Common Git Commands

```bash
# View commit history
git log --oneline

# Check current status
git status

# See what changed in files
git diff

# Undo uncommitted changes
git checkout -- filename

# Create a new branch
git checkout -b feature-name

# Switch branches
git checkout main

# Pull latest changes from GitHub
git pull
```

## Troubleshooting

### Issue: "Permission denied (publickey)"
**Solution**: Set up SSH keys or use HTTPS URL with personal access token
- HTTPS: `https://github.com/username/repo.git`
- SSH: `git@github.com:username/repo.git`

### Issue: "Updates were rejected"
**Solution**: Pull first, then push
```bash
git pull origin main
git push
```

### Issue: Large files rejected
**Solution**: Files over 100MB need Git LFS (Large File Storage)
```bash
git lfs install
git lfs track "*.mp4"
git add .gitattributes
```

## Repository Settings Recommendations

After pushing to GitHub:

1. **Add Topics**: Go to repository settings → Add topics like:
   - `react`
   - `typescript`
   - `file-management`
   - `ocr`
   - `pdf-viewer`
   - `file-converter`

2. **Enable Issues**: For bug tracking and feature requests

3. **Set up Branch Protection** (for main branch):
   - Require pull request reviews
   - Require status checks to pass

4. **Add License** (if you want to):
   - Settings → Add license → Choose appropriate license

## Next Steps

- Set up GitHub Actions for CI/CD
- Configure Dependabot for security updates
- Add badges to README (build status, version, etc.)
- Create CONTRIBUTING.md for contributors
- Set up GitHub Pages for demo (optional)

---

**Need Help?**
- Git Documentation: https://git-scm.com/doc
- GitHub Guides: https://guides.github.com
- GitHub CLI: https://cli.github.com (optional, makes GitHub easier)
