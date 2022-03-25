import React from 'react';
import Button from './';
import QuestionSVG from '../SVG/QuestionSVG';

const HelpButton = () => {
  const handleHelp = () => {
    window.open('https://builderdao.notion.site/', '_blank');
  };

  return (
    <Button handleClick={handleHelp}>
      <QuestionSVG iconSize={20} />
    </Button>
  );
};

export default HelpButton;
