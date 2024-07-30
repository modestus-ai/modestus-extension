import React from "react";

export const MagicWandFilledIcon: React.FC<{
  color?: string;
  size?: number;
}> = ({ size = 16, color = "#12131A" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 17 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Magic Wand">
        <path
          id="Shape"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15.4003 0.533203C15.4003 0.257061 15.1765 0.0332031 14.9003 0.0332031C14.6242 0.0332031 14.4003 0.257061 14.4003 0.533203V1.09987H13.8337C13.5575 1.09987 13.3337 1.32373 13.3337 1.59987C13.3337 1.87601 13.5575 2.09987 13.8337 2.09987H14.4003V2.66654C14.4003 2.94268 14.6242 3.16654 14.9003 3.16654C15.1765 3.16654 15.4003 2.94268 15.4003 2.66654V2.09987H15.967C16.2432 2.09987 16.467 1.87601 16.467 1.59987C16.467 1.32373 16.2432 1.09987 15.967 1.09987H15.4003V0.533203ZM13.1205 3.37965C13.3158 3.57491 13.3158 3.89149 13.1205 4.08675L12.0539 5.15342C11.8586 5.34868 11.5421 5.34869 11.3468 5.15343C11.1515 4.95817 11.1515 4.64158 11.3468 4.44632L12.4134 3.37965C12.6087 3.18439 12.9253 3.18439 13.1205 3.37965ZM10.9872 5.51298C11.1825 5.70825 11.1825 6.02483 10.9872 6.22009L3.52055 13.6868C3.32528 13.882 3.0087 13.882 2.81344 13.6868C2.61818 13.4915 2.61818 13.1749 2.81344 12.9796L10.2801 5.51298C10.4754 5.31772 10.792 5.31772 10.9872 5.51298ZM14.9003 5.36654C15.1765 5.36654 15.4003 5.59039 15.4003 5.86654V6.4332H15.967C16.2432 6.4332 16.467 6.65706 16.467 6.9332C16.467 7.20935 16.2432 7.4332 15.967 7.4332H15.4003V7.99987C15.4003 8.27601 15.1765 8.49987 14.9003 8.49987C14.6242 8.49987 14.4003 8.27601 14.4003 7.99987V7.4332H13.8337C13.5575 7.4332 13.3337 7.20935 13.3337 6.9332C13.3337 6.65706 13.5575 6.4332 13.8337 6.4332H14.4003V5.86654C14.4003 5.59039 14.6242 5.36654 14.9003 5.36654ZM10.067 0.533203C10.067 0.257061 9.84315 0.0332031 9.56701 0.0332031C9.29087 0.0332031 9.06701 0.257061 9.06701 0.533203V1.09987H8.50034C8.2242 1.09987 8.00034 1.32373 8.00034 1.59987C8.00034 1.87601 8.2242 2.09987 8.50034 2.09987H9.06701V2.66654C9.06701 2.94268 9.29087 3.16654 9.56701 3.16654C9.84315 3.16654 10.067 2.94268 10.067 2.66654V2.09987H10.6337C10.9098 2.09987 11.1337 1.87601 11.1337 1.59987C11.1337 1.32373 10.9098 1.09987 10.6337 1.09987H10.067V0.533203Z"
          fill={color}
        />
      </g>
    </svg>
  );
};
