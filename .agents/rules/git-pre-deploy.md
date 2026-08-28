# Git Pre-Deployment Rule

## Mandatory Policy: Commit & Push to Git Before Any Build & Deployment

Before executing any build or production deployment (such as `npm run build`, `npm run deploy`, or `firebase deploy`), you MUST ensure that:
1. All changes, new files, and modifications are staged and committed to Git with a descriptive commit message.
2. All commits are pushed to the remote repository on GitHub (`main` branch).
3. `git status` is clean with no uncommitted changes prior to deploying.

Never deploy uncommitted or unstaged changes to Firebase Hosting.
