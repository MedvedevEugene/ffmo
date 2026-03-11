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
  position: 'starter' | 'substitute' | 'coach';
}

export interface Referee {
  id: string;
  role: 'main' | 'assistant' | 'fourth';
  name: string;
}

export type EventType =
  | 'goal'
  | 'own_goal'
  | 'penalty_goal'
  | 'missed_penalty'
  | 'yellow_card'
  | 'red_card'
  | 'substitution'
  | 'injury'
  | 'offside'
  | 'corner'
  | 'freekick'
  | 'throw_in'
  | 'goal_kick'
  | 'other';

export type YellowCardReason =
  | 'spa'           // СПА
  | 'unsporting'    // Неспортивное поведение
  | 'rough_play'    // Грубая игра
  | 'systematic'    // Систематическое нарушение
  | 'delay';        // Задержка игры

export type RedCardReason =
  | 'violent_conduct'        // ЛЯВЗГ
  | 'serious_foul_play'      // Серьезное нарушение правил
  | 'aggressive_behavior'    // Агрессивное поведение
  | 'offensive'              // Оскорбительные выражения/действия
  | 'other';                 // Другое (с описанием)

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
  yellowCardReason?: YellowCardReason;
  redCardReason?: RedCardReason;
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