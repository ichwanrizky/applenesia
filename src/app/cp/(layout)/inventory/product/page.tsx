import { authOptions } from "@/libs/AuthOptions";
import ProductPage from "@/pages/product/ProductPage";
import deviceServices from "@/services/deviceServices";
import libServices from "@/services/libServices";
import { getServerSession } from "next-auth";

type Session = {
  user: UserSession;
};
type UserSession = {
  name: string;
  id: number;
  username: string;
  role_id: number;
  role_name: string;
  accessToken: string;
  userBranch: any;
};

const getDevice = async (accessToken: string) => {
  try {
    const result = await libServices.getDevice(accessToken);
    if (!result.status) {
      return [];
    }

    return result.data;
  } catch (error) {
    return [];
  }
};

export default async function Product() {
  const session = (await getServerSession(authOptions)) as Session | null;

  if (!session) {
    return null;
  }

  const device = await getDevice(session.user.accessToken);

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0 font-size-18">Data Product</h4>
              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <a href="#">Inventory & Product</a>
                  </li>
                  <li className="breadcrumb-item active">Data Product</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <ProductPage session={session.user} deviceData={device} />
      </div>
    </div>
  );
}
