// Google Apps Script: Google Sheet-এ সংরক্ষণ + ইমেইল নোটিফিকেশন
var EMAIL = "shajinazit@gmail.com";

function doPost(e) {
  var p = (e && e.parameter) || {};
  if (p.website) return ContentService.createTextOutput("ok"); // স্প্যাম ফাঁদ

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    // ১) শিটে সংরক্ষণ (আগে সেভ, যাতে মেইল ফেইল করলেও ডাটা হারায় না)
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    // যদি স্ক্রিপ্টটি শিটের সাথে যুক্ত না হয়, নিচের লাইনে শিটের ID বসিয়ে উপরের লাইনটি মুছুন:
    // var ss = SpreadsheetApp.openById("আপনার_শিট_ID");
    var sh = ss.getSheetByName("Registrations") || ss.insertSheet("Registrations");
    if (sh.getLastRow() === 0) sh.appendRow(["সময়", "ধরন", "নাম", "বয়স", "মোবাইল", "ঠিকানা/প্রশ্ন", "পেজ"]);
    sh.appendRow([new Date(), p.type || "নিবন্ধন", p.name, p.age, "'" + p.mobile, p.address, p.source]);
    SpreadsheetApp.flush();
  } finally {
    lock.releaseLock();
  }

  // ২) ইমেইল (আলাদা try, ব্যর্থ হলেও শিটের ডাটা থেকে যাবে)
  try {
    MailApp.sendEmail({
      to: EMAIL,
      subject: "নতুন " + (p.type || "নিবন্ধন") + ": " + p.name,
      body: "নাম: " + p.name + "\nবয়স: " + p.age + "\nমোবাইল: " + p.mobile +
            "\nঠিকানা/প্রশ্ন: " + p.address + "\nপেজ: " + p.source
    });
  } catch (err) {
    console.error("Mail error: " + err);
  }
  return ContentService.createTextOutput("ok");
}

// ব্রাউজারে লিংক খুললে "Working" দেখাবে (ডিপ্লয়মেন্ট ঠিক আছে কিনা বোঝার জন্য)
function doGet() {
  return ContentService.createTextOutput("Working");
}

// একবার এডিটরে এই ফাংশনটি Run করে মেইল ও শিটের অনুমতি (Authorize) দিন
function testSetup() {
  doPost({ parameter: { type: "টেস্ট", name: "টেস্ট নাম", age: "30", mobile: "01700000000", address: "টেস্ট ঠিকানা", source: "manual-test" } });
}
