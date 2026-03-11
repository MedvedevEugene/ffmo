import { useState, useCallback } from 'react';
import { Match, MatchEvent, EventType, Player } from './types';
import TeamRoster from './components/TeamRoster';
import Statistics from './components/Statistics';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const createTeamPlayers = (teamId: string): Player[] => {
    const players: Player[] = [];
    // Основные (1-11)
    for (let i = 1; i <= 11; i++) {
      players.push({
        id: uuidv4(),
        number: i,
        name: `Игрок ${i}`,
        teamId,
        position: 'starter'
      });
    }
    // Запасные (12-18)
    for (let i = 12; i <= 18; i++) {
      players.push({
        id: uuidv4(),
        number: i,
        name: `Запасной ${i}`,
        teamId,
        position: 'substitute'
      });
    }
    // Тренеры
    players.push({ id: uuidv4(), number: 0, name: 'Главный тренер', teamId, position: 'coach' });
    players.push({ id: uuidv4(), number: 0, name: 'Ассистент тренера', teamId, position: 'coach' });
    players.push({ id: uuidv4(), number: 0, name: 'Тренер по физподготовке', teamId, position: 'coach' });
    return players;
  };

  const [match, setMatch] = useState<Match>({
    id: uuidv4(),
    date: new Date().toISOString().split('T')[0],
    homeTeam: {
      id: uuidv4(),
      name: 'Команда А',
      players: createTeamPlayers(uuidv4())
    },
    awayTeam: {
      id: uuidv4(),
      name: 'Команда Б',
      players: createTeamPlayers(uuidv4())
    },
    referees: [
      { id: uuidv4(), role: 'main', name: 'Главный судья' },
      { id: uuidv4(), role: 'assistant', name: 'Ассистент 1' },
      { id: uuidv4(), role: 'assistant', name: 'Ассистент 2' },
      { id: uuidv4(), role: 'fourth', name: 'Резервный судья' }
    ],
    events: [],
    stadium: 'Стадион "Центральный"',
    tournament: 'Чемпионат России',
    round: '1 тур'
  });

  const addEvent = useCallback((
    type: EventType,
    minute: number,
    playerId: string,
    teamId: string,
    description?: string,
    yellowCardReason?: string,
    redCardReason?: string
  ) => {
    const newEvent: MatchEvent = {
      id: uuidv4(),
      type,
      minute,
      teamId,
      playerId,
      description,
      ...(yellowCardReason && { yellowCardReason: yellowCardReason as any }),
      ...(redCardReason && { redCardReason: redCardReason as any })
    };
    setMatch(prev => ({
      ...prev,
      events: [...prev.events, newEvent].sort((a, b) => a.minute - b.minute)
    }));
  }, []);

  const exportJSON = () => {
    const dataStr = JSON.stringify(match, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `protocol-${match.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getPlayerName = (playerId?: string) => {
    if (!playerId) return '';
    const allPlayers = [...match.homeTeam.players, ...match.awayTeam.players];
    const player = allPlayers.find(p => p.id === playerId);
    return player ? `${player.number}. ${player.name}` : '';
  };

  const getPlayerEvents = useCallback((playerId: string) => {
    return match.events.filter(e => e.playerId === playerId);
  }, [match.events]);

  const getEventTypeLabel = (type: EventType): string => {
    const labels: Record<EventType, string> = {
      goal: 'Гол',
      own_goal: 'Автогол',
      penalty_goal: 'Пенальти (забит)',
      missed_penalty: 'Пенальти (не забит)',
      yellow_card: 'ЖК',
      red_card: 'КК',
      substitution: 'Замена',
      injury: 'Травма',
      offside: 'Офсайд',
      corner: 'Угловой',
      freekick: 'Штрафной',
      throw_in: 'Бросок от ворот',
      goal_kick: 'Удар от ворот',
      other: 'Другое'
    };
    return labels[type] || type;
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Электронный протокол футбольного матча</h1>
      </div>

      <div className="match-info">
        <div className="info-row">
          <span className="info-label">Турнир:</span>
          <span className="info-value">{match.tournament}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Тур:</span>
          <span className="info-value">{match.round}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Дата:</span>
          <span className="info-value">{match.date}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Стадион:</span>
          <span className="info-value">{match.stadium}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Судьи:</span>
          <span className="info-value">
            {match.referees.map(r => r.name).join(', ')}
          </span>
        </div>
      </div>

      <div className="rosters-section">
        <TeamRoster
          teamName={match.homeTeam.name}
          players={match.homeTeam.players}
          onAddEvent={addEvent}
          getPlayerEvents={getPlayerEvents}
          getEventTypeLabel={getEventTypeLabel}
        />

        <TeamRoster
          teamName={match.awayTeam.name}
          players={match.awayTeam.players}
          onAddEvent={addEvent}
          getPlayerEvents={getPlayerEvents}
          getEventTypeLabel={getEventTypeLabel}
        />
      </div>

      <Statistics
        match={match}
        getPlayerName={getPlayerName}
      />

      <div className="actions">
        <button className="btn btn-primary" onClick={exportJSON}>
          Экспорт JSON
        </button>
      </div>
    </div>
  );
}

export default App;
