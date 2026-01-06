import { execSync } from 'child_process';
import { format } from 'date-fns';

const PROJECT_ID = 'metodo-activa-saas-1767353295';
const BUCKET_NAME = `gs://${PROJECT_ID}-backups`;

const backupFirestore = () => {
  const timestamp = format(new Date(), 'yyyy-MM-dd-HH-mm-ss');
  const backupPath = `${BUCKET_NAME}/${timestamp}`;

  console.log(`[⏳] Starting backup for ${PROJECT_ID}...`);
  console.log(`[📂] Destination: ${backupPath}`);

  try {
    // Requires 'gcloud' CLI to be authenticated
    execSync(`gcloud firestore export ${backupPath} --project=${PROJECT_ID}`, { stdio: 'inherit' });
    console.log(`[✅] Backup completed successfully!`);
    console.log(`[ℹ️] To restore, run: npm run restore -- ${timestamp}`);
  } catch (error) {
    console.error(`[❌] Backup failed:`, error);
    process.exit(1);
  }
};

backupFirestore();
