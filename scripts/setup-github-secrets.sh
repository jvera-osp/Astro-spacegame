#!/usr/bin/env bash
# ==============================================================================
# Astro Esquiva - Asistente Automático de GitHub Secrets para Google Play CI/CD
# ==============================================================================
set -e

echo "🚀 ========================================================="
echo "    CONFIGURADOR DE SECRETS PARA GITHUB ACTIONS"
echo "    Aplicación: Astro Esquiva (com.astroesquiva.spacegame)"
echo "========================================================="
echo ""

KEYSTORE_DIR="android/keystores"
KEYSTORE_FILE="$KEYSTORE_DIR/astro-esquiva-release.jks"
SECRETS_FILE=".github/secrets-backup.env"

mkdir -p "$KEYSTORE_DIR"
mkdir -p .github

# 1. Generar Keystore si no existe
if [ ! -f "$KEYSTORE_FILE" ]; then
    echo "🔑 Generando nueva clave de firma oficial (Keystore)..."
    read -sp "Ingresa la contraseña para tu Keystore (Enter para usar 'AstroEsquiva2026!'): " PASS
    echo ""
    PASS=${PASS:-"AstroEsquiva2026!"}

    read -p "Alias de la clave (Enter para usar 'astroesquiva'): " ALIAS
    ALIAS=${ALIAS:-"astroesquiva"}

    keytool -genkey -v \
        -keystore "$KEYSTORE_FILE" \
        -alias "$ALIAS" \
        -keyalg RSA \
        -keysize 2048 \
        -validity 10000 \
        -storepass "$PASS" \
        -keypass "$PASS" \
        -dname "CN=Astro Esquiva, OU=Games, O=AstroEsquiva, L=Madrid, ST=Madrid, C=ES"

    echo "✅ Keystore generado en: $KEYSTORE_FILE"
else
    echo "ℹ️ Se encontró un Keystore existente en: $KEYSTORE_FILE"
    PASS="AstroEsquiva2026!"
    ALIAS="astroesquiva"
fi

# 2. Codificar a Base64
if command -v base64 >/dev/null 2>&1; then
    KEYSTORE_B64=$(base64 -w 0 "$KEYSTORE_FILE" 2>/dev/null || base64 "$KEYSTORE_FILE" | tr -d '\n')
else
    echo "❌ No se encontró el comando base64."
    exit 1
fi

# 3. Guardar archivo de respaldo local
cat <<EOF > "$SECRETS_FILE"
# ⚠️ ARCHIVO CONFIDENCIAL - NO LO SUBAS AL REPOSITORIO PÚBLICO
# Estos son los valores exactos para GitHub Secrets:
# Ve a tu repositorio en GitHub -> Settings -> Secrets and variables -> Actions -> New repository secret

ANDROID_KEYSTORE_BASE64=$KEYSTORE_B64
ANDROID_KEYSTORE_PASSWORD=$PASS
ANDROID_KEY_ALIAS=$ALIAS
ANDROID_KEY_PASSWORD=$PASS

# PLAY_STORE_JSON_KEY: Pega aquí el contenido JSON completo de tu Cuenta de Servicio de Google Cloud
PLAY_STORE_JSON_KEY={"type":"service_account",...}
EOF

echo ""
echo "========================================================="
echo "🎉 ¡LISTO! COPIA ESTOS 5 SECRETS EN TU REPOSITORIO GITHUB:"
echo "   Ruta: Repositorio -> Settings -> Secrets and variables -> Actions"
echo "========================================================="
echo ""
echo "1️⃣  Nombre: ANDROID_KEYSTORE_BASE64"
echo "    Valor (Base64 generado, copia la línea siguiente completa):"
echo "$KEYSTORE_B64"
echo ""
echo "2️⃣  Nombre: ANDROID_KEYSTORE_PASSWORD"
echo "    Valor: $PASS"
echo ""
echo "3️⃣  Nombre: ANDROID_KEY_ALIAS"
echo "    Valor: $ALIAS"
echo ""
echo "4️⃣  Nombre: ANDROID_KEY_PASSWORD"
echo "    Valor: $PASS"
echo ""
echo "5️⃣  Nombre: PLAY_STORE_JSON_KEY"
echo "    Valor: El contenido completo del archivo .json que descargas de Google Cloud (Cuenta de Servicio con permisos de Google Play Android Developer)."
echo ""
echo "📄 Se guardó una copia de respaldo en: $SECRETS_FILE"
echo ""

# 4. Si GitHub CLI está instalado, ofrecer cargarlos automáticamente
if command -v gh >/dev/null 2>&1; then
    read -p "¿Deseas cargar estos secrets directamente a GitHub ahora con 'gh secret set'? (s/n): " AUTO_LOAD
    if [[ "$AUTO_LOAD" == "s" || "$AUTO_LOAD" == "S" ]]; then
        gh secret set ANDROID_KEYSTORE_BASE64 --body "$KEYSTORE_B64"
        gh secret set ANDROID_KEYSTORE_PASSWORD --body "$PASS"
        gh secret set ANDROID_KEY_ALIAS --body "$ALIAS"
        gh secret set ANDROID_KEY_PASSWORD --body "$PASS"
        echo "✅ Secrets cargados exitosamente a GitHub!"
    fi
fi
