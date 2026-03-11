import React, { useState } from 'react';
import { Player, MatchEvent, EventType } from '../types';

interface Props {
  teamName: string;
  players: Player[];
  onAddEvent: (
    type: EventType,
    minute: number,
    playerId: string,
    teamId: string,
    description?: string,
    yellowCardReason?: string,
    redCardReason?: string
  ) => void;
  getPlayerEvents: (playerId: string) => MatchEvent[];
  getEventTypeLabel: (type: EventType) => string;
}

const eventTypeLabels: Record<EventType, string> = {
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

const yellowCardReasons = [
  { value: 'spa', label: 'СПА' },
  { value: 'unsporting', label: 'Неспортивное поведение' },
  { value: 'rough_play', label: 'Грубая игра' },
  { value: 'systematic', label: 'Систематическое нарушение' },
  { value: 'delay', label: 'Задержка игры' }
];

const redCardReasons = [
  { value: 'violent_conduct', label: 'ЛЯВЗГ' },
  { value: 'serious_foul_play', label: 'Серьезное нарушение правил' },
  { value: 'aggressive_behavior', label: 'Агрессивное поведение' },
  { value: 'offensive', label: 'Оскорбительные выражения/действия' },
  { value: 'other', label: 'Другое' }
];

const TeamRoster: React.FC<Props> = ({
  teamName,
  players,
  onAddEvent,
  getPlayerEvents,
  getEventTypeLabel
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [eventType, setEventType] = useState<EventType>('goal');
  const [minute, setMinute] = useState<number>(0);
  const [yellowCardReason, setYellowCardReason] = useState<string>('');
  const [redCardReason, setRedCardReason] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const starters = players.filter(p => p.position === 'starter');
  const substitutes = players.filter(p => p.position === 'substitute');
  const coaches = players.filter(p => p.position === 'coach');

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
    setShowMenu(true);
    resetForm();
  };

  const handleAddEvent = () => {
    if (!selectedPlayer || !minute) return;

    onAddEvent(
      eventType,
      minute,
      selectedPlayer.id,
      selectedPlayer.teamId,
      description || undefined,
      yellowCardReason || undefined,
      redCardReason || undefined
    );

    resetForm();
    setShowMenu(false);
  };

  const resetForm = () => {
    setEventType('goal');
    setMinute(0);
    setYellowCardReason('');
    setRedCardReason('');
    setDescription('');
  };

  const getPlayerBadge = (player: Player) => {
    const playerEvents = getPlayerEvents(player.id);
    if (playerEvents.length === 0) return null;

    return (
      <div className="player-badges">
        {playerEvents.slice(-3).map(event => (
          <span key={event.id} className={`badge badge-${event.type}`}>
            {getEventTypeLabel(event.type)}
          </span>
        ))}
      </div>
    );
  };

  const renderPlayer = (player: Player) => (
    <div
      key={player.id}
      className="player-card"
      onClick={() => handlePlayerClick(player)}
    >
      <div className="player-number">{player.number}</div>
      <div className="player-name">{player.name}</div>
      {getPlayerBadge(player)}
    </div>
  );

  return (
    <div className="team-roster">
      <h3>{teamName}</h3>

      <div className="roster-section">
        <h4>Основной состав (1-11)</h4>
        <div className="players-grid">
          {starters.map(renderPlayer)}
        </div>
      </div>

      <div className="roster-section">
        <h4>Запасные (12-18)</h4>
        <div className="players-grid">
          {substitutes.map(renderPlayer)}
        </div>
      </div>

      <div className="roster-section">
        <h4>Тренеры</h4>
        <div className="players-grid coaches">
          {coaches.map(renderPlayer)}
        </div>
      </div>

      {showMenu && selectedPlayer && (
        <div className="event-menu-overlay" onClick={() => setShowMenu(false)}>
          <div className="event-menu" onClick={e => e.stopPropagation()}>
            <h4>Добавить событие для {selectedPlayer.name}</h4>

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

            {eventType === 'yellow_card' && (
              <div className="form-group">
                <label>Причина ЖК</label>
                <select
                  value={yellowCardReason}
                  onChange={(e) => setYellowCardReason(e.target.value)}
                >
                  <option value="">Выберите причину</option>
                  {yellowCardReasons.map(reason => (
                    <option key={reason.value} value={reason.value}>{reason.label}</option>
                  ))}
                </select>
              </div>
            )}

            {eventType === 'red_card' && (
              <>
                <div className="form-group">
                  <label>Причина КК</label>
                  <select
                    value={redCardReason}
                    onChange={(e) => setRedCardReason(e.target.value)}
                  >
                    <option value="">Выберите причину</option>
                    {redCardReasons.map(reason => (
                      <option key={reason.value} value={reason.value}>{reason.label}</option>
                    ))}
                  </select>
                </div>
                {redCardReason === 'other' && (
                  <div className="form-group">
                    <label>Описание</label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Подробное описание"
                    />
                  </div>
                )}
              </>
            )}

            {(eventType === 'goal' || eventType === 'penalty_goal' || eventType === 'missed_penalty' || eventType === 'own_goal') && (
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={!!description}
                    onChange={(e) => setDescription(e.target.checked ? 'Дополнительное описание' : '')}
                  />
                  {' '}Добавить описание
                </label>
              </div>
            )}

            <div className="menu-actions">
              <button className="btn btn-success" onClick={handleAddEvent}>
                Добавить
              </button>
              <button className="btn btn-secondary" onClick={() => setShowMenu(false)}>
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamRoster;
