import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import * as fs from 'fs';

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'metodo-activa-tests',
    firestore: {
      rules: fs.readFileSync('firestore.rules', 'utf8'),
      host: '127.0.0.1',
      port: 8080,
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

describe('Firestore Security Rules', () => {
  // --- PATIENTS ---
  it('allows user to create their own patient', async () => {
    const userId = 'user_123';
    const db = testEnv.authenticatedContext(userId).firestore();

    await assertSucceeds(
      db.collection('patients').doc('patient_1').set({
        userId: userId,
        firstName: 'Test',
        lastName: 'Patient',
      }),
    );
  });

  it('DENIES creating patient for another user', async () => {
    const userId = 'user_123';
    const db = testEnv.authenticatedContext(userId).firestore();

    await assertFails(
      db.collection('patients').doc('patient_2').set({
        userId: 'user_999', // Malicious userId
        firstName: 'Hacked',
        lastName: 'Patient',
      }),
    );
  });

  it('allows reading own patients', async () => {
    const userId = 'user_123';
    // Admin setup
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().collection('patients').doc('patient_1').set({ userId: 'user_123' });
    });

    const db = testEnv.authenticatedContext(userId).firestore();
    await assertSucceeds(db.collection('patients').doc('patient_1').get());
  });

  it('DENIES reading others patients', async () => {
    const userId = 'user_123';
    const victimId = 'user_666';

    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context
        .firestore()
        .collection('patients')
        .doc('patient_victim')
        .set({ userId: victimId });
    });

    const db = testEnv.authenticatedContext(userId).firestore();
    await assertFails(db.collection('patients').doc('patient_victim').get());
  });
});
