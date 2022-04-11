import { createContext, useContext } from 'react';
import { TutorialProgramClient } from "@builderdao/program-tutorial";

type DappContextTypes = {
  tutorialProgram: TutorialProgramClient | null;
};

export const TutorialProgramContext = createContext<DappContextTypes>({
  tutorialProgram: null,
});
export const TutorialProgramContextProvider = TutorialProgramContext.Provider;

export const useTutorialProgram = () => {
  const { tutorialProgram } = useContext(TutorialProgramContext);
  if (!tutorialProgram) {
    throw new Error('TutorialProgramProvider not added to _app');
  }

  return tutorialProgram;
};
