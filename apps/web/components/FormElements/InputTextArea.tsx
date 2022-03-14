import React, { useState } from 'react';

const InputTextArea = ({ maxLength }) => {
  const [input, setInput] = useState('');
  const [inputLength, setInputLength] = useState(0);
  maxLength = maxLength || 480;
  const handleChange = e => {
    setInput(e.target.value);
    setInputLength(e.target.value.length);
  };
  return (
    <div>
      <p
        className={`absolute right-14 bottom-16 text-md dark:bg-kafedarker select-none bg-kafelighter shadow-sm p-2 rounded-xl ${
          inputLength / maxLength > 0.9 ? 'text-kafered' : null
        }`}
      >{`${inputLength}/${maxLength}`}</p>
      <textarea
        className="block w-full rounded-2xl shadow-sm focus:ring-0 dark:bg-kafedarker bg-kafelighter border-none min-h-[200px] p-5 sm:text-lg resize-none"
        maxLength={maxLength}
        required
        spellCheck
        value={input}
        onChange={handleChange}
      />
    </div>
  );
};

export default InputTextArea;
