export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
}

export interface Gift {
  id: string;
  externalId: string;
  title: string;
  slug: string;
  image: string;
  animation: string;
  cost: number;
  num: number;
  availabilityIssued: number;
  availabilityTotal: number;
}

export interface Participant {
  id: string;
  user: User;
  vote: boolean;
  voteCount: number;
}

export interface DAO {
  id: string;
  type: string;
  status: string;
  gift: Gift;
  participants: Participant[];
  createdAt: string;
  endedAt: string;
  voteCount: number;
  voteDoneCount: number;
  voteForCount: number;
  voteAgainstCount: number;
  myVotesCount: number;
}
