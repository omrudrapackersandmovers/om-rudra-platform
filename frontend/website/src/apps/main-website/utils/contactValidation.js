export const contactSubjects = ["General enquiry", "Moving quote", "Existing booking", "Feedback or complaint", "Business enquiry", "Other"];

export function validateContact(form) {
  const errors = {};
  const name = form.name.trim();
  const email = form.email.trim();
  const message = form.message.trim();
  if (name.length < 2) errors.name = "Enter your full name (at least 2 characters).";
  else if (name.length > 100) errors.name = "Keep your name within 100 characters.";
  if (!/^[6-9]\d{9}$/.test(form.phone.trim())) errors.phone = "Enter a valid 10-digit Indian mobile number starting with 6, 7, 8 or 9.";
  if (!email) errors.email = "Enter your email address.";
  else if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address, such as you@example.com.";
  if (!contactSubjects.includes(form.subject)) errors.subject = "Choose an enquiry subject.";
  if (form.subject === "Other" && !form.subjectOther?.trim()) errors.subjectOther = "Please specify the enquiry subject.";
  else if (form.subject === "Other" && form.subjectOther.trim().length > 200) errors.subjectOther = "Keep the subject within 200 characters.";
  if (message.length < 10) errors.message = "Tell us a little more (at least 10 characters).";
  else if (message.length > 2000) errors.message = "Keep your message within 2,000 characters.";
  return errors;
}
