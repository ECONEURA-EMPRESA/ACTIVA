import { execSync } from 'child_process';

const PROJECT_ID = 'metodo-activa-saas-1767353295';
const BUCKET_NAME = `gs://${PROJECT_ID}-backups`;

const restoreFirestore = () => {
  const timestamp = process.argv[2];

  if (!timestamp) {
    console.error('[❌] Error: Please provide a timestamp argument.');
    console.error('Usage: npm run restore <YYYY-MM-DD-HH-mm-ss>');
    process.exit(1);
  }

  const backupPath = `${BUCKET_NAME}/${timestamp}`;

  console.log(`[⏳] Starting RESTORE for ${PROJECT_ID}...`);
  console.log(`[📂] Source: ${backupPath}`);
  console.log(
    `[⚠️] WARNING: This usually requires an empty database or will overwrite colliding IDs.`,
  );

  try {
    // Requires 'gcloud' CLI to be authenticated
    execSync(`gcloud firestore import ${backupPath} --project=${PROJECT_ID}`, { stdio: 'inherit' });
    console.log(`[✅] Restore operation initiated successfully!`);
    console.log(`[ℹ️] Check Google Cloud Console for operation progress.`);
  } catch (error) {
    console.error(`[❌] Restore failed:`, error);
    process.exit(1);
  }
};

restoreFirestore();
