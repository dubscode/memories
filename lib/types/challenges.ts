import { getChallengeDetails } from '@/lib/models/challenges';

export type ChallengeDetails = Awaited<ReturnType<typeof getChallengeDetails>>;
