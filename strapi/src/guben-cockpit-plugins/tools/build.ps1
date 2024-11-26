$directories = Get-ChildItem -Directory "strapi-masterportal";

foreach($dir in $directories) {
  Set-Location $dir.FullName
  Write-Output "Installing packages in $($dir.FullName)..."
  npm i
  Write-Output "Building project in $($dir.FullName)..."
  npm run build
}

Write-Output "Finished processing..."
