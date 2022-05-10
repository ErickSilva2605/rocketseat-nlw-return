import express from 'express';
import { SubmitFeedbackService } from './services/submit-feedback-service';
import { PrismaFeedbacksRepository } from './repositories/prisma/prisma-feedbacks-repository';
import { NodemailerMailAdapter } from './adapters/nodemailer/nodemailer-mail-adapter';

export const routes = express.Router();

routes.post('/feedbacks', async (req, res) => {
  const { type, comment, screenshot } = req.body;

  try {
    const prismaFeedbacksRepository = new PrismaFeedbacksRepository();
    const nodemailerMailAdapter = new NodemailerMailAdapter();

    const submitFeedbackService = new SubmitFeedbackService(
      prismaFeedbacksRepository,
      nodemailerMailAdapter
    );

    await submitFeedbackService.execute({
      type,
      comment,
      screenshot
    });

    return res.status(201).send();
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});