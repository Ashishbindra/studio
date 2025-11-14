
export const uiContent = {
  // Header
  'app.title': 'Shramik Hisab',
  'nav.dashboard': 'Dashboard',
  'nav.attendance': 'Attendance',
  'nav.payments': 'Payments',
  'nav.worker.payment': 'Worker Payment',
  'language.toggle.label': 'हिन्दी',

  // Dashboard Page
  'dashboard.title': 'Worker Dashboard',
  'dashboard.add.worker': 'Add Worker',
  'dashboard.edit.worker': 'Edit',
  'dashboard.delete.worker': 'Delete',
  'worker.wage.per.day': '/ day',
  'worker.due': 'Due',
  'worker.paid': 'Paid',
  'worker.balance': 'Balance',

  // Add Worker Dialog
  'dialog.add.worker.title': 'Add New Worker',
  'dialog.add.worker.description': "Enter the details of the new worker. Click save when you're done.",
  'dialog.edit.worker.title': 'Edit Worker',
  'dialog.edit.worker.description': "Update the worker's details. Click save when you're done.",
  'form.name.label': 'Name',
  'form.name.placeholder': 'e.g. Ramesh Kumar',
  'form.phone.label': 'Phone Number',
  'form.phone.placeholder': 'e.g. 9876543210',
  'form.daily.wage.label': 'Daily Wage (₹)',
  'form.daily.wage.placeholder': 'e.g. 500',
  'form.photo.label': 'Photo',
  'form.generate.photo': 'Generate',
  'form.cancel': 'Cancel',
  'form.save': 'Save Changes',

  // Delete Worker Dialog
  'dialog.delete.worker.title': 'Are you sure you want to delete this worker?',
  'dialog.delete.worker.description_p1': 'This will permanently delete the record for',
  'dialog.delete.worker.description_p2': 'This action cannot be undone.',
  
  // Delete Payment Dialog
  'dialog.delete.payment.title': 'Are you sure you want to delete this payment?',
  'dialog.delete.payment.description': 'This will permanently delete the payment record of ₹{amount} for {workerName}. This action cannot be undone.',

  // Attendance Page
  'attendance.title': 'Daily Attendance',
  'attendance.date.label': "Date",
  'attendance.mark.present': 'Present',
  'attendance.mark.absent': 'Absent',
  'attendance.checked.in.at': 'Checked in at',
  'attendance.checked.out.at': 'Checked out at',
  'attendance.check.in': 'Check-in',
  'attendance.check.out': 'Check-out',
  'attendance.status.present': 'Present',
  'attendance.status.absent': 'Absent',
  'attendance.status.half-day': 'Half Day',
  'attendance.not.marked': 'Not Marked',
  'status.present': 'Present',

  // Payments Page
  'payments.title': 'Payment History',
  'payments.record.payment': 'Record Payment',
  'payments.table.worker': 'Worker',
  'payments.table.status': 'Status',
  'payments.status.paid': 'Paid',
  'payments.status.due': 'Due',

  // Worker Payment Page
  'worker.payment.title': 'Worker Payment Summary',
  'worker.payment.table.worker': 'Worker',
  'worker.payment.table.present.days': 'Present Days',
  'worker.payment.table.half.days': 'Half Days',
  'worker.payment.table.total.earned': 'Total Earned',
  'worker.payment.table.total.paid': 'Total Paid',
  'worker.payment.table.balance': 'Balance',

  // Add/Edit Payment Dialog
  'dialog.record.payment.title': 'Record a Payment',
  'dialog.record.payment.description': "Select a worker and enter the amount paid.",
  'dialog.edit.payment.title': 'Edit Payment',
  'dialog.edit.payment.description': "Update the details of this payment record.",
  'form.worker.label': 'Worker',
  'form.worker.placeholder': 'Select a worker',
  'form.payment.amount.label': 'Amount',
  'form.payment.amount.placeholder': 'e.g. 1000',
  'form.payment.note.label': 'Note',
  'form.payment.note.placeholder': 'e.g. Advance payment',


  // Toasts
  'toast.worker.added.title': 'Worker Added',
  'toast.worker.added.description': '{workerName} has been successfully added.',
  'toast.worker.updated.title': 'Worker Updated',
  'toast.worker.updated.description': "{workerName}'s details have been updated.",
  'toast.worker.deleted.title': 'Worker Deleted',
  'toast.worker.deleted.description': '{workerName} has been removed.',
  'toast.attendance.updated.title': 'Attendance Updated',
  'toast.attendance.updated.description': '{workerName} marked as {status}.',
  'toast.attendance.checked.out.title': 'Checked Out',
  'toast.attendance.checked.out.description': '{workerName} has been checked out.',
  'toast.payment.recorded.title': 'Payment Recorded',
  'toast.payment.recorded.description': '₹{amount} paid to {workerName}.',
  'toast.payment.updated.title': 'Payment Updated',
  'toast.payment.updated.description': 'Payment of ₹{amount} for {workerName} has been updated.',
  'toast.payment.deleted.title': 'Payment Deleted',
  'toast.payment.deleted.description': 'Payment of ₹{amount} for {workerName} has been deleted.',
};

export type UIContentKeys = keyof typeof uiContent;
