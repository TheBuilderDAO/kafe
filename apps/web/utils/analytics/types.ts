export enum EventType {
  VOTED = 'VOTED',
}

export type VotedEventProps = {
  tutorialId: number;
  publicKey: string;
};
