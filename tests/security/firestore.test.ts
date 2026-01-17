import {
    assertFails,
    assertSucceeds,
    initializeTestEnvironment,
    RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import * as fs from 'fs';
import * as path from 'path';

let testEnv: RulesTestEnvironment;

const PROJECT_ID = 'metodo-activa-tests';
const RULES_PATH = path.resolve(__dirname, '../../firestore.rules');

beforeAll(async () => {
    // Load Rules
    if (!fs.existsSync(RULES_PATH)) {
        throw new Error(`🔥 FATAL: Rules file not found at ${RULES_PATH}`);
    }
    const rules = fs.readFileSync(RULES_PATH, 'utf8');

    testEnv = await initializeTestEnvironment({
        projectId: PROJECT_ID,
        firestore: {
            rules,
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

describe('🛡️ TITANIUM SECURITY PERIMETER', () => {

    // --- MOCK USERS ---
    const ALICE_ID = 'alice_user';
    const BOB_ID = 'bob_hackerman';
    const ADMIN_ID = 'admin_super'; // Future capability

    const aliceDb = () => testEnv.authenticatedContext(ALICE_ID).firestore();
    const bobDb = () => testEnv.authenticatedContext(BOB_ID).firestore();
    const unauthDb = () => testEnv.unauthenticatedContext().firestore();

    // --- 1. DATA SOVEREIGNTY (Isolation) ---

    it('✅ Users can READ their own Patients', async () => {
        // Setup: Alice creates a patient
        await testEnv.withSecurityRulesDisabled(async (ctx) => {
            await ctx.firestore().collection('patients').doc('p1').set({ userId: ALICE_ID, name: 'Alice Patient' });
        });

        await assertSucceeds(aliceDb().collection('patients').doc('p1').get());
    });

    it('🚫 Users CANNOT read others Patients (Horizontal Escalation)', async () => {
        // Setup: Alice creates a patient
        await testEnv.withSecurityRulesDisabled(async (ctx) => {
            await ctx.firestore().collection('patients').doc('p1').set({ userId: ALICE_ID, name: 'Alice Patient' });
        });

        // Bob tries to read
        await assertFails(bobDb().collection('patients').doc('p1').get());
    });

    it('🚫 Unauthenticated users are BLOCKED globally', async () => {
        await assertFails(unauthDb().collection('patients').get());
        await assertFails(unauthDb().collection('patients').doc('p1').get());
    });


    // --- 2. INTEGRITY & VALIDATION (Schema Enforcement) ---

    it('✅ Can CREATE Patient with Valid Schema', async () => {
        await assertSucceeds(
            aliceDb().collection('patients').add({
                userId: ALICE_ID,
                name: 'Valid Patient',
                age: 30,
                diagnosis: 'Stress'
            })
        );
    });

    it('🚫 Cannot CREATE Patient with Missing Required Fields (Schema Break)', async () => {
        await assertFails(
            aliceDb().collection('patients').add({
                userId: ALICE_ID,
                name: 'Incomplete Patient'
                // Missing age, diagnosis
            })
        );
    });

    it('🚫 Cannot CREATE Patient with Invalid Types (Type Safety)', async () => {
        await assertFails(
            aliceDb().collection('patients').add({
                userId: ALICE_ID,
                name: 12345, // Should be string
                age: 'thirty', // Should be int
                diagnosis: 'Test'
            })
        );
    });

    it('🚫 Cannot SPOOF ownership (User ID Injection)', async () => {
        await assertFails(
            aliceDb().collection('patients').add({
                userId: BOB_ID, // Alice trying to create data as Bob
                name: 'Spoofed Patient',
                age: 20,
                diagnosis: 'Fraud'
            })
        );
    });

    // --- 3. SESSION SECURITY (Subcollections) ---

    it('✅ Owner can manage Sessions', async () => {
        // Parent must exist first? Rules don't strictly enforce parent existence for write if paths match, 
        // but typically we should structure data correctly.
        // However, our rules match /patients/{pId}/sessions/{sId}

        // Setup: Alice owns patient p1
        await testEnv.withSecurityRulesDisabled(async (ctx) => {
            await ctx.firestore().collection('patients').doc('p1').set({ userId: ALICE_ID, name: 'P1', age: 10, diagnosis: 'x' });
        });

        await assertSucceeds(
            aliceDb().collection('patients/p1/sessions').add({
                userId: ALICE_ID, // Redundant but required by current rules
                date: '2025-01-01',
                time: '10:00',
                type: 'individual'
            })
        );
    });

    it('🚫 Non-Owner CANNOT add Sessions to others patients', async () => {
        // Setup: Alice owns patient p1
        await testEnv.withSecurityRulesDisabled(async (ctx) => {
            await ctx.firestore().collection('patients').doc('p1').set({ userId: ALICE_ID, name: 'P1', age: 10, diagnosis: 'x' });
        });

        await assertFails(
            bobDb().collection('patients/p1/sessions').add({
                userId: BOB_ID,
                date: '2025-01-01',
                time: '10:00',
                type: 'individual'
            })
        );
    });

});
