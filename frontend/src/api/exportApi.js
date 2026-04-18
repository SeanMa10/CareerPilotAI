import api from "./axios";

const REPORT_FILE_NAMES = {
  resume_review: "resume_review_report.pdf",
  skill_gap: "skill_gap_report.pdf",
  roadmap: "roadmap_report.pdf",
};

export async function downloadAiReport(reportType) {
  const response = await api.get(`/exports/report/${reportType}`, {
    responseType: "blob",
  });

  const blob = new Blob([response.data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = REPORT_FILE_NAMES[reportType] || "careerpilot_report.pdf";
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
}
