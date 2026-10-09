import { spawnSync } from 'node:child_process'
import assert from 'node:assert/strict'

const image = process.argv[2] || 'neyna-birthday:latest'
const name = `neyna-birthday-smoke-${Date.now()}`
function docker(args, allowFailure = false) {
  const result = spawnSync('docker', args, { encoding: 'utf8', timeout: 30000 })
  if (!allowFailure && result.status !== 0) throw new Error(result.stderr || String(result.error))
  return { ...result, output: result.stdout + result.stderr }
}
let created = false
try {
  docker(['run', '--detach', '--network', 'none', '--name', name, '--health-interval=1s', '--health-start-period=0s', image])
  created = true
  let healthy = false
  for (let attempt = 0; attempt < 20; attempt++) {
    if (docker(['inspect', '--format', '{{.State.Health.Status}}', name]).stdout.trim() === 'healthy') { healthy = true; break }
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  assert(healthy, 'Container must become healthy')
  assert.match(docker(['exec', name, 'nginx', '-t']).output, /test is successful/)
  const body = path => docker(['exec', name, 'wget', '-q', '-O', '-', `http://127.0.0.1${path}`]).stdout
  const headers = path => docker(['exec', name, 'wget', '-S', '-O', '/dev/null', `http://127.0.0.1${path}`], true).output
  assert.equal(body('/healthz'), 'ok')
  const html = body('/')
  assert.match(html, /<title>Neyna Salma Shidqy’s Birthday<\/title>/)
  assert.equal(body('/a-spa-route'), html)
  assert.match(headers('/'), /Cache-Control: no-cache/i)
  const asset = html.match(/src="(\/assets\/[^"]+\.js)"/)?.[1]
  assert(asset, 'Production HTML must reference a bundled script')
  assert.match(headers(asset), /max-age=31536000, immutable/i)
  for (const photo of ['portrait', 'little-joys', 'sunshine', 'simple-moments', 'quiet-dreams', 'bloom', 'beautiful-days']) {
    const photoHeaders = headers(`/images/${photo}.jpg`)
    assert.match(photoHeaders, /max-age=3600/i)
    assert.match(photoHeaders, /200 OK/)
    assert.match(photoHeaders, /Content-Type: image\/jpeg/i)
  }
  const musicHeaders = headers('/until%20i%20found%20you%20cover.mp3')
  assert.match(musicHeaders, /200 OK/)
  assert.match(musicHeaders, /Content-Type: audio\/mpeg/i)
  assert.match(musicHeaders, /max-age=3600/i)
  const range = docker(['exec', name, 'wget', '-S', '--header=Range: bytes=0-1023', '-O', '/dev/null', 'http://127.0.0.1/until%20i%20found%20you%20cover.mp3']).output
  assert.match(range, /206 Partial Content/i)
  assert.match(range, /Content-Range: bytes 0-1023\//i)
  assert.match(headers('/music/missing.mp3'), /404 Not Found/)
  assert.match(headers('/assets/missing.js'), /404 Not Found/)
  const ports = JSON.parse(docker(['inspect', '--format', '{{json .HostConfig.PortBindings}}', name]).stdout)
  assert(!ports || Object.keys(ports).length === 0, 'No host ports may be published')
  console.log('PASS: healthy container; nginx -t; current page title; SPA fallback; cache; seven JPG photos; supplied MP3 MIME and byte ranges; missing media/assets 404; zero published ports.')
} finally {
  if (created) docker(['rm', '--force', name])
}
