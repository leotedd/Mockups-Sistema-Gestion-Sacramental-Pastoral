# Exporta cada diapositiva del PPTX a PNG para verificacion visual.
param(
  [string]$Pptx = "C:\Users\i7del\OneDrive\Desktop\Mockups_Sistema_Parroquial\documentacion\Modulo_Celebraciones_Mockup.pptx",
  [string]$OutDir = "C:\Users\i7del\OneDrive\Desktop\Mockups_Sistema_Parroquial\documentacion\_build\preview"
)

if (Test-Path $OutDir) { Remove-Item $OutDir -Recurse -Force }
New-Item -ItemType Directory -Path $OutDir | Out-Null

$ppt = New-Object -ComObject PowerPoint.Application
$pres = $ppt.Presentations.Open($Pptx, $true, $false, $false)  # ReadOnly, Untitled, WithWindow=false
try {
  $pres.SlideWidth  | Out-Null
  foreach ($slide in $pres.Slides) {
    $n = "{0:D2}" -f $slide.SlideIndex
    $path = Join-Path $OutDir "slide_$n.png"
    $slide.Export($path, "PNG", 1600, 900)
  }
  Write-Output "Exportadas $($pres.Slides.Count) diapositivas a $OutDir"
}
finally {
  $pres.Close()
  $ppt.Quit()
  [System.Runtime.InteropServices.Marshal]::ReleaseComObject($ppt) | Out-Null
}
