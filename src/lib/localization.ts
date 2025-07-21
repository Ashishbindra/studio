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
  'form.photo.url.label': 'Photo URL',
  'form.photo.url.placeholder': 'https://placehold.co/100x100.png',
  'form.cancel': 'Cancel',
  'form.save': 'Save Changes',

  // Delete Worker Dialog
  'dialog.delete.worker.title': 'Are you sure you want to delete this worker?',
  'dialog.delete.worker.description_p1': 'This will permanently delete the record for',
  'dialog.delete.worker.description_p2': 'This action cannot be undone.',

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
  'payments.record.payment': 'Record Payment',
  'payments.table.worker': 'Worker',
  'payments.table.status': 'Status',
  'payments.status.paid': 'Paid',
  'payments.status.due': 'Due',

  // Add Payment Dialog
  'dialog.record.payment.title': 'Record a Payment',
  'dialog.record.payment.description': "Select a worker and enter the amount paid.",
  'form.worker.label': 'Worker',
  'form.worker.placeholder': 'Select a worker',
  'form.payment.amount.label': 'Amount (₹)',
  'form.payment.amount.placeholder': 'e.g. 1000',

  // Toasts
  'toast.worker.added.title': 'Worker Added',
  'toast.worker.added.description': '{workerName} has been successfully added.',
  'toast.worker.updated.title': 'Worker Updated',
  'toast.worker.updated.description': "{workerName}'s details have been updated.",
  'toast.worker.deleted.title': 'Worker Deleted',
  'toast.worker.deleted.description': '{workerName} has been removed.',
  'toast.attendance.marked.present.title': 'Marked Present',
  'toast.attendance.marked.present.description': '{workerName} marked as present.',
  'toast.attendance.marked.absent.title': 'Marked Absent',
  'toast.attendance.marked.absent.description': '{workerName} marked as absent.',
  'toast.attendance.checked.out.title': 'Checked Out',
  'toast.attendance.checked.out.description': '{workerName} has been checked out.',
  'toast.payment.recorded.title': 'Payment Recorded',
  'toast.payment.recorded.description': '₹{amount} paid to {workerName}.',
};

export type UIContentKeys = keyof typeof uiContent;
