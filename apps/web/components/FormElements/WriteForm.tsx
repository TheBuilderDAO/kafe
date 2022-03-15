import React from 'react';
import Image from 'next/image';
import BorderSVG from '../SVG/BorderSVG';
import InputTitle from './InputTitle';
import InputTextArea from './InputTextArea';
import InputSelect from './InputSelect';
import InputCheckbox from './InputCheckbox';
import { useDapp } from '../../hooks/useDapp';
import defaultAvatar from '/public/assets/icons/default_avatar.svg';
import { addEllipsis } from 'utils/strings';

const WriteForm = ({ tags, register, Controller, control, watch }) => {
  const { wallet } = useDapp();
  const walletIcon = wallet?.wallet?.adapter?.icon; //TO-DO: figure out better way to create user icons

  return (
    <div className="relative min-w-[700px] grow">
      <BorderSVG />
      <div className="p-10">
        <div className="mb-5">
          <div className="text-sm flex items-center">
            <p>Proposal by{'  '}</p>
            <div className="mx-2">
              <Image
                src={walletIcon ? walletIcon : defaultAvatar}
                alt="wallet icon"
                width="25"
                height="25"
              />
            </div>
            <p className="font-black">
              {addEllipsis(wallet?.publicKey.toString())}
            </p>
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
