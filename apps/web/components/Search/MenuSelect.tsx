import { connectMenu } from 'react-instantsearch-dom';

const MenuSelect = ({ items, currentRefinement, refine, attribute }) => {
  return (
    <div className="flex">
      {items.map(item => (
        <label
          key={item.value}
          htmlFor={item.label}
          className="cursor-pointer pb-10"
        >
          <input
            type="radio"
            id={item.value}
            name={attribute}
            value={item.isRefined ? currentRefinement : item.value}
            className="peer absolute opacity-0 cursor-pointer"
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

{
  /* <select
value={currentRefinement || ''}
onChange={event => refine(event.currentTarget.value)}
>
<option value="">select</option>
{items.map(item => (
  <option
    key={item.label}
    value={item.isRefined ? currentRefinement : item.value}
  >
    {item.label}
  </option>
))}
</select> */
}
