import { authOptions } from "@/libs/AuthOptions";
import KategoriPage from "@/pages/kategori/KategoriPage";
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

export default async function Category() {
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
              <h4 className="mb-0 font-size-18">Data Kategori</h4>
              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <a href="#">Configuration</a>
                  </li>
                  <li className="breadcrumb-item active">Data Kategori</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <KategoriPage session={session.user} />
      </div>
    </div>
  );
}
