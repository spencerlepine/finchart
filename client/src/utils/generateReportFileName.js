const generateReportFileName = (reportTitle, timestamp) => {
  const timeString = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(timestamp);

  return `${timeString}_${reportTitle.replace(/[ ]/, '_')}_FinChart.json`;
};

export default generateReportFileName;
