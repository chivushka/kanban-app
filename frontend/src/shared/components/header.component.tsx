import React from 'react';
import Button from './button.component';
import BackIcon from '@mui/icons-material/ArrowLeft';

interface HeaderProps {
  title: string;
  titleColor?: string;
  backText?: string;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  titleColor = 'text-white',
  backText = 'Back to Home',
  onBack,
}) => {
  return (
    <div className=" h-[73px] flex items-center justify-between px-6 py-4 border-b border-l_gray/10">
      <div className="flex-1">
        {onBack ? (
          <Button
            icon={<BackIcon />}
            text={backText}
            variant={'transparent'}
            onClick={onBack}
          />
        ) : (
          <div />
        )}
      </div>
      <div className="flex-1">
        <h1
          className={`text-center text-xl font-semibold w-full ${titleColor}`}
          data-testid="header-title"
        >
          {title}
        </h1>
      </div>
      <div className="flex-1" />
    </div>
  );
};
