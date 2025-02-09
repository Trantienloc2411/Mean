import useFetchUserOnLoad from "./useFetchUserOnLoad";

const useAppInit = () => {
  useFetchUserOnLoad(); // Kiểm tra & lấy user, role
};

export default useAppInit;
