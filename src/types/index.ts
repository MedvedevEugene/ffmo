export interface Team {
  id: string;
  name: string;
  players: Player[];
}

export interface Player {
  id: string;
  number: number;
  name: string;
  teamId: string;
}

export interface Referee {
  id: string;
  role: 'main' | 'assistant' | 'fourth';
  name: string;
}

export type EventType =
  | 'goal'
  | 'yellow_card'
  | 'red_card'
  | 'substitution'
  | 'injury'
  | 'penalty'
  | 'offside'
  | 'corner'
  | 'freekick'
  | 'throw_in'
  | 'goal_kick'
  | 'other';

export interface MatchEvent {
  id: string;
  type: EventType;
  minute: number;
  teamId?: string;
  playerId?: string;
  description?: string;
  additionalPlayerId?: string; // для замен
  isOwnGoal?: boolean;
  isPenalty?: boolean;
}

export interface Match {
  id: string;
  date: string;
  homeTeam: Team;
  awayTeam: Team;
  referees: Referee[];
  events: MatchEvent[];
  stadium?: string;
  tournament?: string;
  round?: string;
}

export interface ProtocolForm {
  tournament: string;
  round: string;
  date: string;
  stadium: string;
  homeTeamName: string;
  awayTeamName: string;
  homeTeamPlayers: string;
  awayTeamPlayers: string;
  mainReferee: string;
  assistantReferee1: string;
  assistantReferee2: string;
  fourthReferee: string;
}