#!/bin/sh
# Builds every version of the Guide into one site, site-build/, as GitHub Pages serves it
# (decision 97): main as /development/, each release-X.Y branch as /X.Y/, the newest
# release as /latest/ and the site's root, and site/'s own files at the root: the 404 page
# every missing path gets, a page not written yet under a version and language, and
# CNAME.
#
# Usage: tools/build-site.sh        (from the repository's root, its branches fetched)
set -eu

root=$(pwd)
out="$root/site-build"
work="$root/.versions"
rm -rf "$out" "$work"
mkdir -p "$out" "$work"

# One version: the tree at $1 built on the base /$2/.
build() {
  (cd "$1" && npm ci --no-fund --no-audit && GUIDE_BASE="/$2" npx astro build --outDir "$out/$2")
}

build "$root" development

# The release branches, oldest first, so the last is the newest.
releases=$(git for-each-ref --format='%(refname:lstrip=3)' 'refs/remotes/origin/release-*' | sed 's/^release-//' | sort -V)
latest=development
for version in $releases; do
  git worktree add --detach "$work/$version" "origin/release-$version" >/dev/null
  build "$work/$version" "$version"
  latest=$version
done

# The versions the 404 page knows, newest release first, then development.
versions='"development"'
for version in $releases; do versions="\"$version\",$versions"; done
versions="[$versions]"
sed -e "s|__VERSIONS__|$versions|" -e "s|__LATEST__|$latest|" site/404.html > "$out/404.html"
cp site/CNAME "$out/CNAME"

# The root and /latest/ go to the newest release's start page, in English.
redirect() {
  mkdir -p "$(dirname "$1")"
  cat > "$1" <<HTML
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0; url=/$latest/en/" />
    <link rel="canonical" href="/$latest/en/" />
    <title>Apertrust Guide</title>
  </head>
  <body><a href="/$latest/en/">Apertrust Guide</a></body>
</html>
HTML
}
redirect "$out/index.html"
redirect "$out/latest/index.html"

for version in $releases; do git worktree remove --force "$work/$version"; done
rm -rf "$work"
echo "Built development and ${releases:-no releases} into site-build/; latest is $latest."
