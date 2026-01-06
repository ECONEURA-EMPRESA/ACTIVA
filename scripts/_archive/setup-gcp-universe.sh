#!/bin/bash

# --- CONFIGURACIÓN DE TUS DATOS ---
# ID de tu cuenta de facturación (Proporcionado por usuario)
BILLING_ACCOUNT_ID="017D82-3F0D3B-DC1B98"
# Organización (Proporcionado por usuario: familiapanzardi-org).
# Nota: gcloud requiere el ID numérico para el flag --organization. 
# Si el usuario configura gcloud con su cuenta de org, no hace falta flag.


# Nombre para tu nuevo proyecto (debe ser único globalmente, añado un random al final)
PROJECT_ID="metodo-activa-saas-$(date +%s)"
PROJECT_NAME="Metodo Activa CRM"
REGION="europe-west1" # Servidores en Europa (Bélgica) para mejor latencia en España

# Colores para los mensajes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 INICIANDO DESPLIEGUE AUTOMÁTICO DE INFRAESTRUCTURA GOOGLE CLOUD${NC}"
echo -e "${BLUE}================================================================${NC}"
echo -e "Proyecto: $PROJECT_ID"
echo -e "Facturación: $BILLING_ACCOUNT_ID"
echo -e "Región: $REGION"
echo ""

# 1. Crear el Proyecto
echo -e "${GREEN}[1/7] Creando proyecto nuevo en Google Cloud...${NC}"
gcloud projects create $PROJECT_ID --name="$PROJECT_NAME" --quiet

# 2. Configurar el entorno local para usar este proyecto
echo -e "${GREEN}[2/7] Configurando entorno local...${NC}"
gcloud config set project $PROJECT_ID

# 3. Vincular la Cuenta de Facturación (CRÍTICO para usar tus créditos)
echo -e "${GREEN}[3/7] Vinculando cuenta de facturación ($BILLING_ACCOUNT_ID)...${NC}"
gcloud beta billing projects link $PROJECT_ID --billing-account=$BILLING_ACCOUNT_ID

if [ $? -ne 0 ]; then
  echo "❌ Error al vincular facturación. Verifica que tu usuario sea administrador de la cuenta de facturación."
  exit 1
fi

# 4. Habilitar las APIs necesarias (El "Cerebro" del sistema)
echo -e "${GREEN}[4/7] Habilitando servicios (esto puede tardar unos minutos)...${NC}"
gcloud services enable \
  run.googleapis.com \
  firestore.googleapis.com \
  storage.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com \
  identitytoolkit.googleapis.com \
  firebase.googleapis.com

# 5. Crear la Base de Datos Firestore (Modo Nativo)
echo -e "${GREEN}[5/7] Creando base de datos Firestore en $REGION...${NC}"
# Intentamos crear la base de datos (default)
gcloud firestore databases create --location=$REGION --type=firestore-native --quiet || echo "⚠️ La base de datos ya existe o está en proceso."

# 6. Crear el Bucket de Storage (Privado para documentos médicos)
echo -e "${GREEN}[6/7] Creando almacén de archivos seguro (Bucket)...${NC}"
gsutil mb -l $REGION -p $PROJECT_ID gs://$PROJECT_ID-secure-docs
# Hacemos que sea privado (evita acceso público accidental)
gcloud storage buckets update gs://$PROJECT_ID-secure-docs --public-access-prevention

# 7. Crear repositorio para Docker (Artifact Registry)
echo -e "${GREEN}[7/7] Creando repositorio de imágenes para el Backend...${NC}"
gcloud artifacts repositories create crm-repo \
  --repository-format=docker \
  --location=$REGION \
  --description="Repositorio para API Metodo Activa"
  --description="Repositorio para API Metodo Activa"

# 8. Generar configuración para Terraform
echo -e "${GREEN}[8/9] Generando configuración de Terraform (terraform.tfvars)...${NC}"
cat > infra/terraform/terraform.tfvars <<EOF
project_id = "$PROJECT_ID"
region     = "$REGION"
EOF

# 9. Obtener configuración para Frontend (Firebase)
echo -e "${GREEN}[9/9] Obteniendo configuración de Firebase...${NC}"
# Nota: Esto requiere que el usuario configure la web app en Firebase console o via CLI extra
# Por ahora generamos un archivo .env.local plantilla con el ID del proyecto.
cat > apps/crm-client/.env.local <<EOF
VITE_FIREBASE_API_KEY="REEMPLAZAR_CON_API_KEY_DE_CONSOLA"
VITE_FIREBASE_AUTH_DOMAIN="$PROJECT_ID.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="$PROJECT_ID"
VITE_FIREBASE_STORAGE_BUCKET="$PROJECT_ID-secure-docs"
VITE_FIREBASE_MESSAGING_SENDER_ID="REEMPLAZAR"
VITE_FIREBASE_APP_ID="REEMPLAZAR"
EOF

echo ""
echo -e "${BLUE}✅ ¡INFRAESTRUCTURA LISTA!${NC}"
echo -e "----------------------------------------------------------------"
echo -e "Tu proyecto ID es: ${GREEN}$PROJECT_ID${NC}"
echo -e "Todo está listo para desplegar el código del CRM."
