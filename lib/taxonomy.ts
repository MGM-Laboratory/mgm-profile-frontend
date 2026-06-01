// Starter tech-stack taxonomy (plan §4.5): grouped by domain so members rarely
// hit a missing item, and extensible (the picker lets users add custom entries).
// Tech stack is SEPARATE from skills and carries a per-item proficiency.

export interface TechGroup {
  domain: string;
  items: string[];
}

export const TECH_TAXONOMY: TechGroup[] = [
  {
    domain: "Web — Frontend",
    items: [
      "HTML",
      "CSS",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Vue",
      "Nuxt",
      "Svelte",
      "SvelteKit",
      "Angular",
      "Astro",
      "Tailwind CSS",
      "Redux",
      "TanStack Query",
      "Vite",
      "Webpack",
    ],
  },
  {
    domain: "Web — Backend",
    items: [
      "Node.js",
      "Express",
      "NestJS",
      "Go",
      "Fiber",
      "Python",
      "Django",
      "FastAPI",
      "Flask",
      "Java",
      "Spring",
      "PHP",
      "Laravel",
      "Ruby on Rails",
      ".NET",
      "GraphQL",
      "gRPC",
    ],
  },
  {
    domain: "Databases & Infra",
    items: [
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "Redis",
      "SQLite",
      "Prisma",
      "Docker",
      "Kubernetes",
      "AWS",
      "GCP",
      "Azure",
      "Nginx",
      "Terraform",
      "CI/CD",
      "Meilisearch",
      "RabbitMQ",
      "Kafka",
    ],
  },
  {
    domain: "Mobile",
    items: [
      "Kotlin",
      "Swift",
      "Java (Android)",
      "Flutter",
      "Dart",
      "React Native",
      "Jetpack Compose",
      "SwiftUI",
      "Expo",
    ],
  },
  {
    domain: "UX / Design",
    items: [
      "Figma",
      "Adobe XD",
      "Sketch",
      "Framer",
      "Photoshop",
      "Illustrator",
      "After Effects",
      "User research",
      "Prototyping",
      "Design systems",
      "Wireframing",
      "Usability testing",
    ],
  },
  {
    domain: "Interactive Media (XR / VR / AR / Game)",
    items: [
      "Unity",
      "Unreal Engine",
      "Godot",
      "Blender",
      "C#",
      "C++",
      "ARKit",
      "ARCore",
      "WebXR",
      "Three.js",
      "Shader programming",
      "Spline",
    ],
  },
  {
    domain: "General Tooling",
    items: ["Git", "GitHub", "GitLab", "Jira", "Notion", "Postman", "Linear", "VS Code", "Vim"],
  },
];

// Flattened domain list for the picker's group headers.
export const TECH_DOMAINS = TECH_TAXONOMY.map((g) => g.domain);

// Lookup: which domain a known item belongs to (for prefilling custom adds).
export const TECH_ITEM_DOMAIN: Record<string, string> = Object.fromEntries(
  TECH_TAXONOMY.flatMap((g) => g.items.map((item) => [item, g.domain])),
);
