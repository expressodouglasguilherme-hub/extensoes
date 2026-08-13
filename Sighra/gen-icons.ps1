Add-Type -AssemblyName System.Drawing

function New-RoundedPath([int]$x, [int]$y, [int]$w, [int]$h, [int]$r) {
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = $r * 2
    $path.AddArc($x, $y, $d, $d, 180, 90)
    $path.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
    $path.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
    $path.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
    $path.CloseFigure()
    return $path
}

function Make-Icon([int]$size, [string]$outPath) {
    $f = $size / 128.0
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

    # Fundo gradiente (laranja -> vermelho)
    $bgRect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
    $bgPath = New-RoundedPath 0 0 $size $size ([int](28 * $f))
    $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($bgRect, [System.Drawing.Color]::FromArgb(231,76,60), [System.Drawing.Color]::FromArgb(243,156,18), 45)
    $g.FillPath($bgBrush, $bgPath)

    # Card de tras (inclinado)
    $g.TranslateTransform($size/2, $size/2)
    $g.RotateTransform(-8)
    $g.TranslateTransform(-$size/2, -$size/2)
    $backBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(90,255,255,255))
    $backPath = New-RoundedPath ([int](34*$f)) ([int](26*$f)) ([int](60*$f)) ([int](76*$f)) ([int](10*$f))
    $g.FillPath($backBrush, $backPath)
    $g.ResetTransform()
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

    # Card da frente
    $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $frontPath = New-RoundedPath ([int](30*$f)) ([int](30*$f)) ([int](64*$f)) ([int](76*$f)) ([int](11*$f))
    $g.FillPath($whiteBrush, $frontPath)

    # Aba do topo
    $tabBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255,232,214))
    $tabPath = New-RoundedPath ([int](47*$f)) ([int](24*$f)) ([int](30*$f)) ([int](12*$f)) ([int](6*$f))
    $g.FillPath($tabBrush, $tabPath)

    # Linhas coloridas
    $linhas = @(
        @{ y=50; x2=82; c=@(231,76,60) },
        @{ y=63; x2=74; c=@(230,126,34) },
        @{ y=76; x2=82; c=@(243,156,18) },
        @{ y=89; x2=68; c=@(22,160,133) }
    )
    foreach ($l in $linhas) {
        $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb($l.c[0],$l.c[1],$l.c[2]), [float](5*$f))
        $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
        $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
        $g.DrawLine($pen, [float](42*$f), [float]($l.y*$f), [float]($l.x2*$f), [float]($l.y*$f))
    }

    # Selo de check
    $cx = 96*$f; $cy = 96*$f; $r = 20*$f
    $checkRect = New-Object System.Drawing.Rectangle([int]($cx-$r), [int]($cy-$r), [int]($r*2), [int]($r*2))
    $checkBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($checkRect, [System.Drawing.Color]::FromArgb(22,160,133), [System.Drawing.Color]::FromArgb(39,174,96), 45)
    $g.FillEllipse($checkBrush, $checkRect)
    $whitePen = New-Object System.Drawing.Pen([System.Drawing.Color]::White, [float](4*$f))
    $g.DrawEllipse($whitePen, $checkRect)

    # Checkmark
    $ckPen = New-Object System.Drawing.Pen([System.Drawing.Color]::White, [float](5*$f))
    $ckPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $ckPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $ckPen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
    $pts = @(
        (New-Object System.Drawing.PointF([float](87*$f),[float](96*$f))),
        (New-Object System.Drawing.PointF([float](94*$f),[float](103*$f))),
        (New-Object System.Drawing.PointF([float](106*$f),[float](89*$f)))
    )
    $g.DrawLines($ckPen, $pts)

    $g.Dispose()
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Gerado: $outPath"
}

$dir = $PSScriptRoot
Make-Icon 16  (Join-Path $dir 'icon16.png')
Make-Icon 48  (Join-Path $dir 'icon48.png')
Make-Icon 128 (Join-Path $dir 'icon128.png')
Write-Host "Concluido!"
