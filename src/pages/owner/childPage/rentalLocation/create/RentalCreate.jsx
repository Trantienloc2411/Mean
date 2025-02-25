import { useParams } from "react-router-dom";
import { useGetOwnerDetailByUserIdQuery } from "../../../../../redux/services/ownerApi";
import RentalForm from "./RentalForm";
import { useSelector } from "react-redux";

export default function RentalCreate() {
  const id = useSelector((state) => state.auth.userId);
  console.log(id);

  const {
    data: ownerDetailData,
    isLoading: ownerDetailIsLoading,
    isError: ownerDetailIsError,
  } = useGetOwnerDetailByUserIdQuery(id);
  const ownerId = ownerDetailData?.id;

  return (
    <div style={{ padding: "20px" }}>
      <RentalForm ownerId={ownerId} />
    </div>
  );
}
