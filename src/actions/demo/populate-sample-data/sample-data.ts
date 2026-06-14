const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000)
const daysFromNow = (n: number) => new Date(Date.now() + n * 24 * 60 * 60 * 1000)

export const SAMPLE_PROJECTS = [
  {
    name: "Website Redesign",
    description: "Modernize the company website with a new design system",
    color: "#3b82f6",
    tags: ["design", "frontend"],
    tasks: [
      { title: "Create wireframes for homepage", status: "DONE" as const, priority: "HIGH" as const, dueDate: daysAgo(14) },
      { title: "Design new color palette", status: "DONE" as const, priority: "MEDIUM" as const, dueDate: daysAgo(7) },
      { title: "Build responsive navigation", status: "IN_PROGRESS" as const, priority: "HIGH" as const, dueDate: daysAgo(3) },
      { title: "Implement contact form", status: "TODO" as const, priority: "MEDIUM" as const, dueDate: daysFromNow(7) },
      { title: "SEO optimization", status: "TODO" as const, priority: "LOW" as const, dueDate: daysFromNow(21) },
    ],
  },
  {
    name: "Mobile App v2",
    description: "Second major release with offline support and push notifications",
    color: "#8b5cf6",
    tags: ["mobile", "backend"],
    tasks: [
      { title: "User authentication flow", status: "DONE" as const, priority: "HIGH" as const, dueDate: daysAgo(21) },
      { title: "Push notification system", status: "IN_PROGRESS" as const, priority: "HIGH" as const, dueDate: daysAgo(7) },
      { title: "Offline mode support", status: "IN_PROGRESS" as const, priority: "MEDIUM" as const, dueDate: daysFromNow(5) },
      { title: "Performance profiling", status: "TODO" as const, priority: "MEDIUM" as const, dueDate: daysFromNow(14) },
      { title: "App store submission", status: "TODO" as const, priority: "LOW" as const, dueDate: daysFromNow(30) },
    ],
  },
  {
    name: "Data Pipeline",
    description: "ETL pipeline for analytics dashboards and automated reporting",
    color: "#10b981",
    tags: ["backend", "data"],
    tasks: [
      { title: "Set up data warehouse", status: "DONE" as const, priority: "HIGH" as const, dueDate: daysAgo(28) },
      { title: "Build ingestion scripts", status: "DONE" as const, priority: "HIGH" as const, dueDate: daysAgo(14) },
      { title: "Create transformation rules", status: "IN_PROGRESS" as const, priority: "MEDIUM" as const, dueDate: daysAgo(14) },
      { title: "Schedule automated reports", status: "TODO" as const, priority: "MEDIUM" as const, dueDate: daysFromNow(10) },
      { title: "Add data quality checks", status: "TODO" as const, priority: "LOW" as const, dueDate: daysFromNow(21) },
    ],
  },
]
