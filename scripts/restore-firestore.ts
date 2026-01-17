import { execSync } from 'child_process';
import * as readline from 'readline';

const PROJECT_ID = 'metodo-activa-saas-1767353295'; // HARDCODED PRODUCTION ID
const BUCKET_NAME = `gs://${PROJECT_ID}-backups`;

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

    // Check Project ID
    const currentProject = runCommand('gcloud config get-value project');
    if (currentProject !== PROJECT_ID) {
      console.warn(`[⚠️] WARNING: Switched execution context from ${currentProject} to ${PROJECT_ID}`);
    }
  } catch (e) {
    console.error('[❌] GCloud Auth Missing. Run `gcloud auth login` first.');
    process.exit(1);
  }
};

const askConfirmation = (question: string): Promise<boolean> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
};

const restoreFirestore = async () => {
  const timestamp = process.argv[2];

  if (!timestamp) {
    console.error('[❌] Error: Please provide a timestamp argument.');
    console.error('Usage: npm run restore <YYYY-MM-DD-HH-mm-ss>');
    process.exit(1);
  }

  checkPrerequisites();

  const backupPath = `${BUCKET_NAME}/${timestamp}`;

  console.log(`\n[🚨] TITANIUM RESTORE PROTOCOL INITIATED`);
  console.log(`[🎯] Target Project: ${PROJECT_ID}`);
  console.log(`[📂] Source: ${backupPath}`);
  console.log(`[⚠️] WARNING: This is a DESTRUCTIVE operation. It imports data into the active database.`);

  const confirmed = await askConfirmation('\n[❓] Are you sure you want to proceed? (y/N): ');

  if (!confirmed) {
    console.log('[🛑] Operation cancelled by user.');
    process.exit(0);
  }

  console.log(`\n[⏳] Starting RESTORE operation...`);

  try {
    // Requires 'gcloud' CLI to be authenticated
    execSync(`gcloud firestore import ${backupPath} --project=${PROJECT_ID}`, { stdio: 'inherit' });
    console.log(`\n[✅] RESTORE STARTED SUCCESSFULLY`);
    console.log(`[ℹ️] Monitor progress in Google Cloud Console.`);
  } catch (error) {
    console.error(`\n[❌] RESTORE FAILED`);
    console.error(error);
    process.exit(1);
  }
};

restoreFirestore();
