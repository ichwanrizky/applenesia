import { authOptions } from "@/libs/AuthOptions";
import CreateServicePage from "@/pages/service/ServiceCreate";
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

export default async function CreateService() {
  const session = (await getServerSession(authOptions)) as Session | null;

  if (!session) {
    return null;
  }

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <div></div>
              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <a href="#">Point Of Sales</a>
                  </li>
                  <li className="breadcrumb-item">Data Service</li>
                  <li className="breadcrumb-item active">Create</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <CreateServicePage />
      </div>
    </div>
  );
}
