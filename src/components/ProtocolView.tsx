import React from 'react';
import { Match, Player, MatchEvent } from '../types';
import './ProtocolView.css';

interface Props {
  match: Match;
  getPlayerById: (playerId: string) => Player | undefined;
}

const getYellowCardReasonLabel = (reason?: string): string => {
  const reasons: Record<string, string> = {
    spa: 'СПА',
    unsporting: 'Неспортивное поведение',
    rough_play: 'Грубая игра',
    systematic: 'Систематическое нарушение',
    delay: 'Задержка игры'
  };
  return reason ? reasons[reason] || reason : '';
};

const getRedCardReasonLabel = (reason?: string): string => {
  const reasons: Record<string, string> = {
    violent_conduct: 'ЛЯВЗГ',
    serious_foul_play: 'Серьезное нарушение правил',
    aggressive_behavior: 'Агрессивное поведение',
    offensive: 'Оскорбительные выражения/действия',
    other: 'Другое'
  };
  return reason ? reasons[reason] || reason : '';
};

const ProtocolView: React.FC<Props> = ({ match, getPlayerById }) => {
  const homePlayers = [...match.homeTeam.players].sort((a, b) => (a.number || 0) - (b.number || 0));
  const awayPlayers = [...match.awayTeam.players].sort((a, b) => (a.number || 0) - (b.number || 0));

  const getPlayerGoals = (playerId: string): MatchEvent[] => {
    return match.events.filter(e =>
      e.playerId === playerId &&
      (e.type === 'goal' || e.type === 'penalty_goal')
    );
  };

  const getPlayerSubstitutions = (playerId: string): MatchEvent[] => {
    return match.events.filter(e =>
      e.playerId === playerId &&
      e.type === 'substitution'
    );
  };

  const renderGoalsCell = (player: Player) => {
    const goals = getPlayerGoals(player.id);
    if (goals.length === 0) return '-';
    
    return goals.map(g => {
      const isOwnGoal = g.type === 'own_goal';
      const isPenalty = g.type === 'penalty_goal';
      let label = `${g.minute}'`;
      if (isOwnGoal) label += ' (авт.)';
      else if (isPenalty) label += ' (п)';
      return <div key={g.id}>{label}</div>;
    });
  };

  const renderSubstitutionsCell = (player: Player) => {
    const subs = getPlayerSubstitutions(player.id);
    if (subs.length === 0) return '-';
    
    return subs.map(s => {
      const substitutePlayer = s.additionalPlayerId ? getPlayerById(s.additionalPlayerId) : null;
      const substituteNumber = substitutePlayer?.number || '-';
      return <div key={s.id}>{substituteNumber} ({s.minute}')</div>;
    });
  };

  const maxRows = Math.max(homePlayers.length, awayPlayers.length);

  return (
    <div className="protocol-view">
      <div className="protocol-header">
        <h2>Протокол матча</h2>
        <div className="protocol-meta">
          <p><strong>Турнир:</strong> {match.tournament}</p>
          <p><strong>Тур:</strong> {match.round}</p>
          <p><strong>Дата:</strong> {match.date}</p>
          <p><strong>Стадион:</strong> {match.stadium}</p>
        </div>
        <div className="protocol-teams">
          <h3>{match.homeTeam.name}</h3>
          <span>—</span>
          <h3>{match.awayTeam.name}</h3>
        </div>
      </div>

      <table className="protocol-table">
        <thead>
          <tr>
            <th>№</th>
            <th>Игрок (Дома)</th>
            <th>Голы</th>
            <th>Замены</th>
            <th>Голы</th>
            <th>Замены</th>
            <th>Игрок (Гости)</th>
            <th>№</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: maxRows }).map((_, index) => {
            const homePlayer = homePlayers[index];
            const awayPlayer = awayPlayers[index];
            
            return (
              <tr key={index}>
                {homePlayer ? (
                  <>
                    <td className="player-number">{homePlayer.number}</td>
                    <td className="player-name">{homePlayer.name}</td>
                    <td className="events-cell">{renderGoalsCell(homePlayer)}</td>
                    <td className="events-cell">{renderSubstitutionsCell(homePlayer)}</td>
                  </>
                ) : (
                  <>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </>
                )}
                {awayPlayer ? (
                  <>
                    <td className="events-cell">{renderGoalsCell(awayPlayer)}</td>
                    <td className="events-cell">{renderSubstitutionsCell(awayPlayer)}</td>
                    <td className="player-name">{awayPlayer.name}</td>
                    <td className="player-number">{awayPlayer.number}</td>
                  </>
                ) : (
                  <>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      <h3>Предупреждение игрокам (Желтые карточки)</h3>

      <table className="protocol-table">
        <thead>
          <tr>
            <th>Номер</th>
            <th>Команда</th>
            <th>Минута</th>
            <th>Причина</th>
          </tr>
        </thead>
        <tbody>
          {match.events
            .filter(e => e.type === 'yellow_card')
            .map(e => {
              const player = getPlayerById(e.playerId || '');
              return (
                <tr key={e.id}>
                  <td>{player?.number || '-'}</td>
                  <td>{player?.teamId === match.homeTeam.id ? match.homeTeam.name : match.awayTeam.name}</td>
                  <td>{e.minute}'</td>
                  <td>{getYellowCardReasonLabel(e.yellowCardReason)}</td>
                </tr>
              );
            })}
          {match.events.filter(e => e.type === 'yellow_card').length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center' }}>Нет предупреждений</td>
            </tr>
          )}
        </tbody>
      </table>

      <h3>Удаления игроков (Красные карточки)</h3>

      <table className="protocol-table">
        <thead>
          <tr>
            <th>Номер</th>
            <th>Команда</th>
            <th>Минута</th>
            <th>Причина</th>
          </tr>
        </thead>
        <tbody>
          {match.events
            .filter(e => e.type === 'red_card')
            .map(e => {
              const player = getPlayerById(e.playerId || '');
              return (
                <tr key={e.id}>
                  <td>{player?.number || '-'}</td>
                  <td>{player?.teamId === match.homeTeam.id ? match.homeTeam.name : match.awayTeam.name}</td>
                  <td>{e.minute}'</td>
                  <td>{getRedCardReasonLabel(e.redCardReason)}</td>
                </tr>
              );
            })}
          {match.events.filter(e => e.type === 'red_card').length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center' }}>Нет удалений</td>
            </tr>
          )}
        </tbody>
      </table>

      <h3>Травматические случаи</h3>

      <table className="protocol-table">
        <thead>
          <tr>
            <th>Номер</th>
            <th>Команда</th>
            <th>Минута</th>
            <th>Причина</th>
          </tr>
        </thead>
        <tbody>
          {match.events
            .filter(e => e.type === 'injury')
            .map(e => {
              const player = getPlayerById(e.playerId || '');
              return (
                <tr key={e.id}>
                  <td>{player?.number || '-'}</td>
                  <td>{player?.teamId === match.homeTeam.id ? match.homeTeam.name : match.awayTeam.name}</td>
                  <td>{e.minute}'</td>
                  <td>{e.description || '-'}</td>
                </tr>
              );
            })}
          {match.events.filter(e => e.type === 'injury').length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center' }}>Нет травм</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProtocolView;
