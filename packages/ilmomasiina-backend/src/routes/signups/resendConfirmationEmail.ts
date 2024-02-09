/* eslint-disable no-await-in-loop */
import { FastifyReply, FastifyRequest } from 'fastify';

import sendSignupConfirmationMail from '../../mail/signupConfirmation';
import { Signup } from '../../models/signup';
import { NoSuchSignup } from './errors';

/** Requires admin authentication */
export default async function resendConfirmationEmails(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { ids } = request.body as { ids: string[] };
  console.log('Resending confirmation emails for signups', request.body);
  for (const id of ids) {
    const signup = await Signup.scope('active').findByPk(id, {
      attributes: ['id', 'quotaId', 'confirmedAt', 'firstName', 'lastName', 'email', 'language'],
    });
    if (signup === null) {
      throw new NoSuchSignup('Signup expired or already deleted');
    }
    await sendSignupConfirmationMail(signup);
  }
  reply.status(204);
}
