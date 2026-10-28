#!/usr/bin/env python3
"""
Astro Esquiva - Generador de Secrets para GitHub Actions
Permite convertir un keystore existente a Base64 o verificar los parámetros para GitHub Secrets.
"""
import os
import base64
import sys

def main():
    print("=" * 60)
    print(" Astro Esquiva - Asistente de Secrets de GitHub Actions")
    print("=" * 60)
    
    keystore_path = input("Ingresa la ruta a tu archivo .jks o .keystore (o presiona Enter para usar default): ").strip()
    if not keystore_path:
        keystore_path = "android/keystores/astro-esquiva-release.jks"
    
    if not os.path.exists(keystore_path):
        print(f"\n⚠️ El archivo '{keystore_path}' no existe en esta ruta.")
        print("💡 Recuerda que el workflow de GitHub Actions '.github/workflows/deploy-playstore.yml'")
        print("   puede generar automáticamente un keystore en la nube si aún no tienes uno!")
        print("\nPara crear uno con keytool, ejecuta:")
        print(f"keytool -genkey -v -keystore {keystore_path} -alias astroesquiva -keyalg RSA -keysize 2048 -validity 10000")
        return

    with open(keystore_path, "rb") as f:
        content = f.read()
        b64 = base64.b64encode(content).decode("utf-8")

    print("\n✅ Keystore codificado con éxito en Base64!\n")
    print("Copia los siguientes valores en GitHub -> Settings -> Secrets and variables -> Actions:\n")
    print(f"1. ANDROID_KEYSTORE_BASE64:\n{b64}\n")
    print("2. ANDROID_KEYSTORE_PASSWORD:\n(la contraseña que usaste al crear el keystore)\n")
    print("3. ANDROID_KEY_ALIAS:\nastroesquiva\n")
    print("4. ANDROID_KEY_PASSWORD:\n(la contraseña de la clave)\n")
    print("5. PLAY_STORE_JSON_KEY:\n(el JSON de la Cuenta de Servicio de Google Cloud)\n")

if __name__ == "__main__":
    main()
