import { PrismaClient, Difficulty, CheckpointType, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin1234", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@local" },
    update: {},
    create: {
      email: "admin@local",
      username: "admin",
      passwordHash: adminPassword,
      role: Role.ADMIN
    }
  });

  const moduleOne = await prisma.module.create({
    data: {
      slug: "web-basics",
      title: "Web Basics",
      description: "Learn the building blocks of web security with hands-on reading.",
      difficulty: Difficulty.BEGINNER,
      tags: ["web", "http"],
      coverImage: "/uploads/sample-diagram.svg",
      published: true,
      createdById: admin.id,
      pages: {
        create: [
          {
            orderIndex: 1,
            title: "HTTP Fundamentals",
            markdownContent: `# HTTP Fundamentals\n\nWelcome to **MiniHackMe**!\n\n![Diagram](/uploads/sample-diagram.svg)\n\n## Request Anatomy\n\n- Method\n- Path\n- Headers\n- Body\n\n\n\`\`\`http\nGET /rooms HTTP/1.1\nHost: minihack.me\n\`\`\`\n\n> Remember: headers are case-insensitive.\n\n- [x] Use HTTPS in production\n- [ ] Avoid sending secrets in URLs\n`,
            checkpoints: {
              create: [
                {
                  orderIndex: 1,
                  type: CheckpointType.MULTIPLE_CHOICE,
                  prompt: "Which header indicates the client host?",
                  options: ["Host", "User-Agent", "Accept"],
                  correctAnswer: "Host",
                  explanation: "The Host header specifies the domain name."
                }
              ]
            }
          },
          {
            orderIndex: 2,
            title: "Status Codes",
            markdownContent: `# Status Codes\n\n| Code | Meaning |\n| --- | --- |\n| 200 | OK |\n| 404 | Not Found |\n\n\`\`\`bash\ncurl -i https://example.com\n\`\`\`\n`,
            checkpoints: {
              create: [
                {
                  orderIndex: 1,
                  type: CheckpointType.TEXT,
                  prompt: "What status code means Not Found?",
                  correctAnswer: "404",
                  explanation: "404 indicates the resource could not be located."
                }
              ]
            }
          }
        ]
      }
    }
  });

  await prisma.module.create({
    data: {
      slug: "intro-linux",
      title: "Intro to Linux",
      description: "A quick tour of the Linux command line for security learners.",
      difficulty: Difficulty.BEGINNER,
      tags: ["linux", "cli"],
      published: true,
      createdById: admin.id,
      pages: {
        create: [
          {
            orderIndex: 1,
            title: "Navigation",
            markdownContent: `# Navigation\n\nLearn to move around with \`pwd\` and \`ls\`.\n\n\`\`\`bash\npwd\nls -la\n\`\`\`\n`,
            checkpoints: {
              create: [
                {
                  orderIndex: 1,
                  type: CheckpointType.MULTIPLE_CHOICE,
                  prompt: "Which command lists files?",
                  options: ["ls", "cd", "mkdir"],
                  correctAnswer: "ls",
                  explanation: "ls lists directory contents."
                }
              ]
            }
          }
        ]
      }
    }
  });

  await prisma.userProgress.create({
    data: {
      userId: admin.id,
      moduleId: moduleOne.id,
      completedPages: 1,
      completedCheckpoints: 1,
      isCompleted: false
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
