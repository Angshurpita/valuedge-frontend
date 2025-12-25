const API_BASE_URL = "https://valuedge-backend.onrender.com";

export async function runDCF(input: any) {
  const response = await fetch(`${API_BASE_URL}/valuation/dcf`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text);
  }

  return response.json();
}

export async function runSensitivity(input: any) {
  const response = await fetch(`${API_BASE_URL}/valuation/sensitivity`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text);
  }

  return response.json();
}

export async function runComps(data: any) {
  const res = await fetch(`${API_BASE_URL}/valuation/comps`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return res.json();
}

export async function exportPDF(data: any) {
  const res = await fetch(`${API_BASE_URL}/export/pdf`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("PDF export failed");

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "ValuEdge_Valuation_Report.pdf";
  a.click();

  window.URL.revokeObjectURL(url);
}

