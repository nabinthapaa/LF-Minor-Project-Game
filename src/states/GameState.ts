const GameState = {
  LOADING: "LOADING",
  RUNNING: "RUNNING",
  PAUSED: "PAUSED",
  GAME_OVER: "GAME_OVER",
};

export const PlayerState = {
  IDLE: "IDLE",
  WALKING: "WALKING",
  JUMPING: "JUMPING",
  FALLING: "FALLING",
  DEAD: "DEAD",
};

export const PlayerStats = {
  MAX_SPEED: 5,
  JUMP_FORCE: 10,
  GRAVITY: 0.5,
};

export default GameState;
