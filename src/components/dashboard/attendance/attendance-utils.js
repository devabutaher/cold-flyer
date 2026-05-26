export const ATTENDANCE_STATUS_MAP = {
  present: { label: "Present", className: "bg-green-500/10 text-green-600" },
  absent: { label: "Absent", className: "bg-red-500/10 text-red-600" },
  late: { label: "Late", className: "bg-amber-500/10 text-amber-600" },
  leave: { label: "On Leave", className: "bg-blue-500/10 text-blue-600" },
};

export function calcDuration(inTime, outTime) {
  const parse = (t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  const diff = parse(outTime) - parse(inTime);
  if (diff <= 0) return "\u2014";
  const hrs = Math.floor(diff / 60);
  const mins = diff % 60;
  return `${hrs}h ${mins}m`;
}

export function mapHistoryRow(r) {
  return {
    workerName: r.workerName || "\u2014",
    date: r.date ? new Date(r.date).toLocaleDateString() : "\u2014",
    inTime: r.inTime || "\u2014",
    outTime: r.outTime || "\u2014",
    location: r.location || "\u2014",
    task: r.task || "\u2014",
    totalTime: r.inTime && r.outTime ? calcDuration(r.inTime, r.outTime) : "\u2014",
  };
}

export const HISTORY_PDF_COLUMNS = [
  { header: "Worker", accessorKey: "workerName", width: 1.5 },
  { header: "Date", accessorKey: "date", width: 1.2 },
  { header: "In Time", accessorKey: "inTime", width: 1 },
  { header: "Out Time", accessorKey: "outTime", width: 1 },
  { header: "Location", accessorKey: "location", width: 1.5 },
  { header: "Task", accessorKey: "task", width: 1.5 },
  { header: "Total Time", accessorKey: "totalTime", width: 1 },
];
