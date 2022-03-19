import React from 'react';
import BorderSVG from '../SVG/BorderSVG';
import InputTitle from './InputTitle';
import InputTextArea from './InputTextArea';
import InputSelect from './InputSelect';
import InputCheckbox from './InputCheckbox';
import { useDapp } from '../../hooks/useDapp';
import UserAvatar from '@app/components/UserAvatar/UserAvatar';

const WriteForm = ({ tags, register, Controller, control, watch }) => {
  const { wallet } = useDapp();

  return (
    <div className="relative w-screen">
      <BorderSVG />
      <div className="p-10">
        <div className="mb-5">
          <div className="text-sm flex items-center">
            <p>Proposal by{'  '}</p>
            <UserAvatar address={wallet.publicKey.toString()} />
          </div>
          <div className="mt-1">
            <InputTitle placeholder="Enter a title" register={register} />
          </div>
        </div>

        <div className="flex items-center justify-between mb-14">
          <div className="flex-1 mr-20">
            <label
              htmlFor="tags"
              className="block text-kafeblack dark:text-kafewhite text-sm"
            >
              Enter tags
            </label>
            <Controller
              name="tags"
              rules={{ required: true }}
              render={({ field: { ref, onChange } }) => (
                <InputSelect
                  options={tags}
                  inputRef={ref}
                  onChange={onChange}
                />
              )}
              control={control}
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium pb-2"
            >
              Difficulty level
            </label>
            <div>
              <Controller
                name="difficulty"
                control={control}
                rules={{ required: true }}
                render={({ field: { name, ref, onChange } }) => (
                  <InputCheckbox
                    options={['Beginner', 'Advanced']}
                    onChange={onChange}
                    inputRef={ref}
                    name={name}
                  />
                )}
              />
            </div>
          </div>
        </div>
        <div className="mb-5">
          <label htmlFor="comment" className="block text-sm">
            Summary
          </label>
          <div className="mt-1">
            <InputTextArea
              maxLength={480}
              name="description"
              register={register}
              watch={watch}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteForm;
