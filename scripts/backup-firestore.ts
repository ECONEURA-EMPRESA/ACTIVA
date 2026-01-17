import { execSync } from 'child_process';
import { format } from 'date-fns';

const PROJECT_ID = 'metodo-activa-saas-1767353295'; // HARDCODED PRODUCTION ID
const BUCKET_NAME = `gs://${PROJECT_ID}-backups`;
const RETENTION_DAYS = 30;

const runCommand = (command: string): string => {
  try {
    return execSync(command, { encoding: 'utf-8', stdio: 'pipe' }).trim();
  } catch (error: any) {
    if (error.stderr) throw new Error(error.stderr.toString());
    throw error;
  }
};

const checkPrerequisites = () => {
  console.log('[🔍] Verifying Titanium prerequisites...');
  try {
    const authEmail = runCommand('gcloud config get-value account');
    console.log(`[👤] Authenticated as: ${authEmail}`);

    const currentProject = runCommand('gcloud config get-value project');
    if (currentProject !== PROJECT_ID) {
      console.warn(`[⚠️] Switched execution context from ${currentProject} to ${PROJECT_ID}`);
    }
  } catch (e) {
    console.error('[❌] GCloud Auth Missing. Run `gcloud auth login` first.');
    process.exit(1);
  }
};

const enforceRetentionPolicy = () => {
  console.log(`[🧹] Enforcing ${RETENTION_DAYS}-day retention policy...`);
  // This would typically involve listing objects and deleting old ones.
  // For now, we set a Lifecycle rule on the bucket if not exists (Idempotent).
  try {
    // Check if bucket exists, if not create it
    try {
      runCommand(`gsutil ls -b ${BUCKET_NAME}`);
    } catch {
      console.log(`[📦] Creating backup bucket ${BUCKET_NAME}...`);
      runCommand(`gsutil mb -p ${PROJECT_ID} -l europe-west1 ${BUCKET_NAME}`);
      runCommand(`gsutil lifecycle set infra/gcs-lifecycle.json ${BUCKET_NAME}`);
    }
  } catch (e) {
    console.warn('[⚠️] Retention policy check skipped (Bucket access issue). Manual cleanup required.');
  }
};

const backupFirestore = () => {
  checkPrerequisites();

  const timestamp = format(new Date(), 'yyyy-MM-dd-HH-mm-ss');
  const backupPath = `${BUCKET_NAME}/${timestamp}`;

  console.log(`[⏳] Starting TITANIUM BACKUP for ${PROJECT_ID}...`);
  console.log(`[📂] Destination: ${backupPath}`);

  try {
    // 1. Export Data
    execSync(`gcloud firestore export ${backupPath} --project=${PROJECT_ID}`, { stdio: 'inherit' });

    // 2. Enforce Retention (Placeholder for future implementation or lifecycle hook)
    // enforceRetentionPolicy(); 

    console.log(`\n[✅] BACKUP SUCCESSFUL`);
    console.log(`[🔗] URI: ${backupPath}`);
    console.log(`[ℹ️] To restore: npm run restore -- ${timestamp}`);
  } catch (error) {
    console.error(`\n[❌] BACKUP FAILED`);
    console.error(error);
    process.exit(1);
  }
};

backupFirestore();
