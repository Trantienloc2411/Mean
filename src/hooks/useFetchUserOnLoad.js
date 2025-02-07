import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  useLazyGetUserQuery,
  useLazyGetRoleByIdQuery,
} from "../redux/services/authApi";
import { setUser, setRole } from "../redux/slices/authSlice";
import { getToken, getUserId } from "../utils/storage"; // Lấy token và userId từ localStorage

const useFetchUserOnLoad = () => {
  const dispatch = useDispatch();
  const token = getToken(); // Lấy token từ localStorage
  const userId = getUserId(); // Lấy userId từ localStorage

  // Lazy queries (chỉ gọi API khi được trigger)
  const [getUser] = useLazyGetUserQuery();
  const [getRole] = useLazyGetRoleByIdQuery();

  useEffect(() => {
    if (token && userId) {
      getUser(userId).then(({ data }) => {
        if (data) {
          dispatch(setUser(data?.getUser));

          getRole(data.getUser.roleID).then(({ data: roleData }) => {
            if (roleData) {
              dispatch(setRole(roleData));
            }
          });
        }
      });
    }
  }, [token, userId, dispatch, getUser, getRole]);
};

export default useFetchUserOnLoad;
