import { connectMenu } from 'react-instantsearch-dom';

const MenuSelect = ({ currentRefinement, refine, attribute, items }) => {
  return (
    <div className="flex">
      {items.map(item => (
        <label
          key={item.value}
          htmlFor={item.label}
          className="pb-10 cursor-pointer"
        >
          <input
            type="radio"
            id={item.value}
            name={attribute}
            value={item.value}
            className="absolute opacity-0 cursor-pointer peer"
            checked={currentRefinement === item.label}
            onChange={() => refine(item.value)}
          />
          <span
            className="
            p-1
            px-2
            border-[1px]
            rounded-md
            dark:border-kafewhite
            border-kafeblack
            dark:peer-checked:border-kafewhite
            peer-checked:border-kafeblack
            dark:peer-checked:text-kafeblack
            peer-checked:text-kafewhite
            dark:peer-checked:bg-kafewhite
            peer-checked:bg-kafeblack
            dark:bg-kafeblack
            bg-kafelighter
            text-kafeblack
            dark:text-kafewhite
            text-[12px]
            mr-4
            block
            "
          >
            {item?.label?.toUpperCase()}
          </span>
        </label>
      ))}
    </div>
  );
};

export default connectMenu(MenuSelect);
