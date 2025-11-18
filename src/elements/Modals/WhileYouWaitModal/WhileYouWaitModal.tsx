import React, { useState } from "react";
import { WhileYouWaitStartScreen } from "./WhileYouWaitStartScreen";
import { WhileYouWaitGameOverScreen } from "./WhileYouWaitGameOverScreen";
import { WhileYouWaitGame } from "./WhileYouWaitGame";

export const WhileYouWaitModal = ({}) => {
  const [timeSurvived, setTimeSurvived] = useState(0);

  const [gameState, setGameState] = useState("home");

  const onStart = () => {
    setTimeSurvived(0);
    setGameState("game");
  };
  if (gameState === "home") {
    return <WhileYouWaitStartScreen onStart={onStart} />;
  }

  if (gameState === "gameOver") {
    return (
      <WhileYouWaitGameOverScreen
        timeSurvived={timeSurvived}
        onRestart={onStart}
      />
    );
  }
  if (gameState === "game") {
    return (
      <WhileYouWaitGame
        onRestart={onStart}
        timeSurvived={timeSurvived}
        setTimeSurvived={setTimeSurvived}
        onGameOver={(ts) => {
          setTimeSurvived(ts);
          setGameState("gameOver");
        }}
      />
    );
  }
};
