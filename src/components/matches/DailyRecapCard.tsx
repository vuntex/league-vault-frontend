import React from "react";
import type { DailyRecap } from "../../types";

interface Props {
  recap: DailyRecap;
  isLoading: boolean;
}

const DailyRecapCard: React.FC<Props> = ({ recap, isLoading }) => {
  if (isLoading) {
    return (
      <div className="recap-card">
        <div className="recap-card-header">
          <span className="recap-title">Heutiger Tag</span>
        </div>
        <div className="recap-empty">
          <div className="dots">
            <div className="dot" />
            <div className="dot" />
            <div className="dot" />
          </div>
        </div>
      </div>
    );
  }

  const today = new Date().toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const lpClass =
    recap.lpChange > 0 ? "pos" : recap.lpChange < 0 ? "neg" : "zero";
  const lpLabel =
    recap.lpChange > 0 ? `+${recap.lpChange}` : String(recap.lpChange);

  return (
    <div className="recap-card">
      <div className="recap-card-header">
        <span className="recap-title">Heutiger Tag</span>
        <span className="recap-date">{today}</span>
      </div>

      {recap.gamesPlayed === 0 ? (
        <div className="recap-empty">Noch keine Spiele heute 🎮</div>
      ) : (
        <>
          {/* W / L / Total */}
          <div className="recap-score">
            <div className="recap-score-item">
              <div className="recap-big-num total">{recap.gamesPlayed}</div>
              <div className="recap-big-label">Spiele</div>
            </div>
            <div className="recap-score-sep" />
            <div className="recap-score-item">
              <div className="recap-big-num win">{recap.wins}</div>
              <div className="recap-big-label">Siege</div>
            </div>
            <div className="recap-score-sep" />
            <div className="recap-score-item">
              <div className="recap-big-num loss">{recap.losses}</div>
              <div className="recap-big-label">Niederlagen</div>
            </div>
          </div>

          {/* LP Change */}
          <div className="recap-lp-row">
            <span className="recap-lp-label">LP heute</span>
            <span className={`recap-lp-value ${lpClass}`}>
              {recap.lpChange === 0 ? "±0" : lpLabel}
            </span>
          </div>

          {/* Streak */}
          {(recap.currentWinStreak > 1 || recap.currentLossStreak > 1) && (
            <div className="recap-streak">
              {recap.currentWinStreak > 1 && (
                <>
                  <span className="recap-streak-badge win">
                    🔥 {recap.currentWinStreak}er
                  </span>
                  <span className="recap-streak-text">Win-Streak</span>
                </>
              )}
              {recap.currentLossStreak > 1 && (
                <>
                  <span className="recap-streak-badge loss">
                    💀 {recap.currentLossStreak}er
                  </span>
                  <span className="recap-streak-text">Loss-Streak</span>
                </>
              )}
            </div>
          )}

          {/* KDA + Most played */}
          <div className="recap-game-row">
            <span className="recap-game-label">Ø KDA</span>
            <div className="recap-game-champ">{recap.avgKda.toFixed(2)}</div>
            {recap.mostPlayedChampion && (
              <>
                <span
                  className="recap-game-label"
                  style={{ marginLeft: "auto" }}
                >
                  Meist gespielt
                </span>
                <div className="recap-game-champ">
                  {recap.mostPlayedChampion}
                </div>
              </>
            )}
          </div>

          {/* Best game */}
          {recap.bestGame && (
            <div className="recap-game-row">
              <span className="recap-game-label">Bestes</span>
              <div>
                <div className="recap-game-champ">
                  {recap.bestGame.champion}
                </div>
                <div className="recap-game-kda">
                  {recap.bestGame.kills}/{recap.bestGame.deaths}/
                  {recap.bestGame.assists}
                  &nbsp;·&nbsp;{recap.bestGame.kda.toFixed(2)} KDA
                </div>
              </div>
              <span
                className={`recap-game-result ${recap.bestGame.win ? "win" : "loss"}`}
                style={{ marginLeft: "auto" }}
              >
                {recap.bestGame.win ? "WIN" : "LOSS"}
              </span>
            </div>
          )}

          {/* Worst game */}
          {recap.worstGame && (
            <div className="recap-game-row">
              <span className="recap-game-label">Schlechtestes</span>
              <div>
                <div className="recap-game-champ">
                  {recap.worstGame.champion}
                </div>
                <div className="recap-game-kda">
                  {recap.worstGame.kills}/{recap.worstGame.deaths}/
                  {recap.worstGame.assists}
                  &nbsp;·&nbsp;{recap.worstGame.kda.toFixed(2)} KDA
                </div>
              </div>
              <span
                className="recap-game-result loss"
                style={{ marginLeft: "auto" }}
              >
                LOSS
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DailyRecapCard;
