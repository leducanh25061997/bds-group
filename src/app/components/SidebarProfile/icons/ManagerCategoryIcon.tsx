import React from 'react';
interface Props {
  active: boolean;
  className?: string;
}
export default function ManagerCategoryIcon(props: Props) {
  return (
    <svg
      className={props.className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill={props.active ? 'white' : ' #C8D3E4'}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.75 4.375L7.5 1.25L1.25 4.375V10.625L7.5 13.75L13.75 10.625V4.375Z"
        stroke="white"
        stroke-width="1.8"
        stroke-linejoin="round"
      />
      <path
        d="M1.25 4.375L7.5 7.5"
        stroke="white"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M7.5 13.75V7.5"
        stroke="white"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M13.75 4.375L7.5 7.5"
        stroke="white"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M10.625 2.8125L4.375 5.9375"
        stroke="white"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
