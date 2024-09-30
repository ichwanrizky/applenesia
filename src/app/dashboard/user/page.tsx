import { authOptions } from "@/libs/AuthOptions";
import UserPage from "@/pages/user/UserPage";
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
};

export default async function User() {
  const session: Session | null = await getServerSession(authOptions);
  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0 font-size-18">Data User</h4>
              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <a href="#">Dashboard</a>
                  </li>
                  <li className="breadcrumb-item active">Data User</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <UserPage session={session} />
      </div>
    </div>
  );
}
