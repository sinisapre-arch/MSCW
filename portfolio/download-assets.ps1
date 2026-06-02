$BaseUrl = "https://portfolio-qyh8lm.manus.space"
$Root = $PSScriptRoot

$urls = @(
  "./IMG_3082-topaz-face-upscale-2x.jpg",
  "./images/djursholm/photo_24_2024-03-28_14-44-34.jpg",
  "./images/djursholm/photo_30_2024-03-28_14-44-34.jpg",
  "./images/varmdo/varmdo2_before.png",
  "./images/varmdo/varmdo1_After.jpg",
  "./images/stallarholmen/stallar1_Before.jpg",
  "./images/stallarholmen/stallar1_After.jpg",
  "./images/dalaro/DJI_0728.JPG",
  "./images/dalaro/photo_2_2024-03-28_14-50-12.jpg",
  "./images/crimea/krim1_before.png",
  "./images/crimea/krim2_after.png",
  "./images/ruza/ruza1_Before.jpg",
  "./images/ruza/ruza0_after.png",
  "./images/eco-hotel/eco1_before.jpg",
  "./images/eco-hotel/eco2_after.jpg",
  "./images/djursholm/photo_8_2024-03-28_14-44-34.jpg",
  "./images/djursholm/photo_6_2024-03-28_14-44-34.jpg",
  "./images/djursholm/photo_21_2024-03-28_14-44-34.jpg",
  "./images/djursholm/photo_22_2024-03-28_14-44-34.jpg",
  "./images/djursholm/photo_23_2024-03-28_14-44-34.jpg",
  "./images/djursholm/photo_25_2024-03-28_14-44-34.jpg",
  "./images/djursholm/photo_26_2024-03-28_14-44-34.jpg",
  "./images/dalaro/DJI_0747.JPG",
  "./images/dalaro/photo_4_2024-03-28_14-50-12.jpg",
  "./images/dalaro/photo_5_2024-03-28_14-50-12.jpg",
  "./images/dalaro/photo_6_2024-03-28_14-50-12.jpg",
  "./images/stallarholmen/stallar3.jpg",
  "./images/stallarholmen/stallar4.jpg",
  "./images/stallarholmen/stallar5.jpg",
  "./images/stallarholmen/stallar6.jpg",
  "./images/stallarholmen/stallar7.jpg",
  "./images/stallarholmen/stallar8.jpg",
  "./images/stallarholmen/stallar9.jpg",
  "./images/varmdo/varmdo3.png",
  "./images/varmdo/varmdo4.jpg",
  "./images/varmdo/varmdo5.jpg",
  "./images/varmdo/varmdo6.jpg",
  "./images/varmdo/varmdo7.jpg",
  "./images/varmdo/varmdo8.jpg",
  "./images/varmdo/varmdo9.jpg",
  "./images/varmdo/varmdo10.jpg",
  "./images/varmdo/varmdo11.png",
  "./images/varmdo/varmdo12.png",
  "./images/varmdo/varmdo13.png",
  "./images/crimea/krim3.png",
  "./images/crimea/krim4.png",
  "./images/crimea/krim5.jpg",
  "./images/crimea/krim6.jpg",
  "./images/crimea/krim8.png",
  "./images/crimea/krim9.jpg",
  "./images/crimea/krim10.png",
  "./images/crimea/krim11.png",
  "./images/crimea/krim12.png",
  "./images/crimea/krim13.png",
  "./images/crimea/ph01_archviz_fluxtools_HQ_0001.png",
  "./images/ruza/ruza2.jpg",
  "./images/ruza/ruza3.png",
  "./images/ruza/ruza4.png",
  "./images/eco-hotel/eco3.jpg",
  "./images/eco-hotel/eco4.jpg",
  "./images/eco-hotel/eco5.jpg",
  "./images/eco-hotel/eco6.jpg",
  "./images/eco-hotel/eco7.jpg",
  "./images/eco-hotel/eco8.jpg"
)

$ok = 0
$fail = 0
foreach ($rel in $urls) {
  $path = $rel -replace '^\./', ''
  $dest = Join-Path $Root $path
  $dir = Split-Path $dest -Parent
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  $uri = "$BaseUrl/$($path -replace '\\', '/')"
  try {
    Invoke-WebRequest -Uri $uri -OutFile $dest -UseBasicParsing -TimeoutSec 120
    Write-Host "OK $path"
    $ok++
  } catch {
    Write-Host "FAIL $path : $($_.Exception.Message)"
    $fail++
  }
}
Write-Host "Done: $ok ok, $fail failed"
