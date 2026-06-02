import { PrismaClient } from '@prisma/client'
import {
  mockCalls,
  mockDeals,
  mockReps,
  mockFollowUps,
  teamMetrics,
} from '../src/lib/demo'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database with demo data...')

  // Seed calls
  for (const call of mockCalls) {
    await prisma.callAnalysis.upsert({
      where: { id: call.id },
      update: {},
      create: {
        id: call.id,
        title: call.title,
        duration: call.duration,
        sentiment: call.sentiment,
        stage: call.stage,
        objection: call.objection,
        objectionCategory: call.objectionCategory,
        nextSteps: call.nextSteps,
        dealValue: call.dealValue,
        repName: call.repName,
        transcript: call.transcript,
        talkRatioRep: call.talkRatio.rep,
        talkRatioProspect: call.talkRatio.prospect,
        createdAt: new Date(call.createdAt),
      },
    })
  }

  // Seed deals
  for (const deal of mockDeals) {
    await prisma.deal.upsert({
      where: { id: deal.id },
      update: {},
      create: {
        id: deal.id,
        company: deal.company,
        contact: deal.contact,
        stage: deal.stage,
        value: deal.value,
        repName: deal.repName,
        lastActivity: deal.lastActivity,
        probability: deal.probability,
        daysInStage: deal.daysInStage,
        createdAt: new Date(deal.createdAt),
      },
    })
  }

  // Seed reps
  for (const rep of mockReps) {
    await prisma.repScorecard.upsert({
      where: { id: rep.id },
      update: {},
      create: {
        id: rep.id,
        name: rep.name,
        title: rep.title,
        callsHandled: rep.callsHandled,
        avgTalkRatio: rep.avgTalkRatio,
        objectionRate: rep.objectionRate,
        closeRate: rep.closeRate,
        avgDealSize: rep.avgDealSize,
        pipelineValue: rep.pipelineValue,
        score: rep.score,
        strengths: rep.strengths,
        gaps: rep.gaps,
        createdAt: new Date(),
      },
    })
  }

  // Seed follow-ups
  for (const fu of mockFollowUps) {
    await prisma.followUp.upsert({
      where: { id: fu.id },
      update: {},
      create: {
        id: fu.id,
        dealId: fu.dealId,
        company: fu.company,
        contact: fu.contact,
        subject: fu.subject,
        body: fu.body,
        status: fu.status,
        sentAt: fu.sentAt,
        replyAt: fu.replyAt,
        repName: fu.repName,
        createdAt: new Date(),
      },
    })
  }

  console.log('✅ Seed complete. Demo data loaded:')
  console.log(`   ${mockCalls.length} calls`)
  console.log(`   ${mockDeals.length} deals`)
  console.log(`   ${mockReps.length} reps`)
  console.log(`   ${mockFollowUps.length} follow-ups`)
  console.log(`   Team pipeline value: $${teamMetrics.pipelineValue.toLocaleString()}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
