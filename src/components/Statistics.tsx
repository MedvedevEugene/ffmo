import React from 'react';
import { Match } from '../types';

interface Props {
  match: Match;
  getPlayerName: (playerId?: string) => string;
}

const Statistics: React.FC<Props> = ({ match, getPlayerName }) => {
  const goals = match.events.filter(e => e.type === 'goal' && !e.isOwnGoal).length;
  const ownGoals = match.events.filter(e => e.type === 'goal' && e.isOwnGoal).length;
  const yellowCards = match.events.filter(e => e.type === 'yellow_card').length;
  const redCards = match.events.filter(e => e.type === 'red_card').length;
  const penaltyGoals = match.events.filter(e => e.type === 'penalty_goal').length;
  const missedPenalties = match.events.filter(e => e.type === 'missed_penalty').length;
  const totalPenalties = penaltyGoals + missedPenalties;
  const substitutions = match.events.filter(e => e.type === 'substitution').length;

  const homeGoals = match.events.filter(e =>
    e.type === 'goal' && e.teamId === match.homeTeam.id && !e.isOwnGoal
  ).length;
  const awayGoals = match.events.filter(e =>
    e.type === 'goal' && e.teamId === match.awayTeam.id && !e.isOwnGoal
  ).length;

  const homeYellowCards = match.events.filter(e =>
    e.type === 'yellow_card' && e.teamId === match.homeTeam.id
  ).length;
  const awayYellowCards = match.events.filter(e =>
    e.type === 'yellow_card' && e.teamId === match.awayTeam.id
  ).length;

  const homeRedCards = match.events.filter(e =>
    e.type === 'red_card' && e.teamId === match.homeTeam.id
  ).length;
  const awayRedCards = match.events.filter(e =>
    e.type === 'red_card' && e.teamId === match.awayTeam.id
  ).length;

  const scorers: { playerId: string; teamId: string; count: number }[] = [];
  match.events.filter(e => e.type === 'goal' && !e.isOwnGoal && e.playerId).forEach(event => {
    if (event.playerId) {
      const existing = scorers.find(s => s.playerId === event.playerId);
      if (existing) {
        existing.count++;
      } else {
        scorers.push({ playerId: event.playerId, teamId: event.teamId!, count: 1 });
      }
    }
  });

  const sortedScorers = scorers.sort((a, b) => b.count - a.count);

  return (
    <div className="stats-section">
      <h2>Статистика матча</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{homeGoals}</div>
          <div className="stat-label">{match.homeTeam.name || 'Хозяева'}</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">:</div>
          <div className="stat-label">Счет</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{awayGoals}</div>
          <div className="stat-label">{match.awayTeam.name || 'Гости'}</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{goals + ownGoals}</div>
          <div className="stat-label">Всего голов</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{yellowCards}</div>
          <div className="stat-label">Желтые карточки</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{redCards}</div>
          <div className="stat-label">Красные карточки</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{penaltyGoals}</div>
          <div className="stat-label">Пенальти (забито)</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{missedPenalties}</div>
          <div className="stat-label">Пенальти (не забито)</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{totalPenalties}</div>
          <div className="stat-label">Пенальти (всего)</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{substitutions}</div>
          <div className="stat-label">Замены</div>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Бомбардиры</h3>
        {sortedScorers.length === 0 ? (
          <p>Голов пока нет</p>
        ) : (
          <table className="events-table">
            <thead>
              <tr>
                <th>Игрок</th>
                <th>Команда</th>
                <th>Голов</th>
              </tr>
            </thead>
            <tbody>
              {sortedScorers.map(scorer => (
                <tr key={scorer.playerId}>
                  <td>{getPlayerName(scorer.playerId)}</td>
                  <td>{scorer.teamId === match.homeTeam.id ? match.homeTeam.name : match.awayTeam.name}</td>
                  <td>{scorer.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Карточки по командам</h3>
        <table className="events-table">
          <thead>
            <tr>
              <th>Команда</th>
              <th>Желтые</th>
              <th>Красные</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{match.homeTeam.name || 'Хозяева'}</td>
              <td>{homeYellowCards}</td>
              <td>{homeRedCards}</td>
            </tr>
            <tr>
              <td>{match.awayTeam.name || 'Гости'}</td>
              <td>{awayYellowCards}</td>
              <td>{awayRedCards}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Statistics;