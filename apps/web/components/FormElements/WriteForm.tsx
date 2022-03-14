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

const WriteForm = ({ tags, register }) => {
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
            <InputTitle
              placeholder="Enter a title"
              {...register('title', {
                required: true,
                maxLength: 100,
              })}
            />
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
            <div>
              <InputSelect
                options={tags}
                {...register('tags', { required: true })}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium pb-2"
            >
              Difficulty level
            </label>
            <div>
              <InputCheckbox
                options={['Beginner', 'Advanced']}
                name="difficulty levels"
                {...register('difficulty', { required: true })}
              />
            </div>
          </div>
        </div>
        <div className="mb-5">
          <label htmlFor="comment" className="block text-sm">
            Summary
          </label>
          <div className="mt-1">
            <InputTextArea maxLength={480} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteForm;
