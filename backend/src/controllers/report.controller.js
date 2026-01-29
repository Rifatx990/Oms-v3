// backend/src/controllers/report.controller.js
exports.generateAdvancedReport = async (req, res) => {
  try {
    const {
      type,
      startDate,
      endDate,
      branchId,
      format = 'json'
    } = req.body;

    const match = { createdBy: req.userId };
    if (branchId) match.branch = branchId;
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) match.createdAt.$lte = new Date(endDate);
    }

    let report;

    switch (type) {
      case 'profit-loss':
        report = await generateProfitLossReport(match);
        break;
      case 'worker-performance':
        report = await generateWorkerPerformanceReport(match);
        break;
      case 'customer-analysis':
        report = await generateCustomerAnalysisReport(match);
        break;
      case 'inventory':
        report = await generateInventoryReport(match);
        break;
      default:
        report = await generateSalesReport(match);
    }

    if (format === 'pdf') {
      const pdfBuffer = await generatePDFReport(report, type);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${type}-report.pdf`);
      return res.send(pdfBuffer);
    }

    if (format === 'excel') {
      const excelBuffer = await generateExcelReport(report, type);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=${type}-report.xlsx`);
      return res.send(excelBuffer);
    }

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
