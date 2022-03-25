import React from 'react';
import Button from './';
import QuestionSVG from '../SVG/QuestionSVG';

const HelpButton = () => {
  const handleHelp = () => {
    window.open(
      'https://builderdao.notion.site/Kaf-by-Builder-DAO-b46af3ff401448d789288f4b94814e19',
      '_blank',
    );
  };

  return (
    <Button handleClick={handleHelp}>
      <QuestionSVG iconSize={20} />
    </Button>
  );
};

export default HelpButton;
