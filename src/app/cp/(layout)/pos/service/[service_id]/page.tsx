import { authOptions } from "@/libs/AuthOptions";
import DetailServicePage from "@/pages/service/ServiceDetail";
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

const getDeviceType = async (accessToken: string) => {
  try {
    const result = await libServices.getDeviceType(accessToken);
    if (!result.status) {
      return [];
    }

    return result.data;
  } catch (error) {
    return [];
  }
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

export default async function ServiceDetail({
  params,
}: {
  params: { service_id: string };
}) {
  const session = (await getServerSession(authOptions)) as Session | null;

  if (!session) {
    return null;
  }

  const { service_id } = params;
  const deviceType = await getDeviceType(session.user.accessToken);
  const device = await getDevice(session.user.accessToken);

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0 font-size-18">Detail Service </h4>
              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <a href="#">Point Of Sales</a>
                  </li>
                  <li className="breadcrumb-item active">Detail Service</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <DetailServicePage
          session={session.user}
          service_id={service_id}
          deviceTypeData={deviceType}
          deviceData={device}
        />
      </div>
    </div>
  );
}
