interface Props {
  active: boolean;
  className?: string;
}
export default function InventoryIcon(props: Props) {
  return (
    <svg
      className={props.className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.91478 15.0393V10.236H10.7575V15.0393C10.7575 15.5677 11.1898 16 11.7181 16H14.6002C15.1285 16 15.5608 15.5677 15.5608 15.0393V8.31462H17.194C17.6359 8.31462 17.8472 7.76704 17.511 7.47883L9.47977 0.244971C9.11472 -0.0816572 8.55753 -0.0816572 8.19247 0.244971L0.161251 7.47883C-0.165378 7.76704 0.0363633 8.31462 0.478273 8.31462H2.11142V15.0393C2.11142 15.5677 2.54372 16 3.07209 16H5.95411C6.48248 16 6.91478 15.5677 6.91478 15.0393Z"
        fill={props.active ? 'white' : ' #C8D3E4'}
      />
    </svg>
  );
}
