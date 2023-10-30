import { useSelector } from 'react-redux';
import { selectAuth } from 'app/pages/Auth/slice/selectors';

export const useProfile = () => {
  const { userInfo } = useSelector(selectAuth);
  return userInfo;
};
