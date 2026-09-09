Add-Type -AssemblyName System.Drawing

$sourceEmergency = 'C:\Users\Iritabel\.gemini\antigravity-ide\brain\e39e91dd-e744-477f-b1df-853f759677a0\.user_uploaded\media_1788976202779.png'
$sourceHome = 'C:\Users\Iritabel\.gemini\antigravity-ide\brain\e39e91dd-e744-477f-b1df-853f759677a0\.user_uploaded\media_1788976209559.png'
$sourceCelengan = 'C:\Users\Iritabel\.gemini\antigravity-ide\brain\e39e91dd-e744-477f-b1df-853f759677a0\.user_uploaded\media_1788977651605.png'
$sourceSettings = 'C:\Users\Iritabel\.gemini\antigravity-ide\brain\e39e91dd-e744-477f-b1df-853f759677a0\.user_uploaded\media_1788977657655.png'

$destDir = 'c:\Users\Iritabel\savings-app\assets\icons'
if (-not (Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir -Force | Out-Null
}

function Clean-And-DeFringe {
    param(
        [string]$sourcePath,
        [string]$destPath
    )

    $srcBmp = [System.Drawing.Bitmap]::FromFile($sourcePath)
    $w = $srcBmp.Width
    $h = $srcBmp.Height

    # Preserve exact dimensions - no cropping, keeping original aspect ratio and border strokes
    $outBmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

    for ($y = 0; $y -lt $h; $y++) {
        for ($x = 0; $x -lt $w; $x++) {
            $p = $srcBmp.GetPixel($x, $y)
            if ($p.A -eq 0) {
                $outBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            } else {
                # Lock RGB to pure silhouette black (0, 0, 0)
                # Keep exact alpha channel to preserve anti-aliasing without white halo
                $outBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($p.A, 0, 0, 0))
            }
        }
    }

    $srcBmp.Dispose()
    $outBmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $outBmp.Dispose()

    Write-Output "Processed defringed transparent PNG: $destPath ($w x $h)"
}

Clean-And-DeFringe -sourcePath $sourceEmergency -destPath (Join-Path $destDir 'emergency-savings.png')
Clean-And-DeFringe -sourcePath $sourceHome -destPath (Join-Path $destDir 'home.png')
Clean-And-DeFringe -sourcePath $sourceCelengan -destPath (Join-Path $destDir 'celengan.png')
Clean-And-DeFringe -sourcePath $sourceSettings -destPath (Join-Path $destDir 'settings.png')
