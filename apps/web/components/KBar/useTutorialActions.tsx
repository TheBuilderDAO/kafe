import { useRegisterActions } from 'kbar';
import { TwitterIcon } from '../SVG/Twitter';

export interface useTutorialActionProps {
  title: string;
  link: string;
}

export const useTutorialActions = ({ title, link }: useTutorialActionProps) => {
  useRegisterActions([
    {
      id: 'tutorial-share',
      name: `Share on twitter "${title}"`,
      priority: 2,
      perform: () =>
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            title,
          )}&url=${encodeURIComponent(link)}&via=TheBuilderDAO`,
          '_blank',
        ),
      icon: <TwitterIcon />,
    },
  ]);
};
