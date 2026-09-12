$ErrorActionPreference = 'Stop'

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$artifactDir = Join-Path $projectRoot 'artifacts'
$ffmpeg = (Get-Command ffmpeg -ErrorAction Stop).Source
$ffprobe = (Get-Command ffprobe -ErrorAction Stop).Source

Add-Type -AssemblyName System.Speech
$speaker = New-Object System.Speech.Synthesis.SpeechSynthesizer
$speaker.SelectVoice('Microsoft Zira Desktop')
$speaker.Rate = 0

$segments = @(
  @{
    kind = 'image'; source = 'initial.png'; minimum = 18
    words = 'Dealership software handles clean title transactions. VINRelease handles the exceptions. This purchased BMW has eighteen thousand seven hundred dollars of inventory blocked while its title is overdue. The important question is not whether someone called. It is what the call actually proved.'
  },
  @{
    kind = 'video'; source = 'vinrelease-demo-raw.webm'; minimum = 57
    words = 'Here is the deployed product, running in safe demo mode. I open the next action and review the approved recipient, purpose, and minimum disclosure packet before authorizing. The first deterministic replay identifies the missing lien release, so the next owner becomes the lienholder. I authorize that second replay separately. It returns a transmission reference, but VINRelease does not mark the title received. Sent is not received, so the case remains waiting for external confirmation. Then I reset the case and choose the credential-request scenario. The agent refuses to provide credentials, and the case stops for a title clerk. Every visible step is a real click in the public application; this sequence is a no-call replay.'
  },
  @{
    kind = 'image'; source = 'production-resolved.png'; minimum = 18
    words = 'The reference is useful, but it is not a title. VINRelease keeps the case waiting externally, with the owner, blocker, and evidence visible. A polished summary cannot override the state machine or silently close the exception.'
  },
  @{
    kind = 'image'; source = 'authorization.png'; minimum = 18
    words = 'This authorization surface is the control point. Only provisioned contacts can be called. The operator sees the masked destination and approved facts, and a changed preview requires a fresh authorization. Idempotency protects retries from duplicate calls.'
  },
  @{
    kind = 'image'; source = 'production-human-stop.png'; minimum = 18
    words = 'When a recipient asks for a portal security code, that is outside the disclosure budget. VINRelease declines and routes the exception to a person. No credential, payment information, or invented fact is needed to keep the workflow honest.'
  },
  @{
    kind = 'image'; source = 'live-proof-card.png'; minimum = 26
    words = 'Separately, we placed one real CALL-E test call to a user-controlled number. CALL-E returned a completed call ID, three evidence items, and a schema-valid structured result. The person indicated the synthetic case could be located, but the call ended before they identified the blocker or next owner. The outcome was needs human. We do not claim the real call resolved a title. This is exactly the boundary VINRelease enforces.'
  },
  @{
    kind = 'image'; source = 'initial.png'; minimum = 12
    words = 'VINRelease turns phone calls into governed operational progress, while making uncertainty visible. Explore the safe public demo and inspect the open-source implementation.'
  }
)

$rendered = @()
for ($i = 0; $i -lt $segments.Count; $i++) {
  $segment = $segments[$i]
  $audioPath = Join-Path $artifactDir ("demo-voice-$i.wav")
  $videoPath = Join-Path $artifactDir ("demo-segment-$i.mp4")
  $sourcePath = Join-Path $artifactDir $segment.source
  if (-not (Test-Path -LiteralPath $sourcePath)) { throw "Missing video source: $sourcePath" }

  $speaker.SetOutputToWaveFile($audioPath)
  $speaker.Speak($segment.words)
  $speaker.SetOutputToDefaultAudioDevice()
  $probeJson = & $ffprobe -v error -show_entries format=duration -of json $audioPath
  $audioDuration = [double](($probeJson | ConvertFrom-Json).format.duration)
  $duration = [math]::Max([double]$segment.minimum, [math]::Ceiling($audioDuration + 2))
  if ($segment.kind -eq 'video') {
    if ($audioDuration -gt $duration) { throw "Narration is too long for the recorded clip: $audioDuration seconds" }
    & $ffmpeg -y -loglevel error -i $sourcePath -i $audioPath -map 0:v:0 -map 1:a:0 -vf 'fps=24,scale=1440:900:force_original_aspect_ratio=decrease,pad=1440:900:(ow-iw)/2:(oh-ih)/2,format=yuv420p' -af apad -t $duration -c:v libx264 -preset veryfast -crf 23 -c:a aac -b:a 160k $videoPath
  } else {
    & $ffmpeg -y -loglevel error -loop 1 -framerate 24 -i $sourcePath -i $audioPath -map 0:v:0 -map 1:a:0 -vf 'scale=1440:900:force_original_aspect_ratio=decrease,pad=1440:900:(ow-iw)/2:(oh-ih)/2,format=yuv420p' -af apad -t $duration -c:v libx264 -preset veryfast -crf 23 -c:a aac -b:a 160k $videoPath
  }
  if ($LASTEXITCODE -ne 0) { throw "FFmpeg failed on segment $i" }
  $rendered += $videoPath
}

$inputs = @()
for ($i = 0; $i -lt $rendered.Count; $i++) { $inputs += @('-i', $rendered[$i]) }
$pads = -join (0..($rendered.Count - 1) | ForEach-Object { "[$($_):v:0][$($_):a:0]" })
$filter = "${pads}concat=n=$($rendered.Count):v=1:a=1[v][a]"
$finalPath = Join-Path $artifactDir 'vinrelease-demo-final.mp4'
& $ffmpeg -y -loglevel error @inputs -filter_complex $filter -map '[v]' -map '[a]' -c:v libx264 -preset veryfast -crf 22 -c:a aac -b:a 160k -movflags +faststart $finalPath
if ($LASTEXITCODE -ne 0) { throw 'FFmpeg failed to concatenate the video.' }
Write-Host "Rendered $finalPath"
& $ffprobe -v error -show_entries format=duration,size -of json $finalPath
