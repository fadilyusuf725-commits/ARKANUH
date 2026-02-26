param(
  [string]$Voice = "id-ID-GadisNeural",
  [string]$Rate = "+0%",
  [string]$Pitch = "+0Hz"
)

$ErrorActionPreference = "Stop"

function Resolve-PythonExe {
  $cmd = Get-Command python -ErrorAction SilentlyContinue
  if ($cmd -and $cmd.Source -and -not ($cmd.Source -like "*WindowsApps*")) {
    return $cmd.Source
  }

  $userPython = Join-Path $env:LocalAppData "Programs\Python\Python312\python.exe"
  if (Test-Path $userPython) {
    return $userPython
  }

  $userPython311 = Join-Path $env:LocalAppData "Programs\Python\Python311\python.exe"
  if (Test-Path $userPython311) {
    return $userPython311
  }

  throw "Python belum terpasang. Install Python 3.10+ terlebih dahulu."
}

$pythonExe = Resolve-PythonExe

& $pythonExe -c "import edge_tts" 2>$null
if ($LASTEXITCODE -ne 0) {
  throw "Paket edge-tts belum terpasang. Jalankan: pip install edge-tts"
}

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$outputDir = Join-Path $root "public\assets\voice"
if (-not (Test-Path $outputDir)) {
  New-Item -ItemType Directory -Path $outputDir | Out-Null
}

$lines = @(
  @{
    id = "01"
    text = "Di tengah kaumnya, Nabi Nuh berdiri dengan tenang lalu mengajak semua orang menyembah Allah. Beliau berbicara lembut, sabar, dan tidak memaksa. Walaupun belum banyak yang mengikuti, Nabi Nuh tetap menyampaikan kebaikan setiap hari dengan hati yang ikhlas."
  },
  @{
    id = "02"
    text = "Sebagian kaum Nabi Nuh menolak nasihat yang baik. Ada yang mengejek, ada juga yang tidak mau mendengar. Nabi Nuh tidak marah berlebihan. Beliau tetap sabar, tetap berdoa, dan terus memberi contoh akhlak baik supaya kaumnya belajar membedakan sikap benar dan salah."
  },
  @{
    id = "03"
    text = "Waktu terus berjalan, tantangan semakin banyak, tetapi Nabi Nuh tidak menyerah. Beliau tetap teguh karena yakin Allah selalu melihat usaha yang baik. Dari kisah ini kita belajar bahwa kesabaran membuat hati kuat, dan orang yang sabar akan lebih mudah berbuat benar."
  },
  @{
    id = "04"
    text = "Allah memberi perintah kepada Nabi Nuh untuk membuat bahtera. Perintah itu diterima dengan hati patuh tanpa menunda-nunda. Nabi Nuh segera bekerja sesuai petunjuk Allah. Ketaatan beliau mengajarkan bahwa orang beriman mendahulukan perintah Allah dibanding rasa malas atau ragu."
  },
  @{
    id = "05"
    text = "Bahtera disiapkan dengan teliti. Kayu, tali, dan bagian lain disusun satu per satu dengan rapi. Pekerjaan besar tidak selesai dalam satu langkah, tetapi selesai karena tekun dan teratur. Kita belajar bahwa persiapan yang baik membantu kita menghadapi masa sulit dengan lebih siap."
  },
  @{
    id = "06"
    text = "Akhirnya banjir besar datang seperti yang telah diperingatkan. Air naik perlahan lalu semakin tinggi. Bahtera yang sudah dipersiapkan menjadi tempat perlindungan bagi orang beriman. Dari peristiwa ini kita memahami bahwa nasihat baik perlu didengar sebelum keadaan menjadi sulit."
  },
  @{
    id = "07"
    text = "Nabi Nuh mengajak orang beriman naik ke bahtera dengan tertib. Hewan-hewan juga masuk berpasangan sesuai petunjuk Allah. Semua dilakukan dengan tenang dan teratur. Pelajaran pentingnya adalah disiplin dan kepatuhan membuat perjalanan bersama menjadi lebih aman dan lebih terarah."
  },
  @{
    id = "08"
    text = "Di tengah banjir yang besar, Allah menolong Nabi Nuh dan orang-orang yang beriman. Mereka tetap berdoa, saling membantu, dan menjaga sikap baik. Kita belajar bahwa iman bukan hanya kata-kata, tetapi juga perilaku taat, sabar, dan peduli kepada sesama."
  },
  @{
    id = "09"
    text = "Setelah masa yang ditentukan, air banjir mulai surut. Langit perlahan cerah, dan bahtera berhenti di tempat aman. Semua yang ada di bahtera merasa lega dan bersyukur. Dari sini kita memahami bahwa pertolongan Allah datang tepat waktu bagi orang yang sabar dan percaya."
  },
  @{
    id = "10"
    text = "Kisah Nabi Nuh memberi kita banyak pelajaran untuk diamalkan setiap hari. Kita diajak beriman kepada Allah, sabar saat menghadapi tantangan, taat pada kebaikan, dan jujur dalam perkataan. Nilai-nilai ini membuat kita menjadi anak yang kuat, baik, dan dipercaya."
  }
)

Write-Host "Generating voice files with $Voice ..."

foreach ($line in $lines) {
  $targetPath = Join-Path $outputDir ("page-{0}.mp3" -f $line.id)
  & $pythonExe -m edge_tts --voice $Voice --rate $Rate --pitch $Pitch --text $line.text --write-media $targetPath | Out-Null
  Write-Host "Done: $targetPath"
}

Write-Host "All voice files generated in public/assets/voice."
