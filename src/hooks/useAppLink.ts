import { useNavigate } from "react-router-native";

export const useAppLink = () => {
  const navigate = useNavigate();

  const fn = (props) => {
    navigate(props);
  };

  return [fn];
};
