import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/authorization";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const { pageId } = body as { pageId?: string };

    if (!pageId) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const page = await prisma.lessonPage.findUnique({
      where: { id: pageId },
      include: { module: true, checkpoints: true }
    });

    if (!page || !page.module.published) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    const checkpoints = page.checkpoints;
    if (checkpoints.length > 0) {
      const correct = await prisma.userCheckpointAttempt.findMany({
        where: {
          userId: user.id,
          checkpointId: { in: checkpoints.map((checkpoint) => checkpoint.id) },
          isCorrect: true
        },
        select: { checkpointId: true }
      });

      const correctSet = new Set(correct.map((item) => item.checkpointId));
      if (correctSet.size !== checkpoints.length) {
        return NextResponse.json(
          { error: "Complete all checkpoints first." },
          { status: 400 }
        );
      }
    }

    const progress = await prisma.userProgress.upsert({
      where: {
        userId_moduleId: { userId: user.id, moduleId: page.moduleId }
      },
      update: {
        completedPages: { increment: 1 },
        lastSeenAt: new Date()
      },
      create: {
        userId: user.id,
        moduleId: page.moduleId,
        completedPages: 1,
        completedCheckpoints: checkpoints.length,
        isCompleted: false
      }
    });

    const totalPages = await prisma.lessonPage.count({
      where: { moduleId: page.moduleId }
    });

    const isCompleted = progress.completedPages >= totalPages;
    if (isCompleted && !progress.isCompleted) {
      await prisma.userProgress.update({
        where: { id: progress.id },
        data: { isCompleted: true }
      });
    }

    return NextResponse.json({ success: true, isCompleted });
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
