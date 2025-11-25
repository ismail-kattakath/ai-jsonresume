#!/bin/bash
echo "🚀 Starting autonomous GitHub Pages deployment..."

# Build static site
echo "🏗️ Building Next.js static site..."
nohup npm run build > /tmp/github-pages-build.log 2>&1

# Wait for build completion
echo "⏳ Waiting for build to complete..."
while [ ! -d "out" ]; do
  sleep 10
  echo "Still building..."
done

echo "✅ Build completed!"

# Prepare for GitHub Pages
echo "📁 Preparing deployment files..."
nohup bash -c "
# Create .nojekyll file to bypass Jekyll processing
touch out/.nojekyll

# Handle GitHub Pages routing for SPA
cp out/404.html out/index.html 2>/dev/null || echo 'No 404.html found'

# Copy CNAME if exists (for custom domain)
if [ -f 'CNAME' ]; then
    cp CNAME out/
fi
" > /tmp/github-pages-prep.log 2>&1 &

# Deploy using gh-pages or git subtree
if command -v gh-pages &> /dev/null; then
    echo "📤 Deploying with gh-pages..."
    nohup npx gh-pages -d out -t true > /tmp/github-pages-deploy.log 2>&1 &
else
    echo "📤 Deploying with git subtree..."
    nohup bash -c "
    git add out/
    git commit -m 'Deploy to GitHub Pages'
    git subtree push --prefix out origin gh-pages
    " > /tmp/git-subtree-deploy.log 2>&1 &
fi

echo "✅ GitHub Pages deployment initiated!"
echo "📊 Monitor with: tail -f /tmp/github-pages-*.log"
echo "🌐 Site will be available at: https://YOUR-USERNAME.github.io/jsonresume-to-everything"