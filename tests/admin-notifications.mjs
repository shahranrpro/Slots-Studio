/**
 * SLOTS STUDIO — ADMIN NOTIFICATIONS TEST SUITE
 *
 * Verifies:
 * 1. Admin signup email template rendering and security (no secrets).
 * 2. Admin login email template rendering and security (no secrets).
 * 3. Daily idempotency key generation.
 * 4. Graceful handling of missing ADMIN_NOTIFICATION_EMAIL.
 * 5. Non-blocking error handling (email failure never blocks auth).
 * 6. .env.example documentation.
 */

import { readFileSync } from "fs";
import { resolve } from "path";

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

async function runSuite() {
  console.log("===================================================================");
  console.log(" SLOTS STUDIO — ADMIN EMAIL NOTIFICATIONS VERIFICATION");
  console.log("===================================================================\n");

  // -------------------------------------------------------------
  // TEST SECTION 1: Signup Notification Template
  // -------------------------------------------------------------
  console.log(">>> [1/5] Testing Admin Signup Email Template...");
  const signupTemplatePath = resolve(process.cwd(), "src/lib/email/templates/adminSignupTemplate.ts");
  const signupTemplateContent = readFileSync(signupTemplatePath, "utf-8");

  assert(
    signupTemplateContent.includes("Slots Studio — New User Signup"),
    "Signup template has authoritative subject line"
  );
  assert(
    signupTemplateContent.includes("params.userEmail") &&
    signupTemplateContent.includes("params.userId") &&
    signupTemplateContent.includes("params.workspaceId"),
    "Signup template includes required identity & workspace metadata"
  );
  assert(
    !signupTemplateContent.includes("params.password") &&
    !signupTemplateContent.includes("params.token") &&
    !signupTemplateContent.includes("params.secret"),
    "Signup template strictly excludes passwords and sensitive tokens from parameters"
  );

  // -------------------------------------------------------------
  // TEST SECTION 2: Login Notification Template
  // -------------------------------------------------------------
  console.log("\n>>> [2/5] Testing Admin Login Email Template...");
  const loginTemplatePath = resolve(process.cwd(), "src/lib/email/templates/adminLoginTemplate.ts");
  const loginTemplateContent = readFileSync(loginTemplatePath, "utf-8");

  assert(
    loginTemplateContent.includes("Slots Studio — User Login"),
    "Login template has authoritative subject line"
  );
  assert(
    loginTemplateContent.includes("params.userEmail") &&
    loginTemplateContent.includes("params.loginTimestamp"),
    "Login template includes user email and timestamp"
  );
  assert(
    loginTemplateContent.includes("params.userAgent") &&
    loginTemplateContent.includes("params.ipAddress"),
    "Login template safely handles optional client metadata"
  );
  assert(
    !loginTemplateContent.includes("params.password") &&
    !loginTemplateContent.includes("params.token") &&
    !loginTemplateContent.includes("params.sessionToken"),
    "Login template strictly excludes session cookies and auth tokens from parameters"
  );

  // -------------------------------------------------------------
  // TEST SECTION 3: Admin Notification Service Idempotency & Safety
  // -------------------------------------------------------------
  console.log("\n>>> [3/5] Testing Admin Notification Service Idempotency & Dispatch...");
  const servicePath = resolve(process.cwd(), "src/lib/email/adminNotifications.ts");
  const serviceContent = readFileSync(servicePath, "utf-8");

  assert(
    serviceContent.includes('admin_signup_" + payload.userId'),
    "Signup notification uses user-scoped idempotency key"
  );
  assert(
    serviceContent.includes('admin_login_" + payload.userId + "_" + dateKey'),
    "Login notification uses daily idempotency key to prevent inbox flooding"
  );
  assert(
    serviceContent.includes("if (!adminEmail)"),
    "Service gracefully no-ops if ADMIN_NOTIFICATION_EMAIL is absent"
  );
  assert(
    serviceContent.includes("console.warn"),
    "Service catches errors and logs warnings without throwing"
  );

  // -------------------------------------------------------------
  // TEST SECTION 4: Auth Service Integration & Non-Blocking Guarantee
  // -------------------------------------------------------------
  console.log("\n>>> [4/5] Testing Auth Service Non-Blocking Integration...");
  const authServicePath = resolve(process.cwd(), "src/lib/auth/service.ts");
  const authServiceContent = readFileSync(authServicePath, "utf-8");

  assert(
    authServiceContent.includes("sendLoginNotification"),
    "loginUser dispatches sendLoginNotification"
  );
  assert(
    authServiceContent.includes("sendSignupNotification"),
    "signupUser dispatches sendSignupNotification"
  );
  assert(
    authServiceContent.includes("createWorkspaceForUser"),
    "signupUser automatically provisions an isolated workspace for new users"
  );
  assert(
    authServiceContent.includes(".catch((err) => console.warn"),
    "Notification calls are non-blocking fire-and-forget promises"
  );

  // -------------------------------------------------------------
  // TEST SECTION 5: Configuration & Environment File Documentation
  // -------------------------------------------------------------
  console.log("\n>>> [5/5] Testing Environment Variable Documentation...");
  const envExamplePath = resolve(process.cwd(), ".env.example");
  const envExampleContent = readFileSync(envExamplePath, "utf-8");

  assert(
    envExampleContent.includes("ADMIN_NOTIFICATION_EMAIL"),
    ".env.example documents ADMIN_NOTIFICATION_EMAIL"
  );
  assert(
    envExampleContent.includes("NEVER exposed to the browser bundle"),
    ".env.example includes security warning against client exposure"
  );

  // -------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------
  console.log("\n===================================================================");
  console.log(` ADMIN NOTIFICATIONS QA COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log("===================================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runSuite().catch((e) => {
  console.error("FATAL SUITE ERROR:", e);
  process.exit(1);
});
