Add-Type -AssemblyName System.Drawing

$rootDir = 'c:\Users\Iritabel\savings-app'
$cleanSource = $rootDir + '\assets\icon-512-clean.png'

if (-not (Test-Path $cleanSource)) {
    Write-Error "Clean source not found: $cleanSource"
    exit 1
}

$srcImage = [System.Drawing.Image]::FromFile($cleanSource)

function Resize-And-Save {
    param(
        [System.Drawing.Image]$Image,
        [int]$Width,
        [int]$Height,
        [string]$Path
    )
    
    $destRect = New-Object System.Drawing.Rectangle(0, 0, $Width, $Height)
    $destBitmap = New-Object System.Drawing.Bitmap($Width, $Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [System.Drawing.Graphics]::FromImage($destBitmap)
    
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    
    $graphics.DrawImage($Image, $destRect, 0, 0, $Image.Width, $Image.Height, [System.Drawing.GraphicsUnit]::Pixel)
    
    $dir = [System.IO.Path]::GetDirectoryName($Path)
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
    
    $destBitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $destBitmap.Dispose()
    Write-Host "Generated: $Path"
}

# 1. Update source assets
Resize-And-Save -Image $srcImage -Width 512 -Height 512 -Path ($rootDir + '\assets\icon-512.png')
Resize-And-Save -Image $srcImage -Width 192 -Height 192 -Path ($rootDir + '\assets\icon-192.png')

# 2. Update www/assets
Resize-And-Save -Image $srcImage -Width 512 -Height 512 -Path ($rootDir + '\www\assets\icon-512.png')
Resize-And-Save -Image $srcImage -Width 192 -Height 192 -Path ($rootDir + '\www\assets\icon-192.png')

# 3. Update Android mipmaps
$mipmaps = @{
    'mipmap-mdpi' = 48
    'mipmap-hdpi' = 72
    'mipmap-xhdpi' = 96
    'mipmap-xxhdpi' = 144
    'mipmap-xxxhdpi' = 192
}

$resDir = $rootDir + '\android\app\src\main\res'

foreach ($name in $mipmaps.Keys) {
    $size = $mipmaps[$name]
    $dir = $resDir + '\' + $name
    Resize-And-Save -Image $srcImage -Width $size -Height $size -Path ($dir + '\ic_launcher.png')
    Resize-And-Save -Image $srcImage -Width $size -Height $size -Path ($dir + '\ic_launcher_round.png')
    Resize-And-Save -Image $srcImage -Width $size -Height $size -Path ($dir + '\ic_launcher_foreground.png')
}

# 4. Set background XML color to #F3F2ED
$bgXmlPath = $resDir + '\values\ic_launcher_background.xml'
$bgXmlContent = '<?xml version="1.0" encoding="utf-8"?>' + "`n" + '<resources>' + "`n" + '    <color name="ic_launcher_background">#F3F2ED</color>' + "`n" + '</resources>' + "`n"
[System.IO.File]::WriteAllText($bgXmlPath, $bgXmlContent)
Write-Host 'Updated ic_launcher_background.xml with #F3F2ED'

$srcImage.Dispose()
Write-Host 'All assets generated successfully.'
