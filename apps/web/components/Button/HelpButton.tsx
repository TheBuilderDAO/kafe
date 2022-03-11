import React from 'react';
import Button from './';
import QuestionSVG from '../SVG/QuestionSVG';

const HelpButton = () => {
  const iconSize = 20;

  const handleHelp = () => {
    //TODO implement help button
    console.log('Help!');
  };
  return (
    <Button handleClick={handleHelp}>
      <QuestionSVG iconSize={20} />
    </Button>
  );
};

export default HelpButton;
