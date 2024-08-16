export interface IUser {
  _id?: string;
  discordId: string;
  discordName: string;
  questTracker: number;
  questTotalTime: number;
  currentlyOnQuest: boolean;
  startingQuestDate: Date;
}
