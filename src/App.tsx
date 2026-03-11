import { useState, useCallback } from 'react';
import { Match, ProtocolForm, MatchEvent, EventType, Team, Referee, Player } from './types';
import ProtocolFormComponent from './components/ProtocolForm';
import EventsTable from './components/EventsTable';
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
      { id: uuidv4(), role: 'main', name: '' },
      { id: uuidv4(), role: 'assistant', name: '' },
      { id: uuidv4(), role: 'assistant', name: '' },
      { id: uuidv4(), role: 'fourth', name: '' }
    ],
    events: [],
    stadium: '',
    tournament: '',
    round: ''
  });

  const [formData, setFormData] = useState<ProtocolForm>({
    tournament: '',
    round: '',
    date: new Date().toISOString().split('T')[0],
    stadium: '',
    homeTeamName: '',
    awayTeamName: '',
    homeTeamPlayers: '',
    awayTeamPlayers: '',
    mainReferee: '',
    assistantReferee1: '',
    assistantReferee2: '',
    fourthReferee: ''
  });

  const handleFormChange = (field: keyof ProtocolForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProtocol = () => {
    const homePlayers = formData.homeTeamPlayers.split('\n').filter(p => p.trim());
    const awayPlayers = formData.awayTeamPlayers.split('\n').filter(p => p.trim());

    const homeTeam: Team = {
      id: match.homeTeam.id,
      name: formData.homeTeamName,
      players: homePlayers.map((name, index) => ({
        id: uuidv4(),
        number: index + 1,
        name: name.trim(),
        teamId: match.homeTeam.id,
        position: index < 11 ? 'starter' : 'substitute'
      }))
    };

    const awayTeam: Team = {
      id: match.awayTeam.id,
      name: formData.awayTeamName,
      players: awayPlayers.map((name, index) => ({
        id: uuidv4(),
        number: index + 1,
        name: name.trim(),
        teamId: match.awayTeam.id,
        position: index < 11 ? 'starter' : 'substitute'
      }))
    };

    const referees: Referee[] = [
      { id: match.referees[0].id, role: 'main', name: formData.mainReferee },
      { id: match.referees[1].id, role: 'assistant', name: formData.assistantReferee1 },
      { id: match.referees[2].id, role: 'assistant', name: formData.assistantReferee2 },
      { id: match.referees[3].id, role: 'fourth', name: formData.fourthReferee }
    ];

    setMatch(prev => ({
      ...prev,
      date: formData.date,
      tournament: formData.tournament,
      round: formData.round,
      stadium: formData.stadium,
      homeTeam,
      awayTeam,
      referees
    }));
  };

  const addEvent = useCallback((
    type: EventType,
    minute: number,
    teamId?: string,
    playerId?: string,
    description?: string,
    additionalPlayerId?: string,
    isOwnGoal?: boolean,
    isPenalty?: boolean,
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
      additionalPlayerId,
      isOwnGoal,
      isPenalty,
      ...(yellowCardReason && { yellowCardReason: yellowCardReason as any }),
      ...(redCardReason && { redCardReason: redCardReason as any })
    };
    setMatch(prev => ({
      ...prev,
      events: [...prev.events, newEvent].sort((a, b) => a.minute - b.minute)
    }));
  }, []);

  const removeEvent = (eventId: string) => {
    setMatch(prev => ({
      ...prev,
      events: prev.events.filter(e => e.id !== eventId)
    }));
  };

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

  const getTeamName = (teamId?: string) => {
    if (!teamId) return '';
    if (teamId === match.homeTeam.id) return match.homeTeam.name;
    if (teamId === match.awayTeam.id) return match.awayTeam.name;
    return '';
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Электронный протокол футбольного матча</h1>
      </div>

      <ProtocolFormComponent
        formData={formData}
        onFormChange={handleFormChange}
        onSave={handleSaveProtocol}
      />

      <div className="events-section">
        <h2>События матча</h2>
        <EventsTable
          events={match.events}
          players={[...match.homeTeam.players, ...match.awayTeam.players]}
          teams={[match.homeTeam, match.awayTeam]}
          onRemoveEvent={removeEvent}
          getPlayerName={getPlayerName}
          getTeamName={getTeamName}
          onAddEvent={addEvent}
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
