import React from 'react';

const VotedSVG = ({ voted }) => {
  const size = '25';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 27 27"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="22"
        cy="16"
        r="4.5"
        className="dark:stroke-kafelighter stroke-kafedarker fill-transparent dark:group-hover:stroke-kafedarker group-hover:stroke-kafelighter"
      />
      <mask id="path-2-inside-1_1224_1373" fill="white">
        <path d="M0 10H22.75V14.875C22.75 21.1572 17.6572 26.25 11.375 26.25C5.09276 26.25 0 21.1572 0 14.875V10Z" />
      </mask>
      <path
        d="M0 10H22.75V14.875C22.75 21.1572 17.6572 26.25 11.375 26.25C5.09276 26.25 0 21.1572 0 14.875V10Z"
        className="dark:fill-kafedarker fill-kafelighter dark:group-hover:fill-kafelighter group-hover:fill-kafedarker"
      />
      <path
        d="M0 10V9H-1V10H0ZM22.75 10H23.75V9H22.75V10ZM0 11H22.75V9H0V11ZM21.75 10V14.875H23.75V10H21.75ZM1 14.875V10H-1V14.875H1ZM11.375 25.25C5.64505 25.25 1 20.605 1 14.875H-1C-1 21.7095 4.54048 27.25 11.375 27.25V25.25ZM21.75 14.875C21.75 20.605 17.105 25.25 11.375 25.25V27.25C18.2095 27.25 23.75 21.7095 23.75 14.875H21.75Z"
        className="dark:fill-kafelighter dark:group-hover:fill-kafedarker group-hover:fill-kafelighter fill-kafedarker"
        mask="url(#path-2-inside-1_1224_1373)"
      />
      <path
        d="M7.29007 4.88595L7.3961 5.37458L7.3961 5.37457L7.29007 4.88595ZM10.8625 2.98878L10.4082 2.77999L10.4077 2.78113L10.8625 2.98878ZM10.8519 1.94359L11.3019 1.72567L11.296 1.7135L11.2895 1.70167L10.8519 1.94359ZM10.8763 1.28752L10.4579 1.01369L10.4578 1.0139L10.8763 1.28752ZM11.4678 1.00274L11.5189 0.505328L11.514 0.504879L11.4678 1.00274ZM11.4698 1.00295L11.4188 1.50034L11.419 1.50036L11.4698 1.00295ZM2.5 8.99976C2.5 7.86479 3.56215 6.20646 7.3961 5.37458L7.18405 4.39732C3.20313 5.26109 1.5 7.13521 1.5 8.99976H2.5ZM7.3961 5.37457C8.39262 5.15834 9.24132 4.87216 9.89975 4.52249C10.5487 4.17785 11.0684 3.74182 11.3173 3.19643L10.4077 2.78113C10.29 3.03886 9.99201 3.34124 9.43073 3.63931C8.87891 3.93236 8.12472 4.1932 7.18404 4.39732L7.3961 5.37457ZM11.3168 3.19756C11.5319 2.72945 11.5266 2.18956 11.3019 1.72567L10.4019 2.16152C10.4963 2.35647 10.4986 2.58331 10.4082 2.77999L11.3168 3.19756ZM11.2895 1.70167C11.2651 1.65752 11.2671 1.60349 11.2947 1.56113L10.4578 1.0139C10.2273 1.36634 10.2107 1.81713 10.4143 2.18552L11.2895 1.70167ZM11.2946 1.56134C11.3219 1.51969 11.3705 1.49585 11.4216 1.5006L11.514 0.504879C11.0955 0.466043 10.6888 0.66097 10.4579 1.01369L11.2946 1.56134ZM11.4168 1.50013L11.4188 1.50034L11.5209 0.505559L11.5189 0.505352L11.4168 1.50013ZM11.419 1.50036C11.4937 1.50799 13.8114 1.74506 16.0964 2.82712C18.3795 3.90824 20.5146 5.76831 20.5146 8.99976H21.5146C21.5146 5.20963 18.9682 3.08058 16.5244 1.92333C14.0826 0.767034 11.6279 0.516493 11.5207 0.505537L11.419 1.50036Z"
        className="dark:fill-kafelighter fill-kafedarker group-hover:fill-kafelighter dark:group-hover:fill-kafedarker"
      />
      {!voted && (
        <>
          <path
            d="M6 16.852H8.016V14.644H8.88V16.852H10.908V17.692H8.88V19.912H8.016V17.692H6V16.852Z"
            className="dark:fill-kafelighter fill-kafedarker group-hover:fill-kafelighter dark:group-hover:fill-kafedarker"
          />
          <path
            d="M12.348 14.536C12.756 14.376 13.152 14.176 13.536 13.936C13.92 13.688 14.276 13.376 14.604 13H15.3V19.588H16.704V20.428H12.708V19.588H14.316V14.38C14.228 14.46 14.12 14.544 13.992 14.632C13.872 14.712 13.736 14.792 13.584 14.872C13.44 14.952 13.288 15.028 13.128 15.1C12.968 15.172 12.812 15.232 12.66 15.28L12.348 14.536Z"
            className="dark:fill-kafelighter fill-kafedarker group-hover:fill-kafelighter dark:group-hover:fill-kafedarker"
          />
        </>
      )}
    </svg>
  );
};

export default VotedSVG;
