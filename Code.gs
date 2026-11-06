// Google Apps Script: Google Sheet-এ সংরক্ষণ + ইমেইল নোটিফিকেশন
var EMAIL = "shajinazit@gmail.com"; // এখানে আপনার ইমেইল বসান

function doPost(e) {
  var p = e.parameter;
  if (p.website) return ContentService.createTextOutput("ok"); // স্প্যাম ফাঁদ
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName("Registrations") || ss.insertSheet("Registrations");
  if (sh.getLastRow() === 0) sh.appendRow(["সময়", "ধরন", "নাম", "বয়স", "মোবাইল", "ঠিকানা/প্রশ্ন", "পেজ"]);
  sh.appendRow([new Date(), p.type || "নিবন্ধন", p.name, p.age, "'" + p.mobile, p.address, p.source]);
  MailApp.sendEmail(EMAIL, "নতুন " + (p.type || "নিবন্ধন") + ": " + p.name,
    "নাম: " + p.name + "\nবয়স: " + p.age + "\nমোবাইল: " + p.mobile + "\nঠিকানা/প্রশ্ন: " + p.address);
  return ContentService.createTextOutput("ok");
}
