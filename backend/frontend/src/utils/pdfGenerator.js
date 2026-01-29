import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateOrderInvoice = (order) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(44, 62, 80);
  doc.text('মেহেদী টেইলার্স & ফেব্রিক্স', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setTextColor(128, 128, 128);
  doc.text('Dhonaid, Ashulia, Savar, Dhaka | 01720267213, 01812249596', 105, 30, { align: 'center' });
  
  // Invoice title
  doc.setFontSize(18);
  doc.setTextColor(231, 76, 60);
  doc.text('অর্ডার ইনভয়েস', 105, 45, { align: 'center' });
  
  // Order details
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  const details = [
    ['অর্ডার আইডি', order.orderId],
    ['অর্ডার তারিখ', new Date(order.orderDate).toLocaleDateString('bn-BD')],
    ['ডেলিভারি তারিখ', new Date(order.deliveryDate).toLocaleDateString('bn-BD')],
    ['গ্রাহকের নাম', order.customerName],
    ['ফোন নম্বর', order.phone],
    ['ঠিকানা', order.address],
  ];
  
  doc.autoTable({
    startY: 55,
    head: [['বিবরণ', 'মতামত']],
    body: details,
    theme: 'grid',
    headStyles: { fillColor: [44, 62, 80] },
    margin: { left: 20, right: 20 },
  });
  
  // Order items table
  const items = [
    ['আইটেম', order.itemName],
    ['পরিমাণ', order.quantity],
    ['মাপ', order.measurements],
    ['নোট', order.notes || 'N/A'],
    ['মোট মূল্য', `৳ ${order.totalAmount}`],
    ['অগ্রিম', `৳ ${order.advancePaid}`],
    ['বাকি', `৳ ${order.dueAmount}`],
    ['স্ট্যাটাস', order.status],
  ];
  
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 10,
    head: [['বিবরণ', 'মতামত']],
    body: items,
    theme: 'grid',
    headStyles: { fillColor: [52, 152, 219] },
    margin: { left: 20, right: 20 },
  });
  
  // Footer
  const finalY = doc.lastAutoTable.finalY + 20;
  doc.setFontSize(10);
  doc.text('স্বাক্ষর:', 40, finalY);
  doc.text('________________', 40, finalY + 10);
  doc.text('গ্রাহক', 40, finalY + 20);
  
  doc.text('স্বাক্ষর:', 150, finalY);
  doc.text('________________', 150, finalY + 10);
  doc.text('দোকান', 150, finalY + 20);
  
  // Terms and conditions
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('দ্রষ্টব্য: ডেলিভারির পর ৩ দিনের মধ্যে অভিযোগ গ্রহণ করা হবে।', 105, finalY + 40, { align: 'center' });
  
  return doc;
};

export const generateDueReceipt = (due, transactions = []) => {
  const doc = new jsPDF();
  
  // Similar implementation for due receipt
  // ...
  
  return doc;
};

export const generateReportPDF = (reportData, type) => {
  const doc = new jsPDF();
  
  // Implementation for different report types
  // ...
  
  return doc;
};

export const exportToExcel = (data, filename) => {
  // Implementation using exceljs
  // ...
};
