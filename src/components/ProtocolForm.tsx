import React from 'react';
import { ProtocolForm as ProtocolFormType } from '../types';

interface Props {
  formData: ProtocolFormType;
  onFormChange: (field: keyof ProtocolFormType, value: string) => void;
  onSave: () => void;
}

const ProtocolFormComponent: React.FC<Props> = ({ formData, onFormChange, onSave }) => {
  return (
    <div className="form-section">
      <h2>Данные матча</h2>
      <div className="form-grid">
        <div className="form-group">
          <label>Турнир</label>
          <input
            type="text"
            value={formData.tournament}
            onChange={(e) => onFormChange('tournament', e.target.value)}
            placeholder="Название турнира"
          />
        </div>

        <div className="form-group">
          <label>Тур</label>
          <input
            type="text"
            value={formData.round}
            onChange={(e) => onFormChange('round', e.target.value)}
            placeholder="Номер тура"
          />
        </div>

        <div className="form-group">
          <label>Дата</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => onFormChange('date', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Стадион</label>
          <input
            type="text"
            value={formData.stadium}
            onChange={(e) => onFormChange('stadium', e.target.value)}
            placeholder="Название стадиона"
          />
        </div>
      </div>

      <div className="team-column">
        <div className="form-group">
          <label>Команда 1 (хозяева)</label>
          <input
            type="text"
            value={formData.homeTeamName}
            onChange={(e) => onFormChange('homeTeamName', e.target.value)}
            placeholder="Название команды"
          />
        </div>

        <div className="form-group">
          <label>Команда 2 (гости)</label>
          <input
            type="text"
            value={formData.awayTeamName}
            onChange={(e) => onFormChange('awayTeamName', e.target.value)}
            placeholder="Название команды"
          />
        </div>
      </div>

      <div className="form-group" style={{ marginTop: '15px' }}>
        <label>Состав команды 1 (каждый игрок с новой строки, формат: номер. ФИО)</label>
        <textarea
          value={formData.homeTeamPlayers}
          onChange={(e) => onFormChange('homeTeamPlayers', e.target.value)}
          rows={6}
          placeholder="1. Иванов А.С.&#10;2. Петров Б.И.&#10;..."
        />
      </div>

      <div className="form-group" style={{ marginTop: '15px' }}>
        <label>Состав команды 2 (каждый игрок с новой строки, формат: номер. ФИО)</label>
        <textarea
          value={formData.awayTeamPlayers}
          onChange={(e) => onFormChange('awayTeamPlayers', e.target.value)}
          rows={6}
          placeholder="1. Сидоров В.П.&#10;2. Козлов Д.М.&#10;..."
        />
      </div>

      <h3 style={{ marginTop: '20px' }}>Судьи</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>Главный судья</label>
          <input
            type="text"
            value={formData.mainReferee}
            onChange={(e) => onFormChange('mainReferee', e.target.value)}
            placeholder="ФИО"
          />
        </div>

        <div className="form-group">
          <label>Ассистент 1</label>
          <input
            type="text"
            value={formData.assistantReferee1}
            onChange={(e) => onFormChange('assistantReferee1', e.target.value)}
            placeholder="ФИО"
          />
        </div>

        <div className="form-group">
          <label>Ассистент 2</label>
          <input
            type="text"
            value={formData.assistantReferee2}
            onChange={(e) => onFormChange('assistantReferee2', e.target.value)}
            placeholder="ФИО"
          />
        </div>

        <div className="form-group">
          <label>Четвертый судья</label>
          <input
            type="text"
            value={formData.fourthReferee}
            onChange={(e) => onFormChange('fourthReferee', e.target.value)}
            placeholder="ФИО"
          />
        </div>
      </div>

      <div className="form-actions">
        <button className="btn btn-success" onClick={onSave}>
          Сохранить данные
        </button>
      </div>
    </div>
  );
};

export default ProtocolFormComponent;