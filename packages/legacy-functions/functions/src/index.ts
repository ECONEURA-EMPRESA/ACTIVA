import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as crypto from "crypto";

admin.initializeApp();

const db = admin.firestore();

export const lemonSqueezyWebhook = functions.https.onRequest(async (req, res) => {
    try {
        // 1. Validate Method
        if (req.method !== "POST") {
            res.status(405).send("Method Not Allowed");
            return;
        }

        // 2. Validate Signature
        const secret = process.env.LEMON_SQUEEZY_SECRET || "change-me-in-prod";
        const hmac = crypto.createHmac("sha256", secret);
        const digest = Buffer.from(hmac.update(req.rawBody).digest("hex"), "utf8");
        const signature = Buffer.from(req.get("X-Signature") || "", "utf8");

        if (!crypto.timingSafeEqual(digest, signature)) {
            functions.logger.error("Invalid Signature");
            res.status(401).send("Invalid Signature");
            return;
        }

        // 3. Process Event
        const event = req.body;
        const eventName = event.meta.event_name;
        functions.logger.info(`Received Event: ${eventName}`);

        if (eventName === "order_created" || eventName === "subscription_created") {
            const email = event.data.attributes.user_email;
            const orderId = event.data.id;

            functions.logger.info(`Processing Premium Upgrade for: ${email}`);

            // 4. Update User in Firestore
            // Strategy: Lookup by email in 'users' collection
            const usersRef = db.collection("users");
            const snapshot = await usersRef.where("email", "==", email).limit(1).get();

            if (!snapshot.empty) {
                const userDoc = snapshot.docs[0];
                await userDoc.ref.update({
                    subscriptionStatus: "premium",
                    subscriptionId: orderId,
                    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                });
                functions.logger.info(`✅ User ${userDoc.id} upgraded to PREMIUM.`);
            } else {
                // Fallback: Check Auth and create doc if missing
                try {
                    const userRecord = await admin.auth().getUserByEmail(email);
                    await usersRef.doc(userRecord.uid).set({
                        email: email,
                        subscriptionStatus: "premium",
                        subscriptionId: orderId,
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    }, { merge: true });
                    functions.logger.info(`✅ User ${userRecord.uid} (from Auth) upgraded to PREMIUM.`);
                } catch (authError) {
                    functions.logger.error(`❌ User not found for email: ${email}`);
                }
            }
        }

        res.status(200).send("Webhook Processed");

    } catch (error) {
        functions.logger.error("Webhook Error", error);
        res.status(500).send("Server Error");
    }
});

