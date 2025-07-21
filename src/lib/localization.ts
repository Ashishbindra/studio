export const uiContent = {
  // Header
  'app.title': 'Shramik Hisab',
  'nav.dashboard': 'Dashboard',
  'nav.attendance': 'Attendance',
  'nav.payments': 'Payments',
  'language.toggle.label': 'हिन्दी',

  // Dashboard Page
  'dashboard.title': 'Worker Dashboard',
  'dashboard.add.worker': 'Add Worker',
  'worker.wage.per.day': '/ day',
  'worker.due': 'Due',
  'worker.paid': 'Paid',
  'worker.balance': 'Balance',

  // Add Worker Dialog
  'dialog.add.worker.title': 'Add New Worker',
  'dialog.add.worker.description': "Enter the details of the new worker. Click save when you're done.",
  'form.name.label': 'Name',
  'form.name.placeholder': 'e.g. Ramesh Kumar',
  'form.phone.label': 'Phone Number',
  'form.phone.placeholder': 'e.g. 9876543210',
  'form.daily.wage.label': 'Daily Wage (₹)',
  'form.daily.wage.placeholder': 'e.g. 500',
  'form.photo.url.label': 'Photo URL',
  'form.photo.url.placeholder': 'https://placehold.co/100x100.png',
  'form.cancel': 'Cancel',
  'form.save': 'Save Changes',

  // Attendance Page
  'attendance.title': 'Daily Attendance',
  'attendance.date.label': "Attendance for:",
  'attendance.mark.present': 'Present',
  'attendance.mark.absent': 'Absent',
  'attendance.checked.in.at': 'Checked in at',
  'attendance.checked.out.at': 'Checked out at',
  'attendance.check.in': 'Check-in',
  'attendance.check.out': 'Check-out',
  'attendance.status.absent': 'Absent',
  'attendance.not.marked': 'Not Marked',
  'status.present': 'Present',

  // Payments Page
  'payments.title': 'Payment Overview',
  'payments.table.worker': 'Worker',
  'payments.table.status': 'Status',
  'payments.status.paid': 'Paid',
  'payments.status.due': 'Due',
};

export type UIContentKeys = keyof typeof uiContent;
