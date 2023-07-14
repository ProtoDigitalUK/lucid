// Models
import UserToken from "@db/models/UserToken";

export interface ServiceData {
  id: number;
}

const deleteSingle = async (data: ServiceData) => {
  const userToken = await UserToken.deleteSingle({
    id: data.id,
  });

  return userToken;
};

export default deleteSingle;
