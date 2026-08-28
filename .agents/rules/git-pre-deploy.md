# Git Pre-Deployment & Commit Message Rule

## 1. Mandatory Policy: Commit & Push to Git Before Any Build & Deployment
Before executing any build or production deployment (such as `npm run build`, `npm run deploy`, or `firebase deploy`), you MUST ensure that:
1. All changes, new files, and modifications are staged and committed to Git.
2. **Descriptive Auto-Generated Commit Messages**: By default, you must automatically create a clear, specific, and descriptive commit message that summarizes the exact features, fixes, and changes made (e.g., `feat: add libero front-row restriction on receive-first auto-fill`).
3. All commits are pushed to the remote repository on GitHub (`origin main`).
4. `git status` is verified to be clean prior to deployment.

Never deploy uncommitted or unstaged changes to Firebase Hosting.
