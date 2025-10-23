Param(
  [string]$baseUrl = "http://localhost:3334"
)

Write-Host "Using base URL: $baseUrl"

$body = Get-Content -Path "sample-requests\quote-request.json" -Raw

Write-Host "POST /quotes"
$post = Invoke-RestMethod -Uri "$baseUrl/quotes" -Method Post -Body $body -ContentType 'application/json'
Write-Host "Response:"; $post | ConvertTo-Json -Depth 5

Write-Host "GET /quotes/Q123456789"
$get = Invoke-RestMethod -Uri "$baseUrl/quotes/Q123456789" -Method Get
Write-Host "Response:"; $get | ConvertTo-Json -Depth 5
