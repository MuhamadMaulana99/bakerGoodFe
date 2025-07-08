// utils/exportReport.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportToPDF = (data: any) => {
  const doc = new jsPDF();

  doc.text("Laporan Pengaduan", 14, 15);
  doc.setFontSize(10);
  doc.text(`Tanggal Export: ${new Date().toLocaleDateString()}`, 14, 22);

  autoTable(doc, {
    startY: 30,
    head: [["Kategori", "Jumlah", "Persentase"]],
    body: data.byCategory.map((item: any) => [
      item.category,
      item.count,
      `${item.percentage}%`,
    ]),
  });

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [["Status", "Jumlah", "Persentase"]],
    body: data.byStatus.map((item: any) => [
      item.status,
      item.count,
      `${item.percentage}%`,
    ]),
  });

  doc.save(`laporan_pengaduan_${Date.now()}.pdf`);
};

export const exportToExcel = (data: any) => {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Ringkasan Kategori
  const kategoriSheet = XLSX.utils.json_to_sheet(
    data.byCategory.map((item: any) => ({
      Kategori: item.category,
      Jumlah: item.count,
      Persentase: `${item.percentage}%`,
    }))
  );
  XLSX.utils.book_append_sheet(wb, kategoriSheet, "Kategori");

  // Sheet 2: Ringkasan Status
  const statusSheet = XLSX.utils.json_to_sheet(
    data.byStatus.map((item: any) => ({
      Status: item.status,
      Jumlah: item.count,
      Persentase: `${item.percentage}%`,
    }))
  );
  XLSX.utils.book_append_sheet(wb, statusSheet, "Status");

  // Sheet 3: Ringkasan Produk
  const produkSheet = XLSX.utils.json_to_sheet(
    data.byProduct.map((item: any) => ({
      Produk: item.product,
      Jumlah: item.count,
      Persentase: `${item.percentage}%`,
    }))
  );
  XLSX.utils.book_append_sheet(wb, produkSheet, "Produk");

  // Sheet 4: Bulanan
  const bulananSheet = XLSX.utils.json_to_sheet(
    data.monthly.map((item: any) => ({
      Bulan: item.month,
      Pengaduan: item.complaints,
      Selesai: item.resolved,
    }))
  );
  XLSX.utils.book_append_sheet(wb, bulananSheet, "Bulanan");

  const excelBuffer = XLSX.write(wb, {
    bookType: "xlsx",
    type: "array",
  });

  saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), `laporan_pengaduan_${Date.now()}.xlsx`);
};
