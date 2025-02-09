// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import {
//   useLazyGetUserQuery,
//   useLazyGetRoleByIdQuery,
// } from "../redux/services/authApi";
// import { setUser, setRole } from "../redux/slices/authSlice";
// import { getToken, getUserId } from "../utils/storage"; // Lấy token và userId từ localStorage

// const useFetchUserOnLoad = () => {
//   const dispatch = useDispatch();
//   const token = getToken(); // Lấy token từ localStorage
//   const userId = getUserId(); // Lấy userId từ localStorage
//   console.log("useFetchUserOnLoad");

//   // Lazy queries (chỉ gọi API khi được trigger)
//   const [getUser] = useLazyGetUserQuery();
//   const [getRole] = useLazyGetRoleByIdQuery();

//   useEffect(() => {
//     if (token && userId) {
//       getUser(userId).then(({ data }) => {
//         if (data) {
//           dispatch(setUser(data?.getUser));

//           getRole(data.getUser.roleID).then(({ data: roleData }) => {
//             if (roleData) {
//               dispatch(setRole(roleData));
//             }
//           });
//         }
//       });
//     }
//   }, [token, userId, dispatch, getUser, getRole]);
// };

// export default useFetchUserOnLoad;

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useLazyGetUserQuery,
  useLazyGetRoleByIdQuery,
} from "../redux/services/authApi";
import { setUser, setRole } from "../redux/slices/authSlice";
import { getToken, getUserId, saveRole } from "../utils/storage"; // Lấy token và userId từ localStorage

const useFetchUserOnLoad = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log("hello");

  const token = getToken();
  const userId = getUserId();

  const [getUser] = useLazyGetUserQuery();
  const [getRole] = useLazyGetRoleByIdQuery();

  useEffect(() => {
    // Nếu không có token hoặc userId thì chuyển hướng về trang login
    if (!token || !userId) {
      navigate("/login", { replace: true });
      return;
    }

    const fetchUserData = async () => {
      try {
        const { data: userData } = await getUser(userId);
        if (userData) {
          dispatch(setUser(userData.getUser));

          const { data: roleData } = await getRole(userData.getUser.roleID);
          if (roleData) {
            dispatch(setRole(roleData.roleName));
            saveRole(roleData.roleName);
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu user:", error);
      }
    };

    fetchUserData();
  }, [token, userId, dispatch, navigate, getUser, getRole]);
};

export default useFetchUserOnLoad;
