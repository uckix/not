import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/authorization";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const { checkpointId, answer } = body as {
      checkpointId?: string;
      answer?: string;
    };

    if (!checkpointId || typeof answer !== "string") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const checkpoint = await prisma.checkpoint.findUnique({
      where: { id: checkpointId },
      include: { lessonPage: { include: { module: true } } }
    });

    if (!checkpoint || !checkpoint.lessonPage.module.published) {
      return NextResponse.json({ error: "Checkpoint not found" }, { status: 404 });
    }

    const normalized = answer.trim();
    const isCorrect =
      checkpoint.type === "TEXT"
        ? normalized.toLowerCase() === checkpoint.correctAnswer.toLowerCase()
        : normalized === checkpoint.correctAnswer;

    await prisma.userCheckpointAttempt.create({
      data: {
        userId: user.id,
        checkpointId: checkpoint.id,
        submittedAnswer: normalized,
        isCorrect
      }
    });

    if (isCorrect) {
      await prisma.userProgress.upsert({
        where: {
          userId_moduleId: {
            userId: user.id,
            moduleId: checkpoint.lessonPage.moduleId
          }
        },
        update: {
          completedCheckpoints: { increment: 1 },
          lastSeenAt: new Date()
        },
        create: {
          userId: user.id,
          moduleId: checkpoint.lessonPage.moduleId,
          completedCheckpoints: 1,
          completedPages: 0,
          isCompleted: false
        }
      });
    }

    return NextResponse.json({ isCorrect });
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
