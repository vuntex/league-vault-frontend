$SERVER_IP  = "78.47.104.222"
$SSH_KEY    = "D:\SSH\league_vault_key"
$LOCAL_DIST = "dist/*"  # Oder "build/*"
$REMOTE_PATH = "/var/www/xenoria-frontend/"

Write-Host "🚀 Uploading Frontend..." -ForegroundColor Cyan

# Ordner auf Server leeren und neue Dateien hochladen
ssh -i $SSH_KEY root@$SERVER_IP "mkdir -p $REMOTE_PATH && rm -rf ${REMOTE_PATH}*"
scp -i $SSH_KEY -r $LOCAL_DIST "root@$($SERVER_IP):$REMOTE_PATH"

Write-Host "✅ Frontend online unter https://xenoria.de" -ForegroundColor Green