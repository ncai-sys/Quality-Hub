import * as XLSX from 'xlsx';
import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType, 
  AlignmentType, 
  HeadingLevel, 
  BorderStyle 
} from 'docx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MenuPlan, HACCPLog, Workspace, AKGTarget, MotherRecord, ToddlerRecord } from '../types';
import { MASTER_BUMBU_DASAR } from '../data/masterData';

// Helper to trigger browser file download
function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * EXCEL (.xlsx) EXPORT WITH NATIVE FORMULAS
 * e.g., Net Batch Kg = =C7 * portionCount / 1000
 * Gross Batch Kg = =E7 * (100 / D7)
 */
export function exportMenuToExcel(menu: MenuPlan, workspace: Workspace, targetAKG: AKGTarget) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Master Perhitungan Gramatur & Formula Pengadaan
  const headers = [
    ['BADAN GIZI NASIONAL REPUBLIK INDONESIA'],
    [`SISTEM MANAJEMEN OPERASIONAL SPPG - ${workspace.name}`],
    [`Lokasi: ${workspace.location} | Kode Unit: ${workspace.code}`],
    [`Menu: ${menu.name} | Kelompok Target: ${targetAKG.name}`],
    [`Jumlah Sasaran: ${menu.portionCount} Porsi | Tanggal: ${menu.date}`],
    [],
    [
      'No', 
      'Nama Bahan Pangan (TKPI)', 
      'Golongan', 
      'Netto /Porsi (g)', 
      'BDD (%)', 
      'Total Netto Batch (kg)', 
      'Bruto /Porsi (g)', 
      'Total Bruto Batch (kg)', 
      'Estimasi Harga /kg (Rp)', 
      'Total Anggaran (Rp)'
    ]
  ];

  const wsData: any[][] = [...headers];

  const startRowIndex = 8; // Row 8 in 1-based indexing (where data starts)

  menu.ingredients.forEach((item, idx) => {
    const rowNum = startRowIndex + idx;
    // Row layout:
    // Col A: No
    // Col B: Nama
    // Col C: Golongan
    // Col D: Netto / Porsi (g)
    // Col E: BDD (%)
    // Col F: Total Netto Batch (kg) -> FORMULA: =D{row} * portionCount / 1000
    // Col G: Bruto / Porsi (g) -> FORMULA: =D{row} * (100 / E{row})
    // Col H: Total Bruto Batch (kg) -> FORMULA: =G{row} * portionCount / 1000
    // Col I: Estimasi Harga /kg (Rp)
    // Col J: Total Anggaran (Rp) -> FORMULA: =H{row} * I{row}

    wsData.push([
      idx + 1,
      item.foodName,
      item.category,
      item.netWeightGrams,
      item.bdd,
      { t: 'n', f: `D${rowNum}*${menu.portionCount}/1000` },
      { t: 'n', f: `D${rowNum}*(100/E${rowNum})` },
      { t: 'n', f: `G${rowNum}*${menu.portionCount}/1000` },
      item.pricePerKg,
      { t: 'n', f: `H${rowNum}*I${rowNum}` }
    ]);
  });

  // Total Summary Row
  const lastDataRow = startRowIndex + menu.ingredients.length - 1;
  const totalRow = lastDataRow + 1;
  wsData.push([
    'TOTAL',
    '',
    '',
    { t: 'n', f: `SUM(D${startRowIndex}:D${lastDataRow})` },
    '',
    { t: 'n', f: `SUM(F${startRowIndex}:F${lastDataRow})` },
    { t: 'n', f: `SUM(G${startRowIndex}:G${lastDataRow})` },
    { t: 'n', f: `SUM(H${startRowIndex}:H${lastDataRow})` },
    '',
    { t: 'n', f: `SUM(J${startRowIndex}:J${lastDataRow})` }
  ]);

  // Add Bumbu Dasar calculation if active
  if (menu.selectedBumbu !== 'NONE') {
    const bumbuConfig = MASTER_BUMBU_DASAR.find(b => b.id === menu.selectedBumbu);
    if (bumbuConfig) {
      wsData.push([]);
      wsData.push([`FORMULA BUMBU DASAR: ${bumbuConfig.name}`]);
      wsData.push(['Komposisi Bumbu', 'Persentase (%)', 'Gram / Porsi', `Total Batch (${menu.portionCount} porsi) kg`]);
      bumbuConfig.ingredients.forEach(bi => {
        const gPerPorsi = (menu.bumbuGramsPerPortion * bi.percentage) / 100;
        const totalKg = (gPerPorsi * menu.portionCount) / 1000;
        wsData.push([bi.name, `${bi.percentage}%`, Number(gPerPorsi.toFixed(1)), Number(totalKg.toFixed(2))]);
      });
    }
  }

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Set column widths for readability
  ws['!cols'] = [
    { wch: 6 },  // No
    { wch: 32 }, // Nama
    { wch: 18 }, // Golongan
    { wch: 16 }, // Netto/porsi
    { wch: 10 }, // BDD
    { wch: 22 }, // Total Netto kg
    { wch: 16 }, // Bruto/porsi
    { wch: 22 }, // Total Bruto kg
    { wch: 20 }, // Harga/kg
    { wch: 22 }  // Total Rp
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Formulasi & Pengadaan Pangan');

  // Generate buffer and trigger download
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  triggerDownload(blob, `BGN_Formula_Pengadaan_${workspace.code}_${menu.date}.xlsx`);
}

/**
 * WORD (.docx) EXPORT COMPLETE WITH OFFICIAL KOP & SIGNATURE BLOCKS
 */
export async function exportReportToWord(
  menu: MenuPlan, 
  workspace: Workspace, 
  haccpLogs: HACCPLog[], 
  targetAKG: AKGTarget,
  macroCalculated: { energy: number; protein: number; fat: number; carbs: number; iron: number; calcium: number }
) {
  const tableRows = [
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Komponen Menu & Bahan', bold: true })] })] }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Golongan', bold: true })] })] }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Netto/Porsi', bold: true })] })] }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'BDD (%)', bold: true })] })] }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Bruto/Porsi', bold: true })] })] }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `Total Bruto (${menu.portionCount} Porsi)`, bold: true })] })] }),
      ]
    }),
    ...menu.ingredients.map(ing => {
      const grossBatchKg = (ing.grossWeightGrams * menu.portionCount / 1000).toFixed(2);
      return new TableRow({
        children: [
          new TableCell({ children: [new Paragraph(ing.foodName)] }),
          new TableCell({ children: [new Paragraph(ing.category)] }),
          new TableCell({ children: [new Paragraph(`${ing.netWeightGrams} g`)] }),
          new TableCell({ children: [new Paragraph(`${ing.bdd} %`)] }),
          new TableCell({ children: [new Paragraph(`${ing.grossWeightGrams.toFixed(1)} g`)] }),
          new TableCell({ children: [new Paragraph(`${grossBatchKg} kg`)] }),
        ]
      });
    })
  ];

  const haccpRows = [
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Titik Kritis (CCP)', bold: true })] })] }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Tahapan Operasional', bold: true })] })] }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Standar Kritis BGN', bold: true })] })] }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Hasil Ukur', bold: true })] })] }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Kepatuhan & Tindakan Korektif', bold: true })] })] }),
      ]
    }),
    ...haccpLogs.map(log => {
      const statusText = log.isCompliant ? '[SESUAI/LOLOS]' : `[DEVIASI] ${log.correctiveAction || 'Pemanasan/penanganan ulang'}`;
      return new TableRow({
        children: [
          new TableCell({ children: [new Paragraph(log.ccpType)] }),
          new TableCell({ children: [new Paragraph(log.stepName)] }),
          new TableCell({ children: [new Paragraph(log.standardThreshold)] }),
          new TableCell({ children: [new Paragraph(`${log.measuredValue} ${log.unit}`)] }),
          new TableCell({ children: [new Paragraph(statusText)] }),
        ]
      });
    })
  ];

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // KOP SURAT RESMI BGN
        new Paragraph({
          text: 'BADAN GIZI NASIONAL REPUBLIK INDONESIA',
          alignment: AlignmentType.CENTER,
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 60 }
        }),
        new Paragraph({
          text: `SATUAN PELAYANAN PROGRAM GIZI (SPPG) - ${workspace.name.toUpperCase()}`,
          alignment: AlignmentType.CENTER,
          spacing: { after: 40 }
        }),
        new Paragraph({
          text: `${workspace.location} | Kode Registrasi: ${workspace.code}`,
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 }
        }),

        new Paragraph({
          text: 'LAPORAN RESMI MUTU GIZI & KESELAMATAN PANGAN (HACCP)',
          alignment: AlignmentType.CENTER,
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 120 }
        }),

        new Paragraph({
          text: `Tanggal Operasional: ${menu.date} | Target Sasaran: ${targetAKG.name} | Skala Produksi: ${menu.portionCount} Porsi`,
          spacing: { after: 100 }
        }),
        new Paragraph({
          text: `Nama Menu Terjadwal: ${menu.name}`,
          spacing: { after: 150 }
        }),

        // Profil Gizi per Porsi
        new Paragraph({
          text: '1. Verifikasi Kecukupan Gizi per Porsi vs Target AKG 2026',
          heading: HeadingLevel.HEADING_3,
          spacing: { after: 100 }
        }),
        new Paragraph({
          text: `• Energi Total: ${macroCalculated.energy.toFixed(0)} kcal (Target: ${targetAKG.energyKcal} kcal - ${((macroCalculated.energy/targetAKG.energyKcal)*100).toFixed(0)}%)`
        }),
        new Paragraph({
          text: `• Protein: ${macroCalculated.protein.toFixed(1)} g (Target: ${targetAKG.proteinG} g - ${((macroCalculated.protein/targetAKG.proteinG)*100).toFixed(0)}%)`
        }),
        new Paragraph({
          text: `• Lemak: ${macroCalculated.fat.toFixed(1)} g (Target: ${targetAKG.fatG} g)`
        }),
        new Paragraph({
          text: `• Karbohidrat: ${macroCalculated.carbs.toFixed(1)} g (Target: ${targetAKG.carbsG} g)`
        }),
        new Paragraph({
          text: `• Zat Besi (Fe): ${macroCalculated.iron.toFixed(2)} mg | Kalsium: ${macroCalculated.calcium.toFixed(0)} mg`,
          spacing: { after: 180 }
        }),

        // Tabel Rincian Menu & Bahan Baku
        new Paragraph({
          text: '2. Daftar Kebutuhan Bahan Baku & Formulasi Dapur SPPG',
          heading: HeadingLevel.HEADING_3,
          spacing: { after: 100 }
        }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: tableRows
        }),

        // Tabel Verifikasi HACCP
        new Paragraph({
          text: '3. Rekapitulasi Verifikasi Titik Kendali Kritis (HACCP & FSMS)',
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 100 }
        }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: haccpRows
        }),

        // SIGNATURE BLOCKS (3 PENANGGUNG JAWAB)
        new Paragraph({
          text: '4. Lembar Pengesahan Otoritas Mutu SPPG',
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 260, after: 120 }
        }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
            insideHorizontal: { style: BorderStyle.NONE },
            insideVertical: { style: BorderStyle.NONE },
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({ text: 'Mengetahui,', alignment: AlignmentType.CENTER }),
                    new Paragraph({ text: 'Kepala Satuan Pelayanan (SPPG)', alignment: AlignmentType.CENTER }),
                    new Paragraph({ text: '\n\n\n\n( Tanda Tangan & Cap Digital )\n', alignment: AlignmentType.CENTER }),
                    new Paragraph({ children: [new TextRun({ text: workspace.headOfKitchen, bold: true })], alignment: AlignmentType.CENTER }),
                    new Paragraph({ text: 'NIP / NRP Resmi BGN', alignment: AlignmentType.CENTER }),
                  ]
                }),
                new TableCell({
                  children: [
                    new Paragraph({ text: 'Diperiksa Oleh,', alignment: AlignmentType.CENTER }),
                    new Paragraph({ text: 'Ahli Gizi Penanggung Jawab', alignment: AlignmentType.CENTER }),
                    new Paragraph({ text: '\n\n\n\n( Tanda Tangan & Cap Digital )\n', alignment: AlignmentType.CENTER }),
                    new Paragraph({ children: [new TextRun({ text: workspace.nutritionistName, bold: true })], alignment: AlignmentType.CENTER }),
                    new Paragraph({ text: 'STR Tenaga Gizi Terdaftar', alignment: AlignmentType.CENTER }),
                  ]
                }),
                new TableCell({
                  children: [
                    new Paragraph({ text: 'Diverifikasi Oleh,', alignment: AlignmentType.CENTER }),
                    new Paragraph({ text: 'Pengawas Keamanan Pangan (QA)', alignment: AlignmentType.CENTER }),
                    new Paragraph({ text: '\n\n\n\n( Tanda Tangan & Cap Digital )\n', alignment: AlignmentType.CENTER }),
                    new Paragraph({ children: [new TextRun({ text: workspace.qaOfficerName, bold: true })], alignment: AlignmentType.CENTER }),
                    new Paragraph({ text: 'Auditor HACCP / FSMS BGN', alignment: AlignmentType.CENTER }),
                  ]
                })
              ]
            })
          ]
        })
      ]
    }]
  });

  const blob = await Packer.toBlob(doc);
  triggerDownload(blob, `Laporan_BGN_SPPG_${workspace.code}_${menu.date}.docx`);
}

/**
 * PDF (.pdf) EXPORT - PRINT-READY OFFICIAL REPORT
 */
export function exportReportToPDF(
  menu: MenuPlan, 
  workspace: Workspace, 
  haccpLogs: HACCPLog[], 
  targetAKG: AKGTarget,
  macroCalculated: { energy: number; protein: number; fat: number; carbs: number; iron: number; calcium: number }
) {
  const doc = new jsPDF('p', 'mm', 'a4');

  // Header BGN Institutional Banner
  doc.setFillColor(0, 82, 204); // Official BGN Blue #0052CC
  doc.rect(0, 0, 210, 26, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('BADAN GIZI NASIONAL REPUBLIK INDONESIA', 105, 11, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Sistem Manajemen Operasional & Kepatuhan HACCP SPPG | Kode: ${workspace.code}`, 105, 18, { align: 'center' });

  // Subheader
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`LEMBAR VERIFIKASI OPERASIONAL HARIAN`, 14, 34);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Satuan Kerja: ${workspace.name}`, 14, 40);
  doc.text(`Alamat: ${workspace.location}`, 14, 45);
  doc.text(`Tanggal Produksi: ${menu.date} | Skala Porsi: ${menu.portionCount.toLocaleString()} Porsi | Sasaran: ${targetAKG.name}`, 14, 50);
  doc.text(`Menu: ${menu.name}`, 14, 55);

  // Nutrition Card Summary (Macro & Micronutrients)
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, 60, 182, 20, 2, 2, 'F');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 82, 204);
  doc.text('PROFIL NILAI GIZI PER PORSI (vs TARGET BGN 2026):', 18, 66);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);
  const eAchieve = ((macroCalculated.energy / targetAKG.energyKcal) * 100).toFixed(0);
  const pAchieve = ((macroCalculated.protein / targetAKG.proteinG) * 100).toFixed(0);
  doc.text(`Energi: ${macroCalculated.energy.toFixed(0)} kcal (${eAchieve}%) | Protein: ${macroCalculated.protein.toFixed(1)} g (${pAchieve}%) | Lemak: ${macroCalculated.fat.toFixed(1)} g | Karbohidrat: ${macroCalculated.carbs.toFixed(1)} g`, 18, 72);
  doc.text(`Zat Besi: ${macroCalculated.iron.toFixed(2)} mg | Kalsium: ${macroCalculated.calcium.toFixed(0)} mg | Standar Porsi: 35% AKG Harian Makan Siang`, 18, 77);

  // Table 1: Ingredients & Gross Procurement
  const ingRows = menu.ingredients.map((ing, idx) => {
    const grossBatchKg = (ing.grossWeightGrams * menu.portionCount / 1000).toFixed(2);
    const estTotalRp = ((ing.grossWeightGrams * menu.portionCount / 1000) * ing.pricePerKg).toLocaleString('id-ID');
    return [
      (idx + 1).toString(),
      ing.foodName,
      ing.category,
      `${ing.netWeightGrams} g`,
      `${ing.bdd}%`,
      `${ing.grossWeightGrams.toFixed(1)} g`,
      `${grossBatchKg} kg`,
      `Rp ${estTotalRp}`
    ];
  });

  autoTable(doc, {
    startY: 84,
    head: [['No', 'Bahan Pangan (TKPI)', 'Golongan', 'Netto', 'BDD', 'Bruto/Porsi', `Bruto Batch (${menu.portionCount} porsi)`, 'Est. Anggaran']],
    body: ingRows,
    theme: 'grid',
    headStyles: { fillColor: [10, 37, 64], fontSize: 8, textColor: 255 },
    styles: { fontSize: 7.5, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 8 },
      1: { cellWidth: 42 },
      2: { cellWidth: 26 },
      3: { cellWidth: 16 },
      4: { cellWidth: 12 },
      5: { cellWidth: 22 },
      6: { cellWidth: 28 },
      7: { cellWidth: 28 }
    }
  });

  const nextY = (doc as any).lastAutoTable.finalY + 6;

  // Table 2: HACCP Critical Control Points
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('VERIFIKASI TITIK KENDALI KRITIS (CCP) & KEAMANAN PANGAN:', 14, nextY);

  const haccpTableRows = haccpLogs.map(log => [
    log.ccpType,
    log.stepName,
    log.standardThreshold,
    `${log.measuredValue} ${log.unit}`,
    log.isCompliant ? 'SESUAI (PASS)' : `DEVIASI: ${log.correctiveAction || 'Koreksi Suhu'}`
  ]);

  autoTable(doc, {
    startY: nextY + 3,
    head: [['Titik Kritis', 'Tahapan Alur', 'Batas Kritis Standar BGN', 'Hasil Ukur', 'Status & Tindakan Korektif']],
    body: haccpTableRows,
    theme: 'grid',
    headStyles: { fillColor: [0, 82, 204], fontSize: 8, textColor: 255 },
    styles: { fontSize: 7.5, cellPadding: 2 }
  });

  const signY = (doc as any).lastAutoTable.finalY + 12;

  // Signature Blocks
  if (signY < 245) {
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    
    // Left
    doc.text('Kepala Satuan Pelayanan (SPPG):', 25, signY, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.text(workspace.headOfKitchen, 25, signY + 20, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.text('NIP/NRP Resmi BGN', 25, signY + 24, { align: 'center' });

    // Middle
    doc.text('Ahli Gizi Penanggung Jawab:', 105, signY, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.text(workspace.nutritionistName, 105, signY + 20, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.text('STR Tenaga Gizi Terdaftar', 105, signY + 24, { align: 'center' });

    // Right
    doc.text('Petugas Mutu & Keamanan Pangan (QA):', 175, signY, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.text(workspace.qaOfficerName, 175, signY + 20, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.text('Auditor HACCP / FSMS BGN', 175, signY + 24, { align: 'center' });
  }

  doc.save(`Laporan_BGN_SPPG_${workspace.code}_${menu.date}.pdf`);
}

// Convenient Aliases
export const exportMenuToDocx = (
  menu: MenuPlan, 
  workspace: Workspace, 
  haccpLogs: HACCPLog[], 
  targetAKG: AKGTarget,
  macroCalculated?: { energy: number; protein: number; fat: number; carbs: number; iron: number; calcium: number }
) => {
  const defaultMacro = macroCalculated || { energy: 650, protein: 25, fat: 20, carbs: 90, iron: 5, calcium: 300 };
  return exportReportToWord(menu, workspace, haccpLogs, targetAKG, defaultMacro);
};

export const exportReportToPdf = (
  menu: MenuPlan, 
  workspace: Workspace, 
  haccpLogs: HACCPLog[], 
  targetAKG: AKGTarget,
  macroCalculated?: { energy: number; protein: number; fat: number; carbs: number; iron: number; calcium: number }
) => {
  const defaultMacro = macroCalculated || { energy: 650, protein: 25, fat: 20, carbs: 90, iron: 5, calcium: 300 };
  return exportReportToPDF(menu, workspace, haccpLogs, targetAKG, defaultMacro);
};

