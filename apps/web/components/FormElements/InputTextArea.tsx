import React, { useState } from 'react';

const InputTextArea = ({ maxLength, register, name, watch }) => {
  const input = watch(name);
  return (
    <div>
      <p
        className={`text-md dark:bg-kafedarker select-none bg-kafelighter shadow-sm p-2 rounded-xl ${
          input?.length / maxLength > 0.9 ? 'text-kafered' : null
        }`}
      >{`${input?.length || 0}/${maxLength}`}</p>

      <textarea
        className="block w-full rounded-2xl shadow-sm focus:ring-0 dark:bg-kafedarker bg-kafelighter border-none min-h-[200px] p-5 sm:text-lg resize-none"
        maxLength={maxLength}
        spellCheck
        {...register(name, { required: true, maxLength: 480 })}
      />
    </div>
  );
};

export default InputTextArea;
