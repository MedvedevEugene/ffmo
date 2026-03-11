import React, { useState } from 'react';
import { MatchEvent, EventType, Player, Team } from '../types';

interface Props {
  events: MatchEvent[];
  players: Player[];
  teams: Team[];
  onRemoveEvent: (eventId: string) => void;
  onAddEvent: (type: EventType, minute: number, teamId?: string, playerId?: string, description?: string, additionalPlayerId?: string, isOwnGoal?: boolean, isPenalty?: boolean) => void;
  getPlayerName: (playerId?: string) => string;
  getTeamName: (teamId?: string) => string;
}

const eventTypeLabels: Record<EventType, string> = {
  goal: 'Гол',
  yellow_card: 'ЖК',
  red_card: 'КК',
  substitution: 'Замена',
  injury: 'Травма',
  penalty: 'Пенальти',
  offside: 'Офсайд',
  corner: 'Угловой',
  freekick: 'Штрафной',
  throw_in: 'Бросок от ворот',
  goal_kick: 'Удар от ворот',
  other: 'Другое'
};

const EventsTable: React.FC<Props> = ({
  events,
  players,
  teams,
  onRemoveEvent,
  onAddEvent,
  getPlayerName,
  getTeamName
}) => {
  const [showForm, setShowForm] = useState(false);
  const [eventType, setEventType] = useState<EventType>('goal');
  const [minute, setMinute] = useState<number>(0);
  const [teamId, setTeamId] = useState<string>('');
  const [playerId, setPlayerId] = useState<string>('');
  const [additionalPlayerId, setAdditionalPlayerId] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isOwnGoal, setIsOwnGoal] = useState(false);
  const [isPenalty, setIsPenalty] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddEvent(
      eventType,
      minute,
      teamId || undefined,
      playerId || undefined,
      description || undefined,
      additionalPlayerId || undefined,
      isOwnGoal,
      isPenalty
    );
    resetForm();
  };

  const resetForm = () => {
    setEventType('goal');
    setMinute(0);
    setTeamId('');
    setPlayerId('');
    setAdditionalPlayerId('');
    setDescription('');
    setIsOwnGoal(false);
    setIsPenalty(false);
    setShowForm(false);
  };

  const getEventTypeClass = (type: EventType) => {
    const classMap: Record<EventType, string> = {
      goal: 'event-type-goal',
      yellow_card: 'event-type-yellow_card',
      red_card: 'event-type-red_card',
      substitution: 'event-type-substitution',
      penalty: 'event-type-penalty',
      injury: 'event-type-other',
      offside: 'event-type-other',
      corner: 'event-type-other',
      freekick: 'event-type-other',
      throw_in: 'event-type-other',
      goal_kick: 'event-type-other',
      other: 'event-type-other'
    };
    return classMap[type] || 'event-type-other';
  };

  return (
    <>
      <div className="form-actions">
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Скрыть форму' : 'Добавить событие'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="form-section" style={{ marginTop: '20px' }}>
          <h3>Новое событие</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Тип события</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as EventType)}
              >
                {Object.entries(eventTypeLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Минута</label>
              <input
                type="number"
                min="0"
                max="120"
                value={minute}
                onChange={(e) => setMinute(parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="form-group">
              <label>Команда</label>
              <select
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
              >
                <option value="">Не выбрана</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Игрок</label>
              <select
                value={playerId}
                onChange={(e) => setPlayerId(e.target.value)}
              >
                <option value="">Не выбран</option>
                {players.map(player => (
                  <option key={player.id} value={player.id}>
                    {player.number}. {player.name}
                  </option>
                ))}
              </select>
            </div>

            {eventType === 'substitution' && (
              <div className="form-group">
                <label>Кто выходит (доп. игрок)</label>
                <select
                  value={additionalPlayerId}
                  onChange={(e) => setAdditionalPlayerId(e.target.value)}
                >
                  <option value="">Не выбран</option>
                  {players
                    .filter(p => !additionalPlayerId || p.id !== additionalPlayerId)
                    .map(player => (
                      <option key={player.id} value={player.id}>
                        {player.number}. {player.name}
                      </option>
                    ))
                  }
                </select>
              </div>
            )}

            {(eventType === 'goal' || eventType === 'penalty') && (
              <>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={isOwnGoal}
                      onChange={(e) => setIsOwnGoal(e.target.checked)}
                    />
                    {' '}Автогол
                  </label>
                </div>
                {eventType === 'goal' && (
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={isPenalty}
                        onChange={(e) => setIsPenalty(e.target.checked)}
                      />
                      {' '}Пенальти
                    </label>
                  </div>
                )}
              </>
            )}

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Описание</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Дополнительное описание события"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-success">
              Добавить
            </button>
            <button type="button" className="btn btn-danger" onClick={resetForm}>
              Отмена
            </button>
          </div>
        </form>
      )}

      <table className="events-table">
        <thead>
          <tr>
            <th>Минута</th>
            <th>Тип</th>
            <th>Команда</th>
            <th>Игрок</th>
            <th>Описание</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {events.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>
                Событий пока нет
              </td>
            </tr>
          ) : (
            events.map(event => (
              <tr key={event.id}>
                <td>{event.minute}'</td>
                <td>
                  <span className={`event-type-badge ${getEventTypeClass(event.type)}`}>
                    {eventTypeLabels[event.type]}
                  </span>
                </td>
                <td>{getTeamName(event.teamId)}</td>
                <td>
                  {getPlayerName(event.playerId)}
                  {event.isOwnGoal && ' (автогол)'}
                  {event.isPenalty && ' (пенальти)'}
                </td>
                <td>{event.description || ''}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    style={{ padding: '5px 10px', fontSize: '12px' }}
                    onClick={() => onRemoveEvent(event.id)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
};

export default EventsTable;